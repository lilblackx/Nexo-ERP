# Despliegue en Cloudflare Pages

La landing es 100% estática: no tiene backend, base de datos ni claves. Next.js la exporta a `out/`.

## Configuración en Cloudflare
1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → repo `lilblackx/Nexo-ERP`.
2. Production branch: `main`.
3. Build settings:
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
4. Variables de entorno (Production):
   - `NEXT_PUBLIC_SITE_URL` = URL pública final, sin barra al final (por ejemplo `https://nexo-erp.pages.dev` o tu dominio).
   - `NODE_VERSION` = `22` (también está en `.node-version`).
5. Save and Deploy.

Cloudflare define `CF_PAGES=1` durante su build; `next.config.mjs` lo detecta y activa la exportación estática.
No hace falta nada más. Para probar el export en local: `STATIC_EXPORT=1 npx next build` y servir la carpeta `out/`.

## Seguridad
- `public/_headers` agrega: CSP restrictiva, `X-Frame-Options: DENY`, HSTS, `nosniff`, `Referrer-Policy` y `Permissions-Policy`.
- HTTPS y protección DDoS los da Cloudflare.
- Nada de `reference/` ni los `.docx` está en el repo (`.gitignore`).
- Si agregas scripts de terceros (analítica, etc.), hay que ampliar la CSP en `public/_headers`.

## Dominio propio (opcional)
Pages → Custom domains → Set up a domain. Luego actualiza `NEXT_PUBLIC_SITE_URL` y vuelve a desplegar para que
canonical, Open Graph, sitemap y robots apunten al dominio.
