import { AlertTriangle } from "lucide-react";

export function ImportantNote() {
  return (
    <section className="relative px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5 md:p-6 flex gap-4">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shrink-0 shadow-glow">
            <AlertTriangle className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold">Important note</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              This tool works best with public webpages. Pages that require login, captcha, or special browser access may not convert properly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}