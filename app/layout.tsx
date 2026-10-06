import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TITLE, siteDescription, softwareJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";

/*
 * Tipografía de la landing, igual que la página original:
 * - Texto y titulares: Segoe UI (la tipografía de la app en Windows); Inter, autoalojada con next/font,
 *   solo es el respaldo en sistemas sin Segoe UI (Mac, Android, Linux). Ver `fontFamily` en tailwind.config.ts.
 * - Cifras y códigos: JetBrains Mono.
 * `latin` + `latin-ext` cubren la ñ, las tildes y los signos del español.
 */
const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: siteDescription(),
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: siteDescription(),
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: siteDescription(),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0D47A1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd()) }}
        />
      </body>
    </html>
  );
}
