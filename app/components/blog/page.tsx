import Link from "next/link";

import { ArrowUpRight, Search, Rss, AtSign } from "lucide-react";
import type { Metadata } from "next";

// Next.js static metadata
export const metadata: Metadata = {
  title: "Blog — Simple PDF Guides for Modern Work",
  description: "Clean, practical guides on converting, managing, and working with PDFs.",
  openGraph: {
    title: "Blog — Simple PDF Guides for Modern Work",
    description: "Clean, practical guides on converting, managing, and working with PDFs.",
  },
};

const categories = ["URL to PDF", "PDF Tools", "Tutorials", "Productivity"];

const articles = [
  {
    category: "URL to PDF",
    readTime: "5 min read",
    date: "May 2026",
    title: "How to Convert a URL to PDF Online",
    description:
      "Learn how URL to PDF conversion works, which settings matter, and how to create clean PDFs from public web pages.",
    href: "/url-to-pdf",
    slug: "convert-any-url-to-pdf-online",
  },
];

export default function BlogListingpage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <main>
        {/* Hero */}
        <section className="px-5 pt-14 md:pt-20 pb-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Blog</p>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">
              Simple PDF Guides for Modern Work
            </h1>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Learn how to convert, manage, and work with PDFs through clean, practical guides.
            </p>
            <div className="mt-7 mb-5 flex justify-center">
              <Link
                href="/url-to-pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-glow hover:opacity-90 transition"
              >
                Try URL to PDF
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Search + Categories */}
        <section className="px-5 pb-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-primary/60 transition">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="search"
                placeholder="Search articles..."
                className="bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none w-48 sm:w-64"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {categories.map((c) => (
                <button
                  key={c}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="px-5 py-10">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">Latest Articles</h2>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid gap-4">
              {articles.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-card transition group"
                >
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-semibold">{a.category}</span>
                    <span>{a.readTime} • {a.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg md:text-xl font-bold tracking-tight">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
                  >
                    Read Article <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-card p-8 md:p-10 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-4">
              Need to convert a webpage into PDF?
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              Use URL2PDF to turn public URLs into clean, downloadable PDFs in seconds. Professional layout, fast rendering.
            </p>
            <Link
              href="/url-to-pdf"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-glow hover:opacity-90 transition mb-4 mt-4"
            >
              Convert URL to PDF
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Mini footer extras */}
        <section className="px-5 pb-8">
          <div className="mx-auto max-w-3xl flex items-center justify-center gap-4 text-muted-foreground">
            <a href="#" aria-label="RSS" className="hover:text-foreground transition"><Rss className="h-4 w-4" /></a>
            <a href="#" aria-label="Email" className="hover:text-foreground transition"><AtSign className="h-4 w-4" /></a>
          </div>
        </section>
      </main>

    </div>
  );
}
