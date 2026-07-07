import { z } from "zod";

// French mobile/landline numbers, with or without spaces/dots, optional +33.
const PHONE_REGEX = /^(?:\+33|0)[\s.-]?[1-9](?:[\s.-]?\d{2}){4}$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;

export const stepOneSchema = z.object({
  prenom: z.string().trim().min(2, "Prénom trop court"),
  nom: z.string().trim().min(2, "Nom trop court"),
  email: z.string().trim().email("Adresse email invalide"),
  telephone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Numéro de téléphone invalide"),
});

export const stepTwoSchema = z.object({
  adresse: z.string().trim().min(5, "Adresse trop courte"),
  codePostal: z
    .string()
    .trim()
    .regex(POSTAL_CODE_REGEX, "Code postal invalide (5 chiffres)"),
  ville: z.string().trim().min(2, "Ville trop courte"),
});

export const stepThreeSchema = z.object({
  typeLogement: z.enum(["maison", "appartement", "autre"], {
    required_error: "Sélectionnez un type de logement",
  }),
  statutOccupation: z.enum(["proprietaire", "locataire"], {
    required_error: "Sélectionnez votre statut",
  }),
  surfaceToiture: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) > 0, "Surface invalide"),
  factureMensuelle: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) > 0, "Montant invalide"),
});

export const stepFourSchema = z.object({
  revenuFiscal: z
    .string()
    .trim()
    .min(1, "Champ requis")
    .refine((v) => Number(v) >= 0, "Montant invalide"),
  consentement: z
    .boolean()
    .refine((v) => v === true, "Le consentement est requis pour continuer"),
});

export const leadFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .merge(stepFourSchema);

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const stepSchemas = [
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
] as const;

export const stepFields: (keyof LeadFormValues)[][] = [
  ["prenom", "nom", "email", "telephone"],
  ["adresse", "codePostal", "ville"],
  ["typeLogement", "statutOccupation", "surfaceToiture", "factureMensuelle"],
  ["revenuFiscal", "consentement"],
];
