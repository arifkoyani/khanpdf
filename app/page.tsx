import type { Metadata } from "next";
import Homepage from "./components/homepage/homepage";

export const metadata: Metadata = {
  title: "KhanPDF | Free Online URL to PDF Converter",
  description:
    "KhanPDF is a free online tool to convert public URLs, webpages, articles, images, HTML files, text files, and public links into clean downloadable PDF files.",
  alternates: {
    canonical: "https://khanpdf.com",
  },
  openGraph: {
    title: "KhanPDF | Free Online URL to PDF Converter",
    description:
      "Convert public webpages, articles, images, HTML files, text files, and public links into clean downloadable PDF files with KhanPDF.",
    url: "https://khanpdf.com",
    siteName: "KhanPDF",
    type: "website",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KhanPDF",
  alternateName: "KhanPDF URL to PDF Converter",
  url: "https://khanpdf.com",
  description:
    "KhanPDF is a free online URL to PDF converter that helps users convert publicly accessible webpages, articles, images, HTML files, text files, and public links into downloadable PDF files.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://khanpdf.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KhanPDF",
  url: "https://khanpdf.com",
  logo: "https://khanpdf.com/logo.png",
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