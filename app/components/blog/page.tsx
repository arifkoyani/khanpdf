import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowUpRight,
  Rss,
  AtSign,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  BlogArticleList,
  BlogSearchInput,
  BlogSearchProvider,
} from "./BlogSearchSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Simple PDF Guides for Modern Work",
  description:
    "Clean, practical guides on converting, managing, and working with PDFs.",
  openGraph: {
    title: "Blog — Simple PDF Guides for Modern Work",
    description:
      "Clean, practical guides on converting, managing, and working with PDFs.",
  },
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
  created_at: string;
};

type PageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

function formatDate(date?: string | null) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function getBlogs() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/blogs/allblogs`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch blogs");
  }

  return data.blogs as BlogPost[];
}

function SidebarCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ${className}`}>
      <h3 className="font-display text-base font-bold tracking-tight mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function PostItem({
  title,
  date,
  slug,
}: {
  title: string;
  date: string;
  slug: string;
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="block group cursor-pointer py-2.5 border-b border-border/50 last:border-0 hover:border-primary/30 transition"
    >
      <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition line-clamp-2">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground mt-1">{date}</p>
    </Link>
  );
}

export default async function BlogListingpage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const selectedCategory = params?.category?.trim() || "";

  let blogs: BlogPost[] = [];

  try {
    blogs = await getBlogs();
  } catch {
    blogs = [];
  }

  const publishedBlogs = blogs.filter((blog) => blog.status === "publish");

  const categoryBlogs = publishedBlogs.filter((blog) =>
    selectedCategory ? blog.category === selectedCategory : true
  );

  const categories = Array.from(
    new Set(publishedBlogs.map((blog) => blog.category).filter(Boolean))
  ) as string[];

  const sidebarCategories = categories.map((category) => ({
    name: category,
    count: publishedBlogs.filter((blog) => blog.category === category).length,
  }));

  const recentPosts = [...publishedBlogs]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const popularPosts = [...publishedBlogs].slice(0, 4);

  return (
    <BlogSearchProvider blogs={categoryBlogs}>
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <section className="px-5 pt-14 md:pt-20 pb-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Blog
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">
              Simple PDF Guides for Modern Work
            </h1>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Learn how to convert, manage, and work with PDFs through clean,
              practical guides.
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

        <section className="px-5 pb-8">
          <div className="mx-auto max-w-3xl">
            <BlogSearchInput />

            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              <Link
                href="/blog"
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  !selectedCategory
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                All
              </Link>

              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                    selectedCategory === category
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto w-full px-4 sm:px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BlogArticleList />
              </div>

              <div className="space-y-5">
                <SidebarCard title="Recent Posts">
                  <div>
                    {recentPosts.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No recent posts yet.
                      </p>
                    ) : (
                      recentPosts.map((post) => (
                        <PostItem
                          key={post.id}
                          title={post.title}
                          slug={post.slug}
                          date={formatDate(post.publish_date)}
                        />
                      ))
                    )}
                  </div>
                </SidebarCard>

                <SidebarCard title="Popular Posts">
                  <div>
                    {popularPosts.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No popular posts yet.
                      </p>
                    ) : (
                      popularPosts.map((post) => (
                        <PostItem
                          key={post.id}
                          title={post.title}
                          slug={post.slug}
                          date={formatDate(post.publish_date)}
                        />
                      ))
                    )}
                  </div>
                </SidebarCard>

                <SidebarCard title="Categories">
                  <div className="flex flex-wrap gap-2">
                    {sidebarCategories.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No categories yet.
                      </p>
                    ) : (
                      sidebarCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={`/blog?category=${encodeURIComponent(cat.name)}`}
                          className="inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm hover:border-primary/40 hover:bg-primary/5 transition"
                        >
                          <span className="text-foreground">{cat.name}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </SidebarCard>

            

                <SidebarCard title="Explore PDF Tools">
                  <p className="text-xs text-muted-foreground mb-4">
                    Try our free PDF tools to compress, merge, convert, and
                    more.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition"
                  >
                    View All Tools
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </SidebarCard>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-card p-8 md:p-10 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-4">
              Need to convert a webpage into PDF?
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              Use URL2PDF to turn public URLs into clean, downloadable PDFs in
              seconds. Professional layout, fast rendering.
            </p>
            <Link
              href="/url-to-pdf"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-glow hover:opacity-90 transition mb-4"
            >
              Convert URL to PDF
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-5 pb-8">
          <div className="mx-auto max-w-3xl flex items-center justify-center gap-4 text-muted-foreground">
            <a
              href="#"
              aria-label="RSS"
              className="hover:text-foreground transition"
            >
              <Rss className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="hover:text-foreground transition"
            >
              <AtSign className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
    </BlogSearchProvider>
  );
}