/**
 * Registra la huella (SHA-256) de las capturas de public/screens/ que Luis aprobó, en lib/screens-approved.json.
 * La galería "La app, tal cual" solo muestra una captura si su huella coincide: así nunca se muestran por error
 * las capturas antiguas (marca de agua, datos personales, nombre previo).
 *
 * Antes de correrlo: revisa las capturas contra reference/app/manifest.json y cópialas a public/screens/
 * con los nombres de lib/screens.ts. Después: node scripts/aprobar-capturas.mjs && node scripts/optimizar-capturas.mjs
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = [
  "panel-general.png",
  "facturacion.png",
  "tasas-cambio.png",
  "tasa-cambio-brusco.png",
  "productos.png",
  "comisiones.png",
  "reportes.png",
];

const approved = {};
for (const f of FILES) {
  const p = join(root, "public/screens", f);
  if (!existsSync(p)) continue;
  approved[f] = createHash("sha256").update(readFileSync(p)).digest("hex");
  console.log("aprobada", f, approved[f].slice(0, 12));
}
writeFileSync(join(root, "lib/screens-approved.json"), JSON.stringify(approved, null, 2) + "\n", "utf8");
