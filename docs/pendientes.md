# Pendientes antes de publicar

Buscar `TODO(luis)` en el código. Este es el resumen.

## Flags en `lib/features.ts`
- `porcentajeBcv: false`: el "porcentaje BCV" (un porcentaje de incremento sobre los precios, no la tasa del BCV) y Cuentas
  por Cobrar BCV solo aparecen en el menú del mockup, sin copy ni datos. Activarlo exige confirmar su significado comercial.
- `comisionPorDiferenciaPrecio: true`: confirmar la regla de negocio (el cartel de comisión de la factura y el servicio
  no coinciden con Precio 2 y 3).
- Los flags en `false` de "No existe" (Binance Pay, logística, tasas automáticas, respaldos, importación de Excel,
  impresión térmica, multi-sucursal, IGTF, conciliación, cotizaciones, versión visible) no se activan sin que exista la función.

## Textos por confirmar
- Plazo de 7 días de la renovación de la licencia (franja "sin internet", plano de red, FAQ).
- Cobro en bolívares: verificar el flujo en la app real antes de publicar (el juego de cobro mixto lo simula).
- Carácter fiscal de la factura (FAQ y módulo Facturación).
- Qué se ofrece en "Cómo sería empezar": instalación, capacitación, carga de datos y soporte.
- FAQ: respaldo, migración desde Excel, capacidad (cajas y estaciones), ediciones de SQL Server y lista "Qué NO hace todavía".
- Límite "solo ADMIN abre y cierra turnos" (módulo Cajas y bancos): decidir si se publica.
- Rubros del formulario de contacto.
- Mensajes de licencia por estado (el de "Validación pendiente" se redactó con la causa del brief).
- Formato numérico definitivo dentro de los mockups (coma de miles, punto decimal).

## App (antes de recapturar)
- Renombrar la app a "Nexo ERP" (hoy el título de ventana y el instalador usan otro nombre).
- Corregir textos: "RF Empresa" → "RIF Empresa", "Iniciar Sesion" → "Iniciar Sesión", "Password" → "Contraseña",
  "esta en modo solo lectura" → "está en modo solo lectura", columna "AGRANEL" → "A granel" / "Sueltas".
- Capturas: `public/screens/` hoy tiene las del 2026-10-06; `tasas-cambio.png` falta (hay `tasa-cambio-brusco.png`).

## Assets que debes aportar
- Capturas definitivas (ver `public/screens/README.md`) y, si quieres, la captura de Configuración > Licencia con "3 de 4".
- Dominio final: `NEXT_PUBLIC_SITE_URL` (canonical, Open Graph, sitemap, robots).

## Seguridad de datos
- `reference/` está en `.gitignore` y nunca entró al historial. No lo subas a un repositorio ni a un hosting.
- El historial de git de la app real contiene una credencial de correo (ver `reference/brief/10-vacios-y-riesgos.md`): revocarla.
