// Classification commerciale calculée côté serveur à l'insertion en base —
// jamais utilisée pour exclure un visiteur d'une information publique sur
// les aides, uniquement pour aider une équipe commerciale à prioriser son
// temps de rappel.
export type LeadClassification = "prioritaire" | "a_approfondir" | "non_qualifie";

export function classifyLead(params: {
  kind: "early" | "complet";
  typeTravauxCount: number;
}): LeadClassification {
  // Un lead "early" n'a pas encore terminé la qualification (logement,
  // chauffage, revenu...) — toujours à approfondir par construction, même si
  // ses coordonnées sont parfaitement valides.
  if (params.kind === "early") return "a_approfondir";

  // Un visiteur qui a sélectionné un grand nombre de catégories à la fois
  // (ex. "Découvrir toutes les aides possibles") n'a pas encore de projet
  // précis — à approfondir plutôt qu'à transmettre tel quel.
  if (params.typeTravauxCount >= 5) return "a_approfondir";

  return "prioritaire";
}

// Approximation du département à partir des 2 premiers chiffres du code
// postal — suffisante pour un regroupement indicatif dans le dashboard,
// jamais utilisée comme donnée réglementaire.
export function departmentFromPostalCode(codePostal: string | undefined): string | null {
  if (!codePostal) return null;
  const digits = codePostal.trim().slice(0, 2);
  return /^\d{2}$/.test(digits) ? digits : null;
}
