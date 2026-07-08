import type { Config } from "tailwindcss";

/**
 * Design tokens for the "Soleil Pour Tous" brand — a distinct identity
 * from the sefa.is site living elsewhere in this repo. Deep night-sky
 * darks for the hero/energy sections, a warm sun gradient for CTAs and
 * trust accents, and an electric "volt" cyan for energy-flow motifs.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#060B17",
          soft: "#0B1226",
          raised: "#111C34",
        },
        sun: {
          50: "#FFF6E9",
          100: "#FFE9C7",
          300: "#FFC24B",
          400: "#FFA51E",
          500: "#FF8A1E",
          600: "#F2680A",
          // Darkened from #C4530A: the original only cleared 4.5:1 (WCAG AA)
          // on pure white — it read as low as 4.27:1 against bg-sun-50 and
          // bg-paper, both of which this token sits on across the site.
          700: "#B84C09",
        },
        volt: {
          300: "#7DF0E0",
          400: "#3FE0D0",
          500: "#22D3C4",
          600: "#0FA89B",
        },
        leaf: {
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
        },
        paper: "#F7F8FC",
        ink: {
          DEFAULT: "#0B1226",
          soft: "#374056",
        },
        mist: "#545C70",
        line: "#E5E8F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(255, 138, 30, 0.55)",
        "glow-volt": "0 0 80px -20px rgba(34, 211, 196, 0.5)",
        card: "0 20px 60px -25px rgba(11, 18, 38, 0.35)",
        "card-sm": "0 10px 30px -15px rgba(11, 18, 38, 0.25)",
      },
      backgroundImage: {
        "sun-radial":
          "radial-gradient(circle at center, #FFE9C7 0%, #FFA51E 45%, transparent 75%)",
        "mesh-night":
          "radial-gradient(circle at 15% 20%, rgba(255,138,30,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 10%, rgba(34,211,196,0.16) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(34,211,196,0.10) 0%, transparent 50%)",
      },
      keyframes: {
        "ray-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1.5deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.05)" },
        },
        "gradient-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "flow-right": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "ray-spin": "ray-spin 30s linear infinite",
        "ray-spin-slow": "ray-spin 60s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "flow-right": "flow-right 3s ease-in-out infinite",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
