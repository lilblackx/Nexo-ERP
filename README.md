# Nexo ERP: landing

Sitio de presentación de **Nexo ERP**, un sistema de gestión de escritorio (Windows + SQL Server en red local) para distribuidoras y mayoristas en Venezuela.

Sitio publicado: https://nexo-erp-dig.pages.dev

La landing es 100% estática: no tiene backend, base de datos ni claves. La conversión es por WhatsApp.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 3 con tokens propios (paleta de la app)
- Radix UI (acordeón) y Lucide (iconos)
- Tipografía con `next/font`: Bricolage Grotesque, Instrument Sans e IBM Plex Mono
- Hosting: Cloudflare Pages (exportación estática)

## Desarrollo

Requisitos: Node 22.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # next lint + tsc --noEmit
npm run build      # build de producción
npm start          # sirve el build de producción
```

Para probar la exportación estática que usa Cloudflare:

```bash
STATIC_EXPORT=1 npx next build   # genera ./out
```

En Windows PowerShell: `$env:STATIC_EXPORT="1"; npx next build`.

## Estructura

```
app/                   Rutas, metadatos, íconos, imagen Open Graph, sitemap y robots
components/
  appframe/            Réplica en código de la interfaz de la app (AppFrame) con datos ficticios
  sections/            Secciones de la página (sin internet, un día con Nexo, cobro mixto, módulos...)
  ui/                  Botón y acordeón
lib/
  config.ts            Contactos (WhatsApp y correo), URL del sitio, navegación. Única fuente de contactos.
  features.ts          Flags de funciones no confirmadas (USDT, logística, Ed25519)
  seo.ts               Metadatos y JSON-LD, respetan los flags
public/
  _headers             Cabeceras de seguridad de Cloudflare
  screens/             Capturas reales (pendientes, ver su README)
docs/                  Auditoría, registro de afirmaciones, pendientes y guía de despliegue
```

## Reglas de contenido

- **Nada inventado.** No hay clientes, testimonios, logos ni cifras de uso. Producto nuevo.
- **Datos de ejemplo.** Pantallas, empresa, tasas y cifras de los mockups son ficticias y se rotulan como tales.
- **Funciones no confirmadas** viven detrás de `lib/features.ts`. Con `false`, no aparecen en ningún sitio: mockups, FAQ, metadatos ni JSON-LD.
- Lo pendiente de confirmar está marcado con `TODO(luis)` en el código y listado en `docs/pendientes.md`.
- Cada afirmación del sitio y su evidencia están en `docs/claims.md`.

## Despliegue

Cloudflare Pages construye con `npm run build` y publica `out/`. Cloudflare define `CF_PAGES=1`, que activa la exportación estática en `next.config.mjs`.

Variables de entorno:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública final, sin barra al final |
| `NODE_VERSION` | `22` |

Guía completa en [`docs/despliegue-cloudflare.md`](docs/despliegue-cloudflare.md).

## Seguridad y datos sensibles

- `public/_headers` aplica CSP restrictiva, `X-Frame-Options: DENY`, HSTS, `nosniff`, `Referrer-Policy` y `Permissions-Policy`.
- Las capturas originales de la app contienen datos reales y **nunca** se versionan ni se sirven: están en `reference/` (local, fuera de git) y en `.gitignore`, igual que los `.docx`, `.env*` y `*.zip`.
- Las capturas que sí se publiquen deben ir sin marca de agua "sesión no comercial", con datos de prueba y sin nombres, correos, teléfonos ni RIF reales (ver `public/screens/README.md`).
- Si agregas scripts de terceros, amplía la CSP en `public/_headers`.

## Calidad

El sitio se verificó con pruebas de navegador (funcionales, responsive en 360 a 1536 px, reduced-motion y accesibilidad con axe) y con un perfil móvil lento (LCP de 1.5 s). Los resultados y el estado actual de los pendientes están en `docs/`.
