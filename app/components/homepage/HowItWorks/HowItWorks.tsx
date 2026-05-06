import { ClipboardPaste, MousePointerClick, Download } from "lucide-react";

const steps = [
  { icon: ClipboardPaste, title: "Paste your webpage URL", desc: "Copy any public webpage link and drop it into the converter box." },
  { icon: MousePointerClick, title: "Click Convert to PDF", desc: "We render the page and package it into a clean PDF for you." },
  { icon: Download, title: "Download your PDF file", desc: "One click and your PDF is on your device — ready to share or print." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative px-5 py-14 md:py-20 bg-gradient-soft border-y border-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">How it works</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">Three steps. That's it.</h2>
        </div>
        <ol className="mt-10 grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl bg-card border border-border p-6 shadow-card hover:border-primary/40 transition-colors">
              <div className="absolute -top-4 left-6 h-8 w-8 rounded-lg bg-gradient-primary text-foreground grid place-items-center font-display font-bold text-sm shadow-glow">
                {i + 1}
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center mb-4 mt-1">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold">{s.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}