import type { LeadRgeValues } from "@/lib/lead-rge-schema";
import { TYPE_LOGEMENT_LABELS, TYPE_TRAVAUX_LABELS } from "@/lib/lead-schema";

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 16px;color:#6B7488;font-size:13px;white-space:nowrap;border-bottom:1px solid #E5E8F0;">${label}</td>
      <td style="padding:8px 16px;color:#0B1226;font-size:13px;font-weight:600;border-bottom:1px solid #E5E8F0;">${value}</td>
    </tr>`;
}

export function buildLeadRgeEmailHtml(lead: LeadRgeValues, receivedAt: Date) {
  const formattedDate = receivedAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0B1226;padding:24px 28px;border-radius:16px 16px 0 0;">
      <p style="color:#FFA51E;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 6px;">
        Soleil Pour Tous — Trouver un pro RGE
      </p>
      <h1 style="color:#fff;font-size:20px;margin:0;">
        Nouvelle demande de mise en relation RGE
      </h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">
        Reçue le ${formattedDate}
      </p>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E8F0;border-top:none;">
      <tbody>
        ${row("Travaux souhaités", lead.typeTravaux.map((t) => TYPE_TRAVAUX_LABELS[t]).join(", "))}
        ${row("Type de logement", TYPE_LOGEMENT_LABELS[lead.typeLogement])}
        ${row("Code postal", lead.codePostal)}
        ${row("Prénom", lead.prenom)}
        ${row("Email", lead.email)}
        ${row("Téléphone", lead.telephone)}
        ${row("Consentement RGPD", "Oui, recueilli à la soumission du formulaire")}
      </tbody>
    </table>
    <p style="color:#6B7488;font-size:12px;padding:16px 4px;">
      Demande venant du parcours "Trouver un professionnel RGE" — le
      prospect cherche activement un installateur, pas seulement une
      estimation d'aides. Vous pouvez répondre directement à cet email
      pour le contacter.
    </p>
  </div>`;
}
