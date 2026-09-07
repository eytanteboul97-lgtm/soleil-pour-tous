import type { LeadProValues } from "@/lib/lead-pro-schema";
import { STRUCTURE_TYPE_LABELS } from "@/lib/lead-pro-schema";

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 16px;color:#6B7488;font-size:13px;white-space:nowrap;border-bottom:1px solid #E5E8F0;">${label}</td>
      <td style="padding:8px 16px;color:#0B1226;font-size:13px;font-weight:600;border-bottom:1px solid #E5E8F0;">${value}</td>
    </tr>`;
}

export function buildLeadProEmailHtml(lead: LeadProValues, receivedAt: Date) {
  const formattedDate = receivedAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0B1226;padding:24px 28px;border-radius:16px 16px 0 0;">
      <p style="color:#FFA51E;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 6px;">
        Soleil Pour Tous — Professionnels
      </p>
      <h1 style="color:#fff;font-size:20px;margin:0;">
        Nouvelle demande d&#39;aides énergétiques entreprise
      </h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">
        Reçue le ${formattedDate}
      </p>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E8F0;border-top:none;">
      <tbody>
        ${row("Type de structure", STRUCTURE_TYPE_LABELS[lead.typeStructure])}
        ${row("Nom de la structure", lead.nomStructure)}
        ${row("Contact", `${lead.prenom} ${lead.nom}`)}
        ${row("Email", lead.email)}
        ${row("Téléphone", lead.telephone)}
        ${row("Code postal", lead.codePostal)}
        ${lead.besoin ? row("Besoin décrit", lead.besoin) : ""}
        ${row("Consentement RGPD", "Oui, recueilli à la soumission du formulaire")}
      </tbody>
    </table>
    <p style="color:#6B7488;font-size:12px;padding:16px 4px;">
      Vous pouvez répondre directement à cet email pour contacter le prospect
      — l&#39;adresse de réponse est déjà pré-remplie avec la sienne.
    </p>
  </div>`;
}
