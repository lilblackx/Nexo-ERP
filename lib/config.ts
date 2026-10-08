/** Líneas de WhatsApp corporativas: solo dígitos con código de país. Única fuente de números del sitio. */
export const CONTACTS = [
  { number: "584126627139", display: "+58 412-6627139" },
  { number: "584246010970", display: "+58 424-6010970" },
] as const;

/** Correo de contacto. Única fuente del correo en el sitio. */
export const CONTACT_EMAIL = "luisangelfd18@gmail.com";

/** Línea principal: la usan los botones de un solo destino. */
export const WHATSAPP_NUMBER = CONTACTS[0].number;

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WA_DEMO = whatsappLink("Hola, quiero ver una demostración de Nexo ERP.");
export const WA_SUPPORT = whatsappLink("Hola, tengo una consulta sobre Nexo ERP.");

/** TODO(luis): definir el dominio final. Se usa para canonical, Open Graph, sitemap y robots. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.CF_PAGES_URL ??
  "http://localhost:3000"
).replace(/\/+$/, "");

export const NAV_LINKS = [
  { href: "#sin-internet", label: "Sin internet" },
  { href: "#dia", label: "Un día" },
  { href: "#cobro", label: "Cobro mixto" },
  { href: "#modulos", label: "Módulos" },
  { href: "#red", label: "Red local" },
  { href: "#preguntas", label: "Preguntas" },
];
