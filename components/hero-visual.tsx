"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, HandCoins, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

function FloatingCard({
  icon,
  label,
  className,
  delay = 0,
}: {
  icon: ReactNode;
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 + delay }}
      className={cn(
        "glass absolute flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-card animate-float",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sun-300">
        {icon}
      </span>
      <span className="whitespace-nowrap text-sm font-semibold text-white">
        {label}
      </span>
    </motion.div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Rotating sun rays behind the scene */}
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 animate-ray-spin-slow opacity-70">
        <div
          className="h-full w-full"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,165,30,0.16) 0deg 4deg, transparent 4deg 18deg)",
            maskImage: "radial-gradient(circle, black 40%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 40%, transparent 72%)",
          }}
        />
      </div>

      {/* Sun core glow */}
      <div className="absolute right-6 top-4 h-28 w-28 rounded-full bg-sun-radial blur-md animate-pulse-glow sm:h-36 sm:w-36" />

      {/* Main glass stage holding the house illustration */}
      <div className="glass absolute inset-[8%] rounded-[2.5rem] shadow-card">
        <HouseIllustration />
      </div>

      <FloatingCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="Économies"
        className="left-[-6%] top-[14%]"
        delay={0}
      />
      <FloatingCard
        icon={<HandCoins className="h-4 w-4" />}
        label="Aides"
        className="right-[-4%] top-[38%]"
        delay={0.6}
      />
      <FloatingCard
        icon={<Zap className="h-4 w-4" />}
        label="Revente surplus"
        className="left-[-8%] bottom-[22%]"
        delay={1.2}
      />
      <FloatingCard
        icon={<ClipboardCheck className="h-4 w-4" />}
        label="Étude gratuite"
        className="right-[2%] bottom-[4%]"
        delay={1.8}
      />
    </div>
  );
}

function HouseIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      role="img"
      aria-label="Illustration d'une maison équipée de panneaux solaires"
    >
      <defs>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B2C52" />
          <stop offset="100%" stopColor="#0B1226" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2FE6D6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0FA89B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#233457" />
          <stop offset="100%" stopColor="#152140" />
        </linearGradient>
        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9C7" />
          <stop offset="100%" stopColor="#FFA51E" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="336" rx="130" ry="14" fill="#000" opacity="0.25" />

      {/* House body */}
      <rect x="90" y="200" width="220" height="132" rx="14" fill="url(#wallGrad)" />

      {/* Door / window glow */}
      <rect x="185" y="252" width="30" height="80" rx="6" fill="#0B1226" />
      <circle cx="240" cy="280" r="16" fill="url(#windowGlow)" opacity="0.9" />
      <circle cx="150" cy="280" r="16" fill="url(#windowGlow)" opacity="0.9" />

      {/* Roof base */}
      <polygon points="70,206 200,120 330,206 300,206 200,144 100,206" fill="url(#roofGrad)" />

      {/* Solar panel grid on the roof */}
      <g transform="translate(200,163) rotate(0)">
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={-96 + col * 50}
              y={-24 + row * 20}
              width="44"
              height="16"
              rx="2"
              fill="url(#panelGrad)"
              stroke="#062B29"
              strokeWidth="1"
              opacity={0.95 - row * 0.08}
            />
          ))
        )}
      </g>

      {/* Sheen line across panels */}
      <polygon points="104,140 320,140 300,170 84,170" fill="#FFFFFF" opacity="0.06" />
    </svg>
  );
}
