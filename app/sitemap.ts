import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "../lib/seo";

const BASE_URL = SITE_URL;

const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${BASE_URL}/url-to-pdf`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/blog`,
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/faqs`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact-us`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/privacy-policy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms-of-service`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

async function getPublishedBlogEntries(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, publish_date")
    .eq("status", "publish");

  if (error || !data) {
    return [];
  }

  return data.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at || post.publish_date || undefined,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries = await getPublishedBlogEntries();
  return [...staticPages, ...blogEntries];
}
