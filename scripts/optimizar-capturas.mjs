/**
 * Genera las variantes WebP responsivas de las capturas aprobadas (public/screens/<nombre>-960.webp y -1600.webp).
 * La galería las pide con lib/image-loader.ts. Los PNG originales no hace falta publicarlos: puedes borrarlos
 * de public/ después de generar las variantes (déjalos en otra carpeta si quieres conservarlos).
 *
 * Uso: node scripts/optimizar-capturas.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const approved = JSON.parse(readFileSync(join(root, "lib/screens-approved.json"), "utf8"));
const WIDTHS = [960, 1600];

for (const file of Object.keys(approved)) {
  const src = join(root, "public/screens", file);
  if (!existsSync(src)) continue;
  for (const w of WIDTHS) {
    const out = src.replace(/\.png$/, `-${w}.webp`);
    await sharp(src).resize({ width: w }).webp({ quality: 82 }).toFile(out);
    console.log("ok", out.slice(root.length + 1));
  }
}
