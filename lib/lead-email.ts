import type { LeadFormValues } from "@/lib/lead-schema";
import {
  DISPONIBILITE_LABELS,
  NOMBRE_PERSONNES_LABELS,
  ORIENTATION_LABELS,
  STATUT_LABELS,
  TYPE_CHAUFFAGE_LABELS,
  TYPE_LOGEMENT_LABELS,
  TYPE_TRAVAUX_LABELS,
} from "@/lib/lead-schema";

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

  const roofRows = lead.typeTravaux.includes("photovoltaique")
    ? `${row("Surface de toiture", `${lead.surfaceToiture} m²`)}
       ${row("Orientation du toit", lead.orientationToit ? ORIENTATION_LABELS[lead.orientationToit] : "Non renseignée")}`
    : "";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0B1226;padding:24px 28px;border-radius:16px 16px 0 0;">
      <p style="color:#FFA51E;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 6px;">
        HABINNOVA — via Soleil Pour Tous
      </p>
      <h1 style="color:#fff;font-size:20px;margin:0;">
        Nouvelle demande de travaux de rénovation énergétique
      </h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">
        Reçue le ${formattedDate}
      </p>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E8F0;border-top:none;">
      <tbody>
        ${row("Travaux souhaités", lead.typeTravaux.map((t) => TYPE_TRAVAUX_LABELS[t]).join(", "))}
        ${row("Prénom", lead.prenom)}
        ${row("Nom", lead.nom)}
        ${row("Email", lead.email)}
        ${row("Téléphone", lead.telephone)}
        ${row("Adresse", lead.adresse)}
        ${row("Code postal", lead.codePostal)}
        ${row("Ville", lead.ville)}
        ${row("Type de logement", TYPE_LOGEMENT_LABELS[lead.typeLogement])}
        ${row("Statut", STATUT_LABELS[lead.statutOccupation])}
        ${row("Personnes au foyer", NOMBRE_PERSONNES_LABELS[lead.nombrePersonnes])}
        ${row("Chauffage actuel", TYPE_CHAUFFAGE_LABELS[lead.typeChauffage])}
        ${roofRows}
        ${row("Facture mensuelle", `${lead.factureMensuelle} €`)}
        ${row("Revenu fiscal de référence", `${lead.revenuFiscal} €`)}
        ${row("Disponibilité pour être rappelé(e)", DISPONIBILITE_LABELS[lead.disponibiliteRappel])}
        ${row("Consentement RGPD", "Oui, recueilli à la soumission du formulaire")}
      </tbody>
    </table>
    <p style="color:#6B7488;font-size:12px;padding:16px 4px;">
      Vous pouvez répondre directement à cet email pour contacter le prospect
      — l'adresse de réponse est déjà pré-remplie avec la sienne.
    </p>
  </div>`;
}
