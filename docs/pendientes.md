# Pendientes antes de publicar

## Flags en `lib/features.ts` (confirmar para activar)
- `usdt`: hoy `false`. Con `true` se habilita la fila de USDT como método de pago en los mockups.
- `logistica`: hoy `false`. Rutas, mapa y despacho no aparecen en ningún sitio.
- `ed25519`: hoy `false`. Con `true` aparecen la terminal de licencia y el texto de verificación.

## Afirmaciones por confirmar (buscar `TODO(luis)` en el código)
- Flujo real del pago móvil: si hay referencia, verificación bancaria, o registro manual. El FAQ solo dice que se registra como método de pago.
- Pantalla de cobro con pago mixto: el diseño del diálogo es ilustrativo (no hay captura). Reemplazar con la pantalla real.
- Si el cobro aplica la tasa del día a la parte en bolívares (capítulo 4 de "Un día con Nexo").
- COP: hoy solo es tasa de referencia, no método de cobro.
- Qué incluye "Cuentas por Cobrar BCV".
- Alcance real de la implementación: instalación, capacitación, migración desde Excel u otro sistema, soporte.
- Respuestas del FAQ: respaldos y restauración, capacidad (cuántas cajas y usuarios), impresoras y soporte fiscal, licencia (modelo, precio, renovación).
- Soporte fiscal (SENIAT, máquina fiscal): hoy no se menciona. Es una pregunta probable de un dueño de distribuidora.
- Si hay soporte para sucursales: hoy no se dibuja ninguna en el plano de la LAN.
- Qué eventos registra Auditoría y qué otros reportes existen.
- Aviso de privacidad: texto genérico, que lo revise quien corresponda.
- Dominio final: definir `NEXT_PUBLIC_SITE_URL` (canonical, Open Graph, sitemap, robots).

## Assets que debes aportar
- Capturas reales limpias para `public/screens/` (ver `public/screens/README.md`): `panel-general.png`, `facturacion.png`, `tasas-cambio.png`, `productos.png`, `comisiones.png`, `reportes.png`. 1600x850, sin marca de agua "sesión no comercial", con datos de prueba y sin nombres, correos, teléfonos ni RIF reales. Luego poner `REAL_SCREENSHOTS_READY = true` en `lib/config.ts`.
- Captura de la pantalla real de cobro con pago mixto y vuelto.

## Seguridad de datos
- `reference/` y los `.docx` están en `.gitignore`. No los subas a un repositorio ni a un hosting.
