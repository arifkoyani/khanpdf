import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { Providers } from "./providers/providers";
import { DEFAULT_OG_IMAGE, SITE_URL } from "../lib/seo";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KhanPDF | Free Online URL to PDF Converter",
    template: "%s",
  },
  description:
    "Convert public URLs, webpages, articles, and files into clean downloadable PDFs with KhanPDF.",
  openGraph: {
    siteName: "KhanPDF",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "KhanPDF — URL to PDF Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    google: "eK_YuDSi4L54xHu5OXX27M_wHP8J87FF2QuJUb5UjQ8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />

          <div className="flex-1">{children}</div>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
