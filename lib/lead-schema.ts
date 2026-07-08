import { z } from "zod";

// French mobile/landline numbers, with or without spaces/dots, optional +33.
const PHONE_REGEX = /^(?:\+33|0)[\s.-]?[1-9](?:[\s.-]?\d{2}){4}$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;

export const leadFormSchema = z.object({
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
  surfaceToiture: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) > 0, "Surface invalide"),
  orientationToit: z.enum(["sud", "est-ouest", "nord", "inconnue"], {
    required_error: "Sélectionnez une orientation",
  }),
  revenuFiscal: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) >= 0, "Montant invalide"),

  consentement: z
    .boolean()
    .refine((v) => v === true, "Le consentement est requis pour continuer"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

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

export const ORIENTATION_LABELS: Record<LeadFormValues["orientationToit"], string> = {
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
