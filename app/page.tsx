<<<<<<< HEAD
import type { Metadata } from "next";
import Homepage from "./components/homepage/homepage";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "KhanPDF | Free Online URL to PDF Converter",
  description:
    "KhanPDF is a free online tool to convert public URLs, webpages, articles, images, HTML files, text files, and public links into clean downloadable PDF files.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "KhanPDF | Free Online URL to PDF Converter",
    description:
      "Convert public webpages, articles, images, HTML files, text files, and public links into clean downloadable PDF files with KhanPDF.",
    url: SITE_URL,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "KhanPDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KhanPDF | Free Online URL to PDF Converter",
    description:
      "Convert public webpages and URLs into clean downloadable PDF files with KhanPDF.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KhanPDF",
  alternateName: "KhanPDF URL to PDF Converter",
  url: SITE_URL,
  description:
    "KhanPDF is a free online URL to PDF converter that helps users convert publicly accessible webpages, articles, images, HTML files, text files, and public links into downloadable PDF files.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KhanPDF",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div>
        <Homepage />
      </div>
    </>
  );
}
=======
import Image from "next/image";
import Main from "@/components/main/main";

export default function Home() {
  return (
    <div>
      
      <Main/>
    </div>
  );
}
>>>>>>> aee5cace0a3729fe7528f70e855b8a40f488de50
