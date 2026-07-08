"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ChoiceButtons<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { value: T; label: string }[];
  value?: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            aria-pressed={selected}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400 focus-visible:ring-offset-2",
              selected
                ? "border-sun-400 bg-sun-50 text-sun-700 shadow-card-sm"
                : "border-line bg-white text-ink-soft hover:border-sun-300 hover:bg-sun-50/50 active:bg-sun-50"
            )}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
