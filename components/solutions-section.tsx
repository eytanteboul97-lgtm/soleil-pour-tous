"use client";

import { ArrowRight, ChevronDown, Cylinder, Droplets, Hammer, Layers, Sun, Wind } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { TYPE_TRAVAUX_LABELS, type LeadFormValues } from "@/lib/lead-schema";

type Travaux = LeadFormValues["typeTravaux"][number];

const SOLUTIONS: { key: Travaux; icon: typeof Sun; description: string }[] = [
  {
    key: "photovoltaique",
    icon: Sun,
    description:
      "Produisez votre propre électricité et réduisez durablement vos factures grâce à des panneaux solaires adaptés à votre toiture.",
  },
  {
    key: "pac-air-eau",
    icon: Droplets,
    description:
      "Remplacez votre chaudière par une pompe à chaleur Air/Eau performante, éligible à de nombreuses aides à la rénovation.",
  },
  {
    key: "pac-air-air",
    icon: Wind,
    description:
      "Chauffez et rafraîchissez votre logement toute l'année avec une solution réversible économe en énergie.",
  },
  {
    key: "ballon-thermodynamique",
    icon: Cylinder,
    description:
      "Produisez votre eau chaude sanitaire jusqu'à 3 fois moins cher qu'un ballon électrique classique.",
  },
  {
    key: "isolation",
    icon: Layers,
    description:
      "Combles, murs, planchers : une bonne isolation est souvent le premier levier d'économies d'énergie du logement.",
  },
  {
    key: "renovation-globale",
    icon: Hammer,
    description:
      "Un accompagnement complet pour combiner plusieurs travaux et maximiser vos aides dans le cadre de MaPrimeRénov'.",
  },
];

function selectTravauxAndScroll(key: Travaux) {
  window.dispatchEvent(new CustomEvent("soleil:select-travaux", { detail: key }));
  document.getElementById("eligibilite")?.scrollIntoView({ behavior: "smooth" });
}

export function SolutionsSection() {
  return (
    <section id="solutions" className="anchor-offset bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
            Nos solutions
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Un accompagnement complet pour vos travaux
          </h2>
          <p className="mt-4 text-mist">
            Soleil Pour Tous vous accompagne sur l&apos;ensemble de vos projets
            de rénovation énergétique, du diagnostic jusqu&apos;aux aides
            disponibles.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution, i) => (
            <Reveal
              key={solution.key}
              delay={i * 0.07}
              tabIndex={0}
              className="group flex flex-col rounded-3xl border border-line bg-white p-7 outline-none transition-all duration-300 hover:-translate-y-1.5 hover:border-sun-300 hover:shadow-card focus-visible:-translate-y-1.5 focus-visible:border-sun-300 focus-visible:shadow-card focus-visible:ring-2 focus-visible:ring-sun-400 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-500/10 text-sun-700 transition-transform duration-300 group-hover:scale-110">
                  <solution.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <ChevronDown
                  className="mt-1 h-4 w-4 text-mist/60 transition-transform duration-300 group-hover:-rotate-180 group-focus-within:-rotate-180"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                {TYPE_TRAVAUX_LABELS[solution.key]}
              </h3>
              <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-mist opacity-0 transition-all duration-300 ease-out group-hover:mt-2 group-hover:max-h-32 group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:max-h-32 group-focus-within:opacity-100">
                {solution.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 w-full"
                onClick={() => selectTravauxAndScroll(solution.key)}
              >
                Vérifier mon éligibilité
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
