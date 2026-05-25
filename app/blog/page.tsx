import type { Metadata } from "next";
import BlogListingpage from "../components/blog/page";

export const metadata: Metadata = {
  title: "KhanPDF Blog | PDF Tools, Guides & Tutorials",
  description:
    "Read KhanPDF blog articles about URL to PDF conversion, PDF tools, document productivity, and simple guides for working with PDFs online.",
  keywords: [
    "KhanPDF blog",
    "PDF tools blog",
    "URL to PDF guides",
    "PDF tutorials",
    "document productivity",
    "online PDF tools",
  ],
  alternates: {
    canonical: "https://khanpdf.com/blog",
  },
  openGraph: {
    title: "KhanPDF Blog | PDF Tools, Guides & Tutorials",
    description:
      "Explore KhanPDF guides, tutorials, and tips about PDF tools, URL to PDF conversion, and document productivity.",
    url: "https://khanpdf.com/blog",
    siteName: "KhanPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KhanPDF Blog | PDF Tools, Guides & Tutorials",
    description:
      "Read KhanPDF tutorials and guides about PDF tools, URL to PDF conversion, and document productivity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default function Blog({ searchParams }: Props) {
  return <BlogListingpage searchParams={searchParams} />;
}