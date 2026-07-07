import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/lead-schema";

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

  // TODO(intégration backend): brancher ici l'envoi du lead vers le système
  // choisi — CRM (HubSpot, Pipedrive...), webhook interne, Airtable,
  // Google Sheets (via Apps Script/API) ou service d'emailing transactionnel
  // (Resend, SendGrid...). Exemple :
  //
  //   await fetch(process.env.CRM_WEBHOOK_URL!, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(lead),
  //   });
  //
  // Ne jamais logguer de données personnelles en production — le
  // console.log ci-dessous est un placeholder de développement uniquement.
  console.log("[lead] nouvelle demande d'étude reçue:", {
    ville: lead.ville,
    codePostal: lead.codePostal,
    typeLogement: lead.typeLogement,
  });

  return NextResponse.json({ ok: true });
}
