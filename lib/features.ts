/**
 * Qué se puede afirmar en el sitio. Con `false`, la afirmación no aparece en ningún
 * lugar: mockups, copy, FAQ, metadata ni JSON-LD.
 * Fuente: reference/brief/landing-features.json (local, fuera de git).
 */
export const features = {
  // Confirmado en el brief
  pagoMixto: true,
  vuelto: true,
  vueltoPagoMovil: true, // pago móvil SOLO como método de vuelto y devolución
  monedasCobro: true, // USD, VES, COP, USDT
  zelle: true,
  tresPrecios: true,
  cajasYUnidades: true,
  comisiones: true,
  comisionPorDiferenciaPrecio: true, // TODO(luis): confirmar la regla de negocio
  misComisiones: true,
  antiguedadSaldos: true,
  cuentasPorCobrarFifo: true,
  anulacionConNotaCredito: true,
  autorizacionSupervisor: true,
  alertasStockVencimiento: true,
  panelGeneral: true,
  compras: true,
  rutasMapa: true,
  roles: true,
  auditoria: true,
  licenciaFirmada: true, // Ed25519 verificada localmente
  soloLectura: true, // al vencer la licencia
  // No existe: nunca mostrar
  pagoMovilComoCobro: false,
  binancePay: false,
  logistica: false,
  licenciaOffline: false,
  tasasAutomaticas: false,
  respaldosIntegrados: false,
  importacionExcel: false,
  impresionTermica: false,
  multiSucursal: false,
  facturaFiscal: false,
  igtf: false,
  conciliacionBancaria: false,
  cotizacionesPedidos: false,
  versionVisible: false,
  // Pendiente de confirmar con Luis
  porcentajeBcv: false, // TODO(luis): significado comercial
} as const;

export type FeatureKey = keyof typeof features;
