import { Link2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

export function ToolCard() {
  return (
    <section id="converter" className="relative px-5 pb-16 md:pb-20">
      <div className="mx-auto max-w-2xl">
        <div className="relative rounded-2xl bg-card border border-border shadow-elegant p-6 md:p-8 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-primary opacity-25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary-deep/30 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.68 0.22 35 / 0.35), transparent 70%)" }} />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow animate-float">
                <div className="relative">
                  <Link2 className="h-4 w-4 text-foreground absolute -translate-x-[4px] -translate-y-[4px]" strokeWidth={2.5} />
                  <FileText className="h-4 w-4 text-foreground absolute translate-x-[4px] translate-y-[4px]" strokeWidth={2.5} />
                  <div className="h-4 w-4 opacity-0">.</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg md:text-xl font-bold">URL to PDF</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Convert any public webpage into a clean PDF file while keeping the page text, images, and layout readable.
              </p>
            </div>
            <Button asChild className="rounded-lg">
              <Link href="/url-to-pdf">
                Convert Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}