// Capture légère des paramètres de tracking publicitaire (UTM + identifiants
// de clic Meta/Google) — stockée en sessionStorage pour survivre à la
// navigation entre pages (ex. clic sur une pub → /pompe-a-chaleur → puis
// retour à l'accueil pour lancer le simulateur) sans dépendre d'un cookie
// tiers ni d'un service d'attribution externe.
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
};

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

const STORAGE_KEY = "soleil:attribution";

// À appeler côté client (une fois par session suffit, la valeur est mise en
// cache en sessionStorage). Si l'URL courante ne porte aucun paramètre de
// tracking, retombe sur la dernière attribution capturée sur ce domaine
// pendant la session — jamais sur localStorage, pour ne pas prolonger le
// suivi au-delà d'une visite.
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }

  if (Object.keys(fromUrl).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // sessionStorage indisponible (navigation privée stricte...) — on
      // continue simplement sans persistance inter-pages.
    }
    return fromUrl;
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    // Idem.
  }
  return {};
}

// Extraction côté serveur, tolérante : le payload reçu par les routes API
// n'est jamais garanti d'avoir ces champs (ancien client en cache, appel
// direct...), donc chaque valeur est optionnelle et simplement ignorée si
// absente ou mal typée.
export function extractAttribution(body: unknown): Attribution {
  if (!body || typeof body !== "object") return {};
  const result: Attribution = {};
  const record = body as Record<string, unknown>;
  for (const key of ATTRIBUTION_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) result[key] = value.trim();
  }
  return result;
}

// Cookies posés automatiquement par le script fbevents.js du Pixel Meta une
// fois chargé — utilisés uniquement pour améliorer la correspondance des
// événements envoyés côté serveur via Meta Conversions API (lib/meta-capi.ts).
// Absents si le Pixel n'a pas encore eu le temps de se charger ou si un
// bloqueur de publicité l'empêche — dans ce cas la Conversions API fonctionne
// quand même, avec une correspondance simplement moins précise.
export function getFacebookCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const cookies = document.cookie.split(";").reduce<Record<string, string>>((acc, pair) => {
    const [key, ...rest] = pair.trim().split("=");
    if (key) acc[key] = rest.join("=");
    return acc;
  }, {});
  return { fbp: cookies["_fbp"], fbc: cookies["_fbc"] };
}

// Identifiant partagé entre l'événement envoyé au pixel navigateur et celui
// envoyé côté serveur, pour que Meta les fusionne en un seul événement au
// lieu de compter deux leads. crypto.randomUUID() n'existe pas dans tous les
// anciens navigateurs embarqués (certains navigateurs in-app) — repli sur un
// identifiant moins robuste mais suffisant pour cet usage.
export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
