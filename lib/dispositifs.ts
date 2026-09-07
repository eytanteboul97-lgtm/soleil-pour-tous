import type { LeadFormValues } from "@/lib/lead-schema";

type Travaux = LeadFormValues["typeTravaux"][number];

export type Dispositif = { label: string; aideSlug?: string };

// Liste des dispositifs potentiellement applicables, déduite du (des) type(s)
// de travaux sélectionnés — même logique que components/aides-table.tsx et
// lib/aides-content.ts, pour ne jamais afficher un nombre "inventé" : le
// compte de dispositifs montré au visiteur provient toujours de ce moteur.
const MAPRIMERENOV_TRAVAUX: Travaux[] = [
  "pac-air-eau",
  "pac-air-air",
  "ballon-thermodynamique",
  "isolation",
  "renovation-globale",
];
const ECO_PTZ_TRAVAUX: Travaux[] = ["isolation", "renovation-globale"];

export function getApplicableDispositifs(typeTravaux: Travaux[]): Dispositif[] {
  const dispositifs: Dispositif[] = [];

  if (typeTravaux.length > 0) {
    dispositifs.push({ label: "Certificats d'Économies d'Énergie (CEE)" });
  }
  if (typeTravaux.some((t) => MAPRIMERENOV_TRAVAUX.includes(t))) {
    dispositifs.push({ label: "MaPrimeRénov'" });
  }
  if (typeTravaux.includes("photovoltaique")) {
    dispositifs.push({ label: "TVA réduite", aideSlug: "solaire" });
    dispositifs.push({ label: "Revente du surplus d'électricité", aideSlug: "solaire" });
  }
  if (typeTravaux.some((t) => ECO_PTZ_TRAVAUX.includes(t))) {
    dispositifs.push({ label: "Éco-prêt à taux zéro" });
  }

  return dispositifs;
}
