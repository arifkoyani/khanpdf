interface PdfCoResponse {
  url: string;
  error: boolean;
  status: number;
  name?: string;
  message?: string;
  pageCount?: number;
  creditsUsed?: number;
  durationMs?: number;
  expiresAt?: string;
}

/** Optional PDF rendering settings forwarded from the frontend. */
export interface PdfJobOptions {
  /** CSS shorthand: "top right bottom left" e.g. "10mm 0mm 0mm 0mm" */
  margins?: string;
  /** e.g. "A4", "Letter", "Legal" */
  paperSize?: string;
  /** "Portrait" | "Landscape" */
  orientation?: string;
}

const HEADER_HTML =
  "<span style='font-size:10px; display:block; width:100%; text-align:center;'>" +
  "Create by <a href='https://khanpdf.com' style='color:#f16625;text-decoration:none'>khanpdf.com</a>" +
  "</span>";

export interface PdfJobResult {
  fileUrl: string;
  fileName: string;
  pageCount: number;
  creditsUsed: number;
  durationMs: number;
  outputLinkValidTill: string;
}

// Calls khanpdf synchronously (async:false) and returns the final PDF URL directly.
// Throws on any error so callers can handle failure uniformly.
export async function submitPdfJob(
  url: string,
  options: PdfJobOptions = {}
): Promise<PdfJobResult> {
  const startTime = Date.now();

  const response = await fetch(process.env.KHAN_PDF_API_URL_TO_PDF_URL!, {
    method: "POST",
    headers: {
      "x-api-key": process.env.KHAN_PDF_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      name: "www.khanpdf.com.pdf",
      ...(options.margins     && { margins:     options.margins }),
      ...(options.paperSize   && { paperSize:   options.paperSize }),
      ...(options.orientation && { orientation: options.orientation }),
      header: HEADER_HTML,
      async: false,
    }),
  });

  const durationMs = Date.now() - startTime;

  if (!response.ok) {
    throw new Error(`khanpdf returned ${response.status}: ${response.statusText}`);
  }

  const data: PdfCoResponse = await response.json();

  if (data.error) {
    throw new Error(`khanpdf error: ${data.message ?? "unknown"}`);
  }

  if (!data.url) {
    throw new Error("khanpdf returned no URL in response");
  }

  // Calculate link expiration (default 24 hours from now)
  const outputLinkValidTill = data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    fileUrl: data.url,
    fileName: data.name || "www.khanpdf.com.pdf",
    pageCount: data.pageCount || 1,
    creditsUsed: data.creditsUsed || 9,
    durationMs: data.durationMs || durationMs,
    outputLinkValidTill,
  };
}
