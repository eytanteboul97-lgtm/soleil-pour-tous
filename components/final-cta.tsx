"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-night py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun-radial opacity-30 blur-3xl" />

      <Reveal className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
          Et si votre projet pouvait bénéficier d&apos;aides ?
        </h2>
        <p className="mt-5 text-lg text-white/60">
          Quelques minutes suffisent pour obtenir une première analyse personnalisée.
        </p>
        <Button size="lg" className="mt-9" onClick={() => scrollToId("eligibilite")}>
          Tester mon éligibilité
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Button>
      </Reveal>
    </section>
  );
}
