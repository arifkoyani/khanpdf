import {
  BookOpen, Archive, Receipt, GraduationCap, Share2, FileCode2,
  Newspaper, Briefcase, Printer, Tag, Library, BriefcaseBusiness,
} from "lucide-react";

const cases = [
  { icon: BookOpen, title: "Save Articles Offline", desc: "Turn online articles into PDFs so you can read them later without internet." },
  { icon: Archive, title: "Archive Webpages", desc: "Keep a permanent copy of important pages before they change or disappear." },
  { icon: Receipt, title: "Save Receipts & Invoices", desc: "Download online receipts, payment confirmations, and invoices as PDF records." },
  { icon: GraduationCap, title: "Collect Study Material", desc: "Save tutorials, notes, research pages, and learning resources in PDF format." },
  { icon: Share2, title: "Share Clean PDFs", desc: "Send webpages as simple PDF files through email, WhatsApp, or work chats." },
  { icon: FileCode2, title: "Save Documentation", desc: "Keep developer docs, guides, and technical pages available for offline use." },
  { icon: Newspaper, title: "Capture News Pages", desc: "Save news articles and updates before headlines, links, or content change." },
  { icon: Briefcase, title: "Store Client Pages", desc: "Archive client proposals, landing pages, project briefs, and reference pages." },
  { icon: Printer, title: "Print Webpages", desc: "Convert webpages into printer-friendly PDF files with clean formatting." },
  { icon: Tag, title: "Save Product Pages", desc: "Keep product details, prices, and specifications before they are updated." },
  { icon: Library, title: "Build a Web Archive", desc: "Create your own personal library of useful webpages saved as PDFs." },
  { icon: BriefcaseBusiness, title: "Save Job Posts", desc: "Download job descriptions before they expire or get removed from job boards." },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative px-5 py-14 md:py-20 bg-background border-y border-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Use cases</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">A PDF for every webpage you care about</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card text-card-foreground p-5 hover:border-primary/50 hover:shadow-glow transition-all">
              <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center shrink-0">
                <c.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold text-foreground">{c.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}