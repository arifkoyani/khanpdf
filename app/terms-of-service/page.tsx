import type { Metadata } from "next";
import TermsOfPolicy from "../components/termsofservice/termsofservice";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | KhanPDF",
  description:
    "Read KhanPDF Terms of Service to understand the rules, responsibilities, limitations, and acceptable use of our URL to PDF conversion tools.",
  keywords: [
    "KhanPDF terms",
    "KhanPDF terms of service",
    "URL to PDF terms",
    "PDF converter terms",
    "KhanPDF legal",
  ],
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
  openGraph: {
    title: "Terms of Service | KhanPDF",
    description:
      "Review KhanPDF Terms of Service for using our online URL to PDF tools safely and responsibly.",
    url: `${SITE_URL}/terms-of-service`,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "KhanPDF Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | KhanPDF",
    description:
      "Read KhanPDF Terms of Service for using our URL to PDF conversion tools.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfPolicyPage() {
  return <TermsOfPolicy />;
}