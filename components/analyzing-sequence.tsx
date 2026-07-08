"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Logomark } from "@/components/logomark";

const STEPS = [
  "Vérification de votre éligibilité",
  "Calcul de vos économies potentielles",
  "Recherche des aides applicables à votre profil",
  "Préparation de votre recommandation personnalisée",
];

const STEP_DURATION = 700;

export function AnalyzingSequence({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= STEPS.length) {
      const timeout = setTimeout(onComplete, 400);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setActiveStep((s) => s + 1), STEP_DURATION);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-card">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-sun-radial opacity-60 blur-lg"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <Logomark className="relative h-14 w-14 text-night" />
      </div>

      <h3 className="mt-6 font-display text-xl font-bold text-ink">
        Préparation de votre estimation personnalisée
      </h3>

      <ul className="mt-7 w-full max-w-sm space-y-3 text-left">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs " +
                  (done
                    ? "bg-leaf-500/15 text-leaf-600"
                    : active
                      ? "bg-sun-500/15 text-sun-600"
                      : "bg-line text-mist")
                }
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : null}
              </span>
              <span className={done || active ? "text-sm text-ink-soft" : "text-sm text-mist/60"}>
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
