# Registro de afirmaciones

Estado: **Capturas** = visible en las 10 capturas de la app (carpeta local `reference/`, fuera de git).
**Confirmado por Luis** = dicho por Luis en el brief. **Descripción técnica** = texto sobre la app aportado por Luis, sin captura.
**Sin verificar** = no aparece en el sitio nuevo hasta que se confirme.

| Afirmación | Dónde aparecía (sitio previo) | Evidencia | En el sitio nuevo |
|---|---|---|---|
| Menú: Operaciones, Compras, Inventario, Finanzas, Reportes, Administración | Módulos | Capturas | Sí (sidebar de AppFrame, módulos) |
| Barra superior con Tasa BCV, Dólar paralelo y hora de actualización | Mockup | Capturas | Sí (franja del header y AppFrame) |
| Tasas: BCV, paralelo, COP, brecha %, histórico, registrar tasa del día, exportar | Multi-Moneda | Capturas | Sí |
| COP como tasa de referencia | Multi-Moneda | Capturas | Sí, solo como tasa |
| COP como método de cobro | Hero, conversor | Sin verificar | No. TODO(luis): confirmar |
| Compras: órdenes de compra, recepciones, facturas; proveedores con días de crédito | Módulos | Capturas | Sí |
| Productos: código, categoría, cantidad, cajas, a granel, costo, 3 precios, estado | Módulos | Capturas | Sí |
| Facturación con caja abierta, filtros, ver detalle, anular | Módulos | Capturas | Sí |
| Estados de factura: Emitida, Pagada, Parcial, Vencida, Anulada | Mockup | Confirmado por Luis (paleta de la app) | Sí |
| Comisiones por vendedor, filtro "solo con porcentaje BCV", por cobrar / liberada | Módulos | Capturas | Sí |
| Antigüedad de saldos (vigente, 1-30, 31-60, 61-90, 90+), filtros cliente y vendedor | Módulos | Capturas | Sí |
| Panel general: ventas de hoy, por cobrar, por pagar, stock bajo, semana, facturas, cajas, alertas | Mockup | Capturas | Sí |
| Configuración: datos de empresa, logo, IVA configurable, impresora, pie de factura, pestaña Licencia | FAQ | Capturas | Sí |
| Pago móvil, pago mixto y vuelto | Hero, mockup | Confirmado por Luis | Sí (`features.pagoMovil/pagoMixto/vuelto`) |
| Pantalla de cobro con pago mixto (diseño del diálogo) | Mockup | Sin captura: representación ilustrativa | Sí, rotulada como ejemplo. TODO(luis): reemplazar con la pantalla real |
| Cómo se valida un pago móvil (banco, internet, registro manual) | FAQ | Sin verificar | No. TODO(luis): confirmar el flujo |
| Vuelto con autorización "vía Banco" | Mockup | Sin verificar | No |
| USDT / Binance Pay | Hero, conversor, mockup | Sin verificar | No (`features.usdt = false`) |
| Rutas, mapa, despacho, logística | Módulos | Sin verificar | No (`features.logistica = false`) |
| Licencia con firma Ed25519, verificación offline | Arquitectura, FAQ | Sin verificar | No (`features.ed25519 = false`) |
| "v2.4 LTS", "Release v2.4.x" | Navbar, footer | Sin verificar | No |
| "0 ms de latencia", "100% transaccional", "4 divisas conciliadas" | Hero | Sin verificar | No |
| Arqueo ciego, turnos de cajero | Módulos | Sin verificar | No |
| Auditoría de anulaciones, notas de crédito, cambios de precio, supervisor | Módulos | Sin verificar (solo existe el ítem de menú Auditoría) | No. TODO(luis): detallar qué registra |
| Metas mensuales de vendedores | Módulos | Sin verificar | No |
| Factura en PDF "al instante" | Módulos | Sin verificar | No |
| Bloqueo de ventas sin stock | Hero, módulos | Sin verificar | No |
| Facturación, inventario y caja operan sobre la LAN sin internet; tasas se actualizan con conexión o se registran a mano | Hero, FAQ | Confirmado por Luis (regla 2 del brief) | Sí, con esa redacción exacta |
| SQL Server en la red local, estaciones Windows | Arquitectura | Descripción técnica | Sí |
| Reglas de stock, totales y cuentas por cobrar/pagar como triggers en SQL Server | Arquitectura | Descripción técnica | Sí, sin cifras |
| Consultas pesadas en segundo plano (QueryWorker) | Arquitectura | Descripción técnica | Sí, sin nombrar la clase |
| Capacidad (cuántas cajas y usuarios soporta) | FAQ | Sin verificar | No. TODO(luis): medir y confirmar |
| Respaldos y restauración | FAQ | Descripción técnica (existe un documento interno) | Respuesta parcial. TODO(luis): describir el procedimiento |
| Instalación, capacitación, migración y soporte incluidos | CTA final, FAQ | Sin verificar | Solo como proceso genérico. TODO(luis): confirmar qué ofreces |
| Migración desde Excel u otro sistema | FAQ | Sin verificar | Respuesta condicionada. TODO(luis): confirmar |
| Facturación fiscal (SENIAT, máquina fiscal) | — | Sin verificar | No se menciona. TODO(luis): ¿qué cubre? |
| Clientes, testimonios, logos, premios, cifras de uso | — | No existen | No (producto nuevo) |
