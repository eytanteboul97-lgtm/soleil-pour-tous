"use client";

// Sauvegarde locale (jamais envoyée nulle part) de la progression du
// formulaire de qualification, pour reprendre automatiquement là où le
// visiteur s'était arrêté s'il quitte la page puis revient.
const STORAGE_KEY = "soleil:lead-progress";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours — au-delà, on repart à zéro.

export type PersistedProgress<TValues, TScreen> = {
  completed: TScreen[];
  values: TValues;
  savedAt: number;
};

export function loadProgress<TValues, TScreen>(): PersistedProgress<TValues, TScreen> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedProgress<TValues, TScreen>;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    if (!Array.isArray(parsed.completed) || parsed.completed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProgress<TValues, TScreen>(
  data: Omit<PersistedProgress<TValues, TScreen>, "savedAt">
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
  } catch {
    // Stockage indisponible (navigation privée, quota plein) — on continue
    // simplement sans sauvegarde, ce n'est jamais bloquant pour l'utilisateur.
  }
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
