declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Événements du funnel de qualification — permettent de repérer précisément
// à quelle étape les visiteurs abandonnent (simulation commencée, resultat
// teaser vu, lead généré, intérêt pour la mise en relation RGE). Les noms
// standards Meta sont utilisés quand ils existent, sinon un événement
// personnalisé ("trackCustom").
export function trackSimulationStarted() {
  window.fbq?.("trackCustom", "SimulationStarted");
}

export function trackTeaserViewed() {
  window.fbq?.("trackCustom", "TeaserViewed");
}

// eventId optionnel : transmis aussi à Meta Conversions API côté serveur
// (voir submitEarlyLead dans chat-qualification.tsx et lib/meta-capi.ts)
// pour que Meta fusionne les deux comme un seul événement au lieu de
// compter deux leads.
export function trackLead(eventId?: string) {
  window.fbq?.("track", "Lead", {}, eventId ? { eventID: eventId } : undefined);
}

export function trackRgeInterest() {
  window.fbq?.("trackCustom", "RGEInterest");
}

// Permet de repérer, côté acquisition, la part de visiteurs qui n'ont pas
// encore de projet précis en tête — utile pour juger si un angle publicitaire
// trop générique ("découvrez vos aides") attire un trafic moins qualifié
// qu'un angle ciblé sur un projet (PAC, isolation...).
export function trackProjectUndecided() {
  window.fbq?.("trackCustom", "ProjectUndecided");
}
