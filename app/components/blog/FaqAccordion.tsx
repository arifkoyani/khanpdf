"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = {
  q: string;
  a: string;
};

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border rounded-xl px-5 mb-3 bg-card hover:border-primary/40 transition-colors"
        >
          <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-4">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-7 pb-4">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}