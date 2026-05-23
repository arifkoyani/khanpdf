"use client";

import Link from "next/link";
import { Link2, ChevronsUp } from "lucide-react";
import Image from "next/image";

const groups = [
  {
    title: "Tool",
    links: [{ label: "URL to PDF", href: "/url-to-pdf" }],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Use Cases", href: "/#use-cases" },
      { label: "FAQs", href: "/faqs" },
      { label: "Supported URLs", href: "/#formats" },
      { label: "How It Works", href: "/#how" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="mx-auto w-full bg-background">
      <div className="relative overflow-hidden border-y border-border bg-card text-card-foreground">
        <div className="grid lg:grid-cols-2 gap-10 p-8 md:p-12">
          {/* Left */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display flex justify-center items-end font-bold text-sm tracking-tight">
                <Image
                  src="/logo.PNG"
                  alt="KhanPDF Logo"
                  width={50}
                  height={50}
                />
                <span className="text-foreground">KhanPDF</span>
              </span>
            </Link>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground max-w-sm">
              Convert public URLs, webpages, articles, reports, and online resources into clean PDF files in seconds. Simple, fast, and free to use.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              {[
                { label: "X", href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "Facebook", href: "#" },
                { label: "GitHub", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  aria-label={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              onClick={scrollTop}
              className="mt-8 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronsUp className="h-3.5 w-3.5" /> Back to Top
            </button>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {groups.map((g) => (
              <div key={g.title}>
                <h4 className="font-display text-sm font-semibold text-foreground">
                  {g.title}
                </h4>

                <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="hover:text-primary transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Brand strip */}
        <div className="bg-gradient-primary px-6 py-3 text-center">
          <p className="text-[11px] font-medium text-primary-foreground">
            Copyright © {new Date().getFullYear()} KhanPDF. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}