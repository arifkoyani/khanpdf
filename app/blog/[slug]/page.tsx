import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";
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
  mid_image_url: string | null;
  infographic_url: string | null;
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

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const appBaseUrl = process.env.APP_BASE_URL || "https://khanpdf.com";
  const decodedSlug = encodeURIComponent(slug);
  const res = await fetch(`${appBaseUrl}/api/blogs/${decodedSlug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.success || !data.blog) return null;
  return data.blog as BlogPost;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPost(slug);
  if (!blog) {
    return {
      title: "Blog Not Found | KhanPDF",
      description: "The blog post you are looking for could not be found.",
    };
  }
  const title = blog.meta_title || blog.title;
  const description =
    blog.meta_description || blog.description || "Read this KhanPDF blog post.";
  const image = blog.thumbnail_url || "/logo.png";
  const canonical =
    blog.canonical_url || `https://khanpdf.com/blog/${blog.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.publish_date || blog.created_at,
      modifiedTime: blog.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
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
        className="my-6 space-y-3 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm"
      >
        {bulletBuffer.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-base leading-7 text-muted-foreground"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/40" />
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

    // bullet
    if (/^\s*-\s+/.test(line)) {
      bulletBuffer.push(line.replace(/^\s*-\s+/, ""));
      return;
    }
    flushBullets();

    if (!line.trim()) return;

    // ### h3
    if (/^###\s+/.test(line)) {
      nodes.push(
        <div
          key={key}
          className="mt-8 mb-3 rounded-xl border border-border/60 bg-card/50 px-5 py-3"
        >
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
            {line.replace(/^###\s+/, "")}
          </h3>
        </div>,
      );
      return;
    }

    // ## h2
    if (/^##\s+/.test(line)) {
      nodes.push(
        <div
          key={key}
          className="mt-12 mb-4 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-card px-6 py-4 shadow-card"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.025em]">
            <span className="text-gradient-headline">
              {line.replace(/^##\s+/, "")}
            </span>
          </h2>
        </div>,
      );
      return;
    }

    // # h1
    if (/^#\s+/.test(line)) {
      nodes.push(
        <div
          key={key}
          className="mt-14 mb-6 rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-card px-7 py-6 shadow-glow"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-[1.1]">
            <span className="text-gradient-headline">
              {line.replace(/^#\s+/, "")}
            </span>
          </h1>
        </div>,
      );
      return;
    }

    // plain paragraph
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
  const parts = content.split(/(\[MID_IMAGE\]|\[VIDEO\]|\[INFOGRAPHIC\])/g);

  return parts.map((part, index) => {
    if (part === "[MID_IMAGE]") {
      if (!blog.mid_image_url) return null;
      return (
        <img
          key={`mid-${index}`}
          src={blog.mid_image_url}
          alt={`${blog.title} mid image`}
          className="my-10 w-full rounded-2xl border border-border object-cover shadow-card"
        />
      );
    }
    if (part === "[VIDEO]") {
      if (!blog.video_id) return null;
      return (
        <div
          key={`vid-${index}`}
          className="my-10 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-card"
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
        <img
          key={`info-${index}`}
          src={blog.infographic_url}
          alt={`${blog.title} infographic`}
          className="my-10 w-full rounded-2xl border border-border object-cover shadow-card"
        />
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

  return (
    <article className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-hero opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      <section className="relative mx-auto max-w-4xl px-5 py-14 md:py-20">
        {/* Thumbnail */}
        {blog.thumbnail_url && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-border shadow-glow">
            <img
              src={blog.thumbnail_url}
              alt={blog.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 text-center">
          {blog.category && (
            <p className="label-mono text-primary mb-5 inline-flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              {blog.category}
            </p>
          )}

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] md:text-6xl">
            <span className="text-gradient-headline">{blog.title}</span>
          </h1>

          {blog.description && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {blog.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
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
        <div className="prose prose-invert max-w-none">
          {renderBodyContent(blog)}
        </div>

        {/* Conclusion */}
        {blog.conclusion && (
          <section className="mt-14 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-card p-8 shadow-card">
            <p className="label-mono text-primary mb-3 inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" /> Final thoughts
            </p>
            <h2 className="font-display mb-4 text-2xl font-bold tracking-[-0.025em] md:text-3xl">
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
              <p className="label-mono text-primary inline-flex items-center justify-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" /> FAQ
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.025em] md:text-4xl">
                Frequently asked{" "}
                <span className="text-gradient-headline">questions</span>
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border border-border bg-card px-5 transition-all data-[state=open]:border-primary/40 data-[state=open]:shadow-card"
                >
                  <AccordionTrigger className="font-display py-4 text-left text-sm font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-xs leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center shadow-glow">
          <h2 className="font-display text-2xl font-bold tracking-[-0.025em] md:text-3xl">
            Ready to try it yourself?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Convert, compress, and craft PDFs with KhanPDF — fast, free,
            fidelity-first.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Explore KhanPDF Tools
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>
      </section>
    </article>
  );
}
