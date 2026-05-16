"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

type FAQ = {
  q: string;
  a: string;
};

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="rounded-xl border border-border bg-card px-5 data-[state=open]:shadow-card data-[state=open]:border-primary/40 transition-all"
        >
          <AccordionTrigger className="text-left font-display font-semibold text-sm hover:no-underline py-4">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}