# Registro de afirmaciones

Toda frase del sitio que afirme algo sobre el producto debe mapear a una fila de esta tabla. Las que no, se eliminan.
Evidencia: rutas dentro de `reference/brief/` (carpeta local, fuera de git). Estado según `landing-features.json`.
`Flag` es la clave de `lib/features.ts` que la controla (con `false`, la frase no aparece en ningún sitio).

Estados: IMPLEMENTADO · PARCIAL (se redacta con el matiz de la columna "Redacción permitida") · NO ENCONTRADO (nunca se afirma).

## Se puede afirmar

| # | Afirmación (redacción permitida) | id en landing-features.json | Estado | Flag | Evidencia |
|---|---|---|---|---|---|
| C01 | Una factura de contado se cobra con varios métodos y monedas, convertidos a USD con la tasa vigente | pagoMixto | IMPLEMENTADO | pagoMixto | 03-flujos-transversales/cobro.md |
| C02 | Sin tolerancia: si falta dinero no se emite; el exceso es vuelto | pagoMixto | IMPLEMENTADO | pagoMixto | 03-flujos-transversales/cobro.md |
| C03 | Cobros en USD, VES, COP y USDT; la conversión usa VES ÷ BCV, COP ÷ tasa COP, USDT 1 a 1 | cop, usdt, multiMoneda | IMPLEMENTADO | monedasCobro | 08-cruce-con-la-landing.md §2 |
| C04 | Métodos de cobro: Efectivo, Transferencia, Zelle, Binance (USDT), Punto de Venta; todos son registros manuales con referencia y origen | zelle, usdt | IMPLEMENTADO | zelle | 02-modulos/facturacion.md |
| C05 | Sin integración con ninguna plataforma de pago ni validación externa | binancePay, pagoMovil | NO ENCONTRADO (integración) | — | 08-cruce-con-la-landing.md §3 y §6 |
| C06 | El vuelto se calcula y registra en USD, como egreso de caja o cargo bancario; sale en la factura impresa | vuelto | IMPLEMENTADO | vuelto | 03-flujos-transversales/cobro.md §4 |
| C07 | Métodos de vuelto: Efectivo, Pago Móvil o Transferencia; los bancarios exigen referencia y autorización de un supervisor | vuelto, pagoMovil | IMPLEMENTADO / PARCIAL | vueltoPagoMovil | 02-modulos/facturacion.md |
| C08 | Pago móvil solo como vuelto y devolución de nota de crédito (referencia manual, sin validación) | pagoMovil | PARCIAL | vueltoPagoMovil | landing-features.json |
| C09 | La moneda base es USD: facturas, cuentas por cobrar y comisiones en USD; la factura impresa no muestra equivalente en bolívares | multiMoneda | PARCIAL | monedasCobro | 08-cruce-con-la-landing.md §2 |
| C10 | Descuentos, cambio de días de crédito, vuelto bancario y devolución de nota de crédito piden usuario y clave de otro usuario con permiso, sin cerrar la sesión; queda registrado quién autorizó | roles | IMPLEMENTADO | autorizacionSupervisor | 09-diferenciales-reales.md §7 |
| C11 | Anular una factura repone el stock, no borra la historia y genera una nota de crédito (NC-…) que se aplica a otra factura o se devuelve con autorización | notasCreditoCliente | IMPLEMENTADO | anulacionConNotaCredito | 09-diferenciales-reales.md §8 |
| C12 | Tasas BCV, paralelo y COP registradas a mano, con histórico y brecha informativa | tasasBcvAutomaticas | IMPLEMENTADO (manual) | — | 03-flujos-transversales/tasas-y-brecha.md |
| C13 | Aviso de cambio brusco (más de 30 %) y alerta de "tasa sin registrar" | — | IMPLEMENTADO | — | 03-flujos-transversales/tasas-y-brecha.md |
| C14 | Cada factura guarda la tasa vigente al emitirse | multiMoneda | IMPLEMENTADO | monedasCobro | 03-flujos-transversales/tasas-y-brecha.md |
| C15 | Facturas de contado y crédito, con control de límite y días de crédito | iva | IMPLEMENTADO | — | 02-modulos/facturacion.md |
| C16 | IVA configurable por empresa | iva | IMPLEMENTADO | — | 02-modulos/configuracion.md |
| C17 | Sin caja con turno abierto no se puede facturar | turnosCaja | IMPLEMENTADO | — | 02-modulos/cajas.md |
| C18 | Inventario en cajas y unidades sueltas; el stock se descuenta en unidades | inventarioCajasUnidades | IMPLEMENTADO | cajasYUnidades | 03-flujos-transversales/inventario-y-costos.md |
| C19 | Tres niveles de precio por producto, que se eligen en cada línea (sin regla automática por cliente o volumen) | tresPrecios | IMPLEMENTADO | tresPrecios | 08-cruce-con-la-landing.md §9 |
| C20 | Alertas de stock bajo y de productos por vencer | — | IMPLEMENTADO | alertasStockVencimiento | 02-modulos/productos.md |
| C21 | Cuentas por cobrar agrupadas por cliente, cobro por factura y abono general de la factura más antigua a la más nueva | — | IMPLEMENTADO | cuentasPorCobrarFifo | 02-modulos/cuentas-por-cobrar.md |
| C22 | Cuentas por pagar | — | IMPLEMENTADO | compras | 02-modulos/cuentas-por-pagar.md |
| C23 | Antigüedad de saldos en rangos Vigente, 1-30, 31-60, 61-90 y 90+ | reportes | IMPLEMENTADO | antiguedadSaldos | 02-modulos/reportes.md |
| C24 | Comisión del vendedor: diferencia entre el precio vendido y el de lista (Precio 1) | comisiones | IMPLEMENTADO | comisionPorDiferenciaPrecio | 03-flujos-transversales/comisiones.md |
| C25 | La comisión nace Liberada en contado y Pendiente en crédito hasta que el cliente paga la factura completa; se paga en lote por caja o banco | comisiones | IMPLEMENTADO | comisiones | 03-flujos-transversales/comisiones.md |
| C26 | El vendedor ve las suyas en "Mis Comisiones" | comisiones | IMPLEMENTADO | misComisiones | 02-modulos/comisiones.md |
| C27 | Compras con órdenes de compra, recepciones, notas de devolución y facturas de compra; proveedores con días de crédito | — | IMPLEMENTADO | compras | 02-modulos/compras.md |
| C28 | Varias cajas con apertura, cierre y corte impreso | turnosCaja, multiCaja | PARCIAL (solo ADMIN abre y cierra; no se guarda el monto contado) | — | 02-modulos/cajas.md |
| C29 | Panel General: ventas de hoy, por cobrar, por pagar, stock bajo, ventas de la semana, cajas activas, facturas recientes e inventario en alerta | — | IMPLEMENTADO | panelGeneral | 02-modulos/panel-general.md |
| C30 | 44 reportes con exportación a Excel y PDF | reportes | IMPLEMENTADO | — | 02-modulos/reportes.md |
| C31 | Roles y permisos granulares (ADMIN, CAJERO, VENDEDOR); bloqueo tras 5 intentos; contraseñas con bcrypt | roles | IMPLEMENTADO | roles | 03-flujos-transversales/roles-y-permisos.md |
| C32 | Bitácora de auditoría por usuario | auditoria | IMPLEMENTADO | auditoria | 03-flujos-transversales/auditoria.md |
| C33 | Rutas de venta como zonas dibujadas en un mapa, con sugerencia de vendedor al crear clientes; el mapa requiere internet | rutasMapa | IMPLEMENTADO | rutasMapa | 02-modulos/rutas-y-mapa.md |
| C34 | Licencia firmada con Ed25519 y verificada localmente | ed25519 | IMPLEMENTADO | licenciaFirmada | 04-licenciamiento-y-sin-internet.md §2 |
| C35 | Una licencia por empresa, con límite de estaciones (1 a 1000), activada una vez por internet en el servidor | licenciaPorEstaciones | IMPLEMENTADO | licenciaFirmada | 04-licenciamiento-y-sin-internet.md §2 |
| C36 | Si la licencia vence o falla la renovación, la app pasa a solo lectura (consulta, pero no registra) en lugar de bloquearse | licenciaPorEstaciones | IMPLEMENTADO | soloLectura | 04-licenciamiento-y-sin-internet.md §3 |
| C37 | Opera en tu red local, sin depender de internet para el día a día; la licencia se renueva por internet al menos una vez por semana | sinInternet | PARCIAL | — | 08-cruce-con-la-landing.md §1 |
| C38 | El mapa y el envío de códigos por correo también necesitan internet | sinInternet | PARCIAL | — | 04-licenciamiento-y-sin-internet.md §6 |
| C39 | Instalador con modo Servidor y modo Estación, para Windows 10 1809+ o Server 2019+ de 64 bits, sobre SQL Server | instalador | IMPLEMENTADO | — | 01-ficha-tecnica.md |
| C40 | Los datos viven en el SQL Server del cliente, en su red | — | IMPLEMENTADO | — | 09-diferenciales-reales.md §9 |
| C41 | Factura atómica: se registra completa o no se registra | — | PARCIAL (sin "100 %") | — | 08-cruce-con-la-landing.md §7 |
| C42 | Impresión en PDF y en hoja carta por cualquier impresora de Windows | impresionTermica | IMPLEMENTADO (carta) | — | 03-flujos-transversales/impresion.md |
| C43 | Documento digital propio con número de control interno e IVA configurable | facturaFiscal | PARCIAL | — | 10-vacios-y-riesgos.md §D |
| C44 | SQL Server 2019 es el caso de producción documentado | instalador | PARCIAL | — | 08-cruce-con-la-landing.md §8 |

## Nunca se afirma (NO ENCONTRADO)

Binance Pay · "Autorizado vía Banco" · logística, despacho, seguimiento de entregas · tasas automáticas ·
respaldos integrados · importación desde Excel · impresión térmica o de tickets · multi-sucursal o multi-empresa ·
IGTF, retenciones, máquina fiscal, SENIAT, "facturación electrónica" · costeo promedio o PEPS · conciliación bancaria
funcional · actualización automática · app móvil · lotes o series · código de barras · kits o combos · imágenes de producto ·
ajuste por toma física · cotizaciones, pedidos, notas de entrega · descuentos automáticos por cliente o volumen ·
recordatorios de cobro · intereses de mora · cobro en línea · comisión por meta o escalonada · "v2.4 LTS" ·
"0 ms de latencia" · "100 % transaccional" · "instalación en minutos" · "licencia offline" · "100 % offline".

## Pendiente de confirmar (no destacar hasta que Luis lo active)

| Tema | Flag | Tratamiento en el sitio |
|---|---|---|
| "Porcentaje BCV" y Cuentas por Cobrar BCV (es un porcentaje de incremento sobre los precios, no la tasa del BCV; sin pruebas automáticas) | `porcentajeBcv: false` | Solo aparece como ítem del menú del mockup. Sin copy, capítulos ni datos protagonistas. Comisiones siempre con "Solo con porcentaje BCV" desmarcada. |
| Regla de los 3 precios (cuándo se usa cada uno) | — | Solo "tres niveles de precio por producto, que eliges en cada línea". |
| Regla de la comisión (el cartel de facturación y el servicio no coinciden con Precio 2/3) | `comisionPorDiferenciaPrecio` | TODO(luis): confirmar la regla de negocio. |
| Cobro en bolívares desde el diálogo real ("Monto (Bs)") | — | No se muestra escribiendo en "Monto (Bs)"; el juego usa la conversión VES ÷ tasa BCV. TODO(luis): verificar. |
| Plazo de 7 días de la renovación de licencia | — | TODO(luis): confirmar la redacción. |
| Capacidad (cuántas cajas y estaciones) | — | Sin cifras probadas. TODO(luis). |

## Filas por sección del sitio

La columna "Dónde" se completa en la Fase 4 al verificar el copy final contra esta tabla.
