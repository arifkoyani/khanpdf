"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link2,
  Download,
  ExternalLink,
  RotateCcw,
  Check,
} from "lucide-react";
import Spinner from "../ui/Spinner";


type Status = "idle" | "submitting" | "processing" | "done" | "error";

const API_BASE = "/api/urltopdf";

const MARGIN_OPTIONS = ["0mm", "5mm", "10mm", "15mm", "20mm", "1cm", "0.5in"];
const PAPER_SIZES = [
  "A4", "Letter", "Legal", "Tabloid", "Ledger",
  "A0", "A1", "A2", "A3", "A5", "A6",
  "200mm 300mm", "20cm 30cm", "6in 8in", "200px 300px",
];

function isValidUrl(value: string) {
  const v = value.trim();
  if (!v) return false;

  try {
    const u = new URL(v);

    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return false;
    }

    const host = u.hostname.toLowerCase();

    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1"
    ) {
      return false;
    }

    if (
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      return false;
    }

    if (host.endsWith(".local")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default function UrlToPdf() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const pollRef = useRef<number | null>(null);

  // Email send
  const [emailValue, setEmailValue] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // PDF settings — sent to API on convert
  const [marginTop, setMarginTop] = useState("10mm");
  const [marginRight, setMarginRight] = useState("0mm");
  const [marginBottom, setMarginBottom] = useState("0mm");
  const [marginLeft, setMarginLeft] = useState("0mm");
  const [paperSize, setPaperSize] = useState("A4");
  const [orientation, setOrientation] = useState<"Portrait" | "Landscape">("Portrait");

  const valid = useMemo(() => isValidUrl(url), [url]);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  const stopTimers = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const reset = () => {
    stopTimers();
    setUrl("");
    setStatus("idle");
    setError(null);
    setFileUrl(null);
    setRequestId(null);
    setMarginTop("10mm");
    setMarginRight("5mm");
    setMarginBottom("15mm");
    setMarginLeft("5mm");
    setPaperSize("A4");
    setOrientation("Portrait");
    setEmailValue("");
    setEmailSent(false);
  };

  const pollStatus = async (requestId: string) => {
    stopTimers();

    pollRef.current = window.setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/status?requestId=${encodeURIComponent(requestId)}`
        );

        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data;

        if (item?.status === "done" && item?.fileUrl) {
          stopTimers();
          setStatus("done");
          setFileUrl(item.fileUrl);
        }

        if (
          item?.status === "failed" ||
          item?.status === "error" ||
          item?.status === "not_found"
        ) {
          stopTimers();
          setStatus("error");
          setError("PDF conversion failed. Please try another URL.");
        }
      } catch {
        stopTimers();
        setStatus("error");
        setError("Unable to check status.");
      }
    }, 1000);
  };

  const handleConvert = async () => {
    setError(null);
    setFileUrl(null);

    if (!valid) return;

    setStatus("submitting");

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          margins: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`,
          paperSize,
          orientation,
        }),
      });

      const data = await res.json();
      const item = Array.isArray(data) ? data[0] : data;

      if (!item?.requestId) {
        throw new Error("Request ID not found");
      }

      setRequestId(item.requestId);
      setStatus("processing");

      // backend gives requestId, frontend uses it to fetch final result
      pollStatus(item.requestId);

    } catch (e: unknown) {
      stopTimers();
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      const safeName = (() => {
        try {
          return new URL(url).hostname.replace(/\W+/g, "-") + ".pdf";
        } catch {
          return "converted.pdf";
        }
      })();
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpen = () => {
    if (!requestId) return;

    const viewerUrl = `/url-to-pdf/open-pdf?requestId=${encodeURIComponent(requestId)}`;

    const newTab = window.open(viewerUrl, "_blank");

    if (newTab) {
      newTab.opener = null;
    } else {
      window.location.href = viewerUrl;
    }
  };
  const handleSendEmail = async () => {
    if (!fileUrl) {
      setError("PDF URL not found.");
      return;
    }

    if (!emailValue.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setError(null);
      setEmailSending(true);

      const res = await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue.trim(),
          fileUrl,
        })

      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send email.");
      }

      setEmailSent(true);
      setEmailValue("");
    } catch (e: unknown) {
      setEmailSent(false);
      setError(e instanceof Error ? e.message : "Failed to send email.");
    } finally {
      setEmailSending(false);
    }
  };
  const busy = status === "submitting" || status === "processing";
  const showInput = status === "idle" || status === "error";
  useEffect(() => {
    if (status === "submitting" || status === "processing") {
      setProgress(1);
  
      const timer = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 1;
        });
      }, 150);
  
      return () => window.clearInterval(timer);
    }
  
    if (status === "done") {
      setProgress(100);
    }
  
    if (status === "idle" || status === "error") {
      setProgress(0);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-background text-foreground">


      <main className="relative">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute inset-0 grid-bg pointer-events-none" />

        <section
          className="relative mx-auto flex flex-col items-center justify-start px-[5vw]"
          style={{ minHeight: "calc(100vh - 3.5rem)", paddingTop: "4vh", paddingBottom: "6vh" }}
        >
          {/* Heading — kept as-is per request */}
          <div className="text-center mt-10" style={{ marginBottom: "4vh", maxWidth: "min(90vw, 640px)" }}>
            <h1 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)" }}>
              Paste a URL — get a <span className="text-gradient">PDF</span>
            </h1>
            <h2 className="text-muted-foreground mx-auto" style={{ marginTop: "1.5vh", fontSize: "clamp(0.85rem, 1.4vw, 0.95rem)", maxWidth: "min(90vw, 480px)" }}>
              Drop any public webpage link below and turn it into a clean, professional PDF.
              Download, open, or share your converted PDF in just a few seconds.

            </h2>
          </div>

          {/* Tool card */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              maxWidth: "min(92vw, 1290px)",
              padding: "clamp(1.25rem, 3vw, 2rem)",
              minHeight: "clamp(18rem, 38vh, 24rem)",
              marginTop: "4rem"
            }}
          >
            {/* IDLE / INPUT */}
            {showInput && (
              <div className="relative flex flex-col items-center justify-center w-full h-full" style={{ gap: "2.5vh" }}>
                <p className="text-center text-muted-foreground" style={{ fontSize: "clamp(0.85rem, 1.4vw, 0.95rem)" }}>
                  Enter a public website URL and convert it into a PDF file.
                </p>

                <div className="w-full flex justify-center">
  <div className="url-input-3d-wrap">
    <div className="relative w-full rounded-xl bg-background">
      <Link2
        className="absolute left-[1.25rem] top-1/2 z-20 -translate-y-1/2 text-muted-foreground"
        style={{
          height: "clamp(1rem, 1.6vw, 1.15rem)",
          width: "clamp(1rem, 1.6vw, 1.15rem)",
        }}
      />

      <input
        type="url"
        inputMode="url"
        autoFocus
        placeholder="https://example.com"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && valid) handleConvert();
        }}
        className="url-input-3d relative z-10 w-full bg-card text-foreground border border-transparent rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
        style={{
          height: "clamp(3rem, 7vh, 3.75rem)",
          paddingLeft: "clamp(2.75rem, 5vw, 3.25rem)",
          paddingRight: "clamp(2.75rem, 5vw, 3.25rem)",
          fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
        }}
      />

      <div
        className={`absolute right-[1rem] top-1/2 z-20 -translate-y-1/2 grid place-items-center rounded-full text-white transition-all duration-300 ${
          valid ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
        style={{
          height: "clamp(1.5rem, 2.6vw, 1.85rem)",
          width: "clamp(1.5rem, 2.6vw, 1.85rem)",
          background: "oklch(0.7 0.18 145)",
          boxShadow: valid
            ? "0 0 0 4px oklch(0.7 0.18 145 / 0.22)"
            : "none",
        }}
      >
        <Check
          className="animate-[scale-in_0.35s_ease-out]"
          style={{
            height: "clamp(0.85rem, 1.4vw, 1rem)",
            width: "clamp(0.85rem, 1.4vw, 1rem)",
            strokeWidth: 3,
          }}
        />
      </div>
    </div>
  </div>
</div>

                {/* PDF Settings — appears once URL is valid */}
                <div
                  className={`w-full transition-all duration-300 overflow-hidden ${valid ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 pointer-events-none"
                    }`}
                >
                  <div className="flex flex-col" style={{ gap: "1.8vh" }}>
                    <h3 className="font-semibold" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
                      PDF Settings <span className="text-muted-foreground font-normal">(Optional)</span>
                    </h3>

                    {/* Margins */}
                    <div className="flex flex-col" style={{ gap: "0.8vh" }}>
                      <label className="text-muted-foreground" style={{ fontSize: "clamp(0.78rem, 1.2vw, 0.85rem)" }}>
                        Page Margins
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "1.5vw" }}>
                        {[
                          { label: "Top", value: marginTop, set: setMarginTop },
                          { label: "Right", value: marginRight, set: setMarginRight },
                          { label: "Bottom", value: marginBottom, set: setMarginBottom },
                          { label: "Left", value: marginLeft, set: setMarginLeft },
                        ].map((m) => (
                          <div key={m.label} className="flex flex-col" style={{ gap: "0.4vh" }}>
                            <span className="text-muted-foreground" style={{ fontSize: "clamp(0.7rem, 1vw, 0.75rem)" }}>
                              {m.label}
                            </span>
                            <select
                              value={m.value}
                              onChange={(e) => m.set(e.target.value)}
                              className="w-full bg-background/60 border border-border rounded-lg outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                              style={{
                                height: "clamp(2.5rem, 5.5vh, 2.85rem)",
                                paddingLeft: "0.75rem",
                                paddingRight: "0.5rem",
                                fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)",
                              }}
                            >
                              {MARGIN_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: "clamp(0.68rem, 1vw, 0.75rem)" }}>
                        Combined: <span className="font-mono text-foreground/70">{`${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`}</span>
                      </p>
                    </div>

                    {/* Paper size */}
                    <div className="flex flex-col" style={{ gap: "0.8vh" }}>
                      <label className="text-muted-foreground" style={{ fontSize: "clamp(0.78rem, 1.2vw, 0.85rem)" }}>
                        Paper Size
                      </label>
                      <select
                        value={paperSize}
                        onChange={(e) => setPaperSize(e.target.value)}
                        className="w-full bg-background/60 border border-border rounded-lg outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        style={{
                          height: "clamp(2.75rem, 6vh, 3.15rem)",
                          paddingLeft: "0.9rem",
                          paddingRight: "0.6rem",
                          fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)",
                        }}
                      >
                        {PAPER_SIZES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* Orientation */}
                    <div className="flex flex-col" style={{ gap: "0.8vh" }}>
                      <label className="text-muted-foreground" style={{ fontSize: "clamp(0.78rem, 1.2vw, 0.85rem)" }}>
                        Orientation
                      </label>
                      <div className="grid grid-cols-2" style={{ gap: "1.5vw" }}>
                        {(["Portrait", "Landscape"] as const).map((o) => {
                          const active = orientation === o;
                          return (
                            <button
                              key={o}
                              type="button"
                              onClick={() => setOrientation(o)}
                              className={`cursor-pointer rounded-lg border transition-all inline-flex items-center justify-center gap-2 ${active
                                ? "border-[oklch(0.62_0.18_250)] bg-[oklch(0.62_0.18_250/0.1)] text-foreground"
                                : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                                }`}
                              style={{
                                height: "clamp(3rem, 7vh, 3.5rem)",
                                fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)",
                              }}
                            >
                              <span
                                aria-hidden
                                className="inline-block border-2 border-current rounded-[2px]"
                                style={
                                  o === "Portrait"
                                    ? { width: "0.85rem", height: "1.1rem" }
                                    : { width: "1.1rem", height: "0.85rem" }
                                }
                              />
                              {o}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-destructive text-center" style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)" }}>
                    {error}
                  </p>
                )}

                {/* Start Now button — appears only when valid */}
                <div
                  className={`w-full transition-all duration-300 ${valid ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
                >
                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={!valid}
                    className="w-full cursor-pointer rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    style={{
                      height: "clamp(3rem, 7vh, 3.5rem)",
                      fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                      background: "#f16625",
                      boxShadow: "0 10px 30px -20px #ff550d",
                    }}
                  >
                    Start Converting Now
                  </button>
                </div>
              </div>
            )}

            {/* PROCESSING */}
            {busy && (
         <div
         className="relative flex flex-col items-center justify-center w-full h-full"
         style={{ gap: "3vh", minHeight: "clamp(16rem, 32vh, 20rem)" }}
       >
         <Spinner />
       
         <p
           className="text-foreground/90 text-center font-medium"
           style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}
         >
           Converting your URL into PDF....{progress}%
         </p>
     
       </div>
            )}

            {/* DONE */}
            {status === "done" && fileUrl && (
              <div
                className="relative flex flex-col items-center justify-center text-center w-full h-full animate-[fade-in_0.4s_ease-out]"
                style={{ gap: "2vh" }}
              >
                <div
                  className="rounded-full grid place-items-center animate-[scale-in_0.3s_ease-out]"
                  style={{
                    height: "clamp(3.5rem, 8vh, 4.5rem)",
                    width: "clamp(3.5rem, 8vh, 4.5rem)",
                    background: "oklch(0.7 0.18 145 / 0.15)",
                    border: "1px solid oklch(0.7 0.18 145 / 0.45)",
                  }}
                >
                  <Check style={{ height: "clamp(1.5rem, 3vw, 2rem)", width: "clamp(1.5rem, 3vw, 2rem)", color: "oklch(0.7 0.18 145)", strokeWidth: 3 }} />
                </div>
                <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)" }}>
                  Your PDF is ready
                </h2>

                <div className="w-full flex flex-col" style={{ gap: "1.2vh", marginTop: "1vh" }}>
                  {/* Download + Open row (Open is ~20% width) */}
                  <div className="w-full flex" style={{ gap: "0.6rem" }}>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className=" cursor-pointer rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                      style={{
                        flex: "0 0 80%",
                        height: "clamp(3rem, 6.5vh, 3.5rem)",
                        fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                        background: "#ff550d",
                        boxShadow: "0 10px 30px -15px #ff550d",
                      }}
                    >
                      <Download style={{ height: "1.05rem", width: "1.05rem" }} />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleOpen}
                      disabled={!requestId}
                      title="Open PDF"
                      className="cursor-pointer rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        flex: "0 0 calc(20% - 0.6rem)",
                        height: "clamp(3rem, 6.5vh, 3.5rem)",
                        background: "#ff550d",
                        boxShadow: "0 10px 30px -15px #ff550d",
                      }}
                    >
                      <ExternalLink style={{ height: "1rem", width: "1rem" }} />
                    </button>
                  </div>

                  {/* Email row */}
                  <div className="w-full flex flex-col" style={{ gap: "0.5vh", marginTop: "0.4vh" }}>
                    <div className="w-full flex" style={{ gap: "0.6rem" }}>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={emailValue}
                        onChange={(e) => { setEmailValue(e.target.value); setEmailSent(false); }}
                        className="bg-background/60 border border-border rounded-xl outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                        style={{
                          flex: "0 0 80%",
                          height: "clamp(3rem, 6.5vh, 3.5rem)",
                          paddingLeft: "1rem",
                          paddingRight: "1rem",
                          fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={emailSending}
                        title="Send to email"
                        className="cursor-pointer rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          flex: "0 0 calc(20% - 0.6rem)",
                          height: "clamp(3rem, 6.5vh, 3.5rem)",
                          background: "#ff550d",
                          boxShadow: "0 10px 30px -10px #ff550d",
                          fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)",
                        }}
                      >
                        {emailSending ? (
                          <span className="animate-pulse" >Sending...</span>
                        ) : emailSent ? (
                          <Check style={{ height: "1.05rem", width: "1.05rem", strokeWidth: 3, }} />
                        ) : (
                          "Send"
                        )}
                      </button>
                    </div>
                    {emailSent && (
                      <p style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.82rem)", color: "#22c55e", paddingLeft: "0.25rem" }}>
                        Message sent successfully
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={reset}
                    className="cursor-pointer w-full rounded-xl text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center gap-2"
                    style={{
                      height: "clamp(2.5rem, 5.5vh, 3rem)",
                      fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)",
                    }}
                  >
                    <RotateCcw style={{ height: "0.9rem", width: "0.9rem" }} />
                    Convert Another URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
