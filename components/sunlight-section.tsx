"use client";

import { Sun } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const ZONES = [
  {
    label: "Sud de la France",
    detail: "PACA, Occitanie, Corse, Nouvelle-Aquitaine littorale",
    strength: 100,
    note: "Jusqu'à ~15 % de production en plus que la moyenne nationale.",
  },
  {
    label: "Centre & Est",
    detail: "Auvergne-Rhône-Alpes, Bourgogne, Centre-Val de Loire, Île-de-France",
    strength: 87,
    note: "Un ensoleillement dans la moyenne nationale.",
  },
  {
    label: "Nord & Nord-Ouest",
    detail: "Hauts-de-France, Normandie, Bretagne",
    strength: 78,
    note: "Une installation reste tout à fait viable, avec un dimensionnement adapté.",
  },
];

export function SunlightSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
            Ensoleillement en France
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Où que vous soyez, le solaire reste pertinent
          </h2>
          <p className="mt-4 text-mist">
            La France bénéficie d&apos;un ensoleillement globalement favorable au
            photovoltaïque — avec des écarts régionaux dont notre simulateur
            tient compte.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ZONES.map((zone, i) => (
            <Reveal
              key={zone.label}
              delay={i * 0.1}
              className="rounded-3xl border border-line bg-paper p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sun-500/10 text-sun-700">
                <Sun className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {zone.label}
              </h3>
              <p className="mt-1 text-sm text-mist">{zone.detail}</p>

              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r from-sun-400 to-sun-600 transition-all duration-1000"
                  )}
                  style={{ width: `${zone.strength}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-mist">{zone.note}</p>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-mist/70">
          Répartition indicative à titre pédagogique. Le simulateur ci-dessus
          affine cette estimation à partir de votre code postal précis.
        </p>
      </div>
    </section>
  );
}
