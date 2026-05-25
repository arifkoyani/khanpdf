import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | KhanPDF",
  description: "The page you are looking for could not be found on KhanPDF.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        This page does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Go to Home
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          href="/url-to-pdf"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
        >
          URL to PDF
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
        >
          Blog
        </Link>
      </div>
    </main>
  );
}
