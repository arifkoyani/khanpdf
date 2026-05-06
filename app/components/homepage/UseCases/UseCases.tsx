import { BookOpen, Briefcase, GraduationCap, Newspaper, Archive, Share2 } from "lucide-react";

const cases = [
  { icon: BookOpen, title: "Save articles to read offline" },
  { icon: Briefcase, title: "Archive client pages & proposals" },
  { icon: GraduationCap, title: "Collect study material as PDFs" },
  { icon: Newspaper, title: "Capture news before it changes" },
  { icon: Archive, title: "Build a personal web archive" },
  { icon: Share2, title: "Share clean PDFs over email" },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative px-5 py-14 md:py-20 bg-gradient-soft border-y border-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Use cases</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">A PDF for every webpage you care about</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cases.map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/50 hover:shadow-glow transition-all">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary text-foreground grid place-items-center shrink-0">
                <c.icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}