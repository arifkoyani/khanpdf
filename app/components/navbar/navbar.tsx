"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../../components/theme-toggle/theme-toggle";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/url-to-pdf", label: "URL to PDF" },
  { to: "/faqs", label: "FAQs" },
  { to: "/blog", label: "Blog" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return ( 
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60 py-2">
      <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display flex justify-start items-end font-bold text-sm tracking-tight">
            <Image
              src="/logo.png"
              alt="KhanPDF Logo"
              width={25}
              height={25}
            />
            <span className="text-foreground text-sm">KhanPDF</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-12 text-[10px] font-medium text-muted-foreground">
          {navItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <Link
                key={item.to}
                href={item.to}
                className={`relative hover:text-foreground transition-colors ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute  bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


