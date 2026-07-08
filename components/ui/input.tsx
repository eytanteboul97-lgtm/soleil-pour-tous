"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  /** Retour instantané "ce champ a l'air correct", indépendant des erreurs
   * de validation (qui n'apparaissent qu'après avoir quitté le champ). */
  valid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, valid, ...props }, ref) => {
    const showCheck = valid && !error;
    return (
      <div className="relative">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-xl border bg-white px-4 text-[0.95rem] text-ink placeholder:text-mist/70 transition-colors focus:outline-none focus:ring-2 focus:ring-sun-400/50 focus:border-sun-400 disabled:cursor-not-allowed disabled:opacity-50",
            showCheck && "pr-10",
            error ? "border-red-400" : showCheck ? "border-leaf-500" : "border-line",
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {showCheck && (
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-leaf-500"
            >
              <Check className="h-5 w-5" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
