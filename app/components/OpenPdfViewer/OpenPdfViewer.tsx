"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Download,
    ExternalLink,
    Share2,
    RotateCcw,
    Clock,
    ShieldCheck,
    Zap,
    Globe,
    FileText,
    Link2,
    Check,
} from "lucide-react";
import Spinner from "../ui/Spinner";
// import Spinner from "@/components/ui/Spinner";




type Status = "loading" | "processing" | "done" | "error";
type BlogPost = {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    description: string | null;
    read_time: string | null;
    publish_date: string | null;
    status: "draft" | "publish";
    thumbnail_url: string | null;
    created_at: string;
  };

const BRAND = "#ff550d";
const STATUS_API = "/api/urltopdf/status";
const ONE_HOUR_MS = 60 * 60 * 1000;

function formatCountdown(ms: number) {
    if (ms <= 0) return "00:00:00";
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function formatLocal(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    }).format(date);
}


const BLOCKED_EMAIL_DOMAINS = new Set([
    "test.com",
    "example.com",
    "abc.com",
    "localhost.com",
  ]);
  
  const DISPOSABLE_EMAIL_KEYWORDS = [
    "tempmail",
    "10minutemail",
    "mailinator",
    "guerrillamail",
    "yopmail",
    "trashmail",
  ];
  
  function isValidEmail(email: string) {
    const value = email.trim().toLowerCase();
  
    if (!value) return false; // required
    if (/\s/.test(value)) return false; // no spaces
    if (value.length < 6 || value.length > 254) return false; // length
  
    const parts = value.split("@");
    if (parts.length !== 2) return false; // only one @
  
    const [username, domain] = parts;
  
    if (!username || !domain) return false;
    if (username.length > 64) return false;
  
    if (username.startsWith(".") || username.endsWith(".")) return false;
    if (username.includes("..")) return false;
  
    if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(username)) return false;
  
    if (!domain.includes(".")) return false;
    if (domain.includes("..")) return false;
    if (BLOCKED_EMAIL_DOMAINS.has(domain)) return false;
  
    const labels = domain.split(".");
    const tld = labels[labels.length - 1];
  
    if (!tld || tld.length < 2) return false;
    if (!/^[a-z]+$/.test(tld)) return false;
  
    const validLabels = labels.every((label) => {
      if (!label) return false;
      if (label.startsWith("-") || label.endsWith("-")) return false;
      return /^[a-z0-9-]+$/.test(label);
    });
  
    if (!validLabels) return false;
  
    const isDisposable = DISPOSABLE_EMAIL_KEYWORDS.some((keyword) =>
      domain.includes(keyword)
    );
  
    if (isDisposable) return false;
  
    return true;
  }

export default function OpenPdfViewer() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("requestId") || "";
    const [status, setStatus] = useState<Status>("loading");
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [now, setNow] = useState<Date>(() => new Date());
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [copied, setCopied] = useState(false);
    const pollRef = useRef<number | null>(null);
    const tickRef = useRef<number | null>(null);
    const [emailValue, setEmailValue] = useState("");
const [emailSending, setEmailSending] = useState(false);
const [emailSent, setEmailSent] = useState(false);
const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
const emailValid = isValidEmail(emailValue);

    // Poll status
    useEffect(() => {
        if (!requestId) {
            setStatus("error");
            setError("Missing requestId in URL.");
            return;
        }
        let cancelled = false;
        let inFlight = false;
        let failures = 0;

        const poll = async () => {
            if (inFlight || cancelled) return;
            inFlight = true;
            try {
                const res = await fetch(
                    `${STATUS_API}?requestId=${encodeURIComponent(requestId)}`,
                    { cache: "no-store" },
                );
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const json = await res.json();
                const item = Array.isArray(json) ? json[0] : json;
                const s = item?.status;
                failures = 0;
                if (s === "done" && (item?.data?.fileUrl || item?.fileUrl)) {
                    if (!cancelled) {
                        setFileUrl((item?.data?.fileUrl || item?.fileUrl) as string);
                        setStatus("done");
                        setExpiresAt(new Date(Date.now() + ONE_HOUR_MS));
                    }
                    if (pollRef.current) {
                        window.clearInterval(pollRef.current);
                        pollRef.current = null;
                    }
                } else if (
                    s === "failed" ||
                    s === "error" ||
                    s === "not_found" ||
                    item?.success === false
                ) {
                    if (!cancelled) {
                        setStatus("error");
                        setError(item?.message || "Conversion failed or not found.");
                    }
                    if (pollRef.current) {
                        window.clearInterval(pollRef.current);
                        pollRef.current = null;
                    }
                } else {
                    if (!cancelled) setStatus("processing");
                }
            } catch (e) {
                failures += 1;
                if (failures >= 10 && !cancelled) {
                    setStatus("error");
                    setError(e instanceof Error ? e.message : "Network error.");
                    if (pollRef.current) {
                        window.clearInterval(pollRef.current);
                        pollRef.current = null;
                    }
                }
            } finally {
                inFlight = false;
            }
        };

        void poll();
        pollRef.current = window.setInterval(poll, 1000);
        return () => {
            cancelled = true;
            if (pollRef.current) window.clearInterval(pollRef.current);
        };
    }, [requestId]);

    // Live clock / countdown
    useEffect(() => {
        tickRef.current = window.setInterval(() => setNow(new Date()), 1000);
        return () => {
            if (tickRef.current) window.clearInterval(tickRef.current);
        };
    }, []);

    const remaining = useMemo(() => {
        if (!expiresAt) return ONE_HOUR_MS;
        return expiresAt.getTime() - now.getTime();
    }, [expiresAt, now]);


    useEffect(() => {
        const fetchLatestBlogs = async () => {
          try {
            const res = await fetch("/api/blogs/allblogs", {
              cache: "no-store",
            });
      
            const data = await res.json();
      
            if (!res.ok || !data.success) {
              return;
            }
      
            const publishedBlogs = (data.blogs || [])
              .filter((blog: BlogPost) => blog.status === "publish")
              .sort(
                (a: BlogPost, b: BlogPost) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )
              .slice(0, 3);
      
            setLatestBlogs(publishedBlogs);
          } catch {
            setLatestBlogs([]);
          }
        };
      
        fetchLatestBlogs();
      }, []);

    const handleDownload = async () => {
        if (!fileUrl) return;
        try {
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const objUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objUrl;
            a.download = `khanpdf-${requestId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objUrl);
        } catch {
            window.open(fileUrl, "_blank", "noopener,noreferrer");
        }
    };

    const handleShare = async () => {
        const shareUrl = "https://khanpdf.com/";
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "KhanPDF — URL to PDF",
                    text: "Convert any public webpage into a clean PDF in seconds.",
                    url: shareUrl,
                });
                return;
            }
        } catch {
            // fall through to copy
        }
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            window.open(shareUrl, "_blank", "noopener,noreferrer");
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
      
        if (!emailValid) {
          setError("Please enter a valid email address.");
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
            }),
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

    return (
        <div className="min-h-screen bg-background text-foreground">

            <main className="mx-auto max-w-10xl px-5 py-8 md:py-12 space-y-10 mt-8">
                {/* Top row: title + actions */}
                <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  <div>
    <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
      Your PDF preview
    </h1>
    <p className="text-sm text-muted-foreground mt-1">
      Hosted on KhanPDF — request{" "}
      <span className="font-mono text-foreground/80">
        {requestId || "—"}
      </span>
    </p>
  </div>

  <div className="flex flex-col md:flex-row md:items-center gap-3 w-full lg:w-auto">
  <div className="flex flex-col w-full md:w-[420px] gap-2">
  <div className="flex w-full gap-2">
    <div className="relative flex-1">
      <input
        type="email"
        placeholder="you@example.com"
        value={emailValue}
        onChange={(e) => {
          setEmailValue(e.target.value);
          setEmailSent(false);
          if (error) setError(null);
        }}
        className="h-11 w-full bg-background/60 border border-border rounded-xl px-4 pr-12 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground text-sm"
      />

      <div
        className={`absolute right-3 top-1/2 z-20 -translate-y-1/2 grid place-items-center rounded-full text-white transition-all duration-300 ${
          emailValid ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
        style={{
          height: "1.55rem",
          width: "1.55rem",
          background: "oklch(0.7 0.18 145)",
          boxShadow: emailValid
            ? "0 0 0 4px oklch(0.7 0.18 145 / 0.22)"
            : "none",
        }}
      >
        <Check
          className="animate-[scale-in_0.35s_ease-out]"
          style={{
            height: "0.9rem",
            width: "0.9rem",
            strokeWidth: 3,
          }}
        />
      </div>
    </div>

    <button
      type="button"
      onClick={handleSendEmail}
      disabled={emailSending || !fileUrl || !emailValid}
      title="Send PDF to email"
      className="h-11 min-w-[86px] cursor-pointer rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-sm"
      style={{
        background: BRAND,
        boxShadow: `0 10px 30px -10px ${BRAND}`,
      }}
    >
      {emailSending ? (
        <span className="animate-pulse">Sending...</span>
      ) : emailSent ? (
        <Check className="h-4 w-4" strokeWidth={3} />
      ) : (
        "Send"
      )}
    </button>
  </div>

  {emailValue && !emailValid && (
    <p className="text-xs text-destructive pl-1">
      Please enter a valid email address.
    </p>
  )}

  {emailSent && (
    <p className="text-xs text-success pl-1">
      PDF sent successfully
    </p>
  )}
</div>

    <Link
      href="/"
      className="h-11 inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
      style={{
        background: BRAND,
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow: `0 10px 30px -12px ${BRAND}`,
      }}
    >
      <RotateCcw className="h-4 w-4" /> Convert Another URL
    </Link>
  </div>
</section>

                {/* Viewer */}
                <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-elegant mt-8">


                    <div className="bg-muted/30" style={{ height: "min(78vh, 760px)" }}>
                        {status === "loading" || status === "processing" ? (
                            <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                                <Spinner />
                                <p className="text-sm text-muted-foreground">
                                    {status === "loading"
                                        ? "Loading your PDF…"
                                        : "Still processing your PDF — this can take a few seconds."}
                                </p>
                            </div>
                        ) : status === "error" ? (
                            <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-6 text-center">
                                <div
                                    className="h-12 w-12 rounded-full grid place-items-center"
                                    style={{ background: "oklch(0.65 0.2 25 / 0.12)" }}
                                >
                                    <FileText
                                        className="h-6 w-6"
                                        style={{ color: "oklch(0.65 0.2 25)" }}
                                    />
                                </div>
                                <h2 className="font-semibold text-lg">We couldn't load this PDF</h2>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    {error ||
                                        "This PDF may have expired, the link is invalid, or the conversion did not complete."}
                                </p>
                                <Link
                                    href="/url-to-pdf"
                                    className="mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                                    style={{ background: BRAND }}
                                >
                                    Try again
                                </Link>
                            </div>
                        ) : fileUrl ? (
                            <iframe
                                src={fileUrl}
                                title="Converted PDF"
                                className="w-full h-full"
                                style={{ border: 0, background: "white" }}
                            />
                        ) : null}
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-4 border-t border-border bg-background/40 flex flex-wrap gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={!fileUrl}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5"
                            style={{
                                background: BRAND,
                                border: "1px solid rgba(255,255,255,0.85)",
                                boxShadow: `0 10px 30px -12px ${BRAND}`,
                            }}
                        >
                            <Download className="h-4 w-4" /> Download PDF
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                fileUrl &&
                                window.open(fileUrl, "_blank", "noopener,noreferrer")
                            }
                            disabled={!fileUrl}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground border border-border bg-background/60 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                        >
                            <ExternalLink className="h-4 w-4" /> Open Direct
                        </button>
                        <button
                            type="button"
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground border border-border bg-background/60 transition-all hover:-translate-y-0.5"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4" /> Link copied
                                </>
                            ) : (
                                <>
                                    <Share2 className="h-4 w-4" /> Share This Tool
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Expiry / time info */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Current local time</p>
                        <p className="font-mono text-lg mt-1">{formatLocal(now)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">PDF expires at</p>
                        <p className="font-mono text-lg mt-1">
                            {expiresAt ? formatLocal(expiresAt) : "—"}
                        </p>
                    </div>
                    <div
                        className="rounded-xl p-4 text-white"
                        style={{
                            background: `linear-gradient(135deg, ${BRAND}, oklch(0.7 0.2 35))`,
                        }}
                    >
                        <p className="text-xs opacity-90">Time remaining</p>
                        <p className="font-mono text-lg mt-1">
                            {formatCountdown(remaining)}
                        </p>
                    </div>
                </section>

                <section className="rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground mt-8">
                    Your PDF file is temporary and may expire in 1 hour. Download it now
                    to keep a copy.
                </section>

                {/* Promo */}
                <section className="rounded-2xl border border-border bg-card p-6 md:p-8 mt-8">
                    <h2 className="font-display font-bold text-xl md:text-2xl">
                        Need to save another webpage?
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        KhanPDF lets you convert public webpages, articles, blogs, reports,
                        documentation pages, and images into clean PDF files in seconds. No
                        signup required.
                    </p>
                </section>

                {/* Popular tools */}
                <section className="mt-8">
                    <h2 className="font-display font-bold text-xl md:text-2xl mb-4">
                        Popular PDF tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { name: "URL to PDF", status: "Available", to: "/url-to-pdf" },
                            { name: "HTML to PDF", status: "Coming Soon" },
                            { name: "Image to PDF", status: "Coming Soon" },
                            { name: "PDF to QR Code", status: "Coming Soon" },
                            { name: "Barcode Generator", status: "Coming Soon" },
                        ].map((t) => {
                            const available = t.status === "Available";
                            const inner = (
                                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between hover:border-foreground/30 transition-colors h-full">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-9 w-9 rounded-lg grid place-items-center"
                                            style={{ background: `${BRAND}1a`, color: BRAND }}
                                        >
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold">{t.name}</span>
                                    </div>
                                    <span
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{
                                            background: available ? "oklch(0.7 0.18 145 / 0.15)" : "var(--muted)",
                                            color: available ? "oklch(0.55 0.18 145)" : undefined,
                                        }}
                                    >
                                        {t.status}
                                    </span>
                                </div>
                            );
                            return available && t.to ? (
                                <Link key={t.name} href={t.to}>
                                    {inner}
                                </Link>
                            ) : (
                                <div key={t.name}>{inner}</div>
                            );
                        })}
                    </div>
                </section>

                {/* Latest blog */}
                {/* Latest blog */}
{latestBlogs.length > 0 && (
  <section className="mt-10">
    <h2 className="font-display font-bold text-xl md:text-2xl mb-4">
      Latest from the blog
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {latestBlogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.slug}`}
          className="rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/30 transition-colors"
        >
          <div className="aspect-[16/9] bg-muted overflow-hidden">
            {blog.thumbnail_url ? (
              <img
                src={blog.thumbnail_url}
                alt={blog.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <FileText className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="p-4">
            {blog.category && (
              <span className="inline-flex rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold mb-2">
                {blog.category}
              </span>
            )}

            <p className="font-semibold leading-snug line-clamp-2">
              {blog.title}
            </p>

            {blog.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {blog.description}
              </p>
            )}

            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Read Article <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
)}

                {/* Trust */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10 mb-6">
  {[
    { icon: ShieldCheck, label: "No signup required" },
    { icon: Zap, label: "Fast PDF conversion" },
    { icon: Globe, label: "Works with public URLs" },
    { icon: FileText, label: "Clean PDF output" },
    { icon: Share2, label: "Simple download & sharing" },
  ].map(({ icon: Icon, label }) => (
    <div
      key={label}
      className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary"
        >
          <Icon className="h-5 w-12" />
        </div>

        <span className="text-sm font-semibold leading-snug text-foreground">
          {label}
        </span>
      </div>
    </div>
  ))}
</section>


            </main>
        </div>
    );
}

