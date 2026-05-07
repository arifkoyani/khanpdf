interface PdfCoResponse {
  url: string;
  error: boolean;
  status: number;
  name?: string;
  message?: string;
}

// Calls khanpdf synchronously (async:false) and returns the final PDF URL directly.
// Throws on any error so callers can handle failure uniformly.
export async function submitPdfJob(url: string): Promise<string> {
  const response = await fetch(process.env.KHAN_PDF_API_URL_TO_PDF_URL!, {
    method: "POST",
    headers: {
      "x-api-key": process.env.KHAN_PDF_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      name: "www.khanpdf.com.pdf",
      "header": "<span style='font-size:10px; display:block; width:100%; text-align:center;'>Create by <a href='https://khanpdf.com' style='color:#f16625;text-decoration:none'>khanpdf.com</a></span>",
      async: false,
    }),
  });

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

  return data.url;
}
