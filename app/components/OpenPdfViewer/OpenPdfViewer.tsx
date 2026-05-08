"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, RotateCcw, ExternalLink } from "lucide-react";

type PdfStatus = "loading" | "processing" | "done" | "error";

export default function OpenPdfViewer() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("requestId");

    const [status, setStatus] = useState<PdfStatus>("loading");
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const viewerTitle = useMemo(() => {
        if (!requestId) return "PDF Viewer";
        return `PDF Viewer - ${requestId}`;
    }, [requestId]);

    useEffect(() => {
        if (!requestId) {
            setStatus("error");
            setError("Request ID is missing.");
            return;
        }

        let intervalId: number | null = null;

        const fetchFinalPdf = async () => {
            try {
                const res = await fetch(
                    `/api/urltopdf/status?requestId=${encodeURIComponent(requestId)}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await res.json();
                const item = Array.isArray(data) ? data[0] : data;

                if (item?.status === "done" && item?.fileUrl) {
                    setStatus("done");
                    setFileUrl(item.fileUrl);

                    if (intervalId) {
                        window.clearInterval(intervalId);
                    }

                    return;
                }

                if (item?.status === "processing" || item?.status === "queued") {
                    setStatus("processing");
                    return;
                }

                if (
                    item?.status === "failed" ||
                    item?.status === "error" ||
                    item?.status === "not_found"
                ) {
                    setStatus("error");
                    setError("PDF not found, failed, or expired.");

                    if (intervalId) {
                        window.clearInterval(intervalId);
                    }
                }
            } catch {
                setStatus("error");
                setError("Unable to load PDF.");

                if (intervalId) {
                    window.clearInterval(intervalId);
                }
            }
        };

        fetchFinalPdf();

        intervalId = window.setInterval(fetchFinalPdf, 1000);

        return () => {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        };
    }, [requestId]);

    const handleDownload = async () => {
        if (!fileUrl) return;

        try {
            const res = await fetch(fileUrl);
            const blob = await res.blob();

            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = objectUrl;
            a.download = "khanpdf-converted.pdf";

            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(objectUrl);
        } catch {
            window.open(fileUrl, "_blank");
        }
    };

    const handleOpenDirect = () => {
        if (!fileUrl) return;
        window.open(fileUrl, "_blank");
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                color: "#111827",
            }}
        >
            <header
                style={{
                    height: "64px",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#ffffff",
                }}
            >
                <div>
                    <strong style={{ fontSize: "20px" }}>KhanPDF</strong>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                        Your converted PDF is ready to view
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                    style={{
                        border: "none",
                        borderRadius: "10px",
                        background: "#ff550d",
                        color: "#ffffff",
                        padding: "10px 16px",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Convert Another URL
                </button>
            </header>

            <section
                style={{
                    padding: "16px 24px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    background: "#ffffff",
                    borderBottom: "1px solid #e5e7eb",
                }}
            >
                <div>
                    <h1 style={{ margin: 0, fontSize: "18px" }}>PDF Preview</h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                        This temporary file may expire after around 1 hour.
                    </p>
                </div>

                {fileUrl && (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            type="button"
                            onClick={handleDownload}
                            style={{
                                border: "none",
                                borderRadius: "10px",
                                background: "#ff550d",
                                color: "#ffffff",
                                padding: "10px 14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Download size={16} />
                            Download
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenDirect}
                            style={{
                                border: "1px solid #d1d5db",
                                borderRadius: "10px",
                                background: "#ffffff",
                                color: "#111827",
                                padding: "10px 14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <ExternalLink size={16} />
                            Open Direct
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "/";
                            }}
                            style={{
                                border: "1px solid #d1d5db",
                                borderRadius: "10px",
                                background: "#ffffff",
                                color: "#111827",
                                padding: "10px 14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <RotateCcw size={16} />
                            Convert Again
                        </button>
                    </div>
                )}
            </section>

            <section style={{ height: "calc(100vh - 145px)" }}>
                {status === "loading" && (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                        Loading PDF...
                    </div>
                )}

                {status === "processing" && (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                        Your PDF is still processing. Please wait...
                    </div>
                )}

                {status === "error" && (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>
                        {error || "Something went wrong."}
                    </div>
                )}

                {status === "done" && fileUrl && (
                    <iframe
                        src={fileUrl}
                        title={viewerTitle}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            background: "#ffffff",
                        }}
                    />
                )}
            </section>
        </main>
    );
}