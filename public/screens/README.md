# Capturas de la app (galería "La app, tal cual")

Las capturas vienen de la base de demostración (`reference/app/`, local y fuera de git). Esta carpeta guarda las que
se publican. La galería solo muestra una captura si su huella SHA-256 coincide con la aprobada en
`lib/screens-approved.json`; si no, muestra un marcador neutro. Así nunca se publican por error las capturas antiguas
(marca de agua "sesión no comercial", datos personales, nombre previo).

TODO(luis): reemplazar capturas cuando la app se renombre a "Nexo ERP" y se corrijan sus textos
("RIF Empresa", "Iniciar Sesión", "Contraseña", "está en modo solo lectura" y la columna "AGRANEL" → "A granel").

## Nombres esperados (relación fija 16:9, hoy 3200 × 1800)

- `panel-general.png`
- `facturacion.png`
- `tasas-cambio.png` (si falta, la galería acepta `tasa-cambio-brusco.png` para la pestaña "Tasas de cambio")
- `productos.png`
- `comisiones.png`
- `reportes.png`

## Pasos al agregar o cambiar una captura

1. Revisa la captura contra `reference/app/manifest.json` (que sea de la base demo, sin datos reales).
2. Cópiala aquí con el nombre de la lista.
3. `node scripts/aprobar-capturas.mjs` registra su huella.
4. `node scripts/optimizar-capturas.mjs` genera `<nombre>-960.webp` y `<nombre>-1600.webp`, que son las que carga el sitio.
   Los PNG originales no hace falta publicarlos: puedes sacarlos de `public/` después de generar las variantes.
