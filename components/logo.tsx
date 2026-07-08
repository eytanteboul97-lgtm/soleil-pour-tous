"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logomark } from "@/components/logomark";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  reactToScroll = false,
  theme = "dark",
}: {
  className?: string;
  reactToScroll?: boolean;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-3",
        isDark ? "text-white" : "text-ink",
        className
      )}
    >
      <motion.span
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-shadow duration-300 group-hover:shadow-glow",
          isDark ? "border-white/10 bg-night-raised" : "border-line bg-white"
        )}
      >
        <Logomark className="h-6 w-6" reactToScroll={reactToScroll} />
      </motion.span>
      <span className="font-display text-lg leading-none tracking-tight">
        <span className="font-bold">Soleil</span>{" "}
        <span className={cn("font-medium", isDark ? "text-white/70" : "text-ink-soft")}>
          Pour Tous
        </span>
      </span>
    </Link>
  );
}
