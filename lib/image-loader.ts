/**
 * Loader de next/image para las capturas de la galería (hosting estático: no hay optimizador en el servidor).
 * Usa las variantes WebP que genera scripts/optimizar-capturas.mjs: elige la más cercana por encima del ancho pedido.
 */
const WIDTHS = [960, 1600];

export default function screensLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return src.replace(/\.png$/, `-${w}.webp`);
}
