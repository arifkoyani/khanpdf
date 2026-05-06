"use client";

import { FAQ } from "./FAQ/FAQ";
import { Hero } from "./Hero/Hero";
import { HowItWorks } from "./HowItWorks/HowItWorks";
import { ImportantNote } from "./ImportantNote/ImportantNote";
import { SupportedFormats } from "./SupportedFormats/SupportedFormats";
import { ToolCard } from "./ToolCard/ToolCard";
import { UseCases } from "./UseCases/UseCases";
import { WhyUseThis } from "./WhyUseThis/WhyUseThis";



export default function Homepage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <ToolCard />
        <HowItWorks />
        <SupportedFormats />
        <WhyUseThis />
        <UseCases />
        <ImportantNote />
        <FAQ />
      </main>
    </div>
  );
}
