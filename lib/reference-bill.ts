// Estimation pédagogique et illustrative, non contractuelle — sert à situer
// le foyer par rapport à une moyenne et à visualiser un ordre de grandeur
// d'économies, jamais à remplacer l'étude technique personnalisée.
//
// Bases de consommation (hors chauffage) et effet du chauffage électrique
// calibrés sur les ordres de grandeur ADEME/fournisseurs usuellement cités :
// foyer moyen ~4 200 kWh/an hors chauffage, maison 100 % électrique
// ~9 000-18 000 kWh/an tout compris selon surface et isolation.
import type { LeadFormValues } from "@/lib/lead-schema";

const PRICE_PER_KWH = 0.25; // € — cohérent avec lib/simulator.ts

const BASE_ANNUAL_KWH: Record<LeadFormValues["nombrePersonnes"], number> = {
  "1-2": 3200,
  "3-4": 5200,
  "5+": 6800,
};

const HEATING_MULTIPLIER: Record<LeadFormValues["typeChauffage"], number> = {
  electrique: 1.9,
  gaz: 1.05,
  fioul: 1.05,
  autre: 1.1,
};

const DWELLING_MULTIPLIER: Record<LeadFormValues["typeLogement"], number> = {
  maison: 1.15,
  appartement: 0.85,
  autre: 1,
};

export function estimateReferenceMonthlyBill(
  nombrePersonnes: LeadFormValues["nombrePersonnes"],
  typeLogement: LeadFormValues["typeLogement"],
  typeChauffage: LeadFormValues["typeChauffage"]
): number {
  const kwh =
    BASE_ANNUAL_KWH[nombrePersonnes] *
    HEATING_MULTIPLIER[typeChauffage] *
    DWELLING_MULTIPLIER[typeLogement];
  return Math.round((kwh * PRICE_PER_KWH) / 12);
}

// Taux de réduction indicatifs par type de travaux (hors photovoltaïque, qui
// dispose de son propre calcul kWh-par-kWh dans lib/simulator.ts). Ordres de
// grandeur couramment cités : pompe à chaleur vs chauffage électrique direct
// ou fioul (COP ~3-4), gain d'isolation, chauffe-eau thermodynamique sur la
// seule part eau chaude du budget.
const SAVINGS_RATE_BY_TRAVAUX: Partial<Record<LeadFormValues["typeTravaux"][number], number>> = {
  "pac-air-eau": 0.45,
  "pac-air-air": 0.35,
  "ballon-thermodynamique": 0.15,
  isolation: 0.2,
  "renovation-globale": 0.35,
};

export function estimateSavingsRate(typeTravaux: LeadFormValues["typeTravaux"]): number {
  const rates = typeTravaux.map((t) => SAVINGS_RATE_BY_TRAVAUX[t] ?? 0);
  return rates.length ? Math.max(...rates) : 0;
}
