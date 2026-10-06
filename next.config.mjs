import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

// Hosting estático (Cloudflare Pages): se exporta a /out. Cloudflare define CF_PAGES=1 durante su build;
// en local se puede probar con STATIC_EXPORT=1.
const staticExport = process.env.STATIC_EXPORT === "1" || process.env.CF_PAGES === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite correr `next dev` y `next build` a la vez sin pisarse (NEXT_DIST=.next-dev).
  distDir: process.env.NEXT_DIST || ".next",
  // Hay otro package-lock.json en una carpeta superior; fijamos la raíz de este proyecto.
  outputFileTracingRoot: root,
  poweredByHeader: false,
  // Las capturas usan un loader propio con variantes WebP pre-generadas (scripts/optimizar-capturas.mjs):
  // funciona igual con exportación estática (no hay optimizador de imágenes en Cloudflare Pages).
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  ...(staticExport ? { output: "export" } : {}),
};
export default nextConfig;
