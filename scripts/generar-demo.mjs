/**
 * Genera lib/demo/data.json a partir de reference/brief/11-mockups/datos-demo.json.
 *
 * Herramienta de desarrollo: `reference/` es local y está fuera de git, así que el
 * resultado (data.json) sí se versiona y los componentes solo leen lib/demo/.
 *
 * Qué hace:
 *  - Sustituye las tasas del brief (BCV 40, paralelo 44, COP 4,000) por las tasas de
 *    ejemplo del sitio: BCV 871.36 · paralelo 970.00 · COP 3,300.00.
 *  - Recalcula todo monto en bolívares y COP conservando los totales en USD:
 *      VES = USD × tasa BCV · COP = USD × tasa COP · todo a 2 decimales.
 *  - Quita correos, teléfonos y RIF, y el sufijo "(Demo)" / "Demo" de clientes,
 *    vendedores y proveedores.
 *  - Agrega la factura del hero FV-000013 como extensión marcada.
 *  - Omite lo que el sitio no muestra (Cuentas por Cobrar BCV y su porcentaje).
 *
 * Uso:  node scripts/generar-demo.mjs   y luego   node scripts/verificar-demo.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(
  readFileSync(join(root, "reference/brief/11-mockups/datos-demo.json"), "utf8"),
);

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/* ------------------------------ Tasas de ejemplo ------------------------------ */

const RATE = { bcv: 871.36, paralelo: 970.0, cop: 3300.0 };
const OLD_BCV = src.tasas.vigente.tasa_bcv; // 40
const K = RATE.bcv / OLD_BCV; // 21.784

/** Paralelo de los últimos 11 días tomado de la app (misma magnitud que las capturas). */
const PARALELO_FIJO = {
  "2026-10-06": 970.0,
  "2026-10-05": 968.92,
  "2026-10-04": 962.94,
  "2026-10-03": 964.05,
  "2026-10-02": 956.09,
  "2026-10-01": 956.18,
  "2026-09-30": 949.25,
  "2026-09-29": 951.34,
  "2026-09-28": 945.42,
  "2026-09-27": 946.49,
  "2026-09-26": 938.62,
};

const history = src.tasas.historico_30_dias.map((h, i, all) => {
  const day = h.fecha.slice(0, 10);
  const bcv = round2(h.tasa_bcv * K);
  let paralelo = PARALELO_FIJO[day];
  if (paralelo === undefined) {
    // Brecha de 9.6 % a 10.4 % con una ondulación pequeña y determinista.
    const t = i / 19;
    const brecha = 9.6 + 0.8 * t + (i % 3 === 0 ? 0.2 : i % 3 === 1 ? -0.1 : 0.05);
    paralelo = round2(bcv * (1 + brecha / 100));
  }
  const cop = round2(RATE.cop * (bcv / RATE.bcv));
  const brecha = ((paralelo - bcv) / bcv) * 100;
  return {
    fecha: `${day} ${i === all.length - 1 ? "08:30" : "08:30"}`,
    bcv,
    paralelo,
    cop,
    brecha: Math.round(brecha * 10) / 10,
  };
});

const last = history[history.length - 1];
const prev = history[history.length - 2];
if (last.bcv !== RATE.bcv || last.paralelo !== RATE.paralelo || last.cop !== RATE.cop) {
  throw new Error("El histórico no termina en las tasas de ejemplo");
}
const trunc1 = (n) => Math.floor(n * 10) / 10;
const rates = {
  bcv: RATE.bcv,
  paralelo: RATE.paralelo,
  cop: RATE.cop,
  gapPct: Math.round(((RATE.paralelo - RATE.bcv) / RATE.bcv) * 1000) / 10,
  bcvVsAyerPct: trunc1((RATE.bcv / prev.bcv - 1) * 100),
  paraleloVsAyerPct: trunc1((RATE.paralelo / prev.paralelo - 1) * 100),
  vigenteDesde: "2026-10-06 08:30",
  actualizado: "Actualizado hace 12 min",
};

const rateOn = (isoDate) => history.find((h) => h.fecha.startsWith(isoDate))?.bcv;
/** Tasa BCV de una fecha: la del histórico o, para fechas anteriores, la tasa original escalada. */
const bcvFor = (isoDate, oldRate) => rateOn(isoDate) ?? round2(oldRate * K);

/* ------------------------------ Limpieza de nombres ------------------------------ */

const clean = (s) =>
  s == null
    ? s
    : s
        .replace(/\s*\(Demo\)/g, "")
        .replace(/ Demo(?=,|\s|$)/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

/* --------------------------------- Facturas --------------------------------- */

const IVA_PCT = 16;

const invoices = src.facturas.map((f) => {
  const date = f.fecha_emision.slice(0, 10);
  const rate = bcvFor(date, f.tasa_bcv_aplicada);
  const payments = (f.formas_de_pago ?? []).map((p) => {
    const usd = p.equivalente_usd;
    const amount = p.moneda === "VES" ? round2(usd * rate) : p.moneda === "COP" ? round2(usd * RATE.cop) : usd;
    return {
      method: p.metodo_pago,
      currency: p.moneda,
      amount,
      usd,
      origin: p.origen,
      reference: p.referencia ?? null,
    };
  });
  const later = (f.abonos_posteriores ?? []).map((p) => {
    const r = p.tasa_cambio ? round2(p.tasa_cambio * K) : null;
    return {
      date: p.fecha,
      method: p.metodo_pago,
      currency: p.moneda,
      amount: p.moneda === "VES" && r ? round2(p.monto_usd * r) : p.monto_moneda_origen,
      usd: p.monto_usd,
      rate: r,
      origin: p.origen,
      reference: p.referencia ?? null,
    };
  });
  return {
    number: f.numero_factura,
    control: f.numero_control,
    issued: f.fecha_emision,
    client: clean(f.cliente),
    clientId: f.id_cliente,
    seller: clean(f.vendedor),
    condition: f.condicion_pago, // contado | credito
    paymentColumn: f.metodo_pago_columna,
    subtotal: f.subtotal,
    discount: f.descuento,
    discountReason: f.motivo_descuento,
    discountAuthorizedBy: f.autorizado_por_descuento,
    ivaPct: f.iva_porcentaje,
    iva: f.iva,
    total: f.total_a_pagar,
    rate,
    creditDays: f.dias_credito,
    due: f.fecha_vencimiento,
    status: f.estado_visual, // EMITIDA | PAGADA | PARCIAL | VENCIDA | ANULADA
    lines: f.lineas.map((l) => ({
      code: l.cod_producto,
      product: l.producto,
      saleType: l.tipo_venta, // bulto | unidad
      qty: l.cantidad,
      level: l.nivel_precio,
      price: l.precio_unitario,
      subtotal: l.subtotal,
    })),
    payments,
    paidUsd: f.total_pagado_usd ?? null,
    change: f.vuelto
      ? {
          usd: f.vuelto.monto_usd,
          method: f.vuelto.metodo,
          origin: f.vuelto.origen,
          reference: f.vuelto.referencia,
          authorizedBy: f.vuelto.autorizado_por,
        }
      : null,
    laterPayments: later,
    voided: f.anulacion
      ? {
          date: f.anulacion.fecha,
          reason: f.anulacion.motivo,
          user: f.anulacion.usuario,
          creditNote: f.anulacion.nota_credito,
        }
      : null,
  };
});

/* -------- Extensión: FV-000013, la factura del hero (diálogo, no se guarda) -------- */

const heroLines = [
  { code: "ALI-001", product: "Arroz 1kg (caja x20)", saleType: "bulto", qty: 1, level: "Precio 1" },
  { code: "ALI-002", product: "Harina de Maíz 1kg (caja x20)", saleType: "bulto", qty: 1, level: "Precio 1" },
  { code: "LIM-002", product: "Jabón de Barra (caja x30)", saleType: "bulto", qty: 4, level: "Precio 1" },
].map((l) => {
  const p = src.productos.find((x) => x.cod_producto === l.code);
  const price = p.precio_1;
  return { ...l, price, subtotal: round2(price * l.qty) };
});
const heroSubtotal = round2(heroLines.reduce((s, l) => s + l.subtotal, 0));
const heroIva = round2(heroSubtotal * (IVA_PCT / 100));
const heroTotal = round2(heroSubtotal + heroIva);
const zelleUsd = 70;
const transferUsd = 48.5;
const transferVes = round2(transferUsd * RATE.bcv);
const heroPaid = round2(zelleUsd + transferUsd);

const invoiceDraft = {
  extension: true, // no existe en datos-demo.json: agregada para el hero y el cobro mixto
  number: "FV-000013",
  client: "Mercadito Central",
  seller: "Carlos",
  condition: "contado",
  subtotal: heroSubtotal,
  discount: 0,
  ivaPct: IVA_PCT,
  iva: heroIva,
  total: heroTotal,
  rate: RATE.bcv,
  lines: heroLines,
  payments: [
    { method: "zelle", currency: "USD", amount: zelleUsd, usd: zelleUsd, origin: "Banco Demo Uno", reference: "ZELLE-DEMO-0013" },
    { method: "transferencia", currency: "VES", amount: transferVes, usd: transferUsd, origin: "Banco Demo Dos", reference: "TRF-DEMO-0013" },
  ],
  paidUsd: heroPaid,
  change: {
    usd: round2(heroPaid - heroTotal),
    method: "pago_movil",
    origin: "Banco Demo Uno - ****************0001",
    note: "Requiere referencia bancaria y autorización de un supervisor al facturar",
  },
};

/* --------------------------------- Productos --------------------------------- */

const products = src.productos.map((p) => ({
  code: p.cod_producto,
  name: p.nombre_producto,
  category: p.categoria,
  perBox: p.unidades_por_caja,
  units: p.cantidad_unidad,
  boxes: p.cajas,
  loose: p.a_granel_unidades_sueltas,
  min: p.stock_minimo,
  cost: p.costo,
  p1: p.precio_1,
  p2: p.precio_2,
  p3: p.precio_3,
  expires: p.fecha_vencimiento,
  status: p.estado_producto,
  lowStock: p.en_alerta_stock_bajo,
}));

/* ------------------------------ Terceros y bancos ------------------------------ */

const users = src.usuarios.map((u) => ({
  username: u.nombre_usuario,
  name: u.nombre,
  role: u.rol,
  status: u.estado,
}));
const sellers = src.vendedores.map((v) => ({ code: v.codigo_vendedor, name: clean(v.nombre_vendedor) }));
const clients = src.clientes.map((c) => ({
  id: c.id_cliente,
  name: clean(c.nombre_razon_social),
  category: c.categoria,
  creditLimit: c.limite_credito,
  creditDays: c.dias_credito,
}));
const suppliers = src.proveedores.map((p) => ({
  name: clean(p.nombre_razon_social),
  creditDays: p.dias_credito,
}));

const bankMovements = src.movimientos_banco.map((m) => {
  const rate = m.monto_bs != null ? bcvFor(m.fecha.slice(0, 10), m.tasa ?? OLD_BCV) : null;
  return {
    date: m.fecha,
    account: m.cuenta,
    type: m.tipo, // abono | cargo
    usd: m.monto_usd,
    ves: rate ? round2(m.monto_usd * rate) : null,
    rate,
    origin: clean(m.origen),
    reference: m.referencia,
    description: clean(m.descripcion),
    user: m.usuario,
  };
});

const bankAccounts = src.cuentas_bancarias.map((c) => {
  const initialVes = round2(c.saldo_inicial_usd * RATE.bcv * (c.saldo_inicial_bs > 0 ? 1 : 0));
  const mine = bankMovements.filter((m) => m.account === c.banco);
  const usd = round2(c.saldo_inicial_usd + mine.reduce((s, m) => s + (m.type === "abono" ? m.usd : -m.usd), 0));
  const ves = round2(initialVes + mine.reduce((s, m) => s + (m.ves ? (m.type === "abono" ? m.ves : -m.ves) : 0), 0));
  return {
    bank: c.banco,
    masked: c.numero_enmascarado,
    type: c.tipo,
    initialUsd: c.saldo_inicial_usd,
    initialVes,
    balanceUsd: usd,
    balanceVes: ves,
  };
});

/* ---------------------------------- Cajas ---------------------------------- */

const cashRegisters = src.cajas.map((c) => ({
  name: c.nombre_caja,
  status: c.estado,
  cashier: c.cajero,
  opened: c.apertura,
  closed: c.cierre ?? null,
  openingBalance: c.saldo_apertura,
  closingBalance: c.saldo_cierre,
  movements: c.movimientos,
  inflow: c.entradas,
  outflow: c.salidas,
  computedBalance: c.saldo_calculado,
}));
const cashMovements = src.movimientos_caja.map((m) => ({
  register: m.caja,
  date: m.fecha,
  type: m.tipo,
  amount: m.monto,
  description: clean(m.descripcion),
  origin: m.origen,
}));

/* ------------------------------ Cobrar y pagar ------------------------------ */

const receivables = src.cuentas_por_cobrar.map((r) => ({
  invoice: r.factura,
  client: clean(r.cliente),
  clientId: r.id_cliente,
  seller: clean(r.vendedor),
  total: r.total_factura,
  paid: r.abonado,
  balance: r.saldo_pendiente,
  creditBalance: r.saldo_favor,
  days: r.dias,
  issued: r.fecha_factura,
  due: r.vencimiento,
  overdueDays: r.dias_vencido,
  status: r.estado_visual, // vencida | parcial | pagada | pendiente
}));

const receivablesByClient = src.cuentas_por_cobrar_por_cliente.map((c) => ({
  clientId: c.id_cliente,
  client: clean(c.cliente),
  balance: c.saldo_pendiente,
  creditBalance: c.saldo_favor,
  days: c.dias,
  issued: c.fecha_factura,
  status: c.estado,
  invoices: c.facturas,
}));

const RANGO = { "Vigente": "Vigente", "1-30 días": "1-30", "31-60 días": "31-60", "61-90 días": "61-90", "90+ días": "90+" };
const aging = {
  cutoff: src.antiguedad_saldos_cxc.corte,
  rows: src.antiguedad_saldos_cxc.filas.map((r) => ({
    invoice: r.factura,
    client: clean(r.cliente),
    due: r.vencimiento,
    balance: r.saldo_pendiente,
    overdueDays: r.dias_vencido,
    elapsedDays: r.dias_transcurridos,
    range: RANGO[r.rango],
  })),
  totals: Object.fromEntries(Object.entries(src.antiguedad_saldos_cxc.totales_por_rango).map(([k, v]) => [RANGO[k], v])),
  total: src.antiguedad_saldos_cxc.total,
};

const payables = src.cuentas_por_pagar.map((r) => ({
  purchase: r.compra,
  supplier: clean(r.proveedor),
  balance: r.saldo_pendiente,
  issued: r.fecha_factura,
  days: r.dias,
  due: r.vencimiento,
  overdueDays: r.dias_vencido,
  status: r.estado_visual,
}));

/* ------------------------------- Comisiones ------------------------------- */

const commissions = src.comisiones.map((c) => ({
  id: c.id_comision,
  invoice: c.factura,
  client: clean(c.cliente),
  seller: clean(c.vendedor),
  date: c.fecha_calculo,
  lines: c.lineas,
  base: c.monto_base,
  sale: c.monto_venta,
  commission: c.comision,
  status: c.estado, // pendiente | liberada | pagada
  breakdown: c.desglose.map((d) => ({
    product: d.producto,
    qty: d.cantidad,
    base: d.monto_base,
    sale: d.monto_venta,
    commission: d.comision,
  })),
}));
const commissionPayments = src.pagos_comisiones.map((p) => ({
  seller: clean(p.vendedor),
  date: p.fecha_pago,
  method: p.metodo_pago,
  origin: p.origen,
  amount: p.monto,
  reference: p.referencia,
  invoices: p.facturas,
}));

/* --------------------------------- Compras --------------------------------- */

const purchases = {
  orders: src.compras.ordenes_de_compra.map((o) => ({
    number: o.numero_oc,
    supplier: clean(o.proveedor),
    date: o.fecha,
    expected: o.entrega_estimada,
    products: o.total_productos,
    received: o.cantidad_recibida,
    total: o.total,
    status: o.estado,
  })),
  receptions: src.compras.recepciones.map((r) => ({
    number: r.numero_nr,
    order: r.odc,
    supplier: clean(r.proveedor),
    date: r.fecha,
    user: r.usuario,
    status: r.estado,
  })),
  returns: src.compras.notas_de_devolucion.map((r) => ({
    number: r.numero_nota_devolucion,
    reception: r.nr,
    reason: r.motivo,
    qty: r.cantidad,
    status: r.estado,
    date: r.fecha,
  })),
  invoices: src.compras.facturas_de_compra.map((f) => ({
    number: f.numero_compra,
    order: f.odc,
    supplier: clean(f.proveedor),
    date: f.fecha,
    condition: f.condicion,
    creditDays: f.dias_credito,
    due: f.vencimiento,
    total: f.total,
    status: f.estado,
    paid: f.pagado,
    balance: f.saldo,
  })),
};

/* ------------------------- Panel, avisos y auditoría ------------------------- */

const p = src.panel_general;
const dashboard = {
  salesToday: p.ventas_hoy.total,
  salesVsYesterdayPct: p.ventas_hoy.porcentaje_vs_ayer,
  receivable: p.por_cobrar.saldo_total,
  receivableOverdueInvoices: p.por_cobrar.facturas_vencidas,
  payable: p.por_pagar.saldo_total,
  payableOverdue: p.por_pagar.compras_vencidas,
  lowStock: p.stock_bajo.productos_en_alerta,
  week: p.grafico_semanal.map((d) => ({ day: d.dia, amount: d.monto })),
  activeRegisters: p.cajas_activas.map((c) => ({ name: c.caja, cashier: c.cajero, status: c.marca })),
  recentInvoices: p.facturas_recientes.map((f) => ({
    number: f.numero_factura,
    client: clean(f.cliente),
    amount: f.total_venta,
    status: f.estado,
  })),
  stockAlerts: p.inventario_alerta.map((a) => ({
    code: a.cod_producto,
    name: a.nombre_producto,
    category: a.categoria,
    units: a.cantidad_unidad,
    expires: a.fecha_vencimiento,
  })),
};

const notifications = src.notificaciones.map((n) => ({
  title: n.titulo,
  detail: n.detalle,
  severity: n.severidad,
  goesTo: n.lleva_a,
}));

// La auditoría de ejemplo no menciona el porcentaje BCV ni las tasas del brief.
const auditDetail = (a) => {
  if (a.accion === "CAMBIO_TASA") {
    return `Tasa BCV ${RATE.bcv.toFixed(2)} / paralelo ${RATE.paralelo.toFixed(2)} / COP ${RATE.cop.toFixed(2)}`;
  }
  if (a.detalle.includes("FV-000012")) {
    return `Factura FV-000012 crédito, total a pagar ${invoices.find((i) => i.number === "FV-000012").total.toFixed(2)}`;
  }
  if (a.detalle.includes("FV-000011")) {
    return "Factura FV-000011 contado: Zelle USD 50.00 + Transferencia VES";
  }
  return clean(a.detalle);
};
const audit = src.auditoria.map((a) => ({
  date: a.fecha,
  user: a.usuario,
  module: a.modulo,
  action: a.accion,
  detail: auditDetail(a),
}));

const creditNotes = src.notas_credito.map((n) => ({
  number: n.numero_nota_credito,
  client: clean(n.cliente),
  invoice: n.factura_origen,
  amount: n.monto,
  available: n.saldo_disponible,
  status: n.estado,
  date: n.fecha,
  reason: n.motivo,
}));

const out = {
  _generado: "scripts/generar-demo.mjs — datos ficticios; tasas de ejemplo; no editar a mano",
  company: { name: src.empresa.razon_social, initials: "DD", app: "Nexo ERP" },
  today: src.tasas.vigente.fecha.slice(0, 10),
  ivaPct: IVA_PCT,
  rates,
  rateHistory: history,
  users,
  sellers,
  clients,
  suppliers,
  products,
  invoices,
  invoiceDraft,
  creditNotes,
  banks: src.bancos.map((b) => ({ name: b.nombre_banco, type: b.tipo_banco, status: b.estado_banco })),
  bankAccounts,
  bankMovements,
  cashRegisters,
  cashMovements,
  receivables,
  receivablesByClient,
  aging,
  payables,
  commissions,
  commissionPayments,
  purchases,
  dashboard,
  notifications,
  audit,
};

writeFileSync(join(root, "lib/demo/data.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("lib/demo/data.json generado");
