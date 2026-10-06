import { ArrowRight, Ban, Eye, FileText, HandCoins, History, SquarePen, RefreshCw, TrendingUp, TriangleAlert } from "lucide-react";
import { demo, bs, cop, dateEs, num, pct, usd } from "@/lib/demo";
import {
  Badge,
  Btn,
  BtnExport,
  BtnFilter,
  BtnNew,
  Chip,
  Pager,
  PageHead,
  SearchInput,
  Select,
  Table,
  Toolbar,
} from "./parts";
import { STATE } from "./tokens";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const dayName = (iso: string) => DAYS[new Date(`${iso}T12:00:00Z`).getUTCDay()];

/** Curva suave (Catmull-Rom → Bézier) por los puntos de ventas de la semana. */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function WeekChart() {
  const week = demo.dashboard.week;
  const W = 700;
  const H = 112;
  const max = Math.max(...week.map((w) => w.amount)) * 1.05;
  const pts = week.map((w, i) => [10 + (i * (W - 20)) / (week.length - 1), H - 8 - (w.amount / max) * (H - 24)] as [number, number]);
  const line = smooth(pts);
  return (
    <svg width={W} height={H + 22} viewBox={`0 0 ${W} ${H + 22}`} style={{ display: "block", marginTop: 6 }}>
      <defs>
        <linearGradient id="af-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0D47A1" stopOpacity="0.16" />
          <stop offset="1" stopColor="#0D47A1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${pts.at(-1)![0]},${H} L${pts[0][0]},${H} Z`} fill="url(#af-area)" />
      <path d={line} fill="none" stroke="#0D47A1" strokeWidth="2.2" />
      {week.map((w, i) => (
        <text key={w.day} x={pts[i][0]} y={H + 16} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="inherit">
          {dayName(w.day)}
        </text>
      ))}
    </svg>
  );
}

/** Panel General (dashboard). */
export function PanelScreen() {
  const d = demo.dashboard;
  const kpis = [
    { t: "Ventas de hoy", v: usd(d.salesToday), s: `+${d.salesVsYesterdayPct.toFixed(1)}% vs ayer`, c: "#16A34A", ico: <TrendingUp size={15} color="#0D47A1" />, bg: "#DBEAFE" },
    { t: "Por cobrar", v: usd(d.receivable), s: `${d.receivableOverdueInvoices} facturas vencidas`, c: "#DC2626", ico: <FileText size={15} color="#0284C7" />, bg: "#E0F2FE" },
    { t: "Por pagar", v: usd(d.payable), s: `${d.payableOverdue} compras vencidas`, c: "#DC2626", ico: <HandCoins size={15} color="#D97706" />, bg: "#FEF3C7" },
    { t: "Stock bajo", v: String(d.lowStock), s: "Stock o vencimiento", c: "#D97706", ico: <TriangleAlert size={15} color="#DC2626" />, bg: "#FEE2E2" },
  ];
  return (
    <>
      <PageHead
        title="Panel general"
        sub="Resumen de la operación · Administrador (ADMIN)"
        right={<BtnNew>Nueva factura</BtnNew>}
      />
      <div className="af-kpis">
        {kpis.map((k) => (
          <div key={k.t} className="af-kpi">
            <div className="af-kpi-top">
              {k.t}
              <span className="af-kpi-ico" style={{ background: k.bg }}>
                {k.ico}
              </span>
            </div>
            <div className="af-kpi-val">{k.v}</div>
            <div className="af-kpi-sub" style={{ color: k.c }}>
              {k.s}
            </div>
          </div>
        ))}
      </div>
      <div className="af-grid-2" style={{ marginBottom: 14 }}>
        <div className="af-card af-panel" style={{ height: 206 }}>
          <div className="af-panel-title">Ventas de la semana</div>
          <div className="af-panel-sub">Total facturado por día, últimos 7 días</div>
          <WeekChart />
        </div>
        <div className="af-card af-panel" style={{ height: 206 }}>
          <div className="af-panel-title">Cajas activas</div>
          <div className="af-panel-sub">Estado de turnos abiertos hoy</div>
          {d.activeRegisters.map((c) => (
            <div key={c.name} className="af-list-row" style={{ marginTop: 14 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{c.cashier}</div>
              </div>
              <Badge color="#16A34A">{c.status}</Badge>
            </div>
          ))}
        </div>
      </div>
      <div className="af-grid-2">
        <div className="af-card af-panel" style={{ height: 178 }}>
          <div className="af-list-row" style={{ alignItems: "flex-start", padding: 0 }}>
            <div>
              <div className="af-panel-title">Facturas recientes</div>
              <div className="af-panel-sub">Últimos movimientos de ventas</div>
            </div>
            <span className="af-link">
              <ArrowRight size={14} /> Ver más
            </span>
          </div>
          {d.recentInvoices.slice(0, 3).map((f) => (
            <div key={f.number} className="af-list-row">
              <span style={{ width: 90, fontWeight: 700 }}>{f.number}</span>
              <span style={{ flex: 1, color: "#334155" }}>{f.client}</span>
              <span>{usd(f.amount)}</span>
              <Badge color={STATE.factura.EMITIDA}>Emitida</Badge>
            </div>
          ))}
        </div>
        <div className="af-card af-panel" style={{ height: 178 }}>
          <div className="af-panel-title">Inventario en alerta</div>
          <div className="af-panel-sub">Stock por debajo del mínimo</div>
          {d.stockAlerts.map((a) => (
            <div key={a.code} className="af-list-row" style={{ alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{a.category}</div>
              </div>
              <span style={{ fontWeight: 700, color: "#DC2626" }}>{a.units} und.</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const METHOD_COL: Record<string, string> = { "—": "N/A", efectivo: "efectivo", mixto: "Mixto" };

/** Facturación de Ventas: listado. */
export function FacturacionScreen() {
  const rows = [...demo.invoices].sort((a, b) => (a.number < b.number ? 1 : -1));
  const caja = demo.cashRegisters.find((c) => c.status === "ABIERTA");
  return (
    <>
      <PageHead
        title="Facturación de Ventas"
        chips={
          <>
            <Chip>{rows.length} facturas</Chip>
            {caja && <Chip tone="green">Caja abierta: {caja.name}</Chip>}
          </>
        }
      />
      <Toolbar>
        <SearchInput placeholder="Buscar por N° de factura, cliente o vendedor…" width={410} focus />
        <span className="af-spacer" />
        <BtnNew>Nueva Factura</BtnNew>
        <BtnFilter />
        <BtnExport />
      </Toolbar>
      <Table
        height={364}
        columns={[
          { label: "N° Factura", w: "120px" },
          { label: "Cliente", w: "1.5fr" },
          { label: "Vendedor", w: "1fr" },
          { label: "Fecha", w: "110px" },
          { label: "Condición", w: "1fr" },
          { label: "Método pago", w: "130px", align: "c" },
          { label: "Total", w: "110px", align: "r" },
          { label: "Estado", w: "110px", align: "c" },
        ]}
        rows={rows.map((f) => [
          f.number,
          f.client,
          f.seller,
          dateEs(f.issued),
          f.condition === "contado" ? "Contado" : "Crédito",
          METHOD_COL[f.paymentColumn] ?? f.paymentColumn,
          usd(f.status === "ANULADA" ? 0 : f.subtotal),
          <Badge key="s" color={STATE.factura[f.status]}>
            {f.status.charAt(0) + f.status.slice(1).toLowerCase()}
          </Badge>,
        ])}
      />
      <Pager>
        <Btn>
          <Eye size={15} /> Ver detalle
        </Btn>
        <Btn>
          <Ban size={15} /> Anular factura
        </Btn>
      </Pager>
    </>
  );
}

/** Tasas de Cambio. */
export function TasasScreen() {
  const r = demo.rates;
  const hist = [...demo.rateHistory].reverse();
  const col = (label: string, value: string, sub?: string) => (
    <div style={{ flex: 1, padding: "0 22px", borderLeft: "1px solid #cbd5e1" }}>
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>▲ {sub} vs. ayer</div>}
    </div>
  );
  return (
    <>
      <PageHead title="Tasas de Cambio" />
      <div className="af-card" style={{ display: "flex", alignItems: "center", padding: "14px 0", marginBottom: 14 }}>
        <div style={{ flex: 1, padding: "0 22px" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Tasa BCV (Bs./USD)</div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>{bs(r.bcv)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>▲ {pct(r.bcvVsAyerPct)} vs. ayer</div>
        </div>
        {col("Dólar Paralelo (Bs./USD)", bs(r.paralelo), pct(r.paraleloVsAyerPct))}
        {col("Peso Colombiano (COP/USD)", cop(r.cop))}
        <div style={{ flex: 1, textAlign: "right", padding: "0 22px", fontSize: 12, color: "#475569" }}>
          Vigente desde el {dateEs(r.vigenteDesde, true)}
        </div>
      </div>
      <Toolbar>
        <span className="af-label-chip">Histórico:</span>
        <Select width={160}>Últimos 30 días</Select>
        <span className="af-spacer" />
        <BtnNew>Registrar tasa del día</BtnNew>
        <BtnExport />
      </Toolbar>
      <Table
        height={290}
        columns={[
          { label: "Fecha", w: "1.2fr" },
          { label: "Tasa BCV", w: "1fr", align: "r" },
          { label: "Dólar paralelo", w: "1fr", align: "r" },
          { label: "Brecha", w: "1fr", align: "r" },
        ]}
        rows={hist.map((h) => [dateEs(h.fecha, true), bs(h.bcv), bs(h.paralelo), pct(h.brecha)])}
      />
    </>
  );
}

/** Catálogo de productos (Inventario). */
export function ProductosScreen() {
  const alerts = demo.products.filter((p) => p.lowStock).length;
  const expiring = demo.dashboard.stockAlerts.filter((a) => a.expires).length;
  const rows = [...demo.products].sort((a, b) => a.name.localeCompare(b.name, "es"));
  return (
    <>
      <PageHead
        title={<span>CATÁLOGO DE PRODUCTOS</span>}
        chips={
          <>
            <Chip>{rows.length} productos</Chip>
            <Chip tone="amber">
              <TriangleAlert size={13} style={{ marginRight: 6 }} />
              {alerts} con stock bajo · {expiring} por vencer
            </Chip>
          </>
        }
      />
      <Toolbar>
        <SearchInput placeholder="Buscar por código o nombre…" width={290} />
        <span className="af-spacer" />
        <BtnNew>Nuevo Producto</BtnNew>
        <Btn>
          <History size={15} /> Auditoría
        </Btn>
        <BtnFilter />
        <BtnExport />
      </Toolbar>
      {/* TODO(luis): corregir en la app antes de recapturar: la columna "AGRANEL" son unidades sueltas, no peso ni volumen. */}
      <Table
        height={378}
        columns={[
          { label: "Código", w: "92px" },
          { label: "Nombre", w: "1.7fr" },
          { label: "Categoría", w: "100px" },
          { label: "Cantidad", w: "92px", align: "r" },
          { label: "Cajas", w: "70px", align: "r" },
          { label: "Sueltas", w: "80px", align: "r" },
          { label: "Costo", w: "78px", align: "r" },
          { label: "Precio 1", w: "82px", align: "r" },
          { label: "Precio 2", w: "82px", align: "r" },
          { label: "Precio 3", w: "82px", align: "r" },
          { label: "Estado", w: "88px", align: "c" },
        ]}
        rows={rows.map((p) => [
          p.code,
          <span key="n" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {p.lowStock && <TriangleAlert size={15} color="#D97706" fill="#D97706" stroke="#fff" />}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
          </span>,
          p.category,
          num(p.units),
          p.boxes,
          p.loose,
          usd(p.cost),
          usd(p.p1),
          usd(p.p2),
          usd(p.p3),
          <Badge key="s" color={STATE.activo.ACTIVO}>
            Activo
          </Badge>,
        ])}
      />
      <Pager>
        <Btn>
          <SquarePen size={15} /> Editar seleccionado
        </Btn>
        <Btn>
          <RefreshCw size={14} /> Cambiar estado
        </Btn>
      </Pager>
    </>
  );
}
