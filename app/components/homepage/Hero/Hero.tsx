import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import  Link from "next/link";
import { Button } from "../../ui/button";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-5 pt-16 pb-12 md:pt-20 md:pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-[10px] font-medium text-muted-foreground mb-6">
          <Sparkles className="h-3 w-3 text-primary" />
          The simplest way to turn any webpage into a PDF
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] max-w-3xl mx-auto">
          Convert <span className="text-gradient">URL to PDF</span><br className="hidden sm:block" /> Online
        </h1>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Paste any public webpage URL and convert it into a clean, downloadable PDF file in seconds. No sign-up, no installation, and no extra steps.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-2 justify-center">
  <Button asChild className="h-11 px-8 rounded-lg">
    <Link href="/free-url-to-pdf">Try it now — Free</Link>
  </Button>

  <Button
    asChild
    className="h-11 px-8 rounded-lg border border-foreground/15 bg-[#f7f9fa] hover:bg-foreground hover:text-background"
  >
    <a href="#how">See how it works</a>
  </Button>
</div>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Zap className="h-3 w-3 text-primary" /> 100% Free</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-primary" /> No Sign-up</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-primary" /> Secure & Private</span>
        </div>
      </div>
    </section>
  );
}