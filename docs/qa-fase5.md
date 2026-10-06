# QA (Fase 5)

Medido sobre el build de producción servido en local, con Chrome y Playwright (fuera del repositorio).

## Rendimiento
Perfil "4G lento" (1.6 Mbps de bajada, 150 ms de latencia) y CPU 4 veces más lenta:

| Vista | LCP | CLS |
|---|---|---|
| Móvil 390 px | 1.3 s | 0 |
| Escritorio 1280 px | 1.3 s | 0.001 |

- El elemento más grande que se pinta es el titular (texto); los AppFrame no bloquean el LCP: se miden y escalan después de hidratar.
- Las secciones interactivas se cargan con `dynamic()`, los recortes de móvil del recorrido "Un día" se montan solo al acercarse
  (`LazyMount`) y las secciones bajo el pliegue usan `content-visibility: auto`.
- Galería: variantes WebP de 960 y 1600 px (≈ 20 a 70 KB cada una) con `next/image` y un loader propio.
  La exportación estática de Cloudflare no tiene optimizador de imágenes, por eso las variantes se pregeneran
  (`scripts/optimizar-capturas.mjs`). AVIF solo sería posible con un hosting con optimizador.

## Accesibilidad
- axe-core (WCAG 2 A y AA, 2.1 AA y buenas prácticas) en 390 y 1280 px: 0 violaciones.
- Landmarks (header, nav, main, footer), enlace "Saltar al contenido", foco visible, pestañas con flechas (módulos y galería),
  `aria-pressed` en el interruptor de internet, región `role="status"` en el cobro mixto.
- Los AppFrame son decorativos (`aria-hidden` + `inert`) con `<figcaption>` que los resume.
- `prefers-reduced-motion`: el interruptor sigue funcionando, no hay avance automático de renglones (hay un botón manual),
  y los trazos y entradas quedan estáticos.

## Responsive
Sin desbordamiento horizontal de la página en 360, 390, 768, 1280 y 1536 px (las tiras de pestañas de módulos y capturas
hacen scroll dentro de su contenedor). En móvil, los AppFrame muestran recortes legibles (`mobileFocus`) y el recorrido
"Un día" deja de ser sticky.

## Comparación de los AppFrame con las capturas de la app
Se compararon a mano contra `reference/app/`: Panel General, Facturación (listado y "Nueva Factura" en ambas pestañas),
autorización del supervisor, Tasas de Cambio (registro y cambio brusco), Compras, Productos, Cuentas por Cobrar (con abono
general), Reportes, Comisiones, Auditoría. Diferencias intencionales:
- La columna "AGRANEL" se muestra como "Sueltas" (TODO(luis): corregir en la app antes de recapturar).
- Las tasas son las de ejemplo y la brecha termina en 11.3 %, igual que las capturas.
- Reportes no muestra la fila de FV-000012 con saldo $0.00 (su saldo vive en la cuenta BCV, que no se destaca).
- Facturación: la columna TOTAL muestra el subtotal, como la app (FV-000012: $726.00).
- La barra de título dice "Nexo ERP" (TODO(luis): renombrar la app antes de recapturar).

## Build
`npm run build`, `next lint` y `tsc --noEmit` sin errores. La exportación estática (`STATIC_EXPORT=1`) genera `index.html`,
las variantes de las capturas y `_headers`. `node scripts/verificar-demo.mjs`: todas las verificaciones correctas.
