"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Gauge, PiggyBank, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import { computeSimulation } from "@/lib/simulator";
import { cn } from "@/lib/utils";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium text-white/80">
          {label}
        </label>
        <span aria-hidden="true" className="font-display font-semibold text-sun-300">
          {value.toLocaleString("fr-FR")} {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value.toLocaleString("fr-FR")} ${suffix}`}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-sun-500"
      />
    </div>
  );
}

export function Simulator() {
  const [monthlyBill, setMonthlyBill] = useState(120);
  const [codePostal, setCodePostal] = useState("75001");
  const [roofSurface, setRoofSurface] = useState(40);
  const [taxIncome, setTaxIncome] = useState(28000);

  const result = useMemo(
    () =>
      computeSimulation({
        monthlyBill,
        codePostal: /^\d{5}$/.test(codePostal) ? codePostal : "75001",
        roofSurface,
        taxIncome,
      }),
    [monthlyBill, codePostal, roofSurface, taxIncome]
  );

  const animatedSavings = useAnimatedNumber(result.estimatedAnnualSavings);
  const animatedKwc = useAnimatedNumber(Math.round(result.installableKwc * 10));

  return (
    <section id="simulateur" className="anchor-offset relative overflow-hidden bg-night py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-mesh-night opacity-70" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-volt-400">
            Simulateur d&apos;économies
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Estimez vos économies potentielles
          </h2>
          <p className="mt-4 text-white/60">
            Ajustez les curseurs pour obtenir une première estimation. Résultat
            indicatif, non contractuel — confirmé lors de l&apos;étude gratuite.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Inputs */}
          <div className="glass rounded-3xl p-7 sm:p-9">
            <div className="space-y-7">
              <SliderField
                id="sim-facture"
                label="Facture d'électricité mensuelle"
                value={monthlyBill}
                onChange={setMonthlyBill}
                min={30}
                max={400}
                step={5}
                suffix="€"
              />
              <SliderField
                id="sim-surface"
                label="Surface approximative de toiture"
                value={roofSurface}
                onChange={setRoofSurface}
                min={10}
                max={150}
                step={5}
                suffix="m²"
              />
              <SliderField
                id="sim-revenu"
                label="Revenu fiscal de référence"
                value={taxIncome}
                onChange={setTaxIncome}
                min={0}
                max={80000}
                step={1000}
                suffix="€"
              />

              <div>
                <label htmlFor="sim-cp" className="mb-2 block text-sm font-medium text-white/80">
                  Code postal
                </label>
                <input
                  id="sim-cp"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  inputMode="numeric"
                  className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white placeholder:text-white/40 focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/40"
                  placeholder="75001"
                />
              </div>
            </div>
          </div>

          {/* Output dashboard */}
          <div
            className={cn(
              "flex flex-col justify-between rounded-3xl bg-gradient-to-br from-night-raised to-night p-7 shadow-glow sm:p-9"
            )}
          >
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white/5 p-5">
                <PiggyBank className="h-5 w-5 text-sun-300" aria-hidden="true" />
                <p className="mt-3 font-display text-3xl font-bold text-white">
                  {animatedSavings.toLocaleString("fr-FR")} €
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Économies annuelles estimées
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5">
                <Gauge className="h-5 w-5 text-volt-400" aria-hidden="true" />
                <p className="mt-3 font-display text-3xl font-bold text-white">
                  {(animatedKwc / 10).toFixed(1)} kWc
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Puissance installable estimée
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/5 p-5">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sun-300" aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-semibold text-white">
                  {result.eligibilityLabel}
                </p>
                <p className="mt-1 text-sm text-white/60">{result.nextStep}</p>
              </div>
            </div>

            <Button className="mt-6 w-full" onClick={() => scrollToId("eligibilite")}>
              Recevoir mon étude gratuite
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Button>

            <p className="mt-4 text-center text-xs text-white/60">
              Estimation indicative, non contractuelle.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
