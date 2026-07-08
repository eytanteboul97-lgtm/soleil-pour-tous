// Estimations pédagogiques et illustratives, non contractuelles.
// Aucune donnée ici ne doit être présentée comme un engagement chiffré :
// seule une étude technique personnalisée permet de confirmer un dimensionnement.

const PRICE_PER_KWH = 0.25; // € — prix moyen indicatif de l'électricité
const SURPLUS_SELL_PRICE = 0.1; // € / kWh — tarif indicatif de rachat du surplus
const YIELD_PER_KWC = 1100; // kWh / kWc / an — production moyenne indicative en France
const M2_PER_KWC = 6; // m² de toiture indicatifs nécessaires par kWc installé
const SELF_CONSUMPTION_RATE = 0.45; // part indicative auto-consommée sans batterie

const SOUTH_DEPARTMENTS = new Set([
  "04", "05", "06", "11", "13", "20", "2A", "2B", "30", "31", "34", "40", "64", "65", "66", "83", "84",
]);
const NORTH_DEPARTMENTS = new Set([
  "02", "08", "14", "27", "28", "29", "50", "54", "55", "57", "59", "60", "61", "62", "67", "68", "76", "80",
]);

const ORIENTATION_MULTIPLIER: Record<string, number> = {
  sud: 1,
  "est-ouest": 0.87,
  nord: 0.6,
  inconnue: 0.87,
};

export function regionalYieldMultiplier(codePostal: string) {
  const dept = codePostal.slice(0, 2);
  if (SOUTH_DEPARTMENTS.has(dept)) return 1.15;
  if (NORTH_DEPARTMENTS.has(dept)) return 0.9;
  return 1;
}

export function regionLabel(codePostal: string): "sud" | "nord" | "centre" {
  const dept = codePostal.slice(0, 2);
  if (SOUTH_DEPARTMENTS.has(dept)) return "sud";
  if (NORTH_DEPARTMENTS.has(dept)) return "nord";
  return "centre";
}

export type SimulatorInput = {
  monthlyBill: number;
  codePostal: string;
  roofSurface: number;
  taxIncome: number;
  orientation?: "sud" | "est-ouest" | "nord" | "inconnue";
};

export type SimulatorResult = {
  installableKwc: number;
  estimatedAnnualSavings: number;
  eligibilityLevel: "renforcee" | "standard" | "a-confirmer";
  eligibilityLabel: string;
  nextStep: string;
};

export function computeSimulation({
  monthlyBill,
  codePostal,
  roofSurface,
  taxIncome,
  orientation = "inconnue",
}: SimulatorInput): SimulatorResult {
  const regionMultiplier = regionalYieldMultiplier(codePostal);
  const orientationMultiplier = ORIENTATION_MULTIPLIER[orientation] ?? 0.87;

  const installableKwc = clamp(roofSurface / M2_PER_KWC, 1.5, 9);
  const estimatedProductionKwh =
    installableKwc * YIELD_PER_KWC * regionMultiplier * orientationMultiplier;

  const annualBill = monthlyBill * 12;
  const consumptionKwh = annualBill / PRICE_PER_KWH;

  const selfConsumedKwh = Math.min(
    estimatedProductionKwh * SELF_CONSUMPTION_RATE,
    consumptionKwh
  );
  const surplusKwh = Math.max(estimatedProductionKwh - selfConsumedKwh, 0);

  const estimatedAnnualSavings = Math.round(
    selfConsumedKwh * PRICE_PER_KWH + surplusKwh * SURPLUS_SELL_PRICE
  );

  let eligibilityLevel: SimulatorResult["eligibilityLevel"] = "standard";
  let eligibilityLabel = "Éligibilité probable selon profil";
  if (taxIncome > 0 && taxIncome < 25000) {
    eligibilityLevel = "renforcee";
    eligibilityLabel = "Éligibilité renforcée probable";
  } else if (taxIncome > 45000) {
    eligibilityLevel = "a-confirmer";
    eligibilityLabel = "Éligibilité à confirmer selon profil";
  }

  return {
    installableKwc: Math.round(installableKwc * 10) / 10,
    estimatedAnnualSavings,
    eligibilityLevel,
    eligibilityLabel,
    nextStep:
      "Demandez votre étude gratuite pour confirmer ces estimations avec un conseiller.",
  };
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
