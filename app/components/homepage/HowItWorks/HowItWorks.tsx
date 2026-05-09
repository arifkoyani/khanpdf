import { ClipboardPaste, MousePointerClick, Download } from "lucide-react";

const steps = [
  { icon: ClipboardPaste, title: "Paste your webpage URL", desc: "Copy any public webpage link and drop it into the converter box." },
  { icon: MousePointerClick, title: "Click Convert to PDF", desc: "We render the page and package it into a clean PDF for you." },
  { icon: Download, title: "Download your PDF file", desc: "One click and your PDF is on your device — ready to share or print." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative px-5 py-14 md:py-20 bg-background border-y border-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">How it works</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Three steps. That's it.</h2>
        </div>

        <ol className="mt-10 grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-2xl bg-card text-card-foreground border border-border p-6 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg mb-4 mt-1">
                <div className="absolute left-6 h-8 w-8 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center font-display font-bold text-sm shadow-glow">
                  {i + 1}
                </div>
              </div>

              <h3 className="font-display text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}