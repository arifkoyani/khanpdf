import redis from "./redis";
import type { PdfJobOptions } from "./pdfco";

const QUEUE_KEY = "urltopdf:queue";

export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface JobData {
  requestId: string;
  url: string;
  pdfOptions: PdfJobOptions;
  status: JobStatus;
  jobId?: string;
  fileUrl?: string;
  retries: number;
  createdAt: number;
}

export async function enqueueJob(requestId: string): Promise<void> {
  await redis.rpush(QUEUE_KEY, requestId);
}
