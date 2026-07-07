"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/hero-visual";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-night pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(6,11,23,0.4)_70%,#F7F8FC_100%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sun-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Étude d&apos;éligibilité gratuite
          </span>

          <h1 className="font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
            Passez au solaire et{" "}
            <span className="text-gradient-sun">réduisez vos factures</span>{" "}
            d&apos;électricité
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Découvrez en moins de 2 minutes si votre foyer est éligible aux
            aides disponibles pour l&apos;installation de panneaux
            photovoltaïques.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" onClick={() => scrollToId("eligibilite")}>
              Tester mon éligibilité
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost-light"
              className="border border-white/15"
              onClick={() => scrollToId("aides")}
            >
              Voir les aides disponibles
            </Button>
          </div>

          <p className="mt-5 text-sm text-white/50">
            Gratuit, rapide, sans engagement — aides accordées selon
            éligibilité.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
