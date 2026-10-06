"use client";

import { useEffect, useState } from "react";
import LazyFrame from "@/components/appframe/LazyFrame";
import { INVOICE, usd } from "@/components/appframe/data";
import SectionHead from "@/components/SectionHead";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const MAX = INVOICE.lines.length;

/**
 * Momento 1: el visitante corta el internet. Un sistema web genérico (ilustrativo, sin marcas)
 * se congela; Nexo sigue agregando renglones porque trabaja sobre la red local.
 */
export default function CutInternet() {
  const [offline, setOffline] = useState(false);
  const [webRows, setWebRows] = useState(1);
  const [nexoRows, setNexoRows] = useState(1);
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "-10% 0px", once: false });

  // Nexo siempre avanza; la ventana web solo avanza con conexión.
  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => {
      setNexoRows((n) => (n >= MAX ? 1 : n + 1));
    }, 1700);
    return () => clearInterval(id);
  }, [reduce, inView]);

  useEffect(() => {
    if (reduce || !inView || offline) return;
    const id = setInterval(() => {
      setWebRows((n) => (n >= MAX ? 1 : n + 1));
    }, 1700);
    return () => clearInterval(id);
  }, [reduce, inView, offline]);

  const nexo = reduce ? 4 : nexoRows;
  const web = reduce ? 2 : webRows;
  const webLines = INVOICE.lines.slice(0, web);
  const webTotal = webLines.reduce((s, l) => s + l.boxes * l.price, 0);

  return (
    <section id="sin-internet" className="on-blue bg-primary-deep text-white">
      <div className="container py-20 sm:py-28">
        <SectionHead
          onBlue
          n="01"
          label="Sin conexión"
          title="¿Y si se va el internet a media factura?"
        >
          Corta la conexión y mira qué pasa. A la izquierda, un sistema web genérico. A la derecha, Nexo ERP
          trabajando sobre la red local.
        </SectionHead>

        <div ref={ref} className="mt-10 grid grid-cols-12 gap-x-2 md:gap-x-6 gap-y-8">
          <div className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              aria-pressed={offline}
              onClick={() => setOffline((v) => !v)}
              className="group inline-flex items-center gap-3 border border-white/40 px-4 py-3 text-left transition-colors duration-200 ease-nexo hover:border-white hover:bg-white/10"
            >
              <span
                aria-hidden
                className={cn(
                  "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-300 ease-nexo",
                  offline ? "border-white bg-white" : "border-white/50 bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "absolute top-[3px] h-3 w-3 rounded-full transition-all duration-300 ease-nexo",
                    offline ? "left-[19px] bg-primary-deep" : "left-[3px] bg-white",
                  )}
                />
              </span>
              <span className="text-[15px] font-semibold">Cortar el internet</span>
            </button>
            <p className="num text-sm text-tint-200" role="status">
              Internet: {offline ? "cortado" : "conectado"}
            </p>
          </div>

          {/* Sistema web genérico (ilustrativo) */}
          <div className="col-span-12 lg:col-span-5">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-tint-300">
              Sistema web genérico · ilustración
            </p>
            <div className="relative overflow-hidden rounded border border-white/20 bg-white text-fg shadow-frame-dark">
              <div className="flex items-center gap-2 border-b border-line bg-field px-3 py-2">
                <span className="flex gap-1" aria-hidden>
                  <i className="h-2 w-2 rounded-full bg-line" />
                  <i className="h-2 w-2 rounded-full bg-line" />
                  <i className="h-2 w-2 rounded-full bg-line" />
                </span>
                <span className="truncate rounded-sm bg-white px-2 py-0.5 font-mono text-[10px] text-fg-muted">
                  sistema-web.ejemplo/factura/nueva
                </span>
              </div>
              <div className="min-h-[300px] p-4">
                <p className="text-sm font-semibold text-fg">Nueva factura</p>
                <ul className="mt-3 divide-y divide-line/70 text-xs text-fg-slate">
                  {webLines.map((l) => (
                    <li key={l.name} className="flex justify-between gap-3 py-1.5">
                      <span className="truncate">{l.name}</span>
                      <span className="num">{usd(l.boxes * l.price)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                  <span className="text-xs text-fg-muted">Total</span>
                  <span className="num text-xl text-fg">{usd(webTotal)}</span>
                </div>
              </div>
              {offline && (
                <div
                  className="absolute inset-0 grid place-items-center bg-white/85 text-center"
                  role="alert"
                >
                  <div>
                    <span
                      aria-hidden
                      className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-line border-t-primary"
                    />
                    <p className="mt-3 text-sm font-semibold text-fg">Reconectando…</p>
                    <p className="text-xs text-fg-muted">No se puede guardar la factura</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nexo ERP */}
          <div className="col-span-12 lg:col-span-7">
            <p className="mb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wide text-tint-300">
              <span>Nexo ERP · red local</span>
              <span className="normal-case tracking-normal text-white">
                <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success align-middle" />
                LAN activa
              </span>
            </p>
            <LazyFrame screen="nueva" rows={nexo} dense short tone="dark" className="border-white/20" minH={360} />
          </div>

          <p className="col-span-12 max-w-3xl border-t border-white/25 pt-5 text-[15px] leading-relaxed text-tint-100">
            Facturación, inventario y caja operan sobre la red local, sin conexión. Las tasas se actualizan cuando hay
            conexión; si no la hay, las registras a mano en Tasas de Cambio.
          </p>
        </div>
      </div>
    </section>
  );
}
