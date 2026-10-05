import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Paleta oficial de la app Distribuidora DJ (tema claro).
 * Los tokens `success-text` y `warning-text` son variantes más oscuras de
 * success/warning, solo para texto pequeño (cumplen contraste AA sobre blanco).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Azul corporativo
        primary: {
          DEFAULT: "#0D47A1",
          dark: "#0A3A83", // pressed
          light: "#1565C0", // hover / activo
          hover: "#0B4F9F", // hover en sidebar
        },
        // Fondos y bordes
        page: "#F8FAFC",
        card: "#FFFFFF",
        line: "#CBD5E1",
        field: "#F1F5F9",
        thead: "#E2E8F0",
        rowhover: "#EFF6FF",
        // Texto
        fg: {
          DEFAULT: "#1E293B",
          slate: "#334155",
          medium: "#475569",
          muted: "#64748B",
          light: "#94A3B8",
        },
        // Estados
        success: { DEFAULT: "#16A34A", bg: "#DCFCE7", text: "#15803D" },
        warning: { DEFAULT: "#D97706", bg: "#FEF3C7", text: "#B45309" },
        danger: { DEFAULT: "#DC2626", bg: "#FEE2E2" },
        info: { DEFAULT: "#0284C7", bg: "#EFF6FF" },
      },
      fontFamily: {
        // Segoe UI = tipografía de la app en Windows; Inter como respaldo en otros sistemas.
        sans: ['"Segoe UI"', "var(--font-inter)", "Arial", "sans-serif"],
        mono: [
          "var(--font-jetbrains)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        window:
          "0 0 0 1px rgb(203 213 225 / 1), 0 24px 48px -16px rgb(15 23 42 / 0.18), 0 48px 100px -32px rgb(13 71 161 / 0.28)",
        btn: "0 8px 20px -8px rgb(13 71 161 / 0.55)",
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.04)",
        "card-hover": "0 12px 28px -12px rgb(13 71 161 / 0.22)",
        inset: "none",
      },
      backgroundImage: {
        "grid-slate":
          "linear-gradient(to right, rgb(100 116 139 / 0.10) 1px, transparent 1px), linear-gradient(to bottom, rgb(100 116 139 / 0.10) 1px, transparent 1px)",
        "radial-cobalt":
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgb(21 101 192 / 0.14), transparent 70%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        dash: {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "ping-soft": "ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        dash: "dash 1.2s linear infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
