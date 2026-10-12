// Authentification minimale du dashboard admin — un seul mot de passe
// partagé (ADMIN_PASSWORD), pas de table utilisateurs. Suffisant pour un
// opérateur unique ; à remplacer par une vraie authentification (Supabase
// Auth, par ex.) si plusieurs personnes doivent y accéder un jour avec des
// rôles différents.
//
// Web Crypto (crypto.subtle) plutôt que le module "crypto" de Node : ce
// fichier est importé à la fois par une route API (runtime Node) et par
// middleware.ts (runtime Edge), et seul crypto.subtle est disponible dans
// les deux environnements.
export const ADMIN_COOKIE_NAME = "soleil_admin_session";

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
