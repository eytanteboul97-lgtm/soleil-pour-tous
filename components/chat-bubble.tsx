"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Logomark } from "@/components/logomark";
import { cn } from "@/lib/utils";

export function AdvisorAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-night text-white",
        className
      )}
    >
      <Logomark className="h-5 w-5" />
    </span>
  );
}

export function AdvisorBubble({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex items-start gap-3"
    >
      <AdvisorAvatar />
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </motion.div>
  );
}

export function UserBubble({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-[0.95rem] font-medium text-white">
        {children}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3"
    >
      <AdvisorAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-paper px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-mist"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
