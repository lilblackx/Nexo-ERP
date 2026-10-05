import { FileText, Landmark, MapPinned, Percent, ScrollText, ArrowRight, Warehouse } from "lucide-react";
import Reveal, { SectionHeader } from "@/components/Reveal";
import { cn } from "@/lib/utils";

function Card({
  icon: Icon,
  title,
  children,
  className,
  tag,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
  tag: string;
}) {
  return (
    <div
      className={cn(
        "card-surface group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-light/50",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-light/0 blur-3xl transition-colors duration-500 group-hover:bg-primary-light/10"
      />
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-field text-primary-light">
          <Icon className="h-5 w-5" />
        </span>
        <span className="num text-[10px] uppercase tracking-widest text-fg-muted">{tag}</span>
      </div>
      {children}
    </div>
  );
}

function Title({ children, text }: { children?: React.ReactNode; text: string }) {
  return (
    <>
      <h3 className="mt-5 text-lg font-semibold text-fg">{text}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-medium">{children}</p>
    </>
  );
}

/* ------------------------------ Facturación ------------------------------ */

const FLOW = ["Factura", "CxC inmediata", "Pagos multidivisa", "PDF listo"];
const SPLIT = [
  { label: "Efectivo USD", amount: "$1,000.00", pct: 53.5, color: "bg-primary-light" },
  { label: "Pago Móvil VES", amount: "$620.00", pct: 33.1, color: "bg-success" },
  { label: "USDT", amount: "$250.00", pct: 13.4, color: "bg-warning" },
];

function InvoiceCard() {
  return (
    <Card icon={FileText} title="Facturación" tag="01 · ventas" className="lg:col-span-4">
      <Title text="Facturación rápida y pagos mixtos">
        Emite facturas de contado o crédito en segundos. Cada venta genera su cuenta por cobrar inmediata, aplica uno
        o varios pagos en distintas monedas, calcula el vuelto y entrega la factura en PDF al instante.
      </Title>

      <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FLOW.map((s, i) => (
          <li key={s} className="relative rounded-lg border border-line bg-field px-3 py-2.5">
            <span className="num text-[10px] text-primary-light">0{i + 1}</span>
            <p className="text-[13px] text-fg">{s}</p>
            {i < FLOW.length - 1 && (
              <ArrowRight
                aria-hidden
                className="absolute -right-2.5 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 text-fg-muted sm:block"
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-line bg-field p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-fg-medium">Composición del cobro · FAC-0004821</span>
          <span className="num text-fg">$1,870.00 recibido</span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-thead" role="img" aria-label="Composición del pago: 53.5% efectivo USD, 33.1% Pago Móvil VES, 13.4% USDT">
          {SPLIT.map((s) => (
            <div key={s.label} className={s.color} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <ul className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          {SPLIT.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-2 sm:block">
              <span className="flex items-center gap-1.5 text-fg-medium">
                <span className={cn("h-2 w-2 rounded-sm", s.color)} /> {s.label}
              </span>
              <span className="num text-fg sm:mt-0.5 sm:block">{s.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* -------------------------------- Tesorería ------------------------------ */

function TreasuryCard() {
  const rows = [
    { k: "Arqueo ciego por turno", v: "Turno 14", tone: "text-warning-text" },
    { k: "Cobros conciliados", v: "12 / 12", tone: "text-success-text" },
    { k: "Depósitos y transferencias", v: "Banco ↔ caja", tone: "text-fg-slate" },
  ];
  return (
    <Card icon={Landmark} title="Tesorería" tag="02 · caja" className="lg:col-span-2">
      <Title text="Tesorería y cajas blindadas">
        El cajero declara el efectivo sin ver el saldo del sistema. Control de transferencias, depósitos bancarios,
        conciliación de cuentas y custodia de efectivo.
      </Title>
      <ul className="mt-6 space-y-2">
        {rows.map((r) => (
          <li
            key={r.k}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-field px-3 py-2.5 text-xs"
          >
            <span className="text-fg-medium">{r.k}</span>
            <span className={cn("num", r.tone)}>{r.v}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------------- Logística ------------------------------ */

function RouteMap() {
  return (
    <svg
      viewBox="0 0 420 210"
      className="mt-6 w-full rounded-xl border border-line bg-field"
      role="img"
      aria-label="Mapa oscuro de zonas comerciales con ruta de despacho y estado de entrega por cliente"
    >
      <defs>
        <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="rgb(148 163 184 / .35)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="420" height="210" fill="url(#mapgrid)" />
      {/* calles */}
      <g stroke="#FFFFFF" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M-10 150 C 90 140, 150 110, 240 112 S 380 80, 430 60" />
        <path d="M60 -10 C 70 60, 110 110, 118 220" />
        <path d="M250 -10 C 240 50, 262 120, 330 220" />
      </g>
      <g stroke="rgb(203 213 225)" strokeWidth="3" fill="none">
        <path d="M-10 60 L 430 100" />
        <path d="M170 -10 L 190 220" />
      </g>
      {/* zonas */}
      <g fill="rgb(13 71 161 / .06)" stroke="rgb(21 101 192 / .45)" strokeDasharray="3 4">
        <rect x="270" y="20" width="120" height="70" rx="8" />
        <rect x="14" y="108" width="100" height="80" rx="8" />
      </g>
      {/* ruta */}
      <path
        d="M60 160 C 100 140, 130 120, 190 112 S 260 100, 300 62 S 350 50, 360 40"
        fill="none"
        stroke="#1565C0"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        className="animate-dash"
        strokeLinecap="round"
      />
      {/* almacén */}
      <rect x="50" y="150" width="20" height="20" rx="4" fill="#0D47A1" />
      <rect x="55" y="156" width="10" height="8" rx="1" fill="#FFFFFF" />
      {/* clientes */}
      <g stroke="#FFFFFF" strokeWidth="2">
        <circle cx="190" cy="112" r="7" fill="#16A34A" />
        <circle cx="300" cy="62" r="7" fill="#D97706" />
        <circle cx="360" cy="40" r="7" fill="#94A3B8" />
        <circle cx="88" cy="128" r="6" fill="#16A34A" />
        <circle cx="330" cy="150" r="6" fill="#94A3B8" />
        <circle cx="140" cy="40" r="6" fill="#D97706" />
      </g>
    </svg>
  );
}

function LogisticsCard() {
  return (
    <Card icon={MapPinned} title="Logística" tag="03 · rutas" className="lg:col-span-3">
      <Title text="Visor logístico y geolocalización">
        Mapea clientes por zonas comerciales, sigue el estado de cada entrega y ordena el despacho de los choferes con
        un visor de rutas integrado en la aplicación.
      </Title>
      <RouteMap />
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-fg-muted">
        <li className="flex items-center gap-1.5"><Warehouse className="h-3 w-3 text-primary-light" /> Almacén</li>
        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Entregado</li>
        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> En ruta</li>
        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fg-light" /> Pendiente</li>
      </ul>
    </Card>
  );
}

/* -------------------------------- Comisiones ----------------------------- */

const SELLERS = [
  { name: "J. Pérez", collected: 18400, goal: 20000, commission: 460.0 },
  { name: "A. Salcedo", collected: 12750, goal: 15000, commission: 318.75 },
  { name: "L. Mendoza", collected: 9200, goal: 12000, commission: 230.0 },
];
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function CommissionsCard() {
  return (
    <Card icon={Percent} title="Comisiones" tag="04 · vendedores" className="lg:col-span-3">
      <Title text="Comisiones y vendedores">
        Porcentaje calculado automáticamente sobre lo realmente cobrado, avance contra metas mensuales y liquidaciones
        sin margen de error humano.
      </Title>
      <div className="mt-6 space-y-3">
        {SELLERS.map((s) => {
          const pct = Math.round((s.collected / s.goal) * 100);
          return (
            <div key={s.name} className="rounded-lg border border-line bg-field p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg">{s.name}</span>
                <span className="num text-success-text">{usd.format(s.commission)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-thead">
                <div className="h-full rounded-full bg-primary-light" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-fg-muted">
                <span className="num">{usd.format(s.collected)} cobrado</span>
                <span className="num">{pct}% de la meta</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* -------------------------------- Auditoría ------------------------------ */

const LOG = [
  { t: "14:32:07", ev: "ANULACIÓN", detail: "FAC-0004790 · motivo: error de cliente", who: "Sup. R. Díaz", tone: "text-warning-text" },
  { t: "14:10:41", ev: "NOTA CRÉDITO", detail: "NC-0000312 · $85.00", who: "Sup. R. Díaz", tone: "text-primary-light" },
  { t: "13:58:20", ev: "CAMBIO PRECIO", detail: "ARR-0031 · 17.50 → 18.00", who: "Gerencia", tone: "text-primary-light" },
  { t: "13:41:03", ev: "VUELTO AUTORIZADO", detail: "$20.00 · vía Banco · FAC-0004821", who: "Sup. R. Díaz", tone: "text-success-text" },
];

function AuditCard() {
  return (
    <Card icon={ScrollText} title="Auditoría" tag="05 · trazabilidad" className="lg:col-span-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <Title text="Auditoría e inmutabilidad">
            Trazabilidad absoluta de cada anulación, nota de crédito, modificación de precio y autorización de
            supervisor. Sabes quién hizo qué, cuándo y con qué justificación.
          </Title>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-field">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="num ml-2 text-[11px] text-fg-muted">Registro de auditoría</span>
          </div>
          <ul className="divide-y divide-line text-xs">
            {LOG.map((l) => (
              <li key={l.t} className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-0.5 px-3 py-2.5 sm:grid-cols-[4.5rem_9.5rem_1fr_auto]">
                <span className="num text-fg-muted">{l.t}</span>
                <span className={cn("num", l.tone)}>{l.ev}</span>
                <span className="num col-start-2 text-fg-medium sm:col-start-auto">{l.detail}</span>
                <span className="col-start-2 text-fg-muted sm:col-start-auto">{l.who}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function Modules() {
  return (
    <section id="modulos" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeader
            kicker="Módulos operativos"
            title="Cada área de tu distribuidora, bajo un mismo control."
            description="De la factura en mostrador a la liquidación del vendedor en calle: todo comparte la misma base de datos y la misma verdad contable."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <Reveal className="lg:col-span-4 [&>div]:h-full"><InvoiceCard /></Reveal>
          <Reveal delay={0.06} className="lg:col-span-2 [&>div]:h-full"><TreasuryCard /></Reveal>
          <Reveal className="lg:col-span-3 [&>div]:h-full"><LogisticsCard /></Reveal>
          <Reveal delay={0.06} className="lg:col-span-3 [&>div]:h-full"><CommissionsCard /></Reveal>
          <Reveal className="lg:col-span-6 [&>div]:h-full"><AuditCard /></Reveal>
        </div>
      </div>
    </section>
  );
}
