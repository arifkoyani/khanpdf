"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


const navItems = [
  { to: "/", label: "Home" },
  { to: "/url-to-pdf", label: "URL to PDF" },
  { to: "/faqs", label: "FAQs" },
  { to: "/blog", label: "Blog" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">


          <span className="font-display flex justify-center items-end font-bold text-sm tracking-tight gap-1">
            <Image
              src="/logo.png"
              alt="KhanPDF Logo"
              width={20}
              height={20}
              
              
            />  <span className="text-white">KhanPDF</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          {navItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <Link
                key={item.to}
                href={item.to}
                className={`hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="w-7" aria-hidden />
      </div>
    </header>
  );
}