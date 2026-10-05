import { features } from "@/lib/features";
import { cn } from "@/lib/utils";
import {
  AGING_GRAND,
  AGING_ROWS,
  AGING_TOTALS,
  COMMISSIONS,
  COMMISSION_TOTALS,
  COMPANY,
  DEMO_PAYMENT,
  INVOICE,
  INVOICE_LIST,
  INVOICE_TOTAL,
  LOW_STOCK,
  PRODUCTS,
  PURCHASES,
  RATES,
  RATE_HISTORY,
  STATUS_STYLE,
  WEEK_SALES,
  bs,
  fmt,
  fmt0,
  gap,
  pct,
  usd,
} from "./data";
import { Btn, Chip, Crumb, Grid, Kpi, SearchBox, Select, Title } from "./ui";

type P = { dense?: boolean };

/* ------------------------------ Panel ------------------------------ */

export function PanelScreen({ dense }: P) {
  const max = Math.max(...WEEK_SALES.map((d) => d.v));
  return (
    <div>
      <Crumb>Panel General</Crumb>
      <div className="flex items-start justify-between gap-3">
        <Title sub={`Resumen de la operación · ${COMPANY} (ADMIN)`}>Panel general</Title>
        <Btn primary>+ Nueva factura</Btn>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Kpi label="Ventas de hoy" value={usd(3860)} sub="+8.4% vs ayer" tone="success" />
        <Kpi label="Por cobrar" value={usd(AGING_GRAND)} sub={`${AGING_ROWS.filter((r) => r.overdue > 0).length} facturas vencidas`} tone="warning" />
        <Kpi label="Por pagar" value={usd(24480)} sub="0 compras vencidas" />
        <Kpi label="Stock bajo" value={String(LOW_STOCK.length)} sub="Stock y vencimiento" tone="warning" />
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-[1.7fr_1fr]">
        <div className="rounded-sm border border-line bg-card p-2.5">
          <p className="text-[11px] font-semibold text-fg">Ventas de la semana</p>
          <p className="text-[9px] text-fg-muted">Total facturado por día. Últimos 7 días</p>
          <div className="mt-2 flex h-[88px] items-end gap-2" aria-hidden>
            {WEEK_SALES.map((d) => (
              <div key={d.d} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div className="w-full rounded-t-sm bg-primary-light" style={{ height: `${(d.v / max) * 72}px` }} />
                <span className="num text-[8.5px] text-fg-muted">{d.d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-sm border border-line bg-card p-2.5">
          <p className="text-[11px] font-semibold text-fg">Cajas activas</p>
          <p className="text-[9px] text-fg-muted">Estado de turnos abiertos hoy</p>
          <div className="mt-2 flex items-center justify-between rounded-sm bg-field px-2 py-1.5 text-[10px]">
            <span className="text-fg-slate">{INVOICE.caja}</span>
            <Chip tone="success">ABIERTA</Chip>
          </div>
        </div>
      </div>

      {!dense && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-sm border border-line bg-card p-2.5">
            <p className="text-[11px] font-semibold text-fg">Facturas recientes</p>
            <ul className="mt-1.5 divide-y divide-line/70 text-[10px]">
              {INVOICE_LIST.slice(0, 3).map((f) => (
                <li key={f.n} className="flex items-center justify-between py-1">
                  <span className="num text-fg-slate">{f.n}</span>
                  <span className="num text-fg">{usd(f.total)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-line bg-card p-2.5">
            <p className="text-[11px] font-semibold text-fg">Inventario en alerta</p>
            <ul className="mt-1.5 divide-y divide-line/70 text-[10px]">
              {LOW_STOCK.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-2 py-1">
                  <span className="truncate text-fg-slate">{p.name}</span>
                  <span className="num text-warning-text">{p.boxes} cajas</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Facturación --------------------------- */

function CobroDialog({ dense }: P) {
  const p = DEMO_PAYMENT;
  return (
    <div className="absolute inset-0 grid place-items-center bg-fg/35 p-3">
      <div className={cn("w-full border border-line bg-card shadow-frame", dense ? "max-w-[300px]" : "max-w-[360px]")}>
        <div className="flex items-start justify-between border-b border-line px-3 py-2">
          <div>
            <p className="text-[12px] font-semibold text-fg">Cobro · {INVOICE.number}</p>
            <p className="text-[9.5px] text-fg-muted">{INVOICE.client}</p>
          </div>
          {features.pagoMixto && <Chip tone="blue">Pago mixto</Chip>}
        </div>
        <div className="space-y-2 px-3 py-2.5 text-[10px]">
          <div className="flex items-end justify-between">
            <span className="text-fg-muted">Total a pagar</span>
            <span className="num text-[18px] leading-none text-fg">{usd(INVOICE_TOTAL)}</span>
          </div>
          <div className="flex items-center justify-between text-fg-muted">
            <span>Tasa BCV del día</span>
            <span className="num text-fg-slate">{bs(RATES.bcv)}</span>
          </div>
          <div className="divide-y divide-line/70 rounded-sm border border-line">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-fg-slate">Efectivo USD</span>
              <span className="num text-fg">{usd(p.cashUsd)}</span>
            </div>
            {features.pagoMovil && (
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-fg-slate">Pago móvil (Bs.)</span>
                <span className="text-right">
                  <span className="num block text-fg">{bs(p.pagoMovilBs)}</span>
                  <span className="num block text-[9px] text-fg-muted">≈ {usd(p.pagoMovilUsd)}</span>
                </span>
              </div>
            )}
            <div className="flex items-center justify-between bg-field px-2 py-1.5">
              <span className="text-fg-slate">Total recibido</span>
              <span className="num text-success-text">{usd(p.received)}</span>
            </div>
          </div>
          {features.vuelto && (
            <div className="flex items-center justify-between rounded-sm border border-warning/40 bg-warning-bg px-2 py-1.5">
              <span className="font-semibold text-warning-text">Vuelto</span>
              <span className="num text-[13px] text-warning-text">{usd(p.change)}</span>
            </div>
          )}
        </div>
        <div className="border-t border-line px-3 py-2">
          <span className="grid h-7 place-items-center rounded-sm bg-primary text-[10.5px] font-semibold text-white">
            Confirmar cobro
          </span>
        </div>
      </div>
    </div>
  );
}

export function FacturacionScreen({ dense, cobro }: P & { cobro?: boolean }) {
  return (
    <div className="relative">
      <Crumb>Facturación / Ventas</Crumb>
      <div className="flex flex-wrap items-center gap-2">
        <Title chip={<Chip>{INVOICE_LIST.length} facturas</Chip>}>Facturación de Ventas</Title>
        <Chip tone="success">Caja abierta: {INVOICE.caja}</Chip>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <SearchBox placeholder="Buscar por N° de factura, cliente o vendedor..." className="flex-1" />
        <Btn primary>+ Nueva Factura</Btn>
        <Btn className="hidden sm:inline-flex">Filtrar</Btn>
        <Btn className="hidden sm:inline-flex">Exportar</Btn>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "N° Factura", mono: true },
          { label: "Cliente" },
          { label: "Vendedor", min: "lg" },
          { label: "Fecha", min: "md" },
          { label: "Condición", min: "lg" },
          { label: "Método pago", min: "md" },
          { label: "Total", align: "right", mono: true },
          { label: "Estado" },
        ]}
        rows={INVOICE_LIST.map((f) => [
          f.n,
          f.client,
          f.seller,
          f.date,
          f.cond,
          f.method,
          usd(f.total),
          <span key="s" className={cn("rounded-sm px-1.5 py-0.5 text-[9px] font-semibold", STATUS_STYLE[f.status])}>
            {f.status}
          </span>,
        ])}
      />
      {cobro && <CobroDialog dense={dense} />}
    </div>
  );
}

/* ------------------------------ Compras ------------------------------ */

export function ComprasScreen({ dense }: P) {
  return (
    <div>
      <Crumb>Compras</Crumb>
      <Title>Compras</Title>
      <div className="mt-2 flex gap-4 border-b border-line text-[10.5px]">
        <span className="border-b-2 border-primary pb-1 font-semibold text-primary">Órdenes de Compra</span>
        <span className="pb-1 text-fg-muted">Recepciones</span>
        <span className="pb-1 text-fg-muted">Facturas</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <SearchBox placeholder="Buscar..." className="flex-1" />
        <Btn primary>+ Nueva ODC</Btn>
        <Btn className="hidden sm:inline-flex">Filtrar</Btn>
        <Btn className="hidden sm:inline-flex">Exportar</Btn>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "N° ODC", mono: true },
          { label: "Proveedor" },
          { label: "Fecha", min: "md" },
          { label: "Total productos", align: "right", min: "lg", mono: true },
          { label: "Cant. rec.", align: "right", min: "lg", mono: true },
          { label: "Total", align: "right", mono: true },
          { label: "Estado" },
        ]}
        rows={PURCHASES.map((o) => [
          o.n,
          o.supplier,
          o.date,
          fmt(o.units),
          fmt(o.received),
          usd(o.total),
          <Chip key="s" tone={o.status === "Completa" ? "success" : "warning"}>
            {o.status}
          </Chip>,
        ])}
      />
      <div className="mt-2 flex items-center justify-between text-[10px] text-fg-muted">
        <span>Página 1 de 1 ({PURCHASES.length})</span>
        <span className="flex gap-1.5">
          <Btn>Ver Detalle</Btn>
          <Btn>Enmendar</Btn>
        </span>
      </div>
    </div>
  );
}

/* ----------------------------- Productos ----------------------------- */

export function ProductosScreen({ dense }: P) {
  return (
    <div>
      <Crumb>Inventario</Crumb>
      <Title chip={<Chip>{PRODUCTS.length} productos</Chip>}>CATÁLOGO DE PRODUCTOS</Title>
      <div className="mt-2 flex items-center gap-1.5">
        <SearchBox placeholder="Buscar por código o nombre..." className="flex-1" />
        <Btn primary>+ Nuevo Producto</Btn>
        <Btn className="hidden md:inline-flex">Auditoría</Btn>
        <Btn className="hidden sm:inline-flex">Filtrar</Btn>
        <Btn className="hidden sm:inline-flex">Exportar</Btn>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "Código", mono: true },
          { label: "Nombre" },
          { label: "Categoría", min: "lg" },
          { label: "Cantidad", align: "right", min: "md", mono: true },
          { label: "Cajas", align: "right", mono: true },
          { label: "A granel", align: "right", min: "lg", mono: true },
          { label: "Costo", align: "right", min: "lg", mono: true },
          { label: "Precio 1", align: "right", mono: true },
          { label: "Precio 2", align: "right", min: "md", mono: true },
          { label: "Precio 3", align: "right", min: "md", mono: true },
          { label: "Estado", min: "sm" },
        ]}
        rows={PRODUCTS.map((p) => [
          p.code,
          p.name,
          p.cat,
          fmt(p.perBox * p.boxes + p.loose),
          fmt0(p.boxes),
          fmt0(p.loose),
          usd(p.cost),
          usd(p.p1),
          usd(p.p2),
          usd(p.p3),
          <Chip key="s" tone="success">
            Activo
          </Chip>,
        ])}
      />
      <div className="mt-2 flex items-center justify-between text-[10px] text-fg-muted">
        <span>Página 1 de 1</span>
        <span className="flex gap-1.5">
          <Btn>Editar seleccionado</Btn>
          <Btn>Cambiar estado</Btn>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------- Tasas ------------------------------ */

export function TasasScreen({ dense }: P) {
  return (
    <div>
      <Crumb>Tasas de Cambio</Crumb>
      <Title>Tasas de Cambio</Title>
      <div className="mt-2 rounded-sm border border-line bg-card p-2.5">
        <div className="grid gap-2.5 sm:grid-cols-3">
          <div>
            <p className="text-[9px] text-fg-muted">Tasa BCV (Bs./USD)</p>
            <p className="num text-[17px] leading-tight text-fg">{bs(RATES.bcv)}</p>
          </div>
          <div>
            <p className="text-[9px] text-fg-muted">Dólar paralelo (Bs./USD)</p>
            <p className="num text-[17px] leading-tight text-fg">{bs(RATES.paralelo)}</p>
          </div>
          <div>
            <p className="text-[9px] text-fg-muted">Peso colombiano (COP/USD)</p>
            <p className="num text-[17px] leading-tight text-fg">COP {fmt(RATES.cop)}</p>
          </div>
        </div>
        <p className="mt-1.5 text-[9px] text-fg-muted">Vigente desde el 05/10/2026 15:29 · valores de ejemplo</p>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <Btn>Histórico</Btn>
        <Select className="hidden sm:inline-flex">Últimos 30 días</Select>
        <span className="flex-1" />
        <Btn primary>+ Registrar tasa del día</Btn>
        <Btn className="hidden sm:inline-flex">Exportar</Btn>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "Fecha", mono: true },
          { label: "Tasa BCV", align: "right", mono: true },
          { label: "Dólar paralelo", align: "right", mono: true },
          { label: "Brecha", align: "right", mono: true },
        ]}
        rows={RATE_HISTORY.map((r) => [r.fecha, bs(r.bcv), bs(r.par), pct(gap(r.bcv, r.par))])}
      />
    </div>
  );
}

/* ----------------------------- Comisiones ---------------------------- */

export function ComisionesScreen({ dense }: P) {
  return (
    <div>
      <Crumb>Comisiones</Crumb>
      <Title
        chip={
          <span className="inline-flex items-center gap-1 rounded-sm bg-thead px-1.5 py-0.5 text-[9.5px] text-fg-slate">
            Por cobrar: <b className="num">{usd(COMMISSION_TOTALS.pending)}</b> · Liberada:{" "}
            <b className="num">{usd(COMMISSION_TOTALS.released)}</b>
          </span>
        }
      >
        Comisiones
      </Title>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-sm border border-line bg-card p-1.5 text-[10px] text-fg-slate">
        <span>Vendedor:</span>
        <Select className="min-w-[110px]">Vendedor 01</Select>
        <span className="flex-1" />
        <span className="hidden items-center gap-1.5 rounded-sm border border-line px-2 py-1 sm:inline-flex">
          <span className="h-2.5 w-2.5 rounded-sm border border-fg-light" />
          Solo con porcentaje BCV
        </span>
        <Btn>Filtrar</Btn>
        <Btn className="hidden sm:inline-flex">Exportar</Btn>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "Factura", mono: true },
          { label: "Cliente", min: "sm" },
          { label: "Fecha cálculo", min: "lg" },
          { label: "Líneas", align: "right", min: "lg", mono: true },
          { label: "Monto base", align: "right", min: "md", mono: true },
          { label: "Monto venta", align: "right", min: "md", mono: true },
          { label: "Comisión", align: "right", mono: true },
          { label: "Estado" },
        ]}
        rows={COMMISSIONS.map((c) => [
          c.n,
          c.client,
          c.date,
          String(c.lines),
          usd(c.base),
          usd(c.sale),
          usd(c.commission),
          <Chip key="s" tone={c.status === "Liberada" ? "success" : "warning"}>
            {c.status}
          </Chip>,
        ])}
      />
      <div className="mt-2 flex justify-end">
        <Btn primary>Pagar Comisiones</Btn>
      </div>
    </div>
  );
}

/* ------------------------------ Reportes ----------------------------- */

export function ReportesScreen({ dense }: P) {
  return (
    <div>
      <Crumb>Reportes</Crumb>
      <div className="flex items-start justify-between gap-3">
        <Title sub="Reportes financieros y de cumplimiento fiscal">Reportes</Title>
        <Chip>{AGING_ROWS.length} cuentas abiertas</Chip>
      </div>
      <div className="mt-2 space-y-1.5 rounded-sm border border-line bg-card p-1.5 text-[10px] text-fg-slate">
        <div className="flex flex-wrap items-center gap-1.5">
          <span>Reporte:</span>
          <Select className="min-w-[150px]">Antigüedad de Saldos (CxC)</Select>
          <span className="flex-1" />
          <Btn primary>Generar</Btn>
          <Btn className="hidden sm:inline-flex">Exportar</Btn>
        </div>
        <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
          <span>Corte:</span>
          <Select>05/10/2026</Select>
          <span>Cliente:</span>
          <Select>Todos los clientes</Select>
          <span>Vendedor:</span>
          <Select>Todos los vendedores</Select>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {AGING_TOTALS.map((t) => (
          <span key={t.range} className="rounded-full bg-thead px-2 py-0.5 text-[9.5px] text-fg-slate">
            {t.range === "Vigente" ? "Vigente" : `${t.range} días`}: <b className="num">{usd(t.total)}</b>
          </span>
        ))}
        <span className="rounded-full bg-primary px-2 py-0.5 text-[9.5px] font-semibold text-white">
          Total general: <b className="num">{usd(AGING_GRAND)}</b>
        </span>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "Factura", mono: true },
          { label: "Cliente", min: "sm" },
          { label: "Vencimiento", min: "md", mono: true },
          { label: "Saldo pendiente", align: "right", mono: true },
          { label: "Días vencido", align: "right", min: "md", mono: true },
          { label: "Días transcurridos", align: "right", min: "lg", mono: true },
          { label: "Rango" },
        ]}
        rows={AGING_ROWS.map((r) => [
          r.n,
          r.client,
          r.due,
          usd(r.bal),
          String(r.overdue),
          String(r.elapsed),
          r.range,
        ])}
      />
    </div>
  );
}


/* ------------------------- Nueva factura (viva) ----------------------- */

export function NuevaFacturaScreen({ dense, rows }: P & { rows: number }) {
  const lines = INVOICE.lines.slice(0, rows);
  const total = lines.reduce((s, l) => s + l.boxes * l.price, 0);
  return (
    <div>
      <Crumb>Facturación / Nueva factura</Crumb>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Title sub={`Cliente: ${INVOICE.client} · Vendedor: ${INVOICE.seller}`}>Nueva factura</Title>
        <Chip tone="success">Caja abierta: {INVOICE.caja}</Chip>
      </div>
      <Grid
        className="mt-2"
        dense={dense}
        cols={[
          { label: "Producto" },
          { label: "Cajas", align: "right", mono: true },
          { label: "Precio 1", align: "right", min: "sm", mono: true },
          { label: "Subtotal", align: "right", mono: true },
        ]}
        rows={lines.map((l) => [l.name, fmt0(l.boxes), usd(l.price), usd(l.boxes * l.price)])}
      />
      <div className="mt-2 flex items-end justify-between border border-line bg-card px-3 py-2">
        <span className="text-[10px] text-fg-muted">
          {lines.length} {lines.length === 1 ? "renglón" : "renglones"}
        </span>
        <span className="text-right">
          <span className="block text-[9px] text-fg-muted">Total</span>
          <span className="num text-[20px] leading-none text-fg">{usd(total)}</span>
        </span>
      </div>
    </div>
  );
}
