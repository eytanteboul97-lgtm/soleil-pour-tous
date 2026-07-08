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
  nom: z.string().trim().min(2, "Nom trop court"),
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
  typeChauffage: z.enum(["electrique", "gaz", "fioul", "autre"], {
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

  disponibiliteRappel: z.enum(["matin", "apres-midi", "soir", "peu-importe"], {
    required_error: "Sélectionnez une disponibilité",
  }),

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

export const TYPE_TRAVAUX_LABELS: Record<(typeof TYPE_TRAVAUX_VALUES)[number], string> = {
  photovoltaique: "Panneaux photovoltaïques",
  "pac-air-eau": "Pompe à chaleur Air / Eau",
  "pac-air-air": "Pompe à chaleur Air / Air",
  "ballon-thermodynamique": "Ballon thermodynamique",
  isolation: "Isolation thermique",
  "renovation-globale": "Rénovation globale",
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
  autre: "Autre",
};

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
