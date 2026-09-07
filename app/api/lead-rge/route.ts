import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadRgeSchema } from "@/lib/lead-rge-schema";
import { buildLeadRgeEmailHtml } from "@/lib/lead-rge-email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadRgeSchema.safeParse(body);

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
      "[lead-rge] RESEND_API_KEY ou LEAD_NOTIFICATION_EMAIL manquant : email de notification non envoyé.",
      { codePostal: lead.codePostal }
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL || "Soleil Pour Tous <onboarding@resend.dev>",
      to: notifyTo,
      replyTo: lead.email,
      subject: `Demande de mise en relation RGE — ${lead.prenom} (${lead.codePostal})`,
      html: buildLeadRgeEmailHtml(lead, receivedAt),
    });

    if (error) {
      console.error("[lead-rge] échec de l'envoi de l'email de notification:", error);
    }
  } catch (err) {
    console.error("[lead-rge] erreur inattendue lors de l'envoi de l'email:", err);
  }

  return NextResponse.json({ ok: true });
}
