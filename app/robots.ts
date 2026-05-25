import type { MetadataRoute } from "next";

const BASE_URL = "https://khanpdf.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/blog/admin", "/url-to-pdf/open-pdf"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
