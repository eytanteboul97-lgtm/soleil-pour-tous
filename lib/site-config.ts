// Source unique du domaine du site — utilisé par les métadonnées SEO,
// l'image Open Graph, le sitemap et robots.txt. Passe par une variable
// d'environnement pour ne plus jamais avoir à toucher au code le jour où
// un nom de domaine personnalisé (ex. soleilpourtous.fr) est branché sur
// Netlify : il suffit alors de définir NEXT_PUBLIC_SITE_URL dans les
// variables d'environnement Netlify et de redéployer.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://soleilpourtous.netlify.app";
