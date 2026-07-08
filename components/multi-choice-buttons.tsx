"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function MultiChoiceButtons<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: { value: T; label: string }[];
  values: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const selected = values.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(option.value)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200",
              selected
                ? "border-sun-400 bg-sun-50 text-sun-700 shadow-card-sm"
                : "border-line bg-white text-ink-soft hover:border-sun-300 hover:bg-sun-50/50"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                selected ? "border-sun-500 bg-sun-500 text-white" : "border-line bg-white"
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            </span>
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
