import { features } from "@/lib/features";
import { SITE_URL } from "@/lib/config";

export const SITE_NAME = "Nexo ERP";
export const SITE_TITLE = "Nexo ERP: sistema de gestión para distribuidoras en Venezuela";

/** La descripción solo menciona funciones confirmadas (respeta `features`). */
export function siteDescription() {
  const parts = [
    "Sistema de gestión de escritorio para distribuidoras y mayoristas en Venezuela:",
    features.pagoMixto && features.monedasCobro
      ? "cobro mixto en dólares, bolívares, pesos y USDT"
      : features.pagoMixto && "cobro mixto",
    features.vuelto && "con vuelto,",
    features.cajasYUnidades && "inventario por cajas y unidades sueltas,",
    features.cuentasPorCobrarFifo && "cuentas por cobrar,",
    features.comisiones && "comisiones de vendedor.",
    "Para Windows, con SQL Server en tu red local.",
  ].filter(Boolean);
  return parts.join(" ").replace(/\s+/g, " ").replace(/ ,/g, ",");
}

/** Funciones que se listan en el JSON-LD; solo las confirmadas. */
function featureList() {
  return [
    features.pagoMixto && "Cobro mixto con varios métodos y monedas en una factura",
    features.vuelto && "Vuelto registrado en caja o banco",
    features.cajasYUnidades && "Inventario por cajas y unidades sueltas",
    features.tresPrecios && "Tres niveles de precio por producto",
    features.cuentasPorCobrarFifo && "Cuentas por cobrar con abono general y antigüedad de saldos",
    features.compras && "Compras con órdenes, recepciones y facturas",
    features.comisiones && "Comisiones de vendedor",
    features.roles && "Roles y permisos con autorización de supervisor",
    features.auditoria && "Bitácora de auditoría por usuario",
  ].filter(Boolean);
}

/** JSON-LD SoftwareApplication. Sin ratings, precios ni versión: no hay datos reales. */
export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows",
    description: siteDescription(),
    featureList: featureList(),
    inLanguage: "es-VE",
    url: SITE_URL,
  };
}
