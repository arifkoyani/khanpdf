import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { qstashReceiver } from "@/lib/qstash";
import { submitPdfJob } from "@/lib/pdfco";
import type { PdfJobOptions } from "@/lib/pdfco";
import type { JobData } from "@/lib/queue";

const JOB_TTL = 3600;
const DONE_TTL = 3600;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  try {
    await qstashReceiver.verify({ signature, body: rawBody, url: req.url });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId, url, pdfOptions } = JSON.parse(rawBody) as {
    requestId: string;
    url: string;
    pdfOptions?: PdfJobOptions;
  };

  if (!requestId || !url) {
    return NextResponse.json({ error: "Missing requestId or url" }, { status: 400 });
  }

  // Load job from Redis; reconstruct from message payload if Redis save failed
  let job: JobData | null = null;
  try {
    job = await redis.get<JobData>(`job:${requestId}`);
  } catch (err) {
    console.warn(`[submit] Redis get failed for ${requestId}:`, err);
  }

  if (!job) {
    job = { requestId, url, pdfOptions: pdfOptions ?? {}, status: "queued", retries: 0, createdAt: Date.now() };
    try {
      await redis.set(`job:${requestId}`, job, { ex: JOB_TTL });
    } catch (err) {
      console.warn(`[submit] Redis re-save failed for ${requestId}:`, err);
    }
  }

  if (job.status !== "queued") {
    return NextResponse.json({ ok: true, skipped: `status is ${job.status}` });
  }

  // Mark processing to prevent duplicate workers
  try {
    await redis.set(
      `job:${requestId}`,
      { ...job, status: "processing" },
      { ex: JOB_TTL }
    );
  } catch (err) {
    console.warn(`[submit] Redis processing-save failed for ${requestId}:`, err);
  }

  // Call khanpdf with retries — rate is controlled by QStash flowControl upstream
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await submitPdfJob(job.url, job.pdfOptions ?? pdfOptions ?? {});
      try {
        await redis.set(
          `job:${requestId}`,
          { ...job, status: "done", fileUrl: result.fileUrl, pdfJobResult: result },
          { ex: DONE_TTL }
        );
      } catch (err) {
        console.warn(`[submit] Redis done-save failed for ${requestId}:`, err);
      }

      return NextResponse.json({
        success: true,
        requestId,
        status: "done",
        data: {
          fileUrl: result.fileUrl,
          fileName: result.fileName,
          pageCount: result.pageCount,
          creditsUsed: result.creditsUsed,
          durationMs: result.durationMs,
          outputLinkValidTill: result.outputLinkValidTill,
        },
        message: "Your PDF is ready.",
      }, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    } catch (err) {
      lastError = err;
      console.warn(
        `[submit] khanpdf attempt ${attempt}/${MAX_RETRIES} failed for ${requestId}:`,
        err
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }

  console.error(
    `[submit] All ${MAX_RETRIES} attempts failed for ${requestId}:`,
    lastError
  );
  try {
    await redis.set(
      `job:${requestId}`,
      { ...job, status: "failed" },
      { ex: DONE_TTL }
    );
  } catch { }
  return NextResponse.json({
      success: false,
      requestId,
      status: "failed",
      message: "PDF conversion failed. Please try again.",
    });
}
