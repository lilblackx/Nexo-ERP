import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TITLE, siteDescription, softwareJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";

/*
 * Tipografía de la landing: Inter para titulares y texto, JetBrains Mono para cifras y códigos.
 * Se cargan con next/font (autoalojadas, sin pedir nada a Google en tiempo de ejecución).
 * `latin` + `latin-ext` cubren la ñ, las tildes y los signos del español de Venezuela.
 * Los AppFrame usan la tipografía de la app (Segoe UI / system-ui), sin webfonts adicionales.
 */
const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
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
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd()) }}
        />
      </body>
    </html>
  );
}
