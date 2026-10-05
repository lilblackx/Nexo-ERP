import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/*
 * Tipografía (por qué):
 * - Bricolage Grotesque: grotesca con carácter y buen peso en titulares; evita el aspecto de plantilla de Inter.
 * - Instrument Sans: sobria y muy legible a tamaño de texto, con ñ y tildes bien resueltas.
 * - IBM Plex Mono: cifras tabulares de aspecto contable para tasas, montos y códigos.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexo ERP",
  description: "ERP de escritorio para distribuidoras y mayoristas en Venezuela.",
};

export const viewport: Viewport = {
  themeColor: "#0D47A1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
