
import { ScrollText, Mail, Globe, Calendar } from "lucide-react";
import Link from "next/link";


const sections: { title: string; body?: string; bullets?: string[]; outro?: string }[] = [
  {
    title: "1. Use of KhanPDF",
    body: "KhanPDF provides online tools that help users convert public URLs into downloadable PDF files. You may use KhanPDF only for lawful, personal, educational, or business purposes.",
  },
  {
    title: "2. Public URLs Only",
    body: "KhanPDF is designed to work with publicly accessible webpages. You should not submit:",
    bullets: [
      "Private URLs",
      "Login-protected pages",
      "Confidential documents",
      "Sensitive personal information",
      "Internal company links",
      "Pages you do not have permission to process",
    ],
    outro: "You are responsible for making sure the URL you submit is allowed to be converted.",
  },
  {
    title: "3. User Responsibility",
    body: "You are fully responsible for the URLs you submit and the content you convert. KhanPDF does not own or control the content of third-party websites submitted by users.",
  },
  {
    title: "4. Prohibited Use",
    body: "You must not use KhanPDF to:",
    bullets: [
      "Break any law or regulation",
      "Convert or distribute illegal content",
      "Violate copyright, trademark, or intellectual property rights",
      "Process private or confidential content without permission",
      "Attack, overload, abuse, or damage the service",
      "Bypass security systems or access restrictions",
      "Upload, submit, or process harmful or malicious content",
    ],
  },
  {
    title: "5. PDF Conversion Results",
    body: "KhanPDF tries to generate clean and accurate PDF files, but we do not guarantee that every webpage will convert perfectly. Some websites may fail because of:",
    bullets: [
      "Login requirements",
      "Website blocking rules",
      "Dynamic scripts",
      "Slow loading pages",
      "Broken URLs",
      "Private or restricted access",
      "Unsupported page structure",
    ],
  },
  {
    title: "6. Temporary File Access",
    body: "Generated PDF files may be available for a limited time only. You are responsible for downloading your PDF before the file expires.",
    outro: "KhanPDF is not responsible if a temporary PDF link expires before you download it.",
  },
  {
    title: "7. Email Feature",
    body: "If you use the email feature, KhanPDF may send the generated PDF link to the email address you provide. You are responsible for entering the correct email address.",
  },
  {
    title: "8. No Warranty",
    body: "KhanPDF is provided \"as is\" and \"as available.\" We do not guarantee that the service will always be available, error-free, secure, or uninterrupted.",
  },
  {
    title: "9. Limitation of Liability",
    body: "KhanPDF is not responsible for any loss, damage, data loss, business interruption, or other issue caused by using or being unable to use the service.",
  },
  {
    title: "10. Third-Party Services",
    body: "KhanPDF may use third-party services for PDF generation, hosting, storage, email delivery, analytics, and infrastructure. We are not responsible for outages, delays, limits, or errors caused by third-party services.",
  },
  {
    title: "11. Intellectual Property",
    body: "KhanPDF's website design, branding, content, tools, and code belong to KhanPDF or its owners. You may not copy, resell, or misuse KhanPDF's branding or service without permission.",
  },
  {
    title: "12. Changes to the Service",
    body: "We may update, change, suspend, or discontinue any part of KhanPDF at any time.",
  },
  {
    title: "13. Changes to These Terms",
    body: "We may update these Terms of Service from time to time. The updated version will be posted on this page with a new \"Last updated\" date.",
    outro: "By continuing to use KhanPDF after changes are posted, you accept the updated terms.",
  },
];

export default function TermsOfPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-6">
        <div className="mx-auto max-w-3xl px-5 pt-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <ScrollText className="h-3.5 w-3.5 text-primary" />
              Legal
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient-headline">
              Terms of Service
            </h1>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Last updated: May 18, 2026
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Welcome to KhanPDF. By using KhanPDF, you agree to these Terms of Service. Please read them carefully before using our website and PDF conversion tools.
            </p>
          </div>

          <div className="mt-12 space-y-5 pb-16">
            {sections.map((s) => (
              <section
                key={s.title}
                className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 md:p-7 transition-colors hover:border-primary/40"
              >
                <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">
                  {s.title}
                </h2>
                {s.body && (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.body}</p>
                )}
                {s.bullets && (
                  <ul className="mt-3 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/40" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.outro && (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.outro}</p>
                )}
              </section>
            ))}

            <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-7">
              <h2 className="font-display text-lg md:text-xl font-semibold">14. Contact Us</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                If you have questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="mailto:hello@khanpdf.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" /> hello@khanpdf.com
                </Link>
                <Link
                  href="https://khanpdf.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4 text-primary" /> khanpdf.com
                </Link>
              </div>
              <div className="mt-6">
                <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}