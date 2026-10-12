import { createHash } from "crypto";

// Meta Conversions API — envoi serveur de l'événement "Lead", en complément
// du Pixel navigateur (lib/meta-pixel.ts). Objectif : fiabiliser le suivi
// des conversions au-delà des limites du pixel seul (bloqueurs de pub, ITP
// Safari, navigateur in-app Facebook qui bloque parfois ses propres
// scripts tiers). N'envoie rien si META_CONVERSIONS_API_ACCESS_TOKEN n'est
// pas configuré — voir README.
//
// Dédoublonnage : le même "eventId" doit être transmis à la fois au pixel
// navigateur (fbq('track', 'Lead', {}, { eventID })) et ici, pour que Meta
// fusionne les deux comme un seul événement au lieu de compter deux leads.
// Voir submitEarlyLead() dans components/chat-qualification.tsx.
const META_PIXEL_ID = "4598836663731046"; // synchronisé avec app/layout.tsx

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// Meta recommande un numéro normalisé (indicatif pays, sans espaces ni "+")
// avant hachage. Convertit un numéro français "06 12 34 56 78" ou
// "0612345678" en "33612345678".
function normalizePhoneForHash(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+33")) return digits.slice(1);
  if (digits.startsWith("0")) return `33${digits.slice(1)}`;
  if (digits.startsWith("33")) return digits;
  return digits;
}

export async function sendMetaLeadEvent(params: {
  eventId: string;
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
}) {
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  if (!accessToken) return;

  const userData: Record<string, unknown> = {};
  if (params.email) userData.em = [sha256(params.email)];
  if (params.phone) userData.ph = [sha256(normalizePhoneForHash(params.phone))];
  if (params.fbp) userData.fbp = params.fbp;
  if (params.fbc) userData.fbc = params.fbc;
  if (params.clientIp) userData.client_ip_address = params.clientIp;
  if (params.clientUserAgent) userData.client_user_agent = params.clientUserAgent;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: "website",
        event_source_url: params.eventSourceUrl,
        user_data: userData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[meta-capi] échec de l'envoi de l'événement Lead:", res.status, text);
    }
  } catch (err) {
    console.error("[meta-capi] erreur inattendue lors de l'envoi à Meta:", err);
  }
}
