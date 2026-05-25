import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";

const BASE_URL = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/blog/admin", "/url-to-pdf/open-pdf", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
