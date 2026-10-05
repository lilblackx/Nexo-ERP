/**
 * Datos ficticios y coherentes entre todas las pantallas del AppFrame.
 * Empresa, productos, clientes, proveedores y vendedores son inventados:
 * no hay personas, empresas, correos ni teléfonos reales.
 */
import { features } from "@/lib/features";

export const COMPANY = "Distribuidora Demo, C.A.";
export const EXAMPLE_DATE = "05/10/2026";

/** Tasas de ejemplo. Se rotulan siempre como "valores de ejemplo". */
export const RATES = { bcv: 871.36, paralelo: 970.0, cop: 3300 } as const;

const nf2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Mismo formato numérico que muestra la app (coma de miles, punto decimal). */
export const fmt = (n: number) => nf2.format(n);
export const fmt0 = (n: number) => nf0.format(n);
export const usd = (n: number) => `$${nf2.format(n)}`;
export const bs = (n: number) => `Bs. ${nf2.format(n)}`;
export const gap = (bcv: number, par: number) => (par / bcv - 1) * 100;
export const pct = (n: number) => `${n.toFixed(1)}%`;
export const round2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------ Tasas ------------------------------ */

export const RATE_HISTORY = [
  { fecha: `${EXAMPLE_DATE} 15:29`, bcv: 871.36, par: 970.0 },
  { fecha: "04/10/2026 10:12", bcv: 868.9, par: 965.0 },
  { fecha: "03/10/2026 09:40", bcv: 866.4, par: 960.0 },
  { fecha: "02/10/2026 09:05", bcv: 863.1, par: 955.0 },
  { fecha: "01/10/2026 09:18", bcv: 860.2, par: 950.0 },
] as const;

/* ---------------------------- Productos ---------------------------- */

export const PRODUCTS = [
  { code: "HAR-001", name: "Harina de maíz precocida 1 kg", cat: "Alimentos", perBox: 20, boxes: 240, loose: 6, cost: 15.2, p1: 18.0, p2: 17.5, p3: 17.0 },
  { code: "ARR-001", name: "Arroz blanco 1 kg", cat: "Alimentos", perBox: 24, boxes: 180, loose: 0, cost: 20.4, p1: 24.0, p2: 23.4, p3: 22.8 },
  { code: "ACE-001", name: "Aceite vegetal 1 L", cat: "Alimentos", perBox: 12, boxes: 95, loose: 4, cost: 17.9, p1: 21.0, p2: 20.4, p3: 19.8 },
  { code: "AZU-001", name: "Azúcar refinada 1 kg", cat: "Alimentos", perBox: 20, boxes: 12, loose: 0, cost: 12.6, p1: 15.0, p2: 14.6, p3: 14.2 },
  { code: "PAS-001", name: "Pasta larga 500 g", cat: "Alimentos", perBox: 20, boxes: 8, loose: 0, cost: 14.4, p1: 17.5, p2: 17.0, p3: 16.5 },
] as const;

/* ------------------------- Factura de demo -------------------------- */

export const INVOICE = {
  number: "FAC-000127",
  client: "Abasto Ejemplo 01, C.A.",
  seller: "Vendedor 01",
  caja: "Caja 1",
  lines: [
    { name: "Harina de maíz precocida 1 kg", boxes: 20, price: 18.0 },
    { name: "Arroz blanco 1 kg", boxes: 15, price: 24.0 },
    { name: "Aceite vegetal 1 L", boxes: 10, price: 21.0 },
    { name: "Azúcar refinada 1 kg", boxes: 12, price: 15.0 },
    { name: "Pasta larga 500 g", boxes: 8, price: 17.5 },
  ],
} as const;

export const INVOICE_TOTAL = round2(INVOICE.lines.reduce((s, l) => s + l.boxes * l.price, 0)); // 1250

/** Cobro de demostración: efectivo USD + pago móvil en Bs. con vuelto. */
export const DEMO_PAYMENT = (() => {
  const cashUsd = 900;
  const pagoMovilUsd = 360;
  const pagoMovilBs = round2(pagoMovilUsd * RATES.bcv);
  const received = round2(cashUsd + pagoMovilUsd);
  return { cashUsd, pagoMovilBs, pagoMovilUsd, received, change: round2(received - INVOICE_TOTAL) };
})();

/** Métodos que se muestran: respetan `features`. USDT y COP no son métodos de cobro por ahora. */
export const PAYMENT_METHODS = [
  { id: "cash", label: "Efectivo USD" },
  ...(features.pagoMovil ? [{ id: "pm", label: "Pago móvil (Bs.)" }] : []),
  ...(features.usdt ? [{ id: "usdt", label: "USDT" }] : []),
] as const;

/* ---------------------------- Facturación --------------------------- */

export type InvoiceStatus = "EMITIDA" | "PAGADA" | "PARCIAL" | "VENCIDA" | "ANULADA";

export const INVOICE_LIST = [
  { n: "FAC-000127", client: "Abasto Ejemplo 01, C.A.", seller: "Vendedor 01", date: "05/10/2026", cond: "Contado", method: "Mixto", total: 1250, status: "EMITIDA" as InvoiceStatus },
  { n: "FAC-000126", client: "Bodega Ejemplo 02", seller: "Vendedor 02", date: "05/10/2026", cond: "Contado", method: "Pago móvil", total: 310.5, status: "PAGADA" as InvoiceStatus },
  { n: "FAC-000125", client: "Mercado Ejemplo 03", seller: "Vendedor 01", date: "04/10/2026", cond: "Crédito", method: "—", total: 2140, status: "PARCIAL" as InvoiceStatus },
  { n: "FAC-000124", client: "Abasto Ejemplo 04", seller: "Vendedor 03", date: "04/10/2026", cond: "Contado", method: "Efectivo USD", total: 186, status: "PAGADA" as InvoiceStatus },
  { n: "FAC-000123", client: "Bodega Ejemplo 05", seller: "Vendedor 02", date: "03/10/2026", cond: "Crédito", method: "—", total: 740, status: "ANULADA" as InvoiceStatus },
];

export const STATUS_STYLE: Record<InvoiceStatus, string> = {
  EMITIDA: "bg-info-bg text-info",
  PAGADA: "bg-success-bg text-success-text",
  PARCIAL: "bg-warning-bg text-warning-text",
  VENCIDA: "bg-danger-bg text-danger",
  ANULADA: "bg-thead text-fg-muted",
};

/* ------------------------ Antigüedad de saldos ----------------------- */

const REPORT_CUT = new Date(2026, 9, 5);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fdate = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

function bucket(overdue: number) {
  if (overdue <= 0) return "Vigente";
  if (overdue <= 30) return "1-30";
  if (overdue <= 60) return "31-60";
  if (overdue <= 90) return "61-90";
  return "90+";
}

const AGING_SEED = [
  { n: "FAC-000125", client: "Mercado Ejemplo 03", issued: -10, due: 20, bal: 1240 },
  { n: "FAC-000118", client: "Bodega Ejemplo 05", issued: -38, due: -8, bal: 560.5 },
  { n: "FAC-000112", client: "Abasto Ejemplo 04", issued: -52, due: -22, bal: 830 },
  { n: "FAC-000101", client: "Bodega Ejemplo 02", issued: -95, due: -65, bal: 410 },
  { n: "FAC-000087", client: "Mercado Ejemplo 03", issued: -140, due: -110, bal: 295.75 },
] as const;

export const AGING_ROWS = AGING_SEED.map((r) => {
  const due = addDays(REPORT_CUT, r.due);
  const overdue = Math.max(0, -r.due);
  return {
    n: r.n,
    client: r.client,
    due: fdate(due),
    bal: r.bal,
    overdue,
    elapsed: -r.issued,
    range: bucket(-r.due),
  };
});

export const AGING_RANGES = ["Vigente", "1-30", "31-60", "61-90", "90+"] as const;
export const AGING_TOTALS = AGING_RANGES.map((range) => ({
  range,
  total: round2(AGING_ROWS.filter((r) => r.range === range).reduce((s, r) => s + r.bal, 0)),
}));
export const AGING_GRAND = round2(AGING_ROWS.reduce((s, r) => s + r.bal, 0));

/* ------------------------------ Compras ------------------------------ */

export const PURCHASES = [
  { n: "ODC-000014", supplier: "Proveedor Ejemplo 01, C.A.", date: "05/10/2026", units: 1440, received: 1440, total: 24480, status: "Completa" },
  { n: "ODC-000013", supplier: "Proveedor Ejemplo 02, C.A.", date: "03/10/2026", units: 960, received: 480, total: 15840, status: "Pendiente" },
  { n: "ODC-000012", supplier: "Proveedor Ejemplo 01, C.A.", date: "29/09/2026", units: 2400, received: 2400, total: 41760, status: "Completa" },
] as const;

/* ----------------------------- Comisiones ---------------------------- */

const COMMISSION_PCT = 0.03; // solo para cuadrar cifras de ejemplo; no se muestra
export const COMMISSIONS = [
  { n: "FAC-000127", client: "Abasto Ejemplo 01, C.A.", date: "05/10/2026", lines: 5, base: 1250, status: "Por cobrar" },
  { n: "FAC-000126", client: "Bodega Ejemplo 02", date: "05/10/2026", lines: 3, base: 310.5, status: "Liberada" },
  { n: "FAC-000121", client: "Mercado Ejemplo 03", date: "02/10/2026", lines: 6, base: 1820, status: "Liberada" },
].map((r) => ({ ...r, sale: r.base, commission: round2(r.base * COMMISSION_PCT) }));

export const COMMISSION_TOTALS = {
  pending: round2(COMMISSIONS.filter((c) => c.status === "Por cobrar").reduce((s, c) => s + c.commission, 0)),
  released: round2(COMMISSIONS.filter((c) => c.status === "Liberada").reduce((s, c) => s + c.commission, 0)),
};

/* ------------------------------- Panel ------------------------------- */

export const WEEK_SALES = [
  { d: "Mar", v: 1420 },
  { d: "Mié", v: 2310 },
  { d: "Jue", v: 1180 },
  { d: "Vie", v: 3050 },
  { d: "Sáb", v: 2680 },
  { d: "Dom", v: 640 },
  { d: "Lun", v: 3860 },
] as const;

export const LOW_STOCK = [
  { name: "Azúcar refinada 1 kg", boxes: 12, min: 40 },
  { name: "Pasta larga 500 g", boxes: 8, min: 30 },
] as const;
