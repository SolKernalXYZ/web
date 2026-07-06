import type { Config } from "tailwindcss";

/**
 * SolKernal Design System — "The Kernel"
 * A premium developer-tool aesthetic: monochrome-forward, terminal-native,
 * with a single Solana-violet accent for brand/interaction and a green for
 * positive financial (yield) states. All color is token-driven via CSS
 * variables (see globals.css) so light + dark themes share one source of truth.
 */

// rgb(var(--token) / <alpha-value>) lets us use opacity utilities on tokens.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ── Color tokens ────────────────────────────────────────────────
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000000",
      bg: {
        primary: v("bg-primary"),
        subtle: v("bg-subtle"),
        hover: v("bg-hover"),
        elevated: v("bg-elevated"),
        inverse: v("bg-inverse"),
      },
      text: {
        primary: v("text-primary"),
        secondary: v("text-secondary"),
        tertiary: v("text-tertiary"),
        inverse: v("text-inverse"),
      },
      border: {
        DEFAULT: v("border"),
        subtle: v("border-subtle"),
        focused: v("border-focused"),
        strong: v("border-strong"),
      },
      accent: {
        DEFAULT: v("accent"),
        hover: v("accent-hover"),
        subtle: v("accent-subtle"),
        text: v("accent-text"),
      },
      success: {
        DEFAULT: v("success"),
        subtle: v("success-subtle"),
      },
      warning: {
        DEFAULT: v("warning"),
        subtle: v("warning-subtle"),
      },
      danger: {
        DEFAULT: v("danger"),
        subtle: v("danger-subtle"),
      },
      link: v("accent"),
    },

    // ── Typography ──────────────────────────────────────────────────
    fontFamily: {
      sans: ["var(--font-inter)", "system-ui", "Helvetica Neue", "sans-serif"],
      mono: ["var(--font-jetbrains)", "ui-monospace", "Fira Code", "monospace"],
    },
    fontSize: {
      // Fluid display sizes for premium hero/section headings.
      display: ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "700" }],
      "display-sm": ["clamp(2rem, 4.5vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
      h1: ["clamp(1.75rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
      h2: ["clamp(1.375rem, 2vw, 1.625rem)", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" }],
      h3: ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
      "body-lg": ["1.0625rem", { lineHeight: "1.65", fontWeight: "400" }],
      body: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
      small: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
      tiny: ["0.6875rem", { lineHeight: "1.45", fontWeight: "500" }],
      mono: ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
      "mono-sm": ["0.6875rem", { lineHeight: "1.4", fontWeight: "400" }],
    },

    // ── Radii (sharp, terminal-leaning but refined) ─────────────────
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "6px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      "2xl": "24px",
      tag: "4px",
      full: "9999px",
    },

    // ── Elevation ───────────────────────────────────────────────────
    boxShadow: {
      none: "none",
      sm: "var(--shadow-sm)",
      DEFAULT: "var(--shadow)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      glow: "0 0 0 1px rgb(var(--accent) / 0.4), 0 0 24px -4px rgb(var(--accent) / 0.45)",
      "inner-line": "inset 0 1px 0 0 rgb(var(--border-subtle) / 0.6)",
    },

    extend: {
      spacing: {
        // Named section rhythm on the 8px grid.
        section: "5.5rem", // 88px
        "section-lg": "7.5rem", // 120px
      },
      maxWidth: {
        content: "1120px",
        prose: "680px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #9945FF 0%, #7C3AED 45%, #14F195 130%)",
        "accent-fade":
          "linear-gradient(180deg, rgb(var(--accent) / 0.12), transparent)",
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.5" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-20" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.5s ease both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 1.2s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
        blink: "blink 1.1s step-end infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
        "dash-flow": "dash-flow 1s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
