import { features } from "@/lib/features";
import { SITE_URL } from "@/lib/config";

export const SITE_NAME = "Nexo ERP";
export const SITE_TITLE = "Nexo ERP: sistema de gestión para distribuidoras en Venezuela";

/** La descripción solo menciona funciones confirmadas (respeta `features`). */
export function siteDescription() {
  const pagos = [
    features.pagoMixto && "facturación con pago mixto",
    features.pagoMovil && "pago móvil",
  ].filter(Boolean);
  const parts = [
    "Sistema de gestión de escritorio para distribuidoras y mayoristas.",
    pagos.length ? `Incluye ${pagos.join(" y ")},` : "Incluye",
    "inventario por cajas, cuentas por cobrar y por pagar, comisiones y tasas BCV y paralelo.",
    "Funciona sobre SQL Server en tu red local.",
  ];
  return parts.join(" ").replace(/\s+/g, " ");
}

/** JSON-LD SoftwareApplication. Sin ratings ni precios: no hay datos reales. */
export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows",
    description: siteDescription(),
    inLanguage: "es-VE",
    url: SITE_URL,
  };
}
