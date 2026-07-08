import type { LeadFormValues } from "@/lib/lead-schema";

const TYPE_LOGEMENT_LABELS: Record<LeadFormValues["typeLogement"], string> = {
  maison: "Maison",
  appartement: "Appartement",
  autre: "Autre",
};

const STATUT_LABELS: Record<LeadFormValues["statutOccupation"], string> = {
  proprietaire: "Propriétaire",
  locataire: "Locataire",
};

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 16px;color:#6B7488;font-size:13px;white-space:nowrap;border-bottom:1px solid #E5E8F0;">${label}</td>
      <td style="padding:8px 16px;color:#0B1226;font-size:13px;font-weight:600;border-bottom:1px solid #E5E8F0;">${value}</td>
    </tr>`;
}

export function buildLeadEmailHtml(lead: LeadFormValues, receivedAt: Date) {
  const formattedDate = receivedAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0B1226;padding:24px 28px;border-radius:16px 16px 0 0;">
      <p style="color:#FFA51E;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 6px;">
        Soleil Pour Tous
      </p>
      <h1 style="color:#fff;font-size:20px;margin:0;">
        Nouvelle demande d'étude solaire
      </h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">
        Reçue le ${formattedDate}
      </p>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E8F0;border-top:none;">
      <tbody>
        ${row("Prénom", lead.prenom)}
        ${row("Nom", lead.nom)}
        ${row("Email", lead.email)}
        ${row("Téléphone", lead.telephone)}
        ${row("Adresse", lead.adresse)}
        ${row("Code postal", lead.codePostal)}
        ${row("Ville", lead.ville)}
        ${row("Type de logement", TYPE_LOGEMENT_LABELS[lead.typeLogement])}
        ${row("Statut", STATUT_LABELS[lead.statutOccupation])}
        ${row("Surface de toiture", `${lead.surfaceToiture} m²`)}
        ${row("Facture mensuelle", `${lead.factureMensuelle} €`)}
        ${row("Revenu fiscal de référence", `${lead.revenuFiscal} €`)}
        ${row("Consentement RGPD", "Oui, recueilli à la soumission du formulaire")}
      </tbody>
    </table>
    <p style="color:#6B7488;font-size:12px;padding:16px 4px;">
      Vous pouvez répondre directement à cet email pour contacter le prospect
      — l'adresse de réponse est déjà pré-remplie avec la sienne.
    </p>
  </div>`;
}
