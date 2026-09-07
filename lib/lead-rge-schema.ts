import { z } from "zod";
import { PHONE_REGEX, POSTAL_CODE_REGEX, TYPE_TRAVAUX_VALUES } from "@/lib/lead-schema";

// Schéma volontairement minimal — cette page est un parcours autonome
// "trouver un professionnel RGE" (trafic direct/SEO/pub), distinct du
// simulateur d'éligibilité complet : on ne redemande jamais le revenu, la
// facture ou l'adresse complète ici, seulement ce qui sert à qualifier la
// recherche d'installateur.
export const leadRgeSchema = z.object({
  typeTravaux: z
    .array(z.enum(TYPE_TRAVAUX_VALUES))
    .min(1, "Sélectionnez au moins un type de travaux"),
  typeLogement: z.enum(["maison", "appartement", "autre"], {
    required_error: "Sélectionnez un type de logement",
  }),
  codePostal: z.string().trim().regex(POSTAL_CODE_REGEX, "Code postal invalide (5 chiffres)"),
  prenom: z.string().trim().min(2, "Prénom trop court"),
  email: z.string().trim().email("Adresse email invalide"),
  telephone: z.string().trim().regex(PHONE_REGEX, "Numéro de téléphone invalide"),
  consentement: z
    .boolean()
    .refine((v) => v === true, "Le consentement est requis pour continuer"),
});

export type LeadRgeValues = z.infer<typeof leadRgeSchema>;
