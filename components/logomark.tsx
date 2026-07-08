"use client";

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
 * blade carries the brand's accent gold; the rest inherit `currentColor` so
 * the mark works on both dark and light backgrounds without a gradient.
 */
function BladesSvg({ style }: { style?: MotionStyle }) {
  return (
    <motion.svg viewBox="0 0 48 48" className="h-full w-full" style={style} aria-hidden="true">
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
