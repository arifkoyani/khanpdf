
import Link from "next/link";
import { Mail, MessageCircle, Globe, Calendar, AlertCircle, Clock} from "lucide-react";




 export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-6">
        <div className="mx-auto max-w-3xl px-5 pt-12">
          {/* Hero */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5 text-primary" />
              Get in touch
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient-headline">
              Contact Us
            </h1>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Last updated: May 18, 2026
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Have a question, issue, or suggestion? We are here to help. KhanPDF helps users convert public URLs into clean, downloadable PDF files.
            </p>
          </div>

          {/* Primary contact card */}
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <Link
              href="mailto:support@khanpdf.com"
              className="group rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 transition-all hover:border-primary/50 hover:-translate-y-0.5"
            >
              <div className="h-10 w-10 rounded-xl bg-background grid place-items-center shadow-glow">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">Email Support</h3>
              <p className="mt-1 text-sm text-muted-foreground">hello@khanpdf.com</p>
              <p className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Send a message →
              </p>
            </Link>
            <Link
              href="https://khanpdf.com"
              className="group rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:-translate-y-0.5"
            >
              <div className="h-10 w-10 rounded-xl border border-border bg-background grid place-items-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">Website</h3>
              <p className="mt-1 text-sm text-muted-foreground">khanpdf.com</p>
              <p className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Visit site →
              </p>
            </Link>
          </div>

          {/* What to include */}
          <section className="mt-6 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 md:p-7">
            <h2 className="font-display text-lg md:text-xl font-semibold">What to include in your message</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              To help us understand and fix your issue faster, please include:
            </p>
            <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
              {[
                "The URL you tried to convert",
                "The issue you faced",
                "Screenshot of the error, if available",
                "Your browser name",
                "Your device type",
                "The approximate time when the issue happened",
              ].map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/40" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Common reasons */}
          <section className="mt-5 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 md:p-7">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg md:text-xl font-semibold">Common reasons a URL may not convert</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Some URLs may fail because:</p>
            <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
              {[
                "The page requires login",
                "The website blocks automated access",
                "The page is private or not publicly accessible",
                "The page takes too long to load",
                "The URL is broken or expired",
                "The website uses scripts that cannot render properly during conversion",
              ].map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/40" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Support response */}
          <section className="mt-5 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 md:p-7">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg md:text-xl font-semibold">Support response</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              We try to respond as soon as possible. Response time may vary depending on the type of request and the details provided.
            </p>
          </section>

          {/* Socials */}
       {/* Socials */}
       <section className="mt-5 mb-12  rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-7">
  <h2 className="font-display text-lg md:text-xl font-semibold">
    Follow KhanPDF
  </h2>

  <p className="mt-2 text-sm text-muted-foreground">
    Connect with us across the web.
  </p>

  <div className="mt-5 flex flex-wrap gap-2.5">
  <Link
    href="https://github.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-xl border border-[#0d1117] bg-[#0d1117] px-4 py-2 text-sm font-semibold text-[#0d1117] transition-all hover:-translate-y-0.5 hover:opacity-90"
  >
    GitHub
  </Link>

  <Link
    href="https://facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-xl border border-[#1877F2] bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
  >
    Facebook
  </Link>

  <Link
    href="https://twitter.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-xl border border-[#1DA1F2] bg-[#1DA1F2] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
  >
    Twitter
  </Link>

  <Link
    href="https://instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-xl border border-[#E4405F] bg-[#E4405F] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
  >
    Instagram
  </Link>

  <Link
    href="https://linkedin.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-xl border border-[#0A66C2] bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
  >
    LinkedIn
  </Link>
</div>

  <div className="mt-6">
    <Link
      href="/"
      className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
    >
      ← Back to Home
    </Link>
  </div>
</section>

          <div className="h-16" />
        </div>
      </main>
    </div>
  );
}