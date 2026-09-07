import { z } from "zod";
import { PHONE_REGEX, POSTAL_CODE_REGEX } from "@/lib/lead-schema";

export const STRUCTURE_TYPE_VALUES = [
  "tpe",
  "pme",
  "industrie",
  "commerce",
  "hotel",
  "restaurant",
  "copropriete",
  "association",
  "collectivite",
] as const;

export const leadProSchema = z.object({
  typeStructure: z.enum(STRUCTURE_TYPE_VALUES, {
    required_error: "Sélectionnez le type de structure",
  }),
  nomStructure: z.string().trim().min(2, "Nom trop court"),
  prenom: z.string().trim().min(2, "Prénom trop court"),
  nom: z.string().trim().min(2, "Nom trop court"),
  email: z.string().trim().email("Adresse email invalide"),
  telephone: z.string().trim().regex(PHONE_REGEX, "Numéro de téléphone invalide"),
  codePostal: z.string().trim().regex(POSTAL_CODE_REGEX, "Code postal invalide (5 chiffres)"),
  besoin: z.string().trim().max(500, "500 caractères maximum").optional().default(""),
  consentement: z
    .boolean()
    .refine((v) => v === true, "Le consentement est requis pour continuer"),
});

export type LeadProValues = z.infer<typeof leadProSchema>;

export const STRUCTURE_TYPE_LABELS: Record<(typeof STRUCTURE_TYPE_VALUES)[number], string> = {
  tpe: "TPE",
  pme: "PME",
  industrie: "Industrie",
  commerce: "Commerce",
  hotel: "Hôtel",
  restaurant: "Restaurant",
  copropriete: "Copropriété",
  association: "Association",
  collectivite: "Collectivité",
};
