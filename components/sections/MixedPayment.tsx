"use client";

import { useMemo, useState } from "react";
import { INVOICE, INVOICE_TOTAL, RATES, bs, gap, pct, round2, usd } from "@/components/appframe/data";
import SectionHead from "@/components/SectionHead";
import { features } from "@/lib/features";
import { cn } from "@/lib/utils";

/*
 * Momento 3: el total es fijo en USD y el visitante lo reparte.
 * Sin USDT (solo existiría con `features.usdt`) y COP no es método de cobro hasta que se confirme.
 * TODO(luis): confirmar el flujo real del pago móvil (referencia, verificación, tasa aplicada).
 */

const DEFAULTS = { cash: "900.00", pm: "313689.60", rate: "871.36", par: "970.00" };

function parse(v: string) {
  const n = Number.parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function Field({
  id,
  label,
  prefix,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  prefix: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-line py-3">
      <label htmlFor={id} className="text-sm text-fg-slate">
        {label}
        {hint && <span className="block text-xs text-fg-muted">{hint}</span>}
      </label>
      <div className="flex h-10 w-[11.5rem] items-center border border-line bg-card px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <span className="num text-sm text-fg-muted">{prefix}</span>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="num w-full min-w-0 bg-transparent px-2 text-right text-[15px] text-fg outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "info" }) {
  return (
    <div className="flex items-baseline justify-between border-b border-line py-2.5">
      <span className="text-sm text-fg-medium">{label}</span>
      <span
        className={cn(
          "num text-lg",
          tone === "ok" && "text-success-text",
          tone === "warn" && "text-warning-text",
          tone === "info" && "text-primary",
          !tone && "text-fg",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function MixedPayment() {
  const [cash, setCash] = useState(DEFAULTS.cash);
  const [pm, setPm] = useState(DEFAULTS.pm);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [par, setPar] = useState(DEFAULTS.par);

  const calc = useMemo(() => {
    const cashN = parse(cash);
    const r = parse(rate);
    const pmUsd = r > 0 ? round2(parse(pm) / r) : 0;
    const received = round2(cashN + pmUsd);
    const diff = round2(received - INVOICE_TOTAL);
    const state = Math.abs(diff) < 0.005 ? "ok" : diff < 0 ? "short" : "over";
    return { cashN, r, pmUsd, received, diff, state } as const;
  }, [cash, pm, rate]);

  const parN = parse(par);
  const brecha = calc.r > 0 ? gap(calc.r, parN) : 0;
  const totalBcv = round2(INVOICE_TOTAL * calc.r);
  const totalPar = round2(INVOICE_TOTAL * parN);

  const money2 = (n: number) => n.toFixed(2);
  const toBs = (u: number) => money2(Math.max(0, u) * calc.r);

  const cashPct = Math.min(100, (calc.cashN / INVOICE_TOTAL) * 100);
  const pmPct = Math.min(100 - cashPct, (calc.pmUsd / INVOICE_TOTAL) * 100);

  return (
    <section id="cobro" className="border-y border-line bg-card">
      <div className="container py-20 sm:py-28">
        <SectionHead n="03" label="Cobro mixto" title="Reparte el pago tú mismo.">
          El total de la factura está fijo en dólares. Divídelo entre efectivo en dólares y pago móvil en bolívares,
          cambia la tasa y mira cuándo cuadra. Todo con valores de ejemplo.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <p className="folio">Factura de ejemplo · {INVOICE.number}</p>
            <p className="mt-4 text-sm text-fg-muted">Total a pagar</p>
            <p className="num mt-1 text-[clamp(2.5rem,2rem+2.5vw,3.75rem)] leading-none text-fg">
              {usd(INVOICE_TOTAL)}
            </p>
            <p className="mt-3 text-sm text-fg-medium">
              {INVOICE.lines.length} renglones · {INVOICE.client}
            </p>

            <div
              className="mt-8 flex h-3 overflow-hidden border border-line bg-field"
              role="img"
              aria-label={`Composición del pago: ${cashPct.toFixed(0)}% efectivo y ${pmPct.toFixed(0)}% pago móvil`}
            >
              <div className="bg-primary transition-[width] duration-500 ease-nexo" style={{ width: `${cashPct}%` }} />
              <div className="bg-primary-light/45 transition-[width] duration-500 ease-nexo" style={{ width: `${pmPct}%` }} />
            </div>
            <div className="mt-2 flex gap-5 text-xs text-fg-muted">
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 bg-primary" /> Efectivo USD
              </span>
              {features.pagoMovil && (
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 bg-primary-light/45" /> Pago móvil
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                ["Todo en efectivo", () => (setCash(money2(INVOICE_TOTAL)), setPm("0.00"))],
                ["Mitad y mitad", () => (setCash(money2(INVOICE_TOTAL / 2)), setPm(toBs(INVOICE_TOTAL / 2)))],
                ["Completar con pago móvil", () => setPm(toBs(INVOICE_TOTAL - calc.cashN))],
                [
                  "Reiniciar",
                  () => (setCash(DEFAULTS.cash), setPm(DEFAULTS.pm), setRate(DEFAULTS.rate), setPar(DEFAULTS.par)),
                ],
              ].map(([label, fn]) => (
                <button
                  key={label as string}
                  type="button"
                  onClick={fn as () => void}
                  className="h-9 border border-line bg-page px-3 text-[13px] font-medium text-fg-slate transition-colors duration-200 hover:border-primary hover:text-primary"
                >
                  {label as string}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="border-t-2 border-fg">
              <Field id="cash" label="Efectivo USD" prefix="$" value={cash} onChange={setCash} />
              {features.pagoMovil && (
                <Field
                  id="pm"
                  label="Pago móvil (Bs.)"
                  prefix="Bs."
                  value={pm}
                  onChange={setPm}
                  hint={`≈ ${usd(calc.pmUsd)} a la tasa de abajo`}
                />
              )}
              <Field
                id="rate"
                label="Tasa BCV"
                prefix="Bs."
                value={rate}
                onChange={setRate}
                hint="Valor de ejemplo: cámbialo"
              />
            </div>

            <div className="mt-2" aria-live="polite">
              <Row label="Total recibido" value={usd(calc.received)} />
              <Row
                label="Falta por pagar"
                value={usd(Math.max(0, -calc.diff))}
                tone={calc.state === "short" ? "warn" : undefined}
              />
              {features.vuelto && (
                <Row label="Vuelto" value={usd(Math.max(0, calc.diff))} tone={calc.state === "over" ? "info" : undefined} />
              )}
              <div className="flex items-center justify-between pt-5">
                <span className="text-sm text-fg-muted">Estado de la factura</span>
                <span
                  className={cn(
                    "inline-block -rotate-2 border-[3px] border-double px-3 py-1 font-mono text-sm font-medium uppercase tracking-[0.18em]",
                    calc.state === "ok" && "border-success-text text-success-text",
                    calc.state === "short" && "border-warning-text text-warning-text",
                    calc.state === "over" && "border-primary text-primary",
                  )}
                >
                  {calc.state === "ok" && "Cuadrado"}
                  {calc.state === "short" && `Falta ${usd(-calc.diff)}`}
                  {calc.state === "over" && (features.vuelto ? `Vuelto ${usd(calc.diff)}` : "Excede")}
                </span>
              </div>
            </div>
          </div>

          {/* Brecha BCV vs. paralelo */}
          <div className="col-span-12 border-t border-line pt-8">
            <div className="grid grid-cols-12 gap-x-8 gap-y-6">
              <div className="col-span-12 lg:col-span-5">
                <h3 className="text-h3">La tasa que uses cambia lo que cobras.</h3>
                <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-fg-medium">
                  Por eso la barra de arriba de Nexo muestra siempre la tasa BCV y el dólar paralelo. Mueve el
                  paralelo y mira la brecha.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <div className="border-t-2 border-fg">
                  <Field id="par" label="Dólar paralelo" prefix="Bs." value={par} onChange={setPar} hint="Valor de ejemplo" />
                </div>
                <dl className="num mt-2 text-sm" aria-live="polite">
                  <div className="flex justify-between border-b border-line py-2.5">
                    <dt className="font-sans text-fg-medium">Brecha</dt>
                    <dd className="text-lg text-fg">{pct(brecha)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line py-2.5">
                    <dt className="font-sans text-fg-medium">{usd(INVOICE_TOTAL)} a tasa BCV</dt>
                    <dd className="text-fg">{bs(totalBcv)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line py-2.5">
                    <dt className="font-sans text-fg-medium">{usd(INVOICE_TOTAL)} a dólar paralelo</dt>
                    <dd className="text-fg">{bs(totalPar)}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="font-sans text-fg-medium">Diferencia</dt>
                    <dd className="text-lg text-warning-text">{bs(Math.max(0, totalPar - totalBcv))}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-fg-muted">
                  Ejemplo por defecto: BCV {bs(RATES.bcv)} · paralelo {bs(RATES.paralelo)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
