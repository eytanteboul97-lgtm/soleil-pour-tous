"use client";

import { useEffect } from "react";

// Content above an anchor can still change height shortly after first
// paint — a chat widget revealing its first question, a web font
// swapping in — leaving the browser's one-time native anchor scroll
// mis-positioned. This re-corrects it once things have had time to
// settle, without touching the browser's own (already correct) behavior
// for same-page anchor clicks.
//
// The delayed correction only fires if the visitor hasn't touched the
// page since the initial jump. Without this guard, a visitor who lands
// on a #eligibilite deep link (e.g. from an ad) and immediately starts
// typing their first answer would get yanked back to the top of the
// section mid-keystroke by our own "fix" — worse than the bug it solves.
const SETTLE_DELAY_MS = 1200;
// Deliberately excludes "scroll": our own corrective scrollIntoView() call
// fires scroll events too, which would immediately (and wrongly) flag
// itself as "the user interacted" and suppress the follow-up correction.
// These four are only ever dispatched by an actual user action.
const INTERACTION_EVENTS = ["keydown", "pointerdown", "wheel", "touchstart"] as const;

export function HashScrollFix() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);

    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    let userInteracted = false;
    const markInteracted = () => {
      userInteracted = true;
    };
    INTERACTION_EVENTS.forEach((event) =>
      window.addEventListener(event, markInteracted, { passive: true })
    );

    const fontsReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
    let cancelled = false;
    let settleTimeout: ReturnType<typeof setTimeout>;

    fontsReady.then(() => {
      if (cancelled) return;
      // The very first correction runs immediately after fonts settle,
      // before the visitor has had a real chance to act — safe to force.
      scrollToTarget();
      settleTimeout = setTimeout(() => {
        if (!userInteracted) scrollToTarget();
      }, SETTLE_DELAY_MS);
    });

    return () => {
      cancelled = true;
      clearTimeout(settleTimeout);
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, markInteracted)
      );
    };
  }, []);

  return null;
}
