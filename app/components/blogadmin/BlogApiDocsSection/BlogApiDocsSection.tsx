"use client";

import { useState } from "react";
import {
  BookOpen,
  Copy,
  Check,
  Database,
  Plus,
  Pencil,
  Trash2,
  Upload,
  List,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

const API_BASE = "https://khanpdf.com";

const docs = [
  {
    id: "allblogs",
    title: "Fetch All Blogs",
    method: "GET",
    endpoint: "/api/blogs/allblogs",
    icon: List,
    description: "Fetch all blogs from the Supabase blog_posts table.",
    curl: `curl -X GET "${API_BASE}/api/blogs/allblogs"`,
  },
  {
    id: "createblog",
    title: "Create Blog",
    method: "POST",
    endpoint: "/api/blogs/createblog",
    icon: Plus,
    description: "Create a new blog post with title, slug, content, media URLs, SEO fields, and FAQs.",
    curl: `curl -X POST "${API_BASE}/api/blogs/createblog" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "What Is URL to PDF and How Does It Work?",
    "slug": "what-is-url-to-pdf-and-how-it-works",
    "category": "URL to PDF",
    "description": "A simple guide explaining how URL to PDF tools convert public webpages into PDF files.",
    "read_time": "10 min read",
    "publish_date": "2026-05-15",
    "status": "publish",
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "mid_image_url": "https://example.com/middle.jpg",
    "infographic_url": "https://example.com/infographic.jpg",
    "video_id": "dQw4w9WgXcQ",
    "meta_title": "What Is URL to PDF? Complete Guide | KhanPDF",
    "meta_description": "Learn what URL to PDF means and how it works.",
    "canonical_url": "https://khanpdf.com/blog/what-is-url-to-pdf-and-how-it-works",
    "body_content": "## Introduction\\n\\nURL to PDF helps convert webpages into PDFs.\\n\\n[MID_IMAGE]\\n\\n[VIDEO]\\n\\n[INFOGRAPHIC]",
    "conclusion": "URL to PDF is useful for saving and sharing webpages.",
    "faqs": [
      {
        "q": "Can I convert any URL to PDF?",
        "a": "You can convert most public URLs."
      }
    ]
  }'`,
  },
  {
    id: "updateblog",
    title: "Update Blog",
    method: "PATCH",
    endpoint: "/api/blogs/updateblog",
    icon: Pencil,
    description: "Update an existing blog using its blog ID.",
    curl: `curl -X PATCH "${API_BASE}/api/blogs/updateblog" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "BLOG_ID_HERE",
    "title": "Updated URL to PDF Guide",
    "slug": "updated-url-to-pdf-guide",
    "category": "URL to PDF",
    "description": "Updated blog description here.",
    "read_time": "8 min read",
    "publish_date": "2026-05-15",
    "status": "publish",
    "thumbnail_url": "https://example.com/updated-thumbnail.jpg",
    "mid_image_url": "https://example.com/updated-middle.jpg",
    "infographic_url": "https://example.com/updated-infographic.jpg",
    "video_id": "dQw4w9WgXcQ",
    "meta_title": "Updated URL to PDF Guide | KhanPDF",
    "meta_description": "Updated SEO description.",
    "canonical_url": "https://khanpdf.com/blog/updated-url-to-pdf-guide",
    "body_content": "## Updated Introduction\\n\\nUpdated body content here.",
    "conclusion": "Updated conclusion here.",
    "faqs": [
      {
        "q": "Is KhanPDF free?",
        "a": "Yes, it can be used online."
      }
    ]
  }'`,
  },
  {
    id: "deleteblog",
    title: "Delete Blog",
    method: "DELETE",
    endpoint: "/api/blogs/deleteblog",
    icon: Trash2,
    description: "Delete a blog post using its blog ID.",
    curl: `curl -X DELETE "${API_BASE}/api/blogs/deleteblog" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "BLOG_ID_HERE"
  }'`,
  },
  {
    id: "uploadmedia",
    title: "Upload Media",
    method: "POST",
    endpoint: "/api/blogs/uploadmedia",
    icon: Upload,
    description: "Upload thumbnail, middle image, or infographic image to Supabase Storage bucket.",
    curl: `curl -X POST "${API_BASE}/api/blogs/uploadmedia" \\
  -F "file=@/path/to/image.png" \\
  -F "folder=blog"`,
  },
];

function methodClass(method: string) {
  if (method === "GET") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (method === "POST") return "bg-green-500/10 text-green-600 border-green-500/20";
  if (method === "PATCH") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (method === "DELETE") return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-muted text-muted-foreground";
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-black text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium text-white/60">cURL</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={copyCode}
          className="h-8 gap-2 text-white hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function BlogApiDocsSection() {
  return (
    <section className="mt-14 rounded-2xl border border-border bg-card p-5 md:p-7">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <BookOpen className="size-3.5" />
            Blog API Docs
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Blog Management API
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Use these API routes to create, update, delete, fetch blogs, and upload blog media.
            These routes connect with the Supabase <span className="font-mono text-foreground">blog_posts</span> table.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Database className="size-4 text-primary" />
            Supabase Table
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            public.blog_posts
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {docs.map((doc) => {
          const Icon = doc.icon;

          return (
            <AccordionItem
              key={doc.id}
              value={doc.id}
              className="overflow-hidden rounded-xl border border-border bg-background px-0"
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex w-full items-center gap-3 text-left">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10">
                    <Icon className="size-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {doc.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${methodClass(doc.method)}`}
                      >
                        {doc.method}
                      </Badge>
                    </div>

                    <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                      {doc.endpoint}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="border-t border-border px-4 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {doc.description}
                </p>

                <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Method
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      {doc.method}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Endpoint
                    </p>
                    <p className="mt-1 break-all font-mono text-sm text-foreground">
                      {API_BASE}
                      {doc.endpoint}
                    </p>
                  </div>
                </div>

                <CodeBlock code={doc.curl} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}