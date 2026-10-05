/** Líneas de WhatsApp corporativas: solo dígitos con código de país. Única fuente de números del sitio. */
export const CONTACTS = [
  { number: "584126627139", display: "+58 412-6627139" },
  { number: "584246010970", display: "+58 424-6010970" },
] as const;

/** Línea principal: la usan los botones de un solo destino. */
export const WHATSAPP_NUMBER = CONTACTS[0].number;

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WA_DEMO = whatsappLink("Hola, quiero ver una demostración de Nexo ERP.");
export const WA_SUPPORT = whatsappLink("Hola, tengo una consulta sobre Nexo ERP.");

/** TODO(luis): definir el dominio final. Se usa para canonical, Open Graph, sitemap y robots. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Las capturas reales van en /public/screens/ (ver public/screens/README.md).
 * Mientras sea false, la sección de capturas no se renderiza.
 * TODO(luis): poner en true cuando estén las 6 capturas limpias y en alta resolución.
 */
export const REAL_SCREENSHOTS_READY = false;

export const NAV_LINKS = [
  { href: "#dia", label: "Un día con Nexo" },
  { href: "#cobro", label: "Cobro mixto" },
  { href: "#modulos", label: "Módulos" },
  { href: "#red", label: "Red local" },
  { href: "#preguntas", label: "Preguntas" },
];
