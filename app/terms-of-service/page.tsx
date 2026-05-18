import type { Metadata } from "next";
import TermsOfPolicy from "../components/termsofservice/termsofservice";

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
    canonical: "https://khanpdf.com/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | KhanPDF",
    description:
      "Review KhanPDF Terms of Service for using our online URL to PDF tools safely and responsibly.",
    url: "https://khanpdf.com/terms-of-service",
    siteName: "KhanPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | KhanPDF",
    description:
      "Read KhanPDF Terms of Service for using our URL to PDF conversion tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfPolicyPage() {
  return <TermsOfPolicy />;
}