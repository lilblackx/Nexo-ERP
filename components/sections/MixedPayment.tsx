"use client";

import { useId, useMemo, useState } from "react";
import { Check, FileText, Plus, Trash2 } from "lucide-react";
import SectionHead from "@/components/SectionHead";
import { CURRENCY_LABEL, METHOD_LABEL, demo, num, pct, round2, toUsd, usd } from "@/lib/demo";
import type { Currency } from "@/lib/demo";
import { features } from "@/lib/features";
import "@/components/appframe/tokens.css";
import "@/components/appframe/appframe.css";

/*
 * Cobro mixto jugable (C01-C03, C06-C07, C14): el total es fijo en USD; cada línea se convierte a USD con las
 * tasas de ejemplo (VES ÷ BCV, COP ÷ tasa COP, USDT 1 a 1). Sin tolerancia: si falta, no se emite; el exceso es vuelto.
 * El diálogo imita "Formas de Pago" de la app, pero con controles accesibles propios.
 * TODO(luis): verificar el flujo de cobro en bolívares en la app real antes de publicar.
 */

const METHODS = ["efectivo", "transferencia", "zelle", "binance", "punto_venta"] as const;
const CURRENCIES: Currency[] = ["USD", "VES", "COP", "USDT"];
const CHANGE_METHODS = ["efectivo", "pago_movil", "transferencia"] as const;
const BANK_NOTE = "Requiere referencia bancaria y autorización de un supervisor al facturar";

interface Line {
  id: number;
  method: string;
  currency: Currency;
  amount: string;
}

/** "42,260.96" → 42260.96; vacío o inválido → 0. */
function parse(v: string) {
  const n = Number(v.replace(/,/g, "").trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const draft = demo.invoiceDraft;
const initialLines = (): Line[] =>
  draft.payments.map((p, i) => ({
    id: i + 1,
    method: p.method,
    currency: p.currency,
    amount: num(p.amount),
  }));

export default function MixedPayment() {
  const uid = useId();
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [nextId, setNextId] = useState(draft.payments.length + 1);
  const [bcv, setBcv] = useState(demo.rates.bcv.toFixed(2));
  const [copRate, setCopRate] = useState(num(demo.rates.cop));
  const [paralelo, setParalelo] = useState(demo.rates.paralelo.toFixed(2));
  const [changeMethod, setChangeMethod] = useState<(typeof CHANGE_METHODS)[number]>("pago_movil");
  const [emitted, setEmitted] = useState(false);

  const total = draft.total;
  const r = { bcv: parse(bcv), cop: parse(copRate) };
  const rateMissing = (c: Currency) => (c === "VES" && r.bcv === 0) || (c === "COP" && r.cop === 0);

  const calc = useMemo(() => {
    const per = lines.map((l) => (rateMissing(l.currency) ? 0 : toUsd(parse(l.amount), l.currency, r)));
    const paid = round2(per.reduce((s, v) => s + v, 0));
    const diff = round2(paid - total);
    return { per, paid, missing: diff < 0 ? -diff : 0, change: diff > 0 ? diff : 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, bcv, copRate]);

  const gap = r.bcv > 0 ? ((parse(paralelo) - r.bcv) / r.bcv) * 100 : 0;
  const bankChange = changeMethod !== "efectivo";

  const touch = () => setEmitted(false);
  const update = (id: number, patch: Partial<Line>) => {
    touch();
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };
  const add = () => {
    touch();
    setLines((ls) => [...ls, { id: nextId, method: "efectivo", currency: "USD", amount: "" }]);
    setNextId((n) => n + 1);
  };
  const remove = (id: number) => {
    touch();
    setLines((ls) => ls.filter((l) => l.id !== id));
  };
  const reset = () => {
    touch();
    setLines(initialLines());
    setNextId(draft.payments.length + 1);
    setBcv(demo.rates.bcv.toFixed(2));
    setCopRate(num(demo.rates.cop));
    setParalelo(demo.rates.paralelo.toFixed(2));
    setChangeMethod("pago_movil");
  };

  const status =
    calc.missing > 0
      ? `Falta ${usd(calc.missing)}: sin tolerancia, la factura no se emite.`
      : calc.change > 0
        ? `Cubierto. Vuelto a entregar: ${usd(calc.change)}.`
        : "Cubierto, sin vuelto.";

  return (
    <section id="cobro" className="border-y border-line bg-white py-20 sm:py-28" aria-labelledby="cobro-titulo">
      <div className="container">
        <SectionHead
          n="03"
          label="Cobro mixto"
          title={<span id="cobro-titulo">Cobra {usd(total)} en las monedas que traiga el cliente.</span>}
        >
          Una factura de contado admite varias formas de pago, en dólares, bolívares, pesos colombianos o USDT. Agrega
          líneas, cambia las tasas y mira cómo la app convierte, valida y calcula el vuelto.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 gap-y-10 md:gap-x-6">
          {/* Tasas de ejemplo editables */}
          <div className="col-span-12 lg:col-span-4">
            <fieldset className="border-t border-line pt-4">
              <legend className="sr-only">Tasas de ejemplo</legend>
              <p className="folio">Tasas de ejemplo</p>
              <div className="mt-4 space-y-4">
                {[
                  { id: "bcv", label: "Tasa BCV (Bs./USD)", value: bcv, set: setBcv },
                  { id: "cop", label: "Peso colombiano (COP/USD)", value: copRate, set: setCopRate },
                  { id: "par", label: "Dólar paralelo (Bs./USD)", value: paralelo, set: setParalelo },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={`${uid}-${f.id}`} className="block text-sm font-semibold text-fg">
                      {f.label}
                    </label>
                    <input
                      id={`${uid}-${f.id}`}
                      inputMode="decimal"
                      value={f.value}
                      onChange={(e) => {
                        touch();
                        f.set(e.target.value);
                      }}
                      className="num mt-1 h-11 w-full rounded border border-line bg-white px-3 text-right text-base focus-visible:ring-primary-light"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-fg-muted">
                USDT se convierte 1 a 1. Son valores de ejemplo: en la app la tasa del día se registra a mano.
              </p>
            </fieldset>

            <div className="mt-8 border-t border-line pt-4">
              <p className="folio">Brecha BCV vs. paralelo</p>
              <p className="num mt-2 text-3xl text-fg">{pct(gap)}</p>
              <p className="mt-2 text-sm text-fg-muted">
                Es un dato informativo: la brecha se calcula como (paralelo − BCV) ÷ BCV. La factura se registra en
                dólares con la tasa vigente.
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-6 text-[15px] font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            >
              Volver al ejemplo
            </button>
          </div>

          {/* Diálogo "Formas de Pago" */}
          <div className="col-span-12 lg:col-span-8">
            <div
              className="app-frame"
              style={{ width: "100%", height: "auto", display: "block", overflow: "visible", borderRadius: 4 }}
            >
              <div className="af-dlg-bar">
                <span>Nueva Factura</span>
              </div>
              <div className="af-dlg-body" style={{ overflow: "visible" }}>
                <div className="af-dlg-head">
                  <span className="af-dlg-ico">
                    <FileText size={22} />
                  </span>
                  <div>
                    <div className="af-dlg-title">Nueva Factura</div>
                    <div className="af-dlg-sub">Pestaña “Formas de Pago”</div>
                  </div>
                  <span className="af-rate-pill">Total fijo: {usd(total)}</span>
                </div>

                <div className="af-card" style={{ padding: "14px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
                  >
                    <span className="af-wrap" style={{ fontSize: 12, color: "#475569" }}>
                      Registre una o más formas de pago que cubran el total de la factura.
                    </span>
                    <button type="button" className="af-btn is-soft" onClick={add}>
                      <Plus size={15} strokeWidth={2.8} /> Agregar forma de pago
                    </button>
                  </div>

                  <div role="group" aria-label="Formas de pago" style={{ marginTop: 10 }}>
                    {lines.length === 0 && (
                      <p className="af-wrap" style={{ padding: "18px 0", fontSize: 13, color: "#64748b" }}>
                        Sin formas de pago. Agrega una para cubrir el total.
                      </p>
                    )}
                    {lines.map((l, i) => {
                      const ve = l.currency === "VES";
                      return (
                        <div key={l.id} className="af-live-row">
                          <select
                            className="af-ctl"
                            aria-label={`Método de pago de la línea ${i + 1}`}
                            value={l.method}
                            onChange={(e) => update(l.id, { method: e.target.value })}
                          >
                            {METHODS.map((m) => (
                              <option key={m} value={m}>
                                {METHOD_LABEL[m]}
                              </option>
                            ))}
                          </select>
                          <select
                            className="af-ctl"
                            aria-label={`Moneda de la línea ${i + 1}`}
                            value={l.currency}
                            onChange={(e) => update(l.id, { currency: e.target.value as Currency })}
                          >
                            {CURRENCIES.map((c) => (
                              <option key={c} value={c}>
                                {CURRENCY_LABEL[c]}
                              </option>
                            ))}
                          </select>
                          <input
                            className="af-ctl is-num"
                            inputMode="decimal"
                            aria-label={`Monto de la línea ${i + 1}`}
                            placeholder="0.00"
                            value={l.amount}
                            onChange={(e) => update(l.id, { amount: e.target.value })}
                          />
                          <div className="af-live-ref" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                            <span className="af-wrap num" style={{ color: rateMissing(l.currency) ? "#DC2626" : "#334155" }}>
                              {rateMissing(l.currency)
                                ? "Falta la tasa"
                                : l.currency === "USD"
                                  ? "Sin conversión"
                                  : `${ve ? "Bs. ÷ BCV" : l.currency === "COP" ? "COP ÷ tasa" : "USDT 1 a 1"} = ${usd(calc.per[i] ?? 0)}`}
                            </span>
                            <button
                              type="button"
                              className="af-btn is-danger-soft"
                              aria-label={`Quitar la línea ${i + 1}`}
                              onClick={() => remove(l.id)}
                              style={{ width: 44, height: 34, flex: "none" }}
                            >
                              <Trash2 size={15} fill="currentColor" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  role="status"
                  aria-live="polite"
                  className={calc.missing > 0 ? "af-summary-miss af-wrap" : "af-summary-ok af-wrap"}
                  style={{ fontSize: 14 }}
                >
                  <span className="num">
                    Total factura: {usd(total)} · Pagado: {usd(calc.paid)}
                  </span>{" "}
                  · {calc.missing > 0 ? <b>Falta: {usd(calc.missing)}</b> : <b>Cubierto</b>}
                </div>
                <span className="sr-only">{status}</span>

                {calc.change > 0 && (
                  <div>
                    <div className="af-change-title">Vuelto a entregar: {usd(calc.change)}</div>
                    {features.vueltoPagoMovil ? (
                      <div style={{ maxWidth: 360 }}>
                        <label htmlFor={`${uid}-vuelto`} className="af-field-label" style={{ display: "block" }}>
                          Método de vuelto
                        </label>
                        <select
                          id={`${uid}-vuelto`}
                          className="af-ctl"
                          value={changeMethod}
                          onChange={(e) => {
                            touch();
                            setChangeMethod(e.target.value as (typeof CHANGE_METHODS)[number]);
                          }}
                        >
                          {CHANGE_METHODS.map((m) => (
                            <option key={m} value={m}>
                              {METHOD_LABEL[m]}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                    {bankChange && <div className="af-note af-wrap">{BANK_NOTE}</div>}
                  </div>
                )}
              </div>
              <div className="af-dlg-foot" style={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <span className="af-wrap" style={{ fontSize: 12, color: emitted ? "#16A34A" : "#64748b" }}>
                  {emitted ? "Ejemplo: así quedaría emitida. No se guarda nada." : "Ejemplo interactivo: no se guarda nada."}
                </span>
                <button
                  type="button"
                  className="af-btn is-primary"
                  disabled={calc.missing > 0 || lines.length === 0}
                  onClick={() => setEmitted(true)}
                >
                  <Check size={15} strokeWidth={3} /> Facturar
                </button>
              </div>
            </div>
            <p className="mt-3 max-w-prose text-sm text-fg-muted">
              Los métodos son Efectivo, Transferencia, Zelle, Binance (USDT) y Punto de Venta. Todos son registros
              manuales, con referencia y origen: no hay integración con ninguna plataforma de pago.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
