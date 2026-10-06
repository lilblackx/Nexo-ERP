/**
 * Colores de estado de la app (design-tokens.json > estadoBadge). Fondo = color con alfa 26/255 (≈10 %).
 */
export const STATE = {
  factura: {
    EMITIDA: "#0284C7",
    PAGADA: "#16A34A",
    PARCIAL: "#D97706",
    VENCIDA: "#DC2626",
    ANULADA: "#64748B",
  },
  cuenta: {
    pendiente: "#D97706",
    parcial: "#0D47A1",
    pagada: "#16A34A",
    vencida: "#DC2626",
  },
  comision: {
    pendiente: "#0D47A1",
    liberada: "#0284C7",
    pagada: "#16A34A",
  },
  ordenCompra: {
    PENDIENTE: "#D97706",
    PARCIAL: "#0D47A1",
    COMPLETA: "#16A34A",
    ANULADA: "#DC2626",
  },
  recepcion: {
    RECIBIDA: "#16A34A",
    PARCIAL: "#0D47A1",
    FACTURADA: "#64748B",
    ANULADA: "#DC2626",
  },
  facturaCompra: {
    EMITIDA: "#16A34A",
    ANULADA: "#DC2626",
  },
  activo: {
    ACTIVO: "#16A34A",
    INACTIVO: "#DC2626",
  },
  licencia: {
    ACTIVA: "#16A34A",
    SIN_LICENCIA: "#D97706",
    VALIDAR_EN_LINEA: "#D97706",
    otros: "#DC2626",
  },
} as const;

/** Etiqueta con la capitalización que usa la app. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/** Orden exacto del menú de la app. */
export const MENU = [
  { section: "OPERACIONES", items: ["Panel General", "Facturación", "Clientes", "Vendedores"] },
  { section: "COMPRAS", items: ["Compras", "Proveedores"] },
  { section: "INVENTARIO", items: ["Productos"] },
  {
    section: "FINANZAS",
    items: [
      "Cuentas Bancarias",
      "Bancos",
      "Cuentas por Cobrar",
      "Cuentas por Cobrar BCV",
      "Cuentas por Pagar",
      "Cajas",
      "Comisiones",
      "Tasas de Cambio",
    ],
  },
  { section: "REPORTES", items: ["Reportes"] },
  { section: "ADMINISTRACIÓN", items: ["Configuración", "Usuarios", "Auditoría"] },
] as const;
