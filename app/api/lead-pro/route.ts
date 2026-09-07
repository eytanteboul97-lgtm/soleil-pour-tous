import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadProSchema } from "@/lib/lead-pro-schema";
import { buildLeadProEmailHtml } from "@/lib/lead-pro-email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadProSchema.safeParse(body);

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
      "[lead-pro] RESEND_API_KEY ou LEAD_NOTIFICATION_EMAIL manquant : email de notification non envoyé.",
      { nomStructure: lead.nomStructure, codePostal: lead.codePostal }
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL || "Soleil Pour Tous <onboarding@resend.dev>",
      to: notifyTo,
      replyTo: lead.email,
      subject: `Nouveau lead professionnel — ${lead.nomStructure} (${lead.codePostal})`,
      html: buildLeadProEmailHtml(lead, receivedAt),
    });

    if (error) {
      console.error("[lead-pro] échec de l'envoi de l'email de notification:", error);
    }
  } catch (err) {
    console.error("[lead-pro] erreur inattendue lors de l'envoi de l'email:", err);
  }

  return NextResponse.json({ ok: true });
}
