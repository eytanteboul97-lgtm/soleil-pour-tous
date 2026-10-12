import { z } from "zod";

// French mobile/landline numbers, with or without spaces/dots, optional +33.
export const PHONE_REGEX = /^(?:\+33|0)[\s.-]?[1-9](?:[\s.-]?\d{2}){4}$/;
export const POSTAL_CODE_REGEX = /^\d{5}$/;
// Vérification légère "a l'air valide" pour le retour instantané en direct —
// volontairement plus permissive que le .email() de zod, qui reste la
// validation faisant foi à la soumission.
export const EMAIL_LOOKS_VALID_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TYPE_TRAVAUX_VALUES = [
  "photovoltaique",
  "pac-air-eau",
  "pac-air-air",
  "ballon-thermodynamique",
  "isolation",
  "renovation-globale",
] as const;

const baseLeadSchema = z.object({
  typeTravaux: z
    .array(z.enum(TYPE_TRAVAUX_VALUES))
    .min(1, "Sélectionnez au moins un type de travaux"),

  // Facultatif — utilisé uniquement pour personnaliser l'expérience (ex.
  // avatar dans le panneau de profil), jamais requis pour avancer.
  civilite: z.enum(["madame", "monsieur"]).optional(),
  prenom: z.string().trim().min(2, "Prénom trop court"),
  // Le nom de famille n'est plus demandé dans le formulaire (le palier de
  // conversion est volontairement réduit à Prénom / Téléphone / Email) —
  // gardé optionnel ici uniquement pour ne pas casser le typage/l'email
  // récapitulatif si jamais renseigné ailleurs.
  nom: z.string().trim().optional().default(""),
  email: z.string().trim().email("Adresse email invalide"),
  telephone: z.string().trim().regex(PHONE_REGEX, "Numéro de téléphone invalide"),

  adresse: z.string().trim().min(5, "Adresse trop courte"),
  codePostal: z.string().trim().regex(POSTAL_CODE_REGEX, "Code postal invalide (5 chiffres)"),
  ville: z.string().trim().min(2, "Ville trop courte"),

  statutOccupation: z.enum(["proprietaire", "locataire"], {
    required_error: "Sélectionnez votre statut",
  }),
  typeLogement: z.enum(["maison", "appartement", "autre"], {
    required_error: "Sélectionnez un type de logement",
  }),
  nombrePersonnes: z.enum(["1-2", "3-4", "5+"], {
    required_error: "Sélectionnez le nombre de personnes",
  }),
  factureMensuelle: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) > 0, "Montant invalide"),
  typeChauffage: z.enum(["electrique", "gaz", "fioul", "charbon", "bois", "pac", "autre"], {
    required_error: "Sélectionnez un type de chauffage",
  }),

  // Uniquement requis si "photovoltaique" fait partie des travaux souhaités
  // (voir le superRefine ci-dessous).
  surfaceToiture: z.string().trim().optional().default(""),
  orientationToit: z.enum(["sud", "est-ouest", "nord", "inconnue"]).optional(),

  revenuFiscal: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) >= 0, "Montant invalide"),

  // Demandée en option seulement, après le résultat, pour ne pas alourdir le
  // palier de conversion (Prénom/Téléphone/Email) — "peu-importe" par défaut
  // si le visiteur ne répond pas à cette question facultative.
  disponibiliteRappel: z
    .enum(["matin", "apres-midi", "soir", "peu-importe"])
    .optional()
    .default("peu-importe"),

  consentement: z
    .boolean()
    .refine((v) => v === true, "Le consentement est requis pour continuer"),
});

export const leadFormSchema = baseLeadSchema.superRefine((data, ctx) => {
  if (data.typeTravaux.includes("photovoltaique")) {
    if (!data.surfaceToiture || Number(data.surfaceToiture) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["surfaceToiture"],
        message: "Champ requis pour un projet photovoltaïque",
      });
    }
    if (!data.orientationToit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["orientationToit"],
        message: "Sélectionnez une orientation",
      });
    }
  }
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

// Schéma "lead rapide" — capturé dès l'écran contact, avant le reste de la
// qualification (chauffage, revenu, etc.). Sous-ensemble volontairement
// restreint de baseLeadSchema : seuls les champs déjà renseignés à ce stade
// du parcours (projet, ville, coordonnées) sont exigés, pour ne jamais
// perdre un contact qui abandonne juste après avoir laissé ses informations.
export const quickLeadSchema = baseLeadSchema.pick({
  typeTravaux: true,
  prenom: true,
  email: true,
  telephone: true,
  adresse: true,
  codePostal: true,
  ville: true,
  consentement: true,
});

export type QuickLeadValues = z.infer<typeof quickLeadSchema>;

export const TYPE_TRAVAUX_LABELS: Record<(typeof TYPE_TRAVAUX_VALUES)[number], string> = {
  photovoltaique: "Panneaux photovoltaïques",
  "pac-air-eau": "Pompe à chaleur Air / Eau",
  "pac-air-air": "Pompe à chaleur Air / Air",
  "ballon-thermodynamique": "Ballon thermodynamique",
  isolation: "Isolation thermique",
  "renovation-globale": "Rénovation globale",
};

// Un émoji par type de travaux, réutilisé partout où le projet du visiteur
// doit se reconnaître visuellement d'un coup d'œil (sélecteur du
// simulateur, panneau "profil en direct", écran de résultat).
export const TYPE_TRAVAUX_EMOJI: Record<(typeof TYPE_TRAVAUX_VALUES)[number], string> = {
  photovoltaique: "☀️",
  "pac-air-eau": "🔥",
  "pac-air-air": "🌡️",
  "ballon-thermodynamique": "💧",
  isolation: "🏠",
  "renovation-globale": "⚡",
};

export const CIVILITE_LABELS: Record<NonNullable<LeadFormValues["civilite"]>, string> = {
  madame: "Madame",
  monsieur: "Monsieur",
};

export const NOMBRE_PERSONNES_LABELS: Record<LeadFormValues["nombrePersonnes"], string> = {
  "1-2": "1 à 2 personnes",
  "3-4": "3 à 4 personnes",
  "5+": "5 personnes ou plus",
};

export const TYPE_CHAUFFAGE_LABELS: Record<LeadFormValues["typeChauffage"], string> = {
  electrique: "Électrique",
  gaz: "Gaz",
  fioul: "Fioul",
  charbon: "Charbon",
  bois: "Bois",
  pac: "Pompe à chaleur",
  autre: "Autre",
};

// Systèmes dont le remplacement par une pompe à chaleur à eau performante
// peut ouvrir droit à la bonification CEE "Coup de pouce Chauffage" — voir
// lib/cee-dispositifs.ts. Un chauffage déjà électrique, une PAC existante ou
// un chauffage bois ne sont volontairement pas inclus.
export const TYPE_CHAUFFAGE_ELIGIBLE_COUP_DE_POUCE: LeadFormValues["typeChauffage"][] = [
  "gaz",
  "fioul",
  "charbon",
];

export const ORIENTATION_LABELS: Record<
  NonNullable<LeadFormValues["orientationToit"]>,
  string
> = {
  sud: "Plein sud",
  "est-ouest": "Est / Ouest",
  nord: "Nord",
  inconnue: "Je ne sais pas",
};

export const TYPE_LOGEMENT_LABELS: Record<LeadFormValues["typeLogement"], string> = {
  maison: "Maison",
  appartement: "Appartement",
  autre: "Autre",
};

export const STATUT_LABELS: Record<LeadFormValues["statutOccupation"], string> = {
  proprietaire: "Propriétaire",
  locataire: "Locataire",
};

export const DISPONIBILITE_LABELS: Record<LeadFormValues["disponibiliteRappel"], string> = {
  matin: "Le matin",
  "apres-midi": "L'après-midi",
  soir: "Le soir",
  "peu-importe": "Peu importe",
};
