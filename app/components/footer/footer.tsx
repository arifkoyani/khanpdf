import { Link2, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-5 py-10 border-t border-border bg-background">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Link2 className="h-3 w-3 text-foreground absolute -translate-x-[2.5px] -translate-y-[2.5px]" />
            <FileText className="h-3 w-3 text-foreground absolute translate-x-[2.5px] translate-y-[2.5px]" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight">URL<span className="text-primary">2</span>PDF</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} URL2PDF. Built with care.</p>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
      </div>
    </footer>
  );
}