
import { Shield, Mail, Globe, Calendar } from "lucide-react";

import Link from "next/link";
const sections: { title: string; body?: string; bullets?: string[]; outro?: string }[] = [
  {
    title: "1. Information We Collect",
    body: "When you use KhanPDF, we may collect:",
    bullets: [
      "The public URL you submit for PDF conversion",
      "The generated PDF file link",
      "Your email address, only if you choose to send the PDF by email",
      "Basic technical data such as browser type, device type, pages visited, and error logs",
      "Usage data needed to improve performance, security, and reliability",
    ],
    outro: "KhanPDF does not require users to create an account for basic URL to PDF conversion.",
  },
  {
    title: "2. How We Use Information",
    body: "We use this information to:",
    bullets: [
      "Convert public URLs into PDF files",
      "Show and provide your generated PDF file",
      "Send the PDF link to your email if requested",
      "Improve KhanPDF's speed, reliability, and user experience",
      "Detect errors, abuse, spam, or security issues",
    ],
  },
  {
    title: "3. Temporary PDF Files",
    body: "Generated PDF files may be stored temporarily so you can open or download them after conversion. These files may expire automatically after a limited time.",
    outro: "We recommend downloading your PDF immediately if you want to keep a permanent copy.",
  },
  {
    title: "4. Email Use",
    body: "If you enter your email address, we use it only to send the requested PDF link. We do not sell your email address.",
  },
  {
    title: "5. Public URLs Only",
    body: "KhanPDF is designed for publicly accessible URLs. Please do not submit private, confidential, login-protected, or sensitive URLs.",
  },
  {
    title: "6. Cookies and Analytics",
    body: "KhanPDF may use cookies or analytics tools to understand website usage, improve performance, and monitor errors. These tools may collect basic technical information such as device, browser, country, and visited pages.",
  },
  {
    title: "7. Third-Party Services",
    body: "KhanPDF may use third-party services for PDF generation, hosting, storage, email delivery, analytics, and error monitoring. These services only process data needed to provide KhanPDF features.",
  },
  {
    title: "8. Data Security",
    body: "We take reasonable steps to protect user data and service infrastructure. However, no online service can guarantee complete security.",
  },
  {
    title: "9. Your Choices",
    body: "You can choose not to provide your email address. You should also avoid submitting any URL that contains private or sensitive information.",
  },
  {
    title: "10. Children's Privacy",
    body: "KhanPDF is not intended for children under 13. We do not knowingly collect personal information from children.",
  },
  {
    title: "11. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-6">
        <div className="mx-auto max-w-3xl px-5 pt-12">
          {/* Hero */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Legal
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient-headline">
              Privacy Policy
            </h1>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Last updated: May 18, 2026
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              KhanPDF respects your privacy. This Privacy Policy explains what information we collect, how we use it, and how we protect it when you use KhanPDF.
            </p>
          </div>

          {/* Sections */}
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

            {/* Contact card */}
            <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-7">
              <h2 className="font-display text-lg md:text-xl font-semibold">12. Contact Us</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                If you have questions about this Privacy Policy, contact us at:
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:hello@khanpdf.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" /> hello@khanpdf.com
                </a>
                <a
                  href="https://khanpdf.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4 text-primary" /> khanpdf.com
                </a>
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