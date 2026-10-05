import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite correr `next dev` y `next build` a la vez sin pisarse (NEXT_DIST=.next-dev).
  distDir: process.env.NEXT_DIST || ".next",
  // Hay otro package-lock.json en una carpeta superior; fijamos la raíz de este proyecto.
  outputFileTracingRoot: root,
  images: { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,
};
export default nextConfig;
