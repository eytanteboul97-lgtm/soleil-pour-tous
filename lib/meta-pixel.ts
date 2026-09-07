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

export function trackLead() {
  window.fbq?.("track", "Lead");
}

export function trackRgeInterest() {
  window.fbq?.("trackCustom", "RGEInterest");
}
