/**
 * Funciones cuya existencia no está confirmada. Con `false`, la afirmación no
 * aparece en ningún sitio: mockups, FAQ, metadata ni JSON-LD.
 */
export const features = {
  pagoMovil: true,
  pagoMixto: true,
  vuelto: true,
  usdt: false, // TODO(luis): confirmar
  logistica: false, // TODO(luis): confirmar
  ed25519: false, // TODO(luis): confirmar
} as const;
