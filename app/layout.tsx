import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { Providers } from "./providers/providers";



const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:"KhanPDF",
  description: "Convert public URLs into PDF files online.",
  // verification: {
  //   google: "eK_YuDSi4L54xHu5OXX27M_wHP8J87FF2QuJUb5UjQ8",
  // }
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

          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}