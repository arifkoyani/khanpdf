import Link from "next/link";
import { FAQ } from "../homepage/FAQ/FAQ";

export default function FAQS() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-6">
        <div className="mx-auto max-w-2xl px-5 pt-10 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-10">
            FAQs
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need to know about URL to PDF.
          </p>

          <Link
            href="/"
            className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to Home
          </Link>
        </div>

        <FAQ />
      </main>
    </div>
  );
}