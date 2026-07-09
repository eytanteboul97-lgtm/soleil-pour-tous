"use client";

import { useId } from "react";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

const BLADE_COUNT = 6;
const RADIUS_INNER = 7;
const RADIUS_OUTER = 18;
const CENTER = 24;
const STROKE_WIDTH = 6.5;
const ACCENT_INDEX = 0;

function bladeLine(index: number) {
  const angleDeg = (360 / BLADE_COUNT) * index;
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x1: CENTER + RADIUS_INNER * cos,
    y1: CENTER + RADIUS_INNER * sin,
    x2: CENTER + RADIUS_OUTER * cos,
    y2: CENTER + RADIUS_OUTER * sin,
  };
}

const BLADES = Array.from({ length: BLADE_COUNT }, (_, i) => bladeLine(i));

/**
 * Abstract radial mark — six rounded blades read at once as sun rays and as
 * a photovoltaic cell grid, deliberately avoiding a literal sun glyph. One
 * blade carries the brand's accent gold with a soft glow behind it; the rest
 * are lit with a consistent top-left highlight so every blade reads as a
 * glossy capsule rather than a flat line, matching the depth used elsewhere
 * on the site (glass cards, glows, gradients) instead of sitting flat next
 * to it.
 */
function BladesSvg({ style }: { style?: MotionStyle }) {
  const uid = useId();
  const neutralGradId = `${uid}-neutral`;
  const accentGradId = `${uid}-accent`;
  const glowId = `${uid}-glow`;
  const haloId = `${uid}-halo`;
  const liftId = `${uid}-lift`;

  return (
    <motion.svg viewBox="0 0 48 48" className="h-full w-full" style={style} aria-hidden="true">
      <defs>
        <linearGradient
          id={neutralGradId}
          x1="6"
          y1="4"
          x2="42"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient
          id={accentGradId}
          x1="24"
          y1="6"
          x2="24"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFE9C7" />
          <stop offset="55%" stopColor="#FFA51E" />
          <stop offset="100%" stopColor="#F2680A" />
        </linearGradient>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id={haloId} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter id={liftId} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Faint warm halo behind the whole mark, then a tighter glow just
          behind the accent blade — two radii of the same light source. */}
      <g filter={`url(#${haloId})`} opacity={0.35}>
        {BLADES.map((b, i) => (
          <line
            key={i}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke={i === ACCENT_INDEX ? "#FFA51E" : "currentColor"}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        ))}
      </g>
      <line
        x1={BLADES[ACCENT_INDEX].x1}
        y1={BLADES[ACCENT_INDEX].y1}
        x2={BLADES[ACCENT_INDEX].x2}
        y2={BLADES[ACCENT_INDEX].y2}
        stroke="#FFA51E"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
        opacity={0.75}
      />

      <g filter={`url(#${liftId})`}>
        {BLADES.map((b, i) => (
          <line
            key={i}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke={i === ACCENT_INDEX ? `url(#${accentGradId})` : `url(#${neutralGradId})`}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        ))}
      </g>
    </motion.svg>
  );
}

// Isolated so the scroll listener + transform (useScroll/useTransform) only
// ever mounts for the one instance that actually reacts to scroll (the
// navbar) — every other Logomark (footer, legal-page headers, the analyzing
// sequence) renders a plain static SVG with zero scroll-tracking overhead.
function ScrollReactiveBlades() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  return <BladesSvg style={{ rotate }} />;
}

export function Logomark({
  className,
  reactToScroll = false,
}: {
  className?: string;
  reactToScroll?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("inline-flex", className)}
    >
      {reactToScroll ? <ScrollReactiveBlades /> : <BladesSvg />}
    </motion.div>
  );
}
