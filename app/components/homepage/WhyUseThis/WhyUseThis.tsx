import { Zap, UserX, FileCheck2, Globe2, Smartphone, Lock } from "lucide-react";

const items = [
  { icon: Zap, title: "Fast webpage conversion", desc: "Optimised pipeline turns long pages into PDFs in seconds." },
  { icon: UserX, title: "No account required", desc: "Skip the sign-ups. Paste, convert, download." },
  { icon: FileCheck2, title: "Clean PDF output", desc: "Readable text, sharp images, sensible page breaks." },
  { icon: Globe2, title: "Works on public URLs", desc: "Articles, docs, recipes, blog posts — anything public." },
  { icon: Smartphone, title: "Simple & mobile-friendly", desc: "Designed to work beautifully on any screen size." },
  { icon: Lock, title: "Secure processing", desc: "Your URLs are processed securely and never shared." },
];

export function WhyUseThis() {
  return (
    <section id="why" className="relative px-5 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Why use this tool</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">Built for speed and clarity</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.title} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
              <div className="h-9 w-9 rounded-lg  text-foreground bg-primary/15 grid place-items-center group-hover:bg-gradient-primary transition-colors">
                <it.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold">{it.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}