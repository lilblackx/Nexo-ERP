/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite correr `next dev` y `next build` a la vez sin pisarse (NEXT_DIST=.next-dev).
  distDir: process.env.NEXT_DIST || ".next",
  images: { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,
};
export default nextConfig;
