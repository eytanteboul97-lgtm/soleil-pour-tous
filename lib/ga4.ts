declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Miroir des événements envoyés au Meta Pixel (lib/meta-pixel.ts) — mêmes
// étapes du funnel, pour pouvoir comparer les deux sources dans Google
// Analytics 4 et dans Meta Ads Manager. N'envoie rien si gtag.js n'est pas
// chargé (NEXT_PUBLIC_GA4_ID non configuré) — voir app/layout.tsx.
export function trackSimulationStarted() {
  window.gtag?.("event", "simulation_started");
}

export function trackTeaserViewed() {
  window.gtag?.("event", "teaser_viewed");
}

export function trackLead() {
  window.gtag?.("event", "generate_lead");
}

export function trackRgeInterest() {
  window.gtag?.("event", "rge_interest");
}

export function trackProjectUndecided() {
  window.gtag?.("event", "project_undecided");
}
