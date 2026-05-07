"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
  FileText,
  Play,
  Star,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ArrowDown,
} from "lucide-react";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const articles = [
  {
    category: "URL to PDF",
    readTime: "10 min read",
    date: "May 2026",
    title: "What Is URL to PDF and How Does It Work?",
    description:
      "Sometimes you need to save a webpage as a PDF for sharing, printing, offline reading, or record keeping. A URL to PDF tool makes this simple — paste a link, click convert, get a PDF.",
    href: "/url-to-pdf",
    slug: "convert-any-url-to-pdf-online",
    thumbnail: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1200&h=630&fit=crop",
    midImage: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1200&h=600&fit=crop",
    infographic: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop",
    videoId: "dQw4w9WgXcQ",
  },
];

const urlTypes = [
  "Blog posts & articles",
  "Documentation pages",
  "Public GitHub pages",
  "Landing pages & reports",
  "HTML pages",
  "Any public webpage",
];

const benefits = [
  { icon: CheckCircle2, text: "No browser extension needed" },
  { icon: CheckCircle2, text: "No signup required" },
  { icon: CheckCircle2, text: "Works from any device" },
  { icon: CheckCircle2, text: "Fast conversion" },
  { icon: CheckCircle2, text: "Easy sharing and downloading" },
  { icon: CheckCircle2, text: "Keeps page formatting in PDF form" },
];

const useCases = [
  { icon: FileText, title: "Save Receipts", desc: "Archive e-commerce order confirmations and invoices as PDFs for accounting records." },
  { icon: Globe, title: "Archive Web Articles", desc: "Preserve news articles and blog posts exactly as they appear today — fonts, images, and all." },
  { icon: Shield, title: "Legal & Compliance", desc: "Capture policy pages or terms-of-service as tamper-evident PDFs." },
  { icon: Zap, title: "Automated Reporting", desc: "Build pipelines that convert live dashboards into scheduled PDF reports." },
];

const commonProblems = [
  { label: "Website blocks automated access", detail: "Some sites detect bots and block headless browsers from loading their content." },
  { label: "Page requires login", detail: "Login-protected or paywalled pages cannot be reached by the converter." },
  { label: "Page takes too long to load", detail: "Heavy pages with many resources may time out before the PDF is generated." },
  { label: "Images or scripts do not load correctly", detail: "Dynamic content that relies on specific browser APIs may render incorrectly." },
  { label: "URL is not publicly accessible", detail: "Intranet, staging, or localhost URLs are not reachable from a remote server." },
];

const bestPractices = [
  "Use a public URL — not login-protected or behind a paywall",
  "Make sure the page loads correctly in your own browser first",
  "Avoid intranet, localhost, or staging environment links",
  "Use clean article or documentation pages for best results",
  "Wait until conversion fully finishes before closing the tab",
];

const conversionSteps = [
  { step: "01", label: "User enters website URL" },
  { step: "02", label: "Tool opens the page in the background" },
  { step: "03", label: "Page content fully loads" },
  { step: "04", label: "Page layout is captured" },
  { step: "05", label: "PDF file is generated" },
  { step: "06", label: "User downloads the PDF" },
];

const exampleSteps = [
  { num: 1, text: "Copy any public webpage URL" },
  { num: 2, text: "Paste it into the KhanPDF URL to PDF tool" },
  { num: 3, text: "Click Convert to PDF" },
  { num: 4, text: "Download or open the final PDF" },
];

const faqs = [
  {
    q: "Can I convert any URL to PDF?",
    a: "You can convert most public URLs. Private or login-protected pages may not work correctly since the tool cannot authenticate on your behalf.",
  },
  {
    q: "Is URL to PDF free?",
    a: "Yes, KhanPDF provides a simple online URL to PDF conversion tool you can use without any subscription.",
  },
  {
    q: "Can I convert blog posts to PDF?",
    a: "Yes. Public blog posts can usually be converted into clean PDF files, preserving text, images, and layout.",
  },
  {
    q: "Why does some website not convert properly?",
    a: "Some websites block automated tools or load content dynamically in ways that may not render correctly inside a headless browser.",
  },
  {
    q: "Can I open the PDF after conversion?",
    a: "Yes. After conversion you can open, download, or send the PDF link directly by email.",
  },
];

/* ─────────────────────────────────────────────────────────────
   FAQ Accordion Item
───────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-card/60 transition"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border bg-card">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section Heading helper
───────────────────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 mt-0">
      {children}
    </h2>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
export default function BlogPostComponent({ slug }: { slug?: string }) {
  const article = articles.find((a) => a.slug === slug) || null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 p-5">
        <h1 className="text-3xl font-bold">Article Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Return to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-20">

        {/* ── Content wrapper ─────────────────────────────────────── */}
        <div className="px-5 pt-8 md:pt-10">
          <div className="mx-auto max-w-3xl">

            {/* ── Hero Thumbnail ──────────────────────────────────────── */}
            <div className="relative w-full rounded-2xl overflow-hidden mb-10 mt-4 mb-4" style={{ aspectRatio: "1200/630" }}>
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
            </div>

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition mb-7"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Category + Title + Meta */}
            <div className="mb-4">
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                {article.category}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
              {article.title}
            </h1>
            <div className="flex items-center gap-5 text-sm text-muted-foreground mb-10">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {article.date}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {article.readTime}
              </div>
            </div>

            {/* ── Introduction ─────────────────────────────────────── */}
            <section className="mb-12 mt-2">
              <p className="text-base md:text-lg leading-relaxed text-foreground font-medium mb-4">
                {article.description}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Whether you need to save an article for offline reading, share a report in a fixed format,
                or keep a record of an important webpage, converting a URL to PDF is the fastest way to do it.
                No printing, no screenshots — just a clean, ready-to-use document.
              </p>
            </section>

            {/* ── What Is URL to PDF? ───────────────────────────────── */}
            <section className="mb-12 mt-10">
              <SectionHeading>What Is URL to PDF?</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                URL to PDF is a tool that takes a webpage link and converts the visible page content into a
                downloadable PDF document. You do not need any desktop software, browser extension, or
                technical knowledge.
              </p>
              {/* Input → Output visual */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-border bg-card p-5 mb-6">
                <div className="flex-1 rounded-lg bg-background border border-border px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Input</p>
                  <code className="text-sm font-mono text-primary break-all">https://example.com/article</code>
                </div>
                <ArrowRight className="hidden sm:block h-5 w-5 text-muted-foreground flex-shrink-0" />
                <ArrowDown className="block sm:hidden h-5 w-5 text-muted-foreground flex-shrink-0 self-center" />
                <div className="flex-1 rounded-lg bg-background border border-border px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Output</p>
                  <code className="text-sm font-mono text-green-500">article.pdf</code>
                </div>
              </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────── */}
            <section className="mb-12">
              <SectionHeading>How URL to PDF Works</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Behind the scenes, the tool uses a headless browser to open, render, and capture the page
                before exporting it as a PDF — exactly how you would see it in your own browser.
              </p>
              {/* Flow steps */}
              <div className="flex flex-col gap-0">
                {conversionSteps.map(({ step, label }, i) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {step}
                      </div>
                      {i < conversionSteps.length - 1 && (
                        <div className="w-px flex-1 min-h-[2rem] bg-border mt-1 mb-1" />
                      )}
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed pt-2 pb-4">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Mid-Article Image ─────────────────────────────────── */}
            <div className="mb-12 rounded-2xl overflow-hidden border border-border shadow-card mt-6 mb-6">
              <div className="relative w-full aspect-video">
                <Image
                  src={article.midImage}
                  alt="URL to PDF conversion process"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center py-3 px-4  bg-card border-t border-border">
                A headless browser renders the page in full fidelity before exporting to PDF.
              </p>
            </div>

            {/* ── Why Convert a URL to PDF? ─────────────────────────── */}
            <section className="mb-12">
              <SectionHeading>Why Convert a URL to PDF?</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                There are many practical reasons to turn a live webpage into a static PDF document.
              </p>
              <ul className="space-y-3">
                {[
                  "Save webpages for offline reading",
                  "Share web content in a fixed, uneditable format",
                  "Print articles, invoices, reports, or documentation",
                  "Keep records of important online pages",
                  "Convert public pages into clean, professional documents",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Use Cases ─────────────────────────────────────────── */}
            <section className="mb-12 mt-6">
              <SectionHeading>Use Cases</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                URL to PDF solves a wide range of everyday and professional problems.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {useCases.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-card transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-xl bg-primary/10 p-2 flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── What Types of URLs ─────────────────────────────────── */}
            <section className="mb-12 mt-10">
              <SectionHeading>What Types of URLs Can Be Converted?</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                Most publicly accessible web pages work well with URL to PDF tools.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {urlTypes.map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-4">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Private pages, login-protected pages, and
                  blocked websites may not convert properly.
                </p>
              </div>
            </section>

            {/* ── Infographic ───────────────────────────────────────── */}
            <div className="mb-12 mt-10">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  The Conversion Pipeline — At a Glance
                </h2>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                <div className="relative w-full" style={{ aspectRatio: "12/7" }}>
                  <Image
                    src={article.infographic}
                    alt="URL to PDF conversion infographic"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center py-3 px-4 bg-card border-t border-border">
                  The four-step pipeline — from raw URL to downloadable PDF.
                </p>
              </div>
            </div>

            {/* ── Benefits ──────────────────────────────────────────── */}
            <section className="mb-12 mt-10">
              <SectionHeading>Benefits of Using an Online URL to PDF Tool</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Here's why thousands of users choose a dedicated tool over browser printing.
              </p>
              <div className="rounded-2xl border border-border bg-card p-5 grid sm:grid-cols-2 gap-4">
                {benefits.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Video ─────────────────────────────────────────────── */}
            <div className="mb-12 mt-10">
              <div className="flex items-center gap-2 mb-3">
                <Play className="h-5 w-5 text-primary flex-shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Watch: URL to PDF in 60 Seconds
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                See exactly how the tool works — from pasting a URL to downloading a finished PDF — in under a minute.
              </p>
              <div className="rounded-2xl overflow-hidden border border-border shadow-card h-[500px]">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${article.videoId}`}
                  title="URL to PDF demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* ── Step-by-Step Example ──────────────────────────────── */}
            <section className="mb-12 mt-10">
              <SectionHeading>URL to PDF — Step-by-Step Example</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Here is how simple the conversion process is with KhanPDF.
              </p>
              <div className="flex flex-col gap-3">
                {exampleSteps.map(({ num, text }) => (
                  <div
                    key={num}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {num}
                    </div>
                    <span className="text-sm font-medium text-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Common Problems ───────────────────────────────────── */}
            <section className="mb-12 mt-10">
              <SectionHeading>Common Problems While Converting URL to PDF</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Occasionally a conversion may not work as expected. Here are the most common reasons.
              </p>
              <div className="flex flex-col gap-3">
                {commonProblems.map(({ label, detail }) => (
                  <div key={label} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Best Practices ────────────────────────────────────── */}
            <section className="mb-12 mt-10">
              <SectionHeading>Best Practices for Better PDF Conversion</SectionHeading>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                Follow these tips to get the cleanest possible PDF every time.
              </p>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                {bestPractices.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── How KhanPDF Helps ─────────────────────────────────── */}
            <section className=" mt-10">
              <SectionHeading>How KhanPDF Helps</SectionHeading>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
                  KhanPDF makes URL to PDF conversion simple. You paste a public URL, start the conversion,
                  and get a downloadable PDF once the file is ready — no account, no extensions, no setup.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The tool handles the entire rendering pipeline in the background so you do not have to
                  worry about page loading, CSS rendering, or font embedding.
                </p>
              </div>
            </section>

            {/* ── Conclusion ────────────────────────────────────────── */}
            <section className="mb-12 mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-primary flex-shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Conclusion</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                URL to PDF is useful when you want to save, share, or print online content as a clean PDF
                document. It removes the manual work and gives you a ready-to-use PDF from a webpage link —
                in seconds.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                Whether you are an individual preserving research or a business automating document
                generation, a dedicated URL-to-PDF tool delivers accuracy and convenience that browser
                printing simply cannot match.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Ready to try it yourself? Hit the button below and convert your first URL to PDF in
                seconds — no account required.
              </p>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────── */}
            <section className="mb-14 mt-10">
              <SectionHeading>Frequently Asked Questions</SectionHeading>
              <div className="flex flex-col gap-3 mt-5">
                {faqs.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </section>

            {/* ── CTA (same as existing) ────────────────────────────── */}
            <div className="mt-10  p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-card text-center mb-6">
              <h2 className="font-display text-2xl font-bold tracking-tight mb-3 text-foreground">
                Ready to create your PDF?
              </h2>
              <p className="text-muted-foreground mb-6">
                Turn any public URL into a clean, downloadable PDF document right now.
              </p>
              <Link
                href="/url-to-pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-glow hover:opacity-90 transition"
              >
                Try URL to PDF
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* inline arrow icon for the input→output block */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
