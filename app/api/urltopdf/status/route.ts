import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import type { JobData } from "@/lib/queue";

const SEEN_DONE_TTL = 3600;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json(
      { success: false, requestId: "", status: "error", message: "requestId is required" },
      { status: 400 }
    );
  }

  let job: JobData | null;
  try {
    job = await redis.get<JobData>(`job:${requestId}`);
  } catch (err) {
    console.error("[status] Redis error:", err);
    return NextResponse.json({
      success: true,
      requestId,
      status: "processing",
      message: "Checking job status...",
    });
  }

  // Distinct status for "key not in Redis" vs "job explicitly failed"
  if (!job) {
    return NextResponse.json({
      success: false,
      requestId,
      status: "not_found",
      message: "No conversion job found for this requestId.",
    });
  }

  if (job.status === "done") {
    await redis.expire(`job:${requestId}`, SEEN_DONE_TTL).catch(() => {});
    const pdfJobResult = (job as any).pdfJobResult;
    return NextResponse.json({
      success: true,
      requestId,
      status: "done",
      data: {
        fileUrl: job.fileUrl,
        fileName: pdfJobResult?.fileName || "www.khanpdf.com.pdf",
        pageCount: pdfJobResult?.pageCount || 1,
        creditsUsed: pdfJobResult?.creditsUsed || 9,
        durationMs: pdfJobResult?.durationMs || 0,
        outputLinkValidTill: pdfJobResult?.outputLinkValidTill || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      message: "Your PDF is ready.",
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }

  if (job.status === "failed") {
    return NextResponse.json({
      success: false,
      requestId,
      status: "failed",
      message: "PDF conversion failed. Please try again.",
    });
  }

  return NextResponse.json({
    success: true,
    requestId,
    status: "processing",
    message: "Your PDF is still being generated.",
  });
}
