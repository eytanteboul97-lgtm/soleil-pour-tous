import { NextResponse } from "next/server";
import { Resend } from "resend";
import { quickLeadSchema } from "@/lib/lead-schema";
import { buildEarlyLeadEmailHtml } from "@/lib/lead-email";
import { extractAttribution } from "@/lib/attribution";
import { classifyLead, departmentFromPostalCode } from "@/lib/lead-classification";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMetaLeadEvent } from "@/lib/meta-capi";

// Capture un lead partiel dès que le visiteur laisse ses coordonnées, avant
// la fin du parcours de qualification — voir app/api/lead/route.ts pour la
// soumission finale enrichie, déclenchée si le visiteur va au bout.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quickLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const lead = parsed.data;
  const receivedAt = new Date();
  const attribution = extractAttribution(body);

  // Meta Conversions API — voir lib/meta-capi.ts. N'envoie rien si
  // META_CONVERSIONS_API_ACCESS_TOKEN n'est pas configuré. L'eventId doit
  // correspondre à celui transmis au pixel navigateur (submitEarlyLead) pour
  // que Meta fusionne les deux comme un seul événement Lead.
  const payload = (body ?? {}) as Record<string, unknown>;
  const eventId = typeof payload.eventId === "string" ? payload.eventId : undefined;
  if (eventId) {
    // Attendu (pas fire-and-forget) : une fonction serverless peut être
    // arrêtée dès la réponse envoyée, ce qui couperait un envoi en arrière-plan
    // non terminé. sendMetaLeadEvent gère déjà ses propres erreurs en interne.
    await sendMetaLeadEvent({
      eventId,
      email: lead.email,
      phone: lead.telephone,
      eventSourceUrl: typeof payload.pageUrl === "string" ? payload.pageUrl : undefined,
      fbp: typeof payload.fbp === "string" ? payload.fbp : undefined,
      fbc: typeof payload.fbc === "string" ? payload.fbc : undefined,
      clientIp:
        request.headers.get("x-nf-client-connection-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        undefined,
      clientUserAgent: request.headers.get("user-agent") || undefined,
    });
  }

  // Persistance en base (facultative tant que Supabase n'est pas configuré)
  // et envoi d'email sont deux canaux indépendants : un souci sur l'un ne
  // doit jamais empêcher l'autre, ni bloquer la réponse envoyée au visiteur.
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase.from("leads").insert({
        kind: "early",
        classification: classifyLead({ kind: "early", typeTravauxCount: lead.typeTravaux.length }),
        type_travaux: lead.typeTravaux,
        prenom: lead.prenom,
        email: lead.email,
        telephone: lead.telephone,
        adresse: lead.adresse,
        code_postal: lead.codePostal,
        ville: lead.ville,
        departement: departmentFromPostalCode(lead.codePostal),
        consentement: lead.consentement,
        ...attribution,
        raw: body,
      });
      if (error) console.error("[lead-early] échec de l'insertion Supabase:", error);
    } catch (err) {
      console.error("[lead-early] erreur inattendue Supabase:", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !notifyTo) {
    console.warn(
      "[lead-early] RESEND_API_KEY ou LEAD_NOTIFICATION_EMAIL manquant : email de notification non envoyé.",
      { ville: lead.ville, codePostal: lead.codePostal }
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL || "Soleil Pour Tous <onboarding@resend.dev>",
      to: notifyTo,
      replyTo: lead.email,
      subject: `Nouveau contact (qualification en cours) — ${lead.prenom} (${lead.ville})`,
      html: buildEarlyLeadEmailHtml(lead, receivedAt),
    });

    if (error) {
      console.error("[lead-early] échec de l'envoi de l'email de notification:", error);
    }
  } catch (err) {
    console.error("[lead-early] erreur inattendue lors de l'envoi de l'email:", err);
  }

  return NextResponse.json({ ok: true });
}
