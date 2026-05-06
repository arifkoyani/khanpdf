import { Globe, FileImage, FileCode, FileDown, Settings2, Ruler, FileText, RotateCw } from "lucide-react";

import {Code } from 'lucide-react';
const domains = [".com", ".org", ".net", ".co", ".io", ".ai", ".app", ".dev", ".info", ".me"];
const fileTypes = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".bmp", ".html", ".htm", ".json", ".txt"];
const paperSizes = ["A4", "Letter", "Legal"];

export function SupportedFormats() {
  return (
    <section id="formats" className="relative px-5 py-14 md:py-20 bg-gradient-soft border-y border-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Supported Formats / Options</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">
            Convert almost any public URL into a clean PDF
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            KhanPDF can convert any publicly accessible URL into a PDF. If a page or file opens publicly in a browser, it can usually be converted with this tool. The examples below are just a few — the main rule is that the URL must be publicly accessible online.
          </p>
        </div>

        {/* Input Formats */}
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold">Public website URLs</h3>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Examples of supported public domain extensions:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {domains.map((d) => (
                <span key={d} className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                <FileImage className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold">Public file links</h3>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Public links pointing to common web files:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {fileTypes.map((f) => (
                <span key={f} className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                <Code className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold">Public GitHub URLs</h3>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Works with public repositories, documentation pages, README files, and publicly accessible project pages.
            </p>
          </div>
        </div>

        {/* Output Format */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary text-foreground grid place-items-center">
              <FileDown className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-bold">Output Format</h3>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Your URL is converted into a clean, downloadable PDF file.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs">
              <span className="font-semibold">Input:</span> Public URL
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs">
              <span className="font-semibold">Output:</span> PDF file
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">After conversion, users can:</p>
          <ul className="mt-2 grid sm:grid-cols-3 gap-2 text-xs">
            <li className="rounded-md border border-border bg-secondary/40 px-3 py-2">Download PDF</li>
            <li className="rounded-md border border-border bg-secondary/40 px-3 py-2">Open PDF</li>
            <li className="rounded-md border border-border bg-secondary/40 px-3 py-2">Convert another URL</li>
          </ul>
        </div>

        {/* Custom PDF Settings */}
        <div className="mt-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-primary">
              <Settings2 className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-widest">Custom PDF Settings</p>
            </div>
            <h3 className="mt-2 font-display text-xl md:text-2xl font-bold tracking-tight">
              Customize your PDF before conversion
            </h3>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {/* Margins */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                  <Ruler className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-display text-base font-bold">Page Margins</h4>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Set each margin separately:</p>
              <ul className="mt-2 text-xs space-y-1">
                <li><span className="font-semibold">Top:</span> 10mm</li>
                <li><span className="font-semibold">Right:</span> 5mm</li>
                <li><span className="font-semibold">Bottom:</span> 15mm</li>
                <li><span className="font-semibold">Left:</span> 5mm</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Combined value:</p>
              <code className="mt-1 inline-block rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-mono">
                10mm 5mm 15mm 5mm
              </code>
              <p className="mt-3 text-xs text-muted-foreground">Order: Top → Right → Bottom → Left</p>
            </div>

            {/* Paper Size */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-display text-base font-bold">Paper Size</h4>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Default paper size:</p>
              <span className="mt-1 inline-block rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                A4
              </span>
              <p className="mt-3 text-xs text-muted-foreground">Common sizes available:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {paperSizes.map((p) => (
                  <span key={p} className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                  <RotateCw className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-display text-base font-bold">Orientation</h4>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Choose how the page appears:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium">Portrait</span>
                <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium">Landscape</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Portrait</span> is best for normal pages, articles, and documents.
              </p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Landscape</span> is best for wide webpages, tables, dashboards, and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}