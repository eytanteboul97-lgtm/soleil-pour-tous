"use client";

import { useEffect } from "react";

// Content above an anchor can still change height shortly after first
// paint — a chat widget revealing its first question, a web font
// swapping in — leaving the browser's one-time native anchor scroll
// mis-positioned. This re-corrects it once things have had time to
// settle, without touching the browser's own (already correct) behavior
// for same-page anchor clicks.
const SETTLE_DELAY_MS = 1200;

export function HashScrollFix() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);

    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    const fontsReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
    let cancelled = false;
    let settleTimeout: ReturnType<typeof setTimeout>;

    fontsReady.then(() => {
      if (cancelled) return;
      scrollToTarget();
      settleTimeout = setTimeout(scrollToTarget, SETTLE_DELAY_MS);
    });

    return () => {
      cancelled = true;
      clearTimeout(settleTimeout);
    };
  }, []);

  return null;
}
