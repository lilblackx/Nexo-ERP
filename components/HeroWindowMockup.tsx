"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  FileText,
  Landmark,
  Lock,
  Minus,
  Printer,
  ShieldCheck,
  Square,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Datos de demostración                                                      */
/* -------------------------------------------------------------------------- */

type CurrencyCode = "USD" | "VES" | "COP" | "USDT";

/** Tasas de demostración: unidades de cada moneda por 1 USD. */
const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  VES: 871.36,
  COP: 3300,
  USDT: 1,
};

const CURRENCY_META: Record<CurrencyCode, { prefix: string; suffix: string; label: string }> = {
  USD: { prefix: "$", suffix: "", label: "USD" },
  VES: { prefix: "Bs. ", suffix: "", label: "VES" },
  COP: { prefix: "COP ", suffix: "", label: "COP" },
  USDT: { prefix: "", suffix: " USDT", label: "USDT" },
};

const ITEMS = [
  { code: "HAR-0142", name: "Harina de maíz precocida 1 kg", pack: "Caja x20", qty: 30, price: 17.5 },
  { code: "ARR-0031", name: "Arroz blanco tipo 1 · 1 kg", pack: "Caja x24", qty: 25, price: 22.0 },
  { code: "ACE-0207", name: "Aceite vegetal 1 L", pack: "Caja x12", qty: 20, price: 19.5 },
  { code: "AZU-0015", name: "Azúcar refinada 1 kg", pack: "Caja x20", qty: 15, price: 13.0 },
  { code: "PAS-0088", name: "Pasta larga 500 g", pack: "Caja x20", qty: 10, price: 19.0 },
] as const;

const TOTAL_USD = ITEMS.reduce((acc, it) => acc + it.qty * it.price, 0); // 1,850.00

const PAYMENTS_IN = {
  cashUsd: 1000,
  pagoMovilVes: 540243.2,
  usdt: 250,
};

const TABS = [
  { id: "facturacion", label: "Facturación", key: "F4" },
  { id: "inventario", label: "Inventario", key: "F5" },
  { id: "tesoreria", label: "Tesorería", key: "F8" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                 */
/* -------------------------------------------------------------------------- */

const nf = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function money(value: number, currency: CurrencyCode) {
  const m = CURRENCY_META[currency];
  return `${m.prefix}${nf.format(value)}${m.suffix}`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/* -------------------------------------------------------------------------- */
/* Componente principal                                                       */
/* -------------------------------------------------------------------------- */

export default function HeroWindowMockup({ className }: { className?: string }) {
  const [tab, setTab] = useState<TabId>("facturacion");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [emitted, setEmitted] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative mx-auto w-full max-w-5xl", className)}
    >
      {/* Resplandor de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -top-10 bottom-10 -z-10 bg-radial-cobalt blur-2xl"
      />

      <div
        role="group"
        aria-label="Vista previa de la ventana de facturación de Distribuidora DJ con pago mixto en USD, VES y USDT"
        className="overflow-hidden rounded-xl bg-card shadow-window"
      >
        <TitleBar />
        <TabBar tab={tab} onChange={setTab} />

        <div className="relative min-h-[430px] bg-card">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "facturacion" && (
                <InvoiceView
                  currency={currency}
                  onCurrency={setCurrency}
                  emitted={emitted}
                  onEmit={() => setEmitted((v) => !v)}
                />
              )}
              {tab === "inventario" && <InventoryView />}
              {tab === "tesoreria" && <TreasuryView />}
            </motion.div>
          </AnimatePresence>
        </div>

        <StatusBar />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Marco de ventana                                                           */
/* -------------------------------------------------------------------------- */

function TitleBar() {
  return (
    <div className="flex h-10 items-center justify-between bg-primary pl-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-white text-[10px] font-bold text-primary">
          DJ
        </span>
        <span className="truncate text-xs text-white/90">
          Distribuidora DJ <span className="text-white/50">—</span> Sucursal Principal
        </span>
      </div>
      <div className="flex h-full shrink-0" aria-hidden>
        <span className="grid w-12 place-items-center text-white/80 hover:bg-primary-light">
          <Minus className="h-3.5 w-3.5" />
        </span>
        <span className="grid w-12 place-items-center text-white/80 hover:bg-primary-light">
          <Square className="h-3 w-3" />
        </span>
        <span className="grid w-12 place-items-center text-white/80 hover:bg-danger hover:text-white">
          <X className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function TabBar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <div role="tablist" aria-label="Módulos" className="flex gap-0.5 overflow-x-auto border-b border-line bg-thead px-2 pt-2 sm:gap-1">
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-t-md px-2.5 py-2 text-xs font-medium transition-colors sm:px-3.5",
              active ? "bg-card text-fg shadow-card" : "text-fg-muted hover:bg-thead/60 hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-primary-light"
              />
            )}
            {t.label}
            <kbd className="num hidden rounded border border-line bg-field px-1 sm:inline text-[10px] text-fg-muted">
              {t.key}
            </kbd>
          </button>
        );
      })}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line bg-field px-3 py-1.5 text-[11px] text-fg-muted">
      <span className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-success" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="text-success-text">SQL Server LAN</span>
        <span className="num hidden sm:inline">SRV-DJ01 · 0 ms</span>
      </span>
      <span className="hidden items-center gap-1.5 sm:flex">
        <User className="h-3 w-3" /> Cajero: M. Rivas · Turno 14 abierto
      </span>
      <span className="num">Tasa BCV: Bs. {RATES.VES.toFixed(2)}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pestaña: Facturación                                                       */
/* -------------------------------------------------------------------------- */

function InvoiceView({
  currency,
  onCurrency,
  emitted,
  onEmit,
}: {
  currency: CurrencyCode;
  onCurrency: (c: CurrencyCode) => void;
  emitted: boolean;
  onEmit: () => void;
}) {
  const reduce = useReducedMotion();

  const calc = useMemo(() => {
    const vesInUsd = PAYMENTS_IN.pagoMovilVes / RATES.VES;
    const paidUsd = PAYMENTS_IN.cashUsd + vesInUsd + PAYMENTS_IN.usdt;
    const changeUsd = round2(paidUsd - TOTAL_USD);
    return { vesInUsd: round2(vesInUsd), paidUsd: round2(paidUsd), changeUsd };
  }, []);

  const inCurrency = (usd: number) => usd * RATES[currency];

  return (
    <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
      {/* Columna izquierda: documento */}
      <div className="min-w-0 bg-card p-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-fg-muted">Factura de despacho</p>
            <p className="num text-sm text-fg">FAC-0004821</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[11px]">
            <span className="text-fg-muted">Cliente</span>
            <span className="text-fg">Bodegón Los Andes, C.A.</span>
            <span className="text-fg-muted">Condición</span>
            <span className="text-fg">Contado · Pago mixto</span>
            <span className="text-fg-muted">Vendedor</span>
            <span className="text-fg">Ruta 07 · J. Pérez</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-xs">
            <thead className="bg-thead text-[10px] uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="hidden px-3 py-2 font-medium sm:table-cell">Código</th>
                <th className="px-3 py-2 font-medium">Descripción</th>
                <th className="px-3 py-2 text-right font-medium">Cant.</th>
                <th className="px-3 py-2 text-right font-medium">P. Unit.</th>
                <th className="px-3 py-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ITEMS.map((it, i) => (
                <motion.tr
                  key={it.code}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                  className="hover:bg-rowhover"
                >
                  <td className="num hidden px-3 py-2 text-fg-muted sm:table-cell">{it.code}</td>
                  <td className="px-3 py-2 text-fg">
                    {it.name}
                    <span className="ml-1.5 text-[10px] text-fg-muted">{it.pack}</span>
                  </td>
                  <td className="num px-3 py-2 text-right text-fg-slate">{it.qty}</td>
                  <td className="num px-3 py-2 text-right text-fg-medium">{nf.format(it.price)}</td>
                  <td className="num px-3 py-2 text-right text-fg">{nf.format(it.qty * it.price)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-fg-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          Existencia validada por la base de datos antes de confirmar cada renglón.
        </p>
      </div>

      {/* Columna derecha: totales y pagos */}
      <div className="flex min-w-0 flex-col bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider text-fg-muted">Total a pagar</p>
          <div role="radiogroup" aria-label="Moneda de visualización" className="flex rounded-md border border-line bg-field p-0.5">
            {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((c) => (
              <button
                key={c}
                role="radio"
                aria-checked={currency === c}
                onClick={() => onCurrency(c)}
                className={cn(
                  "num rounded px-2 py-0.5 text-[10px] transition-colors",
                  currency === c ? "bg-primary text-white" : "text-fg-muted hover:text-white",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <motion.p
          key={currency}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="num text-3xl text-fg"
        >
          {money(inCurrency(TOTAL_USD), currency)}
        </motion.p>
        {currency !== "USD" && (
          <p className="num mt-0.5 text-[11px] text-fg-muted">
            equivale a {money(TOTAL_USD, "USD")} · tasa {nf.format(RATES[currency])}
          </p>
        )}

        <div className="mt-4 space-y-px overflow-hidden rounded-lg border border-line text-xs">
          <PayRow icon={<Banknote className="h-3.5 w-3.5" />} label="Efectivo USD" value={money(PAYMENTS_IN.cashUsd, "USD")} />
          <PayRow
            icon={<Landmark className="h-3.5 w-3.5" />}
            label="Pago Móvil (VES)"
            value={money(PAYMENTS_IN.pagoMovilVes, "VES")}
            hint={`Tasa BCV del día · ${RATES.VES.toFixed(2)}`}
          />
          <PayRow
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Binance Pay (USDT)"
            value={money(PAYMENTS_IN.usdt, "USDT")}
          />
          <div className="flex items-center justify-between bg-thead px-3 py-2">
            <span className="text-fg-medium">Total recibido</span>
            <span className="num text-success-text">{money(calc.paidUsd, "USD")}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg border border-warning/30 bg-warning/10 px-3 py-2">
          <div>
            <p className="text-[11px] text-warning-text">Vuelto a entregar</p>
            <p className="num text-lg text-fg">{money(calc.changeUsd, "USD")}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-warning/40 bg-warning/15 px-2 py-1 text-[10px] font-medium text-warning-text">
            <Lock className="h-3 w-3" />
            Autorizado vía Banco
          </span>
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={onEmit}
            className={cn(
              "group flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98]",
              emitted
                ? "border border-success/40 bg-success/10 text-success-text"
                : "bg-primary text-white shadow-btn hover:bg-primary-light",
            )}
          >
            {emitted ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Factura emitida · CxC saldada
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" /> Emitir factura y PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PayRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-field px-3 py-2">
      <span className="flex items-center gap-2 text-fg-slate">
        <span className="text-fg-muted">{icon}</span>
        <span>
          {label}
          {hint && <span className="block text-[10px] text-fg-muted">{hint}</span>}
        </span>
      </span>
      <span className="num text-fg">{value}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pestaña: Inventario                                                        */
/* -------------------------------------------------------------------------- */

const STOCK_ROWS = [
  { code: "HAR-0142", name: "Harina de maíz precocida 1 kg", stock: 412, min: 150, state: "ok" },
  { code: "ARR-0031", name: "Arroz blanco tipo 1 · 1 kg", stock: 96, min: 120, state: "low" },
  { code: "ACE-0207", name: "Aceite vegetal 1 L", stock: 238, min: 100, state: "ok" },
  { code: "AZU-0015", name: "Azúcar refinada 1 kg", stock: 310, min: 90, state: "ok" },
  { code: "PAS-0088", name: "Pasta larga 500 g", stock: 54, min: 80, state: "low" },
] as const;

function InventoryView() {
  return (
    <div className="p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-fg">Existencias por almacén · Galpón Central</p>
        <span className="flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[11px] text-warning-text">
          <AlertTriangle className="h-3 w-3" /> 2 productos bajo mínimo
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-xs">
          <thead className="bg-thead text-[10px] uppercase tracking-wider text-fg-muted">
            <tr>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Código</th>
              <th className="px-3 py-2 font-medium">Producto</th>
              <th className="px-3 py-2 text-right font-medium">Existencia</th>
              <th className="px-3 py-2 text-right font-medium">Mínimo</th>
              <th className="px-3 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {STOCK_ROWS.map((r) => (
              <tr key={r.code} className="hover:bg-rowhover">
                <td className="num hidden px-3 py-2 text-fg-muted sm:table-cell">{r.code}</td>
                <td className="px-3 py-2 text-fg">{r.name}</td>
                <td className={cn("num px-3 py-2 text-right", r.state === "low" ? "text-warning-text" : "text-fg")}>
                  {r.stock}
                </td>
                <td className="num px-3 py-2 text-right text-fg-muted">{r.min}</td>
                <td className="px-3 py-2">
                  {r.state === "low" ? (
                    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] text-warning-text">Reponer</span>
                  ) : (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success-text">Disponible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-fg-muted">
        <Lock className="h-3.5 w-3.5 text-primary-light" />
        La base de datos bloquea cualquier venta que supere la existencia disponible.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pestaña: Tesorería                                                         */
/* -------------------------------------------------------------------------- */

const CASH_BALANCES: { currency: CurrencyCode; amount: number; note: string }[] = [
  { currency: "USD", amount: 4215, note: "Efectivo en caja" },
  { currency: "VES", amount: 128400, note: "Pago Móvil + punto de venta" },
  { currency: "COP", amount: 2350000, note: "Efectivo de frontera" },
  { currency: "USDT", amount: 1120, note: "Billetera corporativa" },
];

function TreasuryView() {
  return (
    <div className="p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-fg">Caja principal · Turno 14</p>
        <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] text-success-text">
          <CheckCircle2 className="h-3 w-3" /> 12 de 12 cobros conciliados
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {CASH_BALANCES.map((b) => (
          <div key={b.currency} className="rounded-lg border border-line bg-field p-3">
            <div className="flex items-center justify-between text-[11px] text-fg-muted">
              <span>{b.note}</span>
              <span className="num rounded border border-line px-1 text-fg-medium">{b.currency}</span>
            </div>
            <p className="num mt-1 text-xl text-fg">{money(b.amount, b.currency)}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-line bg-field px-3 py-2.5 text-xs">
        <span className="flex items-center gap-2 text-fg-slate">
          <Lock className="h-3.5 w-3.5 text-primary-light" />
          Arqueo ciego: el cajero declara el efectivo sin ver el saldo del sistema.
        </span>
        <span className="num hidden rounded bg-warning/15 px-2 py-0.5 text-[10px] text-warning-text sm:block">
          Pendiente de cierre
        </span>
      </div>
    </div>
  );
}
