import type { Metadata } from "next";
import Contact from "../components/contact/contact";

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
    canonical: "https://khanpdf.com/contact-us",
  },
  openGraph: {
    title: "Contact Us | KhanPDF",
    description:
      "Need help with KhanPDF? Contact us for support, questions, feedback, or PDF conversion issues.",
    url: "https://khanpdf.com/contact-us",
    siteName: "KhanPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | KhanPDF",
    description:
      "Contact KhanPDF for support, questions, feedback, or PDF conversion issues.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <Contact />;
}