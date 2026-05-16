import { notFound } from "next/navigation";
import type { Metadata } from "next";

type FAQ = {
  q: string;
  a: string;
};

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

type Props = {
  params: Promise<{ slug: string }>;
};

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
    alternates: {
      canonical,
    },
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
          alt: blog.title,
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

  return data.map((blog) => ({
    slug: blog.slug,
  }));
}

function formatDate(date?: string | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
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
          alt={blog.title}
          className="my-8 w-full rounded-2xl border object-cover"
        />
      );
    }

    if (part === "[VIDEO]") {
      if (!blog.video_id) return null;

      return (
        <div
          key={index}
          className="my-8 aspect-video overflow-hidden rounded-2xl border bg-muted"
        >
          <iframe
            src={`https://www.youtube.com/embed/${blog.video_id}`}
            title={blog.title}
            className="h-full w-full"
            allowFullScreen
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
          className="my-8 w-full rounded-2xl border object-cover"
        />
      );
    }

    return (
      <div
        key={index}
        className="whitespace-pre-wrap leading-8 text-gray-700"
      >
        {part}
      </div>
    );
  });
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) notFound();

  const publishedDate = formatDate(blog.publish_date || blog.created_at);
  const faqs = Array.isArray(blog.faqs) ? blog.faqs : [];

  return (
    <article className="min-h-screen bg-white">
      <section className="mx-auto max-w-4xl px-5 py-10 md:py-16">
        <div className="mb-8">
          {blog.category && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-blue-600">
              {blog.category}
            </p>
          )}

          <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="mb-5 text-lg leading-8 text-gray-600">
              {blog.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {publishedDate && <span>{publishedDate}</span>}
            {blog.read_time && <span>• {blog.read_time}</span>}
          </div>
        </div>

        {blog.thumbnail_url && (
          <img
            src={blog.thumbnail_url}
            alt={blog.title}
            className="mb-10 w-full rounded-3xl border object-cover shadow-sm"
          />
        )}

        <div className="prose prose-lg max-w-none">
          {renderBodyContent(blog)}
        </div>

        {blog.conclusion && (
          <section className="mt-12 rounded-2xl border bg-gray-50 p-6">
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Conclusion
            </h2>
            <p className="whitespace-pre-wrap leading-8 text-gray-700">
              {blog.conclusion}
            </p>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-950">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-2xl border p-5">
                  <h3 className="mb-2 text-lg font-semibold text-gray-950">
                    {faq.q}
                  </h3>
                  <p className="leading-7 text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </article>
  );
}