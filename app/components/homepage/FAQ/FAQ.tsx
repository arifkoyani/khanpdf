import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../ui/accordion";
  
  const faqs = [
    { q: "What is URL to PDF?", a: "URL to PDF is a free online tool that converts any publicly accessible webpage into a PDF document. Simply paste a link, and we'll render the page as a downloadable PDF." },
    { q: "Is URL to PDF really free?", a: "Yes — converting public webpages to PDF is 100% free with no sign-up, watermarks, or hidden fees." },
    { q: "Do I need to create an account?", a: "No account is required. Just paste a URL, click convert, and download your PDF." },
    { q: "What kind of pages can I convert?", a: "Any publicly accessible webpage works best — blog posts, articles, docs, recipes, news, and more." },
    { q: "Can I convert pages behind a login?", a: "No. Pages that require authentication, captchas, or special browser access can't be reliably converted." },
    { q: "Is my data safe?", a: "We process URLs securely and don't store your links or generated PDFs longer than necessary to deliver them." },
    { q: "Does it work on mobile?", a: "Absolutely. The tool is fully responsive and works on any modern phone, tablet, or desktop browser." },
  ];
  
  export function FAQ() {
    return (
      <section id="faq" className="relative px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">FAQ</p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="mt-8 space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-5 data-[state=open]:shadow-card data-[state=open]:border-primary/40 transition-all">
                <AccordionTrigger className="text-left font-display font-semibold text-sm hover:no-underline py-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  }