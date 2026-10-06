/**
 * Verifica que los datos de demostración (lib/demo/data.json) sigan cuadrando con las
 * tasas de ejemplo: facturas, cobros, vuelto, cajas, cuentas bancarias, cuentas por
 * cobrar y antigüedad de saldos. Sale con código 1 si algo no cuadra.
 *
 * Uso: node scripts/verificar-demo.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const d = JSON.parse(readFileSync(join(root, "lib/demo/data.json"), "utf8"));

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const sum = (xs) => round2(xs.reduce((s, x) => s + x, 0));
let failures = 0;
let checks = 0;

function check(ok, msg) {
  checks += 1;
  if (!ok) {
    failures += 1;
    console.error("✗ " + msg);
  }
}
const eq = (a, b, msg) => check(Math.abs(a - b) < 0.005, `${msg}: ${a} ≠ ${b}`);

/* ---------------------------------- Tasas ---------------------------------- */
const { rates, rateHistory } = d;
eq(rates.bcv, 871.36, "BCV de ejemplo");
eq(rates.paralelo, 970, "paralelo de ejemplo");
eq(rates.cop, 3300, "COP de ejemplo");
eq(rates.gapPct, 11.3, "brecha vigente");
eq(round2(((rates.paralelo - rates.bcv) / rates.bcv) * 100), 11.32, "brecha = (paralelo − BCV) / BCV × 100");
check(rateHistory.length === 30, "histórico de 30 días");
const first = rateHistory[0];
const last = rateHistory.at(-1);
eq(last.bcv, 871.36, "último BCV del histórico");
eq(last.paralelo, 970, "último paralelo del histórico");
eq(last.cop, 3300, "último COP del histórico");
const rise = (last.bcv / first.bcv - 1) * 100;
check(rise > 7 && rise < 9, `alza del mes ≈ 8 %: ${rise.toFixed(2)} %`);
for (const h of rateHistory) {
  check(h.brecha >= 9 && h.brecha <= 12, `brecha ${h.fecha}: ${h.brecha} fuera de 9–12 %`);
  // La brecha se guarda con un decimal, como la muestra la app.
  check(Math.abs(((h.paralelo - h.bcv) / h.bcv) * 100 - h.brecha) <= 0.05, `brecha ${h.fecha}: ${h.brecha}`);
}
check(
  rateHistory.every((h, i) => i === 0 || h.bcv >= rateHistory[i - 1].bcv),
  "el BCV sube sin retrocesos",
);

/* --------------------------------- Facturas --------------------------------- */
const all = [...d.invoices, { ...d.invoiceDraft, status: "BORRADOR", lines: d.invoiceDraft.lines }];
for (const f of all) {
  const lines = sum(f.lines.map((l) => round2(l.qty * l.price)));
  eq(lines, f.subtotal, `${f.number}: suma de renglones = subtotal`);
  f.lines.forEach((l) => eq(round2(l.qty * l.price), l.subtotal, `${f.number}: renglón ${l.code}`));
  eq(round2((f.subtotal - f.discount) * (f.ivaPct / 100)), f.iva, `${f.number}: IVA`);
  eq(round2(f.subtotal - f.discount + f.iva), f.total, `${f.number}: total`);

  if (f.condition === "contado") {
    const usd = sum(f.payments.map((p) => p.usd));
    eq(usd, f.paidUsd, `${f.number}: pagado = suma de equivalentes`);
    check(f.paidUsd >= f.total, `${f.number}: pagado ≥ total`);
    eq(round2(f.paidUsd - f.total), f.change?.usd ?? 0, `${f.number}: vuelto = pagado − total`);
    for (const p of f.payments) {
      if (p.currency === "VES") eq(round2(p.amount / f.rate), p.usd, `${f.number}: VES ÷ tasa BCV`);
      if (p.currency === "VES") eq(round2(p.usd * f.rate), p.amount, `${f.number}: USD × tasa BCV`);
      if (p.currency === "COP") eq(round2(p.amount / rates.cop), p.usd, `${f.number}: COP ÷ tasa COP`);
      if (p.currency === "USD" || p.currency === "USDT") eq(p.amount, p.usd, `${f.number}: USD 1 a 1`);
    }
  }
}
eq(d.invoiceDraft.total, 116, "FV-000013 total");
eq(d.invoiceDraft.paidUsd, 118.5, "FV-000013 pagado");
eq(d.invoiceDraft.change.usd, 2.5, "FV-000013 vuelto");
eq(d.invoiceDraft.payments[1].amount, 42260.96, "FV-000013 Bs. de la transferencia");
eq(d.invoiceDraft.rate, 871.36, "FV-000013 tasa");

/* ------------------------------ Abonos posteriores ------------------------------ */
for (const f of d.invoices) {
  for (const p of f.laterPayments) {
    if (p.currency === "VES") eq(round2(p.amount / p.rate), p.usd, `${f.number}: abono VES ÷ tasa`);
  }
}

/* ---------------------------- Cuentas por cobrar ---------------------------- */
for (const r of d.receivables) {
  const inv = d.invoices.find((i) => i.number === r.invoice);
  eq(inv.total, r.total, `${r.invoice}: total de la cuenta = total de la factura`);
  const abonos = sum(inv.laterPayments.map((p) => p.usd));
  eq(abonos, r.paid, `${r.invoice}: abonado`);
  eq(round2(r.total - r.paid), r.balance, `${r.invoice}: saldo = total − abonado`);
}
for (const c of d.receivablesByClient) {
  const rows = d.receivables.filter((r) => c.invoices.includes(r.invoice));
  eq(sum(rows.map((r) => r.balance)), c.balance, `${c.client}: saldo por cliente`);
}
const totalCxc = sum(d.receivablesByClient.map((c) => c.balance));
eq(totalCxc, d.dashboard.receivable, "Por cobrar del panel = suma de las cuentas por cliente");

/* ------------------------------ Antigüedad de saldos ------------------------------ */
const ranges = ["Vigente", "1-30", "31-60", "61-90", "90+"];
const bucket = (overdue) =>
  overdue <= 0 ? "Vigente" : overdue <= 30 ? "1-30" : overdue <= 60 ? "31-60" : overdue <= 90 ? "61-90" : "90+";
for (const r of d.aging.rows) {
  check(bucket(r.overdueDays) === r.range, `${r.invoice}: rango ${r.range} vs ${bucket(r.overdueDays)}`);
  const cxc = d.receivables.find((x) => x.invoice === r.invoice);
  eq(cxc.balance, r.balance, `${r.invoice}: saldo de antigüedad = saldo de la cuenta`);
}
for (const range of ranges) {
  eq(sum(d.aging.rows.filter((r) => r.range === range).map((r) => r.balance)), d.aging.totals[range], `total ${range}`);
}
eq(sum(ranges.map((r) => d.aging.totals[r])), d.aging.total, "total general de antigüedad");
eq(d.aging.total, d.dashboard.receivable, "antigüedad = por cobrar del panel");

/* ----------------------------- Cajas y cuentas bancarias ----------------------------- */
for (const c of d.cashRegisters) {
  const mine = d.cashMovements.filter((m) => m.register === c.name);
  eq(sum(mine.filter((m) => m.type === "entrada").map((m) => m.amount)), c.inflow, `${c.name}: entradas`);
  eq(sum(mine.filter((m) => m.type === "salida").map((m) => m.amount)), c.outflow, `${c.name}: salidas`);
  eq(mine.length, c.movements, `${c.name}: cantidad de movimientos`);
  eq(round2(c.openingBalance + c.inflow - c.outflow), c.computedBalance, `${c.name}: saldo calculado`);
  if (c.closingBalance != null) eq(c.closingBalance, c.computedBalance, `${c.name}: saldo de cierre`);
}
for (const a of d.bankAccounts) {
  const mine = d.bankMovements.filter((m) => m.account === a.bank);
  const usd = round2(a.initialUsd + sum(mine.map((m) => (m.type === "abono" ? m.usd : -m.usd))));
  eq(usd, a.balanceUsd, `${a.bank}: saldo USD`);
  const ves = round2(a.initialVes + sum(mine.map((m) => (m.ves == null ? 0 : m.type === "abono" ? m.ves : -m.ves))));
  eq(ves, a.balanceVes, `${a.bank}: saldo Bs.`);
  for (const m of mine) if (m.ves != null) eq(round2(m.ves / m.rate), m.usd, `${a.bank}: movimiento ${m.reference}`);
}
eq(d.bankAccounts[1].initialVes, round2(d.bankAccounts[1].initialUsd * rates.bcv), "saldo inicial Bs. = USD × BCV");

/* ---------------------------- Cobros del día vs. banco/caja ---------------------------- */
for (const f of d.invoices) {
  for (const p of f.payments) {
    if (!p.reference || p.method === "efectivo") continue;
    const mov = d.bankMovements.find((m) => m.reference === p.reference && m.type === "abono");
    check(!!mov, `${f.number}: la referencia ${p.reference} tiene su movimiento bancario`);
    if (mov) eq(mov.usd, p.usd, `${f.number}: movimiento bancario ${p.reference}`);
  }
}

/* -------------------------------- Comisiones -------------------------------- */
for (const c of d.commissions) {
  eq(round2(c.sale - c.base), c.commission, `${c.invoice}: comisión = venta − base`);
  eq(sum(c.breakdown.map((b) => b.commission)), c.commission, `${c.invoice}: desglose`);
}
const maria = d.commissions.filter((c) => c.seller === "María");
eq(sum(maria.filter((c) => c.status === "pendiente").map((c) => c.commission)), 22.4, "María: por cobrar");
eq(sum(maria.filter((c) => c.status === "liberada").map((c) => c.commission)), 15, "María: liberada");

/* ------------------------------- Cuentas por pagar ------------------------------- */
eq(sum(d.payables.map((p) => p.balance)), d.dashboard.payable, "Por pagar del panel = suma de cuentas por pagar");
for (const f of d.purchases.invoices) eq(round2(f.total - f.paid), f.balance, `${f.number}: saldo de compra`);

console.log(`${checks - failures}/${checks} verificaciones correctas`);
if (failures > 0) {
  console.error(`${failures} fallaron`);
  process.exit(1);
}
