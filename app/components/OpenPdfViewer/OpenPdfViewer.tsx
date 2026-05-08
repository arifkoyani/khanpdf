/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Download,
    RotateCcw,
    ExternalLink,
    Share2,
    Clock,
    CheckCircle2,
} from "lucide-react";

type PdfStatus = "loading" | "processing" | "done" | "error";

export default function OpenPdfViewer() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("requestId");

    const [status, setStatus] = useState<PdfStatus>("loading");
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [remainingSeconds, setRemainingSeconds] = useState(3600);

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

        const stopPolling = () => {
            if (intervalId) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        };

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
                    stopPolling();
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
                    stopPolling();
                }
            } catch {
                setStatus("error");
                setError("Unable to load PDF.");
                stopPolling();
            }
        };

        fetchFinalPdf();
        intervalId = window.setInterval(fetchFinalPdf, 1000);

        return () => {
            stopPolling();
        };
    }, [requestId]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

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

    const handleShareTool = async () => {
        const shareUrl = "https://khanpdf.com/";

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "KhanPDF - Convert URL to PDF",
                    text: "Convert any public URL into a clean PDF online.",
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert("KhanPDF link copied!");
            }
        } catch {
            await navigator.clipboard.writeText(shareUrl);
            alert("KhanPDF link copied!");
        }
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
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
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
                        fontWeight: 700,
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
                    <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                        PDF Preview
                    </h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                        This temporary file may expire after around 1 hour.
                    </p>
                </div>

                {fileUrl && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={handleDownload}
                            style={{
                                border: "none",
                                borderRadius: "10px",
                                background: "#ff550d",
                                color: "#ffffff",
                                padding: "10px 14px",
                                fontWeight: 700,
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
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <ExternalLink size={16} />
                            Open Direct
                        </button>
                    </div>
                )}
            </section>

            <section style={{ height: "75vh", minHeight: "520px" }}>
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
                    <div
                        style={{
                            padding: "2rem",
                            textAlign: "center",
                            color: "#dc2626",
                        }}
                    >
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

            <section
                style={{
                    padding: "32px 24px",
                    background: "#ffffff",
                    borderTop: "1px solid #e5e7eb",
                }}
            >
                <div
                    style={{
                        maxWidth: "1120px",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "32px",
                    }}
                >
                    <div
                        style={{
                            padding: "24px",
                            borderRadius: "18px",
                            background: "#fff7ed",
                            border: "1px solid #fed7aa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "18px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    color: "#111827",
                                }}
                            >
                                Your PDF is ready
                            </h2>

                            <p
                                style={{
                                    margin: "8px 0 0",
                                    color: "#6b7280",
                                    fontSize: "15px",
                                    lineHeight: 1.6,
                                }}
                            >
                                Your PDF file is temporary and may expire in 1 hour. Download it
                                now to keep a copy.
                            </p>

                            <p
                                style={{
                                    margin: "12px 0 0",
                                    color: "#ff550d",
                                    fontWeight: 800,
                                    fontSize: "16px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <Clock size={17} />
                                File expires in: {formatTime(remainingSeconds)}
                            </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={!fileUrl}
                                style={{
                                    border: "none",
                                    borderRadius: "12px",
                                    background: "#ff550d",
                                    color: "#ffffff",
                                    padding: "12px 18px",
                                    fontWeight: 800,
                                    cursor: fileUrl ? "pointer" : "not-allowed",
                                    opacity: fileUrl ? 1 : 0.6,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <Download size={16} />
                                Download PDF
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                                style={{
                                    border: "1px solid #d1d5db",
                                    borderRadius: "12px",
                                    background: "#ffffff",
                                    color: "#111827",
                                    padding: "12px 18px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <RotateCcw size={16} />
                                Convert Another URL
                            </button>

                            <button
                                type="button"
                                onClick={handleShareTool}
                                style={{
                                    border: "1px solid #d1d5db",
                                    borderRadius: "12px",
                                    background: "#ffffff",
                                    color: "#111827",
                                    padding: "12px 18px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <Share2 size={16} />
                                Share This Tool
                            </button>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "28px",
                            borderRadius: "18px",
                            border: "1px solid #e5e7eb",
                            background: "#f9fafb",
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: 800,
                                color: "#111827",
                            }}
                        >
                            Need to save another webpage?
                        </h2>

                        <p
                            style={{
                                margin: "10px 0 0",
                                color: "#6b7280",
                                fontSize: "16px",
                                lineHeight: 1.7,
                                maxWidth: "760px",
                            }}
                        >
                            KhanPDF lets you convert public webpages, articles, blogs,
                            reports, documentation pages, and images into clean PDF files in
                            seconds. No signup required.
                        </p>
                    </div>

                    <div>
                        <h2
                            style={{
                                margin: "0 0 16px",
                                fontSize: "24px",
                                fontWeight: 800,
                                color: "#111827",
                            }}
                        >
                            Popular PDF Tools
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: "14px",
                            }}
                        >
                            {[
                                { title: "URL to PDF", href: "/", status: "Available" },
                                { title: "HTML to PDF", href: "/", status: "Coming Soon" },
                                { title: "Image to PDF", href: "/", status: "Coming Soon" },
                                { title: "PDF to QR Code", href: "/", status: "Coming Soon" },
                                {
                                    title: "Barcode Generator",
                                    href: "/",
                                    status: "Coming Soon",
                                },
                            ].map((tool) => (
                                <a
                                    key={tool.title}
                                    href={tool.href}
                                    style={{
                                        textDecoration: "none",
                                        padding: "18px",
                                        borderRadius: "16px",
                                        border: "1px solid #e5e7eb",
                                        background: "#ffffff",
                                        color: "#111827",
                                        boxShadow: "0 10px 24px -20px rgba(0,0,0,0.35)",
                                        display: "block",
                                    }}
                                >
                                    <strong style={{ fontSize: "16px" }}>{tool.title}</strong>

                                    <p
                                        style={{
                                            margin: "8px 0 0",
                                            color:
                                                tool.status === "Available" ? "#16a34a" : "#f97316",
                                            fontSize: "13px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {tool.status}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2
                            style={{
                                margin: "0 0 16px",
                                fontSize: "24px",
                                fontWeight: 800,
                                color: "#111827",
                            }}
                        >
                            Latest from KhanPDF Blog
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            {[
                                {
                                    title: "How to Convert a Webpage to PDF Online",
                                    desc: "Learn how to save any public webpage as a clean PDF file using KhanPDF.",
                                    image:
                                        "https://placehold.co/600x340/ff550d/ffffff?text=Convert+Webpage+to+PDF",
                                    href: "/blog/how-to-convert-url-to-pdf",
                                },
                                {
                                    title: "Best Way to Save Articles as PDF",
                                    desc: "A simple guide for saving blogs, articles, and reports as PDF documents.",
                                    image:
                                        "https://placehold.co/600x340/111827/ffffff?text=Save+Articles+as+PDF",
                                    href: "/blog/save-articles-as-pdf",
                                },
                                {
                                    title: "How to Download a Website Page as PDF",
                                    desc: "Turn public website pages into downloadable PDF files in just a few clicks.",
                                    image:
                                        "https://placehold.co/600x340/f97316/ffffff?text=Download+Page+as+PDF",
                                    href: "/blog/download-website-page-as-pdf",
                                },
                            ].map((blog) => (
                                <article
                                    key={blog.title}
                                    style={{
                                        overflow: "hidden",
                                        borderRadius: "18px",
                                        border: "1px solid #e5e7eb",
                                        background: "#ffffff",
                                        boxShadow: "0 12px 30px -24px rgba(0,0,0,0.45)",
                                    }}
                                >
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        style={{
                                            width: "100%",
                                            height: "160px",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />

                                    <div style={{ padding: "18px" }}>
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: "18px",
                                                fontWeight: 800,
                                                color: "#111827",
                                                lineHeight: 1.35,
                                            }}
                                        >
                                            {blog.title}
                                        </h3>

                                        <p
                                            style={{
                                                margin: "10px 0 16px",
                                                color: "#6b7280",
                                                fontSize: "14px",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {blog.desc}
                                        </p>

                                        <a
                                            href={blog.href}
                                            style={{
                                                color: "#ff550d",
                                                fontWeight: 800,
                                                textDecoration: "none",
                                                fontSize: "14px",
                                            }}
                                        >
                                            Read More →
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "28px",
                            borderRadius: "18px",
                            background: "#111827",
                            color: "#ffffff",
                        }}
                    >
                        <h2
                            style={{
                                margin: "0 0 16px",
                                fontSize: "24px",
                                fontWeight: 800,
                            }}
                        >
                            Why use KhanPDF?
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: "14px",
                            }}
                        >
                            {[
                                "No signup required",
                                "Fast PDF conversion",
                                "Works with public URLs",
                                "Clean PDF output",
                                "Simple download and sharing",
                            ].map((item) => (
                                <div
                                    key={item}
                                    style={{
                                        padding: "14px",
                                        borderRadius: "14px",
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <CheckCircle2 size={17} color="#22c55e" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer
                        style={{
                            paddingTop: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "14px",
                            flexWrap: "wrap",
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >
                        <p style={{ margin: 0 }}>
                            © KhanPDF. Convert URLs into PDFs online.
                        </p>

                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                            <a href="/" style={{ color: "#6b7280", textDecoration: "none" }}>
                                URL to PDF
                            </a>
                            <a
                                href="/blog"
                                style={{ color: "#6b7280", textDecoration: "none" }}
                            >
                                Blog
                            </a>
                            <a href="/" style={{ color: "#6b7280", textDecoration: "none" }}>
                                Convert PDF
                            </a>
                        </div>
                    </footer>
                </div>
            </section>
        </main>
    );
}