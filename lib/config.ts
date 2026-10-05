/** Líneas de WhatsApp corporativas: solo dígitos con código de país. */
export const CONTACTS = [
  { number: "584126627139", display: "+58 412-6627139" },
  { number: "584246010970", display: "+58 424-6010970" },
] as const;

/** Línea principal: la usan los botones de un solo destino y el formulario. */
export const WHATSAPP_NUMBER = CONTACTS[0].number;

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WA_DEMO = whatsappLink(
  "Hola, quiero agendar una demostración personalizada de Distribuidora DJ para mi empresa.",
);
export const WA_SUPPORT = whatsappLink("Hola, necesito soporte técnico con Distribuidora DJ.");

export const BUILD_VERSION = "v2.4";
export const RELEASE = "Release v2.4.x";

export const NAV_LINKS = [
  { href: "#modulos", label: "Módulos" },
  { href: "#multi-moneda", label: "Multi-Moneda" },
  { href: "#arquitectura", label: "Arquitectura Local" },
  { href: "#casos", label: "Casos de Uso" },
  { href: "#faq", label: "FAQ" },
];
