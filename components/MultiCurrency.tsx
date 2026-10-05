"use client";

import { useState } from "react";
import { ArrowLeftRight, ShieldCheck, Split } from "lucide-react";
import Reveal, { SectionHeader } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/** Tasas ilustrativas: unidades por 1 USD. */
const RATES = [
  { code: "USD", name: "Dólar en efectivo / Zelle", per: 1, prefix: "$", dec: 2 },
  { code: "VES", name: "Bolívar · Tasa BCV del día", per: 871.36, prefix: "Bs. ", dec: 2 },
  { code: "COP", name: "Peso colombiano · frontera", per: 3300, prefix: "COP ", dec: 0 },
  { code: "USDT", name: "Tether · Binance Pay", per: 1, prefix: "", dec: 2 },
] as const;

const POINTS = [
  {
    icon: Split,
    title: "Un cobro, varias monedas",
    text: "Una misma factura admite efectivo en dólares, Pago Móvil en bolívares, pesos y USDT. El sistema reparte y concilia cada parte.",
  },
  {
    icon: ArrowLeftRight,
    title: "Vuelto exacto, en la moneda correcta",
    text: "Calcula el vuelto sobre el total recibido y exige autorización cuando el monto sale del banco.",
  },
  {
    icon: ShieldCheck,
    title: "Cada tasa queda registrada",
    text: "Tasas del día para cada moneda, aplicadas a la operación y visibles en el libro de caja unificado.",
  },
];

const nf = (dec: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export default function MultiCurrency() {
  const [raw, setRaw] = useState("1850");
  const usd = Number.parseFloat(raw.replace(/,/g, ""));
  const valid = Number.isFinite(usd) && usd >= 0;

  return (
    <section id="multi-moneda" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeader
            kicker="Motor multi-moneda"
            title="Cuatro divisas. Un solo libro de caja."
            description="En Venezuela conviven VES, USD, COP y USDT en el mismo mostrador. Distribuidora DJ lo trata como la operación normal, no como una excepción."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal className="min-w-0">
            <div className="card-surface h-full rounded-2xl p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <label htmlFor="monto-usd" className="text-xs uppercase tracking-wider text-fg-muted">
                    Monto de la venta (USD)
                  </label>
                  <div className="mt-2 flex items-center rounded-lg border border-line bg-field px-3 focus-within:border-primary-light">
                    <span className="num text-fg-muted">$</span>
                    <input
                      id="monto-usd"
                      inputMode="decimal"
                      value={raw}
                      onChange={(e) => setRaw(e.target.value)}
                      className="num w-32 min-w-0 bg-transparent sm:w-40 px-2 py-2.5 text-xl text-fg outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      aria-describedby="monto-ayuda"
                    />
                  </div>
                </div>
                <p id="monto-ayuda" className="max-w-[16rem] text-xs leading-relaxed text-fg-muted">
                  Escribe un monto y mira su equivalente en cada moneda con las tasas de demostración.
                </p>
              </div>

              <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line">
                {RATES.map((r) => (
                  <li key={r.code} className="flex flex-col gap-2 bg-field px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "num grid h-8 w-12 place-items-center rounded-md border text-[11px]",
                          r.code === "VES" || r.code === "USDT"
                            ? "border-success/30 bg-success/10 text-success-text"
                            : "border-line bg-field text-fg-slate",
                        )}
                      >
                        {r.code}
                      </span>
                      <div>
                        <p className="text-sm text-fg">{r.name}</p>
                        <p className="num text-[11px] text-fg-muted">
                          1 USD = {nf(2).format(r.per)} {r.code}
                        </p>
                      </div>
                    </div>
                    <p className="num break-words text-lg text-fg sm:text-right" aria-live="polite">
                      {valid ? `${r.prefix}${nf(r.dec).format(usd * r.per)}${r.code === "USDT" ? " USDT" : ""}` : "—"}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-fg-muted">
                Tasas ilustrativas. En el sistema se registran las tasas vigentes de cada día.
              </p>
            </div>
          </Reveal>

          <div className="min-w-0 space-y-4">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="card-surface flex gap-4 rounded-2xl p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-field text-success-text">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-medium text-fg">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-medium">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
