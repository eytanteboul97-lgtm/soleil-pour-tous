"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gauge, MapPin, PiggyBank, ShieldCheck, Wallet } from "lucide-react";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import { cn } from "@/lib/utils";

const REGION_COPY: Record<"sud" | "nord" | "centre", { label: string; detail: string }> = {
  sud: { label: "Ensoleillement fort", detail: "Votre région bénéficie d'un très bon niveau d'ensoleillement." },
  nord: { label: "Ensoleillement modéré", detail: "Un dimensionnement adapté reste tout à fait viable." },
  centre: { label: "Ensoleillement standard", detail: "Un niveau d'ensoleillement dans la moyenne nationale." },
};

export type LiveEstimate = {
  region?: "sud" | "nord" | "centre";
  estimatedAnnualSavings?: number;
  installableKwc?: number;
  eligibilityLabel?: string;
  fundingRateLabel?: string;
};

function Row({
  icon,
  label,
  ready,
  children,
}: {
  icon: ReactNode;
  label: string;
  ready: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sun-300">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/50">{label}</p>
        <AnimatePresence mode="wait">
          {ready ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="truncate font-display text-base font-semibold text-white"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div key="pending" className="font-display text-base font-semibold text-white/25">
              —
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LiveEstimatePanel({
  estimate,
  className,
  showSolarMetrics = true,
}: {
  estimate: LiveEstimate;
  className?: string;
  showSolarMetrics?: boolean;
}) {
  const savings = useAnimatedNumber(estimate.estimatedAnnualSavings ?? 0, 600);

  return (
    <div
      aria-live="polite"
      className={cn("rounded-3xl bg-gradient-to-br from-night-raised to-night p-6 shadow-glow", className)}
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/40">
        Votre profil, en direct
      </p>
      <div className="space-y-3">
        <Row icon={<MapPin className="h-5 w-5" aria-hidden="true" />} label="Votre secteur" ready={!!estimate.region}>
          {estimate.region ? REGION_COPY[estimate.region].label : ""}
        </Row>
        {showSolarMetrics && (
          <>
            <Row
              icon={<PiggyBank className="h-5 w-5" aria-hidden="true" />}
              label="Économies annuelles estimées"
              ready={estimate.estimatedAnnualSavings != null}
            >
              {savings.toLocaleString("fr-FR")} €
            </Row>
            <Row
              icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
              label="Puissance installable estimée"
              ready={estimate.installableKwc != null}
            >
              {estimate.installableKwc?.toFixed(1)} kWc
            </Row>
          </>
        )}
        <Row
          icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
          label="Éligibilité"
          ready={!!estimate.eligibilityLabel}
        >
          {estimate.eligibilityLabel}
        </Row>
        <Row
          icon={<Wallet className="h-5 w-5" aria-hidden="true" />}
          label="Aides estimées (MaPrimeRénov')"
          ready={!!estimate.fundingRateLabel}
        >
          {estimate.fundingRateLabel}
        </Row>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/40">
        Estimation indicative, non contractuelle, basée sur les barèmes 2026
        pour un foyer de référence — confirmée lors de l&apos;étude
        personnalisée.
      </p>
    </div>
  );
}
