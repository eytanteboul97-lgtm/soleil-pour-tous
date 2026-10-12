import { createClient } from "@supabase/supabase-js";

// Typage minimal de la table "leads" — juste assez pour que l'insertion et
// la lecture côté admin soient vérifiées par TypeScript, sans dépendre de la
// génération de types via la CLI Supabase (non disponible dans cet
// environnement). À régénérer avec `supabase gen types typescript` si le
// schéma évolue significativement.
type LeadRow = {
  id: string;
  created_at: string;
  kind: "early" | "complet";
  classification: "prioritaire" | "a_approfondir" | "non_qualifie";
  type_travaux: string[];
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  departement: string | null;
  statut_occupation: string | null;
  type_logement: string | null;
  nombre_personnes: string | null;
  type_chauffage: string | null;
  facture_mensuelle: number | null;
  revenu_fiscal: number | null;
  surface_toiture: number | null;
  orientation_toit: string | null;
  consentement: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  gclid: string | null;
  raw: Record<string, unknown>;
};

// Seul "kind" est réellement requis à l'insertion côté TypeScript — tous
// les autres champs sont optionnels (la base applique ses propres valeurs
// par défaut / NULL), reflétant que /api/lead-early n'envoie qu'un
// sous-ensemble des colonnes tant que le parcours n'est pas terminé.
type LeadInsert = Partial<Omit<LeadRow, "id" | "created_at">> & Pick<LeadRow, "kind">;

type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Client serveur uniquement — utilise la clé service_role, qui contourne
// Row Level Security et ne doit JAMAIS être exposée au navigateur (pas de
// préfixe NEXT_PUBLIC_, jamais importée depuis un composant "use client").
// Utilisé uniquement dans les routes API (app/api/**/route.ts) et le
// dashboard admin (composants serveur).
let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  if (!client) {
    client = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}
