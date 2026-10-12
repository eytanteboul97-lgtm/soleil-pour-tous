import { NextResponse } from "next/server";
import { Resend } from "resend";
import { quickLeadSchema } from "@/lib/lead-schema";
import { buildEarlyLeadEmailHtml } from "@/lib/lead-email";

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
