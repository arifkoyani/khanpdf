import {
  Globe,
  FileImage,
  Code,
  FileDown,
  Settings2,
  Ruler,
  FileText,
  RotateCw,
} from "lucide-react";

const domains = [
  ".com",
  ".org",
  ".net",
  ".co",
  ".io",
  ".ai",
  ".app",
  ".dev",
  ".info",
  ".me",
];

const fileTypes = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".ico",
  ".bmp",
  ".html",
  ".htm",
  ".json",
  ".txt",
];

const paperSizes = [
  "A4",
  "Letter",
  "Legal",
  "Tabloid",
  "Ledger",
  "A0",
  "A1",
  "A2",
  "A3",
  "A5",
  "A6",
  "200mm 300mm",
  "20cm 30cm",
  "6in 8in",
  "200px 300px",
];

export function SupportedFormats() {
  return (
    <section
      id="formats"
      className="relative border-y border-border bg-background px-5 py-14 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Supported Formats / Options
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Convert almost any public URL into a clean PDF
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            KhanPDF can convert any publicly accessible URL into a PDF. If a
            page or file opens publicly in a browser, it can usually be
            converted with this tool. The examples below are just a few. The
            main rule is that the URL must be publicly accessible online.
          </p>
        </div>

        {/* Input Formats */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <IconBox>
                <Globe className="h-4 w-4 text-primary" />
              </IconBox>

              <h3 className="font-display text-base font-bold text-foreground">
                Public website URLs
              </h3>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Examples of supported public domain extensions:
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {domains.map((d) => (
                <Tag key={d}>{d}</Tag>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-card">
            <div className="flex items-center gap-3">
              <IconBox>
                <FileImage className="h-4 w-4 text-primary" />
              </IconBox>

              <h3 className="font-display text-base font-bold text-foreground">
                Public file links
              </h3>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Public links pointing to common web files:
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {fileTypes.map((f) => (
                <Tag key={f}>{f}</Tag>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-card md:col-span-2">
            <div className="flex items-center gap-3">
              <IconBox>
                <Code className="h-4 w-4 text-primary" />
              </IconBox>

              <h3 className="font-display text-base font-bold text-foreground">
                Public GitHub URLs
              </h3>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Works with public repositories, documentation pages, README files,
              and publicly accessible project pages.
            </p>
          </div>
        </div>

        {/* Output Format */}
        

        {/* Custom PDF Settings */}
        <div className="mt-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-primary">
              <Settings2 className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-widest">
                Custom PDF Settings
              </p>
            </div>

            <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Customize your PDF before conversion
            </h3>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Margins */}
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-card">
              <div className="flex items-center gap-3">
                <IconBox>
                  <Ruler className="h-4 w-4 text-primary" />
                </IconBox>

                <h4 className="font-display text-base font-bold text-foreground">
                  Page Margins
                </h4>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Set each margin separately:
              </p>

              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Top:</span>{" "}
                  10mm
                </li>
                <li>
                  <span className="font-semibold text-foreground">Right:</span>{" "}
                  5mm
                </li>
                <li>
                  <span className="font-semibold text-foreground">
                    Bottom:
                  </span>{" "}
                  15mm
                </li>
                <li>
                  <span className="font-semibold text-foreground">Left:</span>{" "}
                  5mm
                </li>
              </ul>

              <p className="mt-3 text-xs text-muted-foreground">
                Combined value:
              </p>

              <code className="mt-1 inline-block rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-foreground">
                10mm 5mm 15mm 5mm
              </code>

              <p className="mt-3 text-xs text-muted-foreground">
                Order: Top → Right → Bottom → Left
              </p>
            </div>

            {/* Paper Size */}
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-card">
              <div className="flex items-center gap-3">
                <IconBox>
                  <FileText className="h-4 w-4 text-primary" />
                </IconBox>

                <h4 className="font-display text-base font-bold text-foreground">
                  Paper Size
                </h4>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Default paper size:
              </p>

              <span className="mt-1 inline-block rounded-md border border-none bg-transparent px-2.5 py-1 text-xs font-semibold text-white">
                A4
              </span>

              <p className="mt-3 text-xs text-muted-foreground">
                Common sizes available:
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {paperSizes.map((p) => (
                  <Tag key={p}>{p}</Tag>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-card">
              <div className="flex items-center gap-3">
                <IconBox>
                  <RotateCw className="h-4 w-4 text-primary" />
                </IconBox>

                <h4 className="font-display text-base font-bold text-foreground">
                  Orientation
                </h4>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Choose how the page appears:
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Tag>Portrait</Tag>
                <Tag>Landscape</Tag>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Portrait</span>{" "}
                is best for normal pages, articles, and documents.
              </p>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Landscape</span>{" "}
                is best for wide webpages, tables, dashboards, and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15">
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
      {children}
    </div>
  );
}