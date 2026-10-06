import type { Config } from "tailwindcss";

/**
 * Sistema de diseño de Nexo ERP.
 * La paleta es la de la app (tema claro). `primary.deep` y `tint.*` son tonos
 * derivados de la misma familia azul para secciones a sangre y superficies tenues.
 * `success.text` y `warning.text` son variantes oscuras solo para texto pequeño (AA sobre blanco).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1280px" },
    },
    // Radios chicos y planos: de 2 a 6 px. Nada de esquinas de píldora salvo `full`.
    borderRadius: {
      none: "0",
      sm: "2px",
      DEFAULT: "3px",
      md: "4px",
      lg: "6px",
      xl: "6px",
      "2xl": "6px",
      "3xl": "6px",
      full: "9999px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D47A1",
          dark: "#0A3A83",
          light: "#1565C0",
          hover: "#0B4F9F",
          deep: "#072B63",
        },
        tint: { 50: "#EFF6FF", 100: "#DBE7F7", 200: "#B7CDEE", 300: "#8FB0E2" },
        page: "#F8FAFC",
        card: "#FFFFFF",
        line: "#CBD5E1",
        field: "#F1F5F9",
        thead: "#E2E8F0",
        rowhover: "#EFF6FF",
        fg: {
          DEFAULT: "#1E293B",
          slate: "#334155",
          medium: "#475569",
          muted: "#64748B",
          light: "#94A3B8",
        },
        success: { DEFAULT: "#16A34A", bg: "#DCFCE7", text: "#15803D" },
        warning: { DEFAULT: "#D97706", bg: "#FEF3C7", text: "#B45309" },
        danger: { DEFAULT: "#DC2626", bg: "#FEE2E2", text: "#B91C1C" },
        info: { DEFAULT: "#0284C7", bg: "#EFF6FF", text: "#0369A1" },
      },
      // Segoe UI (la tipografía de la app en Windows) con Inter de respaldo; JetBrains Mono para cifras y códigos.
      // `display` es un alias de `sans`.
      fontFamily: {
        display: ['"Segoe UI"', "var(--font-inter)", "Arial", "sans-serif"],
        sans: ['"Segoe UI"', "var(--font-inter)", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // Escala fluida: gran contraste entre titular, subtítulo y texto.
      fontSize: {
        display: [
          "clamp(2.5rem, 1.35rem + 5vw, 5.25rem)",
          { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        h2: [
          "clamp(1.875rem, 1.25rem + 2.6vw, 3.5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.028em", fontWeight: "700" },
        ],
        h3: [
          "clamp(1.25rem, 1.1rem + 0.65vw, 1.75rem)",
          { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        lead: ["clamp(1.0625rem, 1rem + 0.3vw, 1.3125rem)", { lineHeight: "1.5" }],
        body: ["clamp(1rem, 0.97rem + 0.12vw, 1.0625rem)", { lineHeight: "1.6" }],
      },
      transitionTimingFunction: {
        nexo: "cubic-bezier(0.22, 0.8, 0.24, 1)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
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
        rise: "rise 560ms cubic-bezier(0.22, 0.8, 0.24, 1) both",
        fade: "fade 320ms cubic-bezier(0.22, 0.8, 0.24, 1) both",
        "accordion-down": "accordion-down 260ms cubic-bezier(0.22, 0.8, 0.24, 1)",
        "accordion-up": "accordion-up 260ms cubic-bezier(0.22, 0.8, 0.24, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
