"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import AppFrame from "@/components/appframe/AppFrame";
import type { DraftView } from "@/components/appframe/dialogs";
import SectionHead from "@/components/SectionHead";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { demo, usd } from "@/lib/demo";
import { cn } from "@/lib/utils";

/** Renglones de la factura de ejemplo FV-000008 (datos demo): se van agregando uno a uno. */
const SOURCE = demo.invoices.find((i) => i.number === "FV-000008")!;
const TICK_MS = 2300;

function draftWith(n: number): DraftView {
  return {
    client: SOURCE.client,
    seller: SOURCE.seller,
    condition: "contado",
    lines: SOURCE.lines.slice(0, n),
    discount: 0,
    ivaPct: SOURCE.ivaPct,
    payments: [],
  };
}

/** Ventana de un "sistema web genérico": ilustrativa, sin marcas reales. */
function GenericWebWindow({ rows, frozen }: { rows: number; frozen: boolean }) {
  const lines = SOURCE.lines.slice(0, rows);
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  return (
    <div className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded border border-white/25 bg-white text-fg-slate">
      <div className="flex items-center gap-2 border-b border-line bg-field px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-line" />
          <i className="h-2.5 w-2.5 rounded-full bg-line" />
          <i className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <span className="truncate rounded-sm bg-white px-2 py-0.5 font-mono text-[11px] text-fg-muted">
          sistema-web.ejemplo/facturas/nueva
        </span>
      </div>
      <div className="flex-1 p-4">
        <p className="text-base font-bold text-fg">Nueva factura</p>
        <div className="mt-3 grid grid-cols-2 gap-2" aria-hidden>
          <i className="h-8 rounded-sm border border-line bg-field" />
          <i className="h-8 rounded-sm border border-line bg-field" />
        </div>
        <div className="mt-3 divide-y divide-line border-y border-line text-[13px]">
          {lines.map((l) => (
            <div key={l.code} className="flex justify-between gap-3 py-2">
              <span className="truncate">{l.product}</span>
              <span className="num shrink-0">{usd(l.subtotal)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 flex justify-between text-sm font-bold text-fg">
          <span>Subtotal</span>
          <span className="num">{usd(subtotal)}</span>
        </p>
      </div>
      <p className="border-t border-line bg-field px-4 py-2 text-[11px] text-fg-medium">
        Ilustración de un sistema web genérico. No es ningún producto real.
      </p>

      {frozen && (
        <div
          role="status"
          className="absolute inset-0 grid place-items-center bg-white/85 text-center backdrop-blur-[1px]"
        >
          <div>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-fg-muted" aria-hidden />
            <p className="mt-3 text-base font-bold text-fg">Reconectando…</p>
            <p className="mt-1 text-[13px] text-fg-muted">Sin conexión con el servidor</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CutInternet() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: "-10% 0px", once: false });
  const [offline, setOffline] = useState(false);
  const [rows, setRows] = useState(2);
  const [frozenAt, setFrozenAt] = useState(2);

  // El sistema de Nexo sigue facturando: se agregan renglones y cambia el total.
  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setRows((r) => (r >= SOURCE.lines.length ? 1 : r + 1)), TICK_MS);
    return () => clearInterval(id);
  }, [reduce, inView]);

  const genericRows = offline ? frozenAt : rows;
  const draft = useMemo(() => draftWith(rows), [rows]);

  const toggle = () => {
    setOffline((v) => {
      if (!v) setFrozenAt(rows);
      return !v;
    });
  };

  return (
    <section
      id="sin-internet"
      ref={ref}
      className="on-blue bg-primary-deep py-20 text-white sm:py-28"
      aria-labelledby="sin-internet-titulo"
    >
      <div className="container">
        <SectionHead
          n="01"
          label="Red local"
          onBlue
          title={<span id="sin-internet-titulo">Si se cae el internet, se sigue facturando.</span>}
        >
          Nexo opera en tu red local, sin depender de internet para el día a día. Prueba cortarlo.
        </SectionHead>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            aria-pressed={offline}
            onClick={toggle}
            className={cn(
              "inline-flex h-12 items-center gap-3 rounded border px-5 text-[15px] font-semibold transition-colors duration-200 ease-nexo",
              offline
                ? "border-white bg-white text-primary-deep"
                : "border-white/40 text-white hover:border-white hover:bg-white/10",
            )}
          >
            <WifiOff className="h-4 w-4" aria-hidden />
            {offline ? "Internet cortado: volver a conectar" : "Cortar el internet"}
          </button>
          <p className="font-mono text-[13px] text-tint-200" aria-live="polite">
            Internet: {offline ? "cortado" : "conectado"}
          </p>
          {/* Con movimiento reducido no hay avance automático: el renglón se agrega a mano. */}
          {reduce && (
            <button
              type="button"
              onClick={() => setRows((r) => (r >= SOURCE.lines.length ? 1 : r + 1))}
              className="rounded border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:border-white hover:bg-white/10"
            >
              Agregar un renglón a la factura de Nexo
            </button>
          )}
        </div>

        <div className="mt-8 grid grid-cols-12 gap-x-2 gap-y-8 md:gap-x-6">
          <div className="col-span-12 lg:col-span-4">
            <p className="mb-2 font-mono text-[12px] text-tint-200">Sistema web genérico (ilustrativo)</p>
            <GenericWebWindow rows={genericRows} frozen={offline} />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <p className="mb-2 font-mono text-[12px] text-tint-200">Nexo ERP, en tu red local</p>
            <AppFrame
              screen="facturacion"
              dialog="nueva-factura"
              tab="factura"
              draft={draft}
              focus={{ x: 246, y: 34, w: 790, h: 716 }}
              mobileFocus={{ x: 545, y: 392, w: 480, h: 300 }}
              frameClassName="rounded border border-white/25"
              caption="Nueva factura con el internet cortado: se agregan renglones y cambia el total."
              captionClassName="!text-tint-200 [&_span:last-child]:!text-tint-300"
            />
          </div>
        </div>

        <p className="mt-10 max-w-2xl border-t border-white/25 pt-4 text-[15px] text-tint-100">
          La tasa del día se registra a mano y la licencia se renueva por internet al menos una vez por semana.
          {/* TODO(luis): confirmar la redacción del plazo de 7 días de la renovación de la licencia. */}
        </p>
      </div>
    </section>
  );
}
