import type { Metadata } from "next";
import Contact from "../components/contact/contact";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Contact Us | KhanPDF",
  description:
    "Contact KhanPDF for support, questions, feedback, or issues related to URL to PDF conversion, PDF downloads, and email delivery.",
  keywords: [
    "KhanPDF contact",
    "contact KhanPDF",
    "URL to PDF support",
    "PDF converter support",
    "KhanPDF help",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact-us`,
  },
  openGraph: {
    title: "Contact Us | KhanPDF",
    description:
      "Need help with KhanPDF? Contact us for support, questions, feedback, or PDF conversion issues.",
    url: `${SITE_URL}/contact-us`,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Contact KhanPDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | KhanPDF",
    description:
      "Contact KhanPDF for support, questions, feedback, or PDF conversion issues.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <Contact />;
}