"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function LeadFormSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-card"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </span>
      <h3 className="mt-6 font-display text-2xl font-bold text-ink">
        Merci, votre demande a bien été envoyée.
      </h3>
      <p className="mt-3 max-w-sm text-mist">
        Un conseiller Soleil Pour Tous vous contactera rapidement pour
        confirmer votre éligibilité.
      </p>
      <p className="mt-4 text-xs text-mist/70">
        Aucune aide n&apos;est garantie avant validation complète de votre
        dossier.
      </p>
    </motion.div>
  );
}
