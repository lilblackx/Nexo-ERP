/**
 * Único punto de entrada de los datos de demostración del sitio. Ningún componente debe
 * llevar cifras propias: todo sale de aquí. Los datos son ficticios y vienen de
 * `data.json` (generado con scripts/generar-demo.mjs y verificado con scripts/verificar-demo.mjs).
 *
 * Tasas de ejemplo: BCV Bs. 871.36 · paralelo Bs. 970.00 · COP 3,300.00 · brecha 11.3 %.
 * Se rotulan siempre "valores de ejemplo".
 *
 * TODO(luis): confirmar el formato numérico definitivo de la app (coma de miles, punto decimal).
 */
import raw from "./data.json";
import type { Currency, DemoData } from "./types";

export const demo = raw as unknown as DemoData;
export type * from "./types";

export const rates = demo.rates;
export const DEMO_LABEL = "Datos de demostración · tasas de ejemplo";
export const RATES_LABEL = "valores de ejemplo";

const nf2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** 1,200.60 */
export const num = (n: number) => nf2.format(n);
/** 1,201 (texto corrido: sin decimales) */
export const num0 = (n: number) => nf0.format(n);
/** $1,200.60 */
export const usd = (n: number) => `${n < 0 ? "-" : ""}$${nf2.format(Math.abs(n))}`;
/** $1,201 */
export const usd0 = (n: number) => `$${nf0.format(n)}`;
/** Bs. 871.36 */
export const bs = (n: number) => `Bs. ${nf2.format(n)}`;
/** COP 3,300.00 */
export const cop = (n: number) => `COP ${nf2.format(n)}`;
/** 11.3% */
export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;
export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** "2026-10-06" o "2026-10-06 08:30" → "06/10/2026" (con hora si se pide) */
export function dateEs(iso: string, withTime = false): string {
  const [d, t] = iso.split(" ");
  const [y, m, day] = d.split("-");
  const base = `${day}/${m}/${y}`;
  return withTime && t ? `${base} ${t}` : base;
}

/** A USD con las tasas de ejemplo: VES ÷ BCV, COP ÷ tasa COP, USDT y USD 1 a 1. */
export function toUsd(amount: number, currency: Currency, r: { bcv: number; cop: number } = rates): number {
  if (currency === "VES") return round2(amount / r.bcv);
  if (currency === "COP") return round2(amount / r.cop);
  return round2(amount);
}

export const METHOD_LABEL: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  zelle: "Zelle",
  binance: "Binance (USDT)",
  punto_venta: "Punto de Venta",
  pago_movil: "Pago Móvil",
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  USD: "Dólares (USD)",
  VES: "Bolívares (VES)",
  COP: "Pesos colombianos (COP)",
  USDT: "USDT",
};
