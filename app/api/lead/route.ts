import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema } from "@/lib/lead-schema";
import { buildLeadEmailHtml } from "@/lib/lead-email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadFormSchema.safeParse(body);

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
    // Configuration manquante (RESEND_API_KEY / LEAD_NOTIFICATION_EMAIL non
    // définies, typiquement en développement local). Le lead est accepté côté
    // frontend mais n'est transmis nulle part tant que ces variables
    // d'environnement ne sont pas renseignées — voir le README.
    console.warn(
      "[lead] RESEND_API_KEY ou LEAD_NOTIFICATION_EMAIL manquant : email de notification non envoyé.",
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
      subject: `Nouveau lead rénovation énergétique — ${lead.prenom} ${lead.nom} (${lead.ville})`,
      html: buildLeadEmailHtml(lead, receivedAt),
    });

    if (error) {
      console.error("[lead] échec de l'envoi de l'email de notification:", error);
    }
  } catch (err) {
    // On ne bloque jamais la confirmation affichée au prospect pour un souci
    // d'envoi d'email : la donnée a été validée, seul l'acheminement a échoué.
    // Cette erreur doit être surveillée côté logs Netlify pour ne pas perdre
    // de leads silencieusement.
    console.error("[lead] erreur inattendue lors de l'envoi de l'email:", err);
  }

  // TODO(intégration CRM optionnelle) : en plus (ou à la place) de l'email,
  // brancher ici un envoi vers un CRM/webhook/Airtable/Google Sheets si besoin
  // plus tard, ex. :
  //
  //   await fetch(process.env.CRM_WEBHOOK_URL!, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(lead),
  //   });

  return NextResponse.json({ ok: true });
}
