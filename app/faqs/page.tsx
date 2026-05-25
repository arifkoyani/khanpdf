import type { Metadata } from "next";
import FAQS from "../components/faqs/faqs";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../../lib/seo";

export const metadata: Metadata = {
  title: "FAQs | URL to PDF Converter | KhanPDF",
  description:
    "Find answers to common questions about KhanPDF URL to PDF Converter, supported URLs, PDF settings, downloads, email sharing, and public webpage conversion.",
  alternates: {
    canonical: `${SITE_URL}/faqs`,
  },
  openGraph: {
    title: "FAQs | URL to PDF Converter | KhanPDF",
    description:
      "Frequently asked questions about converting public URLs, webpages, images, HTML, text files, and online content into PDF with KhanPDF.",
    url: `${SITE_URL}/faqs`,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "KhanPDF FAQs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs | URL to PDF Converter | KhanPDF",
    description:
      "Answers about KhanPDF URL to PDF conversion, supported URLs, downloads, and settings.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is KhanPDF URL to PDF Converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "KhanPDF URL to PDF Converter is a free online tool that converts any publicly accessible URL into a clean, downloadable PDF file.",
      },
    },
    {
      "@type": "Question",
      name: "What types of URLs can I convert to PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can convert publicly accessible webpages, articles, blogs, documentation pages, reports, public file links, images, HTML pages, JSON files, text files, and common public web URLs into PDF. Private, login-protected, blocked, or broken URLs may not work.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert image URLs to PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. KhanPDF can convert public image links such as PNG, JPG, JPEG, WebP, GIF, SVG, ICO, and BMP files into PDF when the image URL is publicly accessible.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert HTML pages to PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. KhanPDF supports public HTML and HTM pages, including articles, landing pages, documentation pages, reports, and other publicly accessible web pages.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert JSON or text file links to PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Public JSON and TXT file links can be converted into PDF files if they are accessible from the browser without login or private access.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize the PDF size, margins, and layout?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. KhanPDF supports custom page margins, paper size selection, and both portrait and landscape orientation so you can control how your converted PDF looks.",
      },
    },
    {
      "@type": "Question",
      name: "Which paper sizes does KhanPDF support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "KhanPDF supports common paper sizes such as A4, Letter, Legal, Tabloid, Ledger, A0, A1, A2, A3, A5, A6, and custom sizes such as 200mm 300mm, 20cm 30cm, 6in 8in, and 200px 300px.",
      },
    },
    {
      "@type": "Question",
      name: "Can I choose portrait or landscape orientation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. KhanPDF lets you choose portrait or landscape orientation before converting your public URL into a PDF file.",
      },
    },
    {
      "@type": "Question",
      name: "Is KhanPDF URL to PDF Converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. KhanPDF URL to PDF Converter is free to use and does not require signup.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account to convert a URL to PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. KhanPDF does not require login or signup. You can paste a public URL and convert it to PDF directly from your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the converted PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once your PDF is ready, KhanPDF provides a download option so you can save the converted PDF file to your device.",
      },
    },
    {
      "@type": "Question",
      name: "Can I open the converted PDF in a new tab?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After conversion, you can open the generated PDF in a new browser tab to preview it before downloading or sharing.",
      },
    },
    {
      "@type": "Question",
      name: "Can I send the PDF link by email?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After the PDF is generated, you can enter your email address and send the PDF link to your inbox.",
      },
    },
    {
      "@type": "Question",
      name: "Why does some URL fail to convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some URLs may fail if the page is private, login-protected, blocked by the website, broken, paywalled, too slow to load, or not publicly accessible.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best use of URL to PDF conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URL to PDF conversion is useful for saving articles, reports, invoices, documentation, blog posts, guides, public files, and web pages for offline reading, printing, sharing, or record keeping.",
      },
    },
  ],
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      <FAQS />
    </>
  );
}