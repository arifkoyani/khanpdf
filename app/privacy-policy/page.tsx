import type { Metadata } from "next";
import PrivacyPolicy from "../components/privacypolicy/privacypolicy";

export const metadata: Metadata = {
  title: "Privacy Policy - KhanPDF",
  description:
    "Read the KhanPDF Privacy Policy to understand how we collect, use, and protect your information when you use our PDF tools.",
  alternates: {
    canonical: "https://khanpdf.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - KhanPDF",
    description:
      "Learn how KhanPDF handles user privacy, data protection, and information usage.",
    url: "https://khanpdf.com/privacy-policy",
    siteName: "KhanPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - KhanPDF",
    description:
      "Read KhanPDF's Privacy Policy and learn how your data is handled.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}