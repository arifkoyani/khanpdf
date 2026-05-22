"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ArrowUpRight, Search } from "lucide-react";

export type BlogPostCard = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  read_time: string | null;
  publish_date: string | null;
};

type BlogSearchContextValue = {
  inputValue: string;
  setInputValue: (value: string) => void;
  applySearch: () => void;
  filteredBlogs: BlogPostCard[];
  activeQuery: string;
};

const BlogSearchContext = createContext<BlogSearchContextValue | null>(null);

function useBlogSearch() {
  const ctx = useContext(BlogSearchContext);
  if (!ctx) throw new Error("BlogSearch components must be used within BlogSearchProvider");
  return ctx;
}

function formatDate(date?: string | null) {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogSearchProvider({
  blogs,
  children,
}: {
  blogs: BlogPostCard[];
  children: ReactNode;
}) {
  const [inputValue, setInputValue] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const applySearch = () => setActiveQuery(inputValue.trim());

  const filteredBlogs = useMemo(() => {
    if (!activeQuery) return blogs;
    const q = activeQuery.toLowerCase();
    return blogs.filter((blog) => {
      const text = `${blog.title} ${blog.description || ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [blogs, activeQuery]);

  return (
    <BlogSearchContext.Provider
      value={{ inputValue, setInputValue, applySearch, filteredBlogs, activeQuery }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
}

export function BlogSearchInput() {
  const { inputValue, setInputValue, applySearch } = useBlogSearch();
  const isEmpty = inputValue.length === 0;

  return (
    <div className="relative rounded-xl border border-border bg-card focus-within:border-primary/60 transition">
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Search by title or description...
          </span>
        </div>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            applySearch();
          }
        }}
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full bg-transparent px-4 text-center text-sm text-foreground focus:outline-none"
        aria-label="Search articles by title or description"
      />
    </div>
  );
}

export function BlogArticleList() {
  const { filteredBlogs, activeQuery } = useBlogSearch();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">
          Latest Articles
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {activeQuery
              ? `No articles found for "${activeQuery}".`
              : "No published blogs found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-card transition group"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {blog.category && (
                  <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-semibold">
                    {blog.category}
                  </span>
                )}
                <span>
                  {blog.read_time || "5 min read"} •{" "}
                  {formatDate(blog.publish_date)}
                </span>
              </div>

              <h3 className="mt-3 font-display text-lg md:text-xl font-bold tracking-tight">
                {blog.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {blog.description}
              </p>

              <Link
                href={`/blog/${blog.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
              >
                Read Article <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
