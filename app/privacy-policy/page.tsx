import type { Metadata } from "next";
import PrivacyPolicy from "../components/privacypolicy/privacypolicy";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | KhanPDF",
  description:
    "Read the KhanPDF Privacy Policy to understand how we collect, use, and protect your information when you use our PDF tools.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | KhanPDF",
    description:
      "Learn how KhanPDF handles user privacy, data protection, and information usage.",
    url: `${SITE_URL}/privacy-policy`,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "KhanPDF Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | KhanPDF",
    description:
      "Read KhanPDF's Privacy Policy and learn how your data is handled.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}