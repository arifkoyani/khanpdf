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
  const res = await fetch(`${appBaseUrl}/api/blogs/${decodedSlug}`, { cache: "no-store" });
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
  const description = blog.meta_description || blog.description || "Read this KhanPDF blog post.";
  const image = blog.thumbnail_url || "/logo.png";
  const canonical = blog.canonical_url || `https://khanpdf.com/blog/${blog.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description, url: canonical, type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.publish_date || blog.created_at,
      modifiedTime: blog.updated_at,
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return [];
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("blog_posts").select("slug").eq("status", "publish");
  if (error || !data) return [];
  return data.map((blog) => ({ slug: blog.slug }));
}

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en", {
    month: "long", day: "numeric", year: "numeric",
  }).format(new Date(date));
}

function renderBodyContent(blog: BlogPost) {
  const content = blog.body_content || "";
  const parts = content.split(/(\[MID_IMAGE\]|\[VIDEO\]|\[INFOGRAPHIC\])/g);

  return parts.map((part, index) => {
    if (part === "[MID_IMAGE]") {
      if (!blog.mid_image_url) return null;
      return (
        <img
          key={index}
          src={blog.mid_image_url}
          alt={`${blog.title} illustration`}
          className="my-10 w-full rounded-2xl border border-border object-cover shadow-card"
        />
      );
    }
    if (part === "[VIDEO]") {
      if (!blog.video_id) return null;
      return (
        <div key={index} className="my-10 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-card">
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
          key={index}
          src={blog.infographic_url}
          alt={`${blog.title} infographic`}
          className="my-10 w-full rounded-2xl border border-border object-cover shadow-card"
        />
      );
    }
    return (
      <div
        key={index}
        className="whitespace-pre-wrap text-base leading-8 text-muted-foreground"
      >
        {part}
      </div>
    );
  });
}

function normalizeFaqs(faqs: BlogPost["faqs"] | string | null) {
  if (!faqs) return [];
  if (Array.isArray(faqs)) return faqs;
  if (typeof faqs === "string") {
    try { return JSON.parse(faqs) as FAQ[]; } catch { return []; }
  }
  return [];
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);
  if (!blog) notFound();

  const publishedDate = formatDate(blog.publish_date || blog.created_at);
  const faqs = normalizeFaqs(blog.faqs);

  return (
    <article className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-hero opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      <section className="relative mx-auto max-w-4xl px-5 py-14 md:py-20">
        {/* Thumbnail on top */}
        {blog.thumbnail_url && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-border shadow-glow">
            <img
              src={blog.thumbnail_url}
              alt={blog.title}
              className="w-full object-cover aspect-[16/9]"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 text-center">
          {blog.category && (
            <p className="label-mono text-primary inline-flex items-center gap-2 justify-center mb-5">
              <Sparkles className="h-3 w-3" />
              {blog.category}
            </p>
          )}

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05]">
            <span className="text-gradient-headline">{blog.title}</span>
          </h1>

          {blog.description && (
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
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
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.025em] mb-4">
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
            <div className="text-center mb-8">
              <p className="label-mono text-primary inline-flex items-center gap-2 justify-center">
                <span className="h-1 w-1 rounded-full bg-primary" /> FAQ
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-[-0.025em]">
                Frequently asked{" "}
                <span className="text-gradient-headline">questions</span>
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border border-border bg-card px-5 data-[state=open]:shadow-card data-[state=open]:border-primary/40 transition-all"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-sm hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center shadow-glow">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.025em]">
            Ready to try it yourself?
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Convert, compress, and craft PDFs with KhanPDF — fast, free, fidelity-first.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition"
          >
            Explore KhanPDF Tools
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>
      </section>
    </article>
  );
}
