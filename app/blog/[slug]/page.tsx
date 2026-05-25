import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { DEFAULT_OG_IMAGE, SITE_URL, toAbsoluteUrl } from "../../../lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

type FAQ = { q: string; a: string };

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
  thumbnail_alt: string | null;
  infographic_url: string | null;
  infographic_alt: string | null;
  video_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  body_content: string | null;
  conclusion: string | null;
  faqs: FAQ[] | null;
  created_at: string;
  updated_at: string;
};

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const decodedSlug = decodeURIComponent(slug).trim();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", decodedSlug)
    .eq("status", "publish")
    .single();

  if (error || !data) return null;
  return data as BlogPost;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPost(slug);
  if (!blog) {
    return {
      title: "Blog Not Found | KhanPDF",
      description: "The blog post you are looking for could not be found.",
      robots: { index: false, follow: false },
    };
  }
  const title = blog.meta_title || blog.title;
  const description =
    blog.meta_description || blog.description || "Read this KhanPDF blog post.";
  const image = toAbsoluteUrl(blog.thumbnail_url || DEFAULT_OG_IMAGE);
  const canonical =
    blog.canonical_url || `${SITE_URL}/blog/${blog.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.thumbnail_alt || blog.title,
        },
      ],
      publishedTime: blog.publish_date || blog.created_at,
      modifiedTime: blog.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return [];
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "publish");
  if (error || !data) return [];
  return data.map((blog) => ({ slug: blog.slug }));
}

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/* ----------------------------- Markdown-lite ---------------------------- */

function renderBlock(text: string, keyPrefix: string) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul
        key={`${keyPrefix}-ul-${nodes.length}`}
        className="my-6 space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-6 backdrop-blur-sm"
      >
        {bulletBuffer.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-base leading-7 text-muted-foreground"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>,
    );
    bulletBuffer = [];
  };

  lines.forEach((rawLine, i) => {
    const line = rawLine.trimEnd();
    const key = `${keyPrefix}-${i}`;

    if (/^\s*-\s+/.test(line)) {
      bulletBuffer.push(line.replace(/^\s*-\s+/, ""));
      return;
    }
    flushBullets();

    if (!line.trim()) return;

    if (/^###\s+/.test(line)) {
      nodes.push(
        <div
          key={key}
          className="mt-8 mb-3 rounded-xl border border-border/60 bg-muted/30 px-5 py-3"
        >
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
            {line.replace(/^###\s+/, "")}
          </h3>
        </div>,
      );
      return;
    }

    if (/^##\s+/.test(line)) {
      nodes.push(
        <div
          key={key}
          className="mt-12 mb-4 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-muted px-6 py-4 shadow-sm"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.025em] text-foreground">
            {line.replace(/^##\s+/, "")}
          </h2>
        </div>,
      );
      return;
    }

    if (/^#\s+/.test(line)) {
      nodes.push(
        <div
          key={key}
          className="mt-14 mb-6 rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-background to-background px-7 py-6 shadow-sm"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-foreground">
            {line.replace(/^#\s+/, "")}
          </h2>
        </div>,
      );
      return;
    }

    nodes.push(
      <p key={key} className="my-4 text-base leading-8 text-muted-foreground">
        {line}
      </p>,
    );
  });

  flushBullets();
  return nodes;
}

function renderBodyContent(blog: BlogPost) {
  const content = blog.body_content || "";
  const parts = content.split(/(\[VIDEO\]|\[INFOGRAPHIC\])/g);

  return parts.map((part, index) => {
  
    if (part === "[VIDEO]") {
      if (!blog.video_id) return null;
      return (
        <div
          key={`vid-${index}`}
          className="my-10 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm"
        >
          <iframe
            src={`https://www.youtube.com/embed/${blog.video_id}`}
            title={blog.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    }
    if (part === "[INFOGRAPHIC]") {
      if (!blog.infographic_url) return null;
      return (
        <div
          key={`info-${index}`}
          className="relative my-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-sm"
        >
          <Image
            src={blog.infographic_url}
            alt={blog.infographic_alt || `${blog.title} infographic`}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      );
    }
    return <div key={`txt-${index}`}>{renderBlock(part, `b-${index}`)}</div>;
  });
}

function normalizeFaqs(faqs: BlogPost["faqs"] | string | null) {
  if (!faqs) return [];
  if (Array.isArray(faqs)) return faqs;
  if (typeof faqs === "string") {
    try {
      return JSON.parse(faqs) as FAQ[];
    } catch {
      return [];
    }
  }
  return [];
}

/* --------------------------------- Page --------------------------------- */

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);
  if (!blog) notFound();

  const publishedDate = formatDate(blog.publish_date || blog.created_at);
  const faqs = normalizeFaqs(blog.faqs);
  const canonical =
    blog.canonical_url || `${SITE_URL}/blog/${blog.slug}`;
  const ogImage = toAbsoluteUrl(blog.thumbnail_url || DEFAULT_OG_IMAGE);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.meta_description || blog.description,
    image: [ogImage],
    datePublished: blog.publish_date || blog.created_at,
    dateModified: blog.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    author: {
      "@type": "Organization",
      name: "KhanPDF",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "KhanPDF",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <article className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-hero opacity-30 dark:opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25 dark:opacity-40" />

      <section className="relative mx-auto max-w-7xl px-8 py-14 md:py-20">
        {/* Thumbnail */}
        {blog.thumbnail_url && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl border border-border shadow-sm">
            <Image
              src={blog.thumbnail_url}
              alt={blog.thumbnail_alt || blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-10 text-center">
          {blog.category && (
            <p className="mb-5 inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" />
              {blog.category}
            </p>
          )}

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-6xl">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {blog.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            {publishedDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Calendar className="h-3 w-3 text-primary" />
                {publishedDate}
              </span>
            )}
            {blog.read_time && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Clock className="h-3 w-3 text-primary" />
                {blog.read_time}
              </span>
            )}
          </div>

          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </header>

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          {renderBodyContent(blog)}
        </div>

        {/* Conclusion */}
        {blog.conclusion && (
          <section className="mt-14 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-muted p-8">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-1 w-1 rounded-full bg-primary" /> Final thoughts
            </p>
            <h2 className="font-display mb-4 text-2xl font-bold tracking-[-0.025em] text-foreground md:text-3xl">
              Conclusion
            </h2>
            <p className="whitespace-pre-wrap leading-8 text-muted-foreground">
              {blog.conclusion}
            </p>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="mt-14">
            <div className="mb-8 text-center">
              <p className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
                <span className="h-1 w-1 rounded-full bg-primary" /> FAQ
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.025em] text-foreground md:text-4xl">
                Frequently asked questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border border-border bg-card px-5 transition-all hover:border-primary/30 data-[state=open]:border-primary/40 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="font-display py-4 text-left text-sm font-semibold text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-background to-background p-10 text-center">
          <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-foreground md:text-3xl">
            Ready to try it yourself?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Convert, compress, and craft PDFs with KhanPDF — fast, free,
            fidelity-first.
          </p>
          <Link
            href="/url-to-pdf"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Convert URL to PDF
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </article>
  );
}