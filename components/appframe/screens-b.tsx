import { BarChart3, Banknote, Eye, Info, List, Play, SquarePen, Undo2 } from "lucide-react";
import { demo, dateEs, num, usd } from "@/lib/demo";
import type { AgingRange, CxcStatus } from "@/lib/demo";
import {
  Badge,
  Btn,
  BtnExport,
  BtnFilter,
  BtnNew,
  Check,
  Chip,
  Pager,
  PageHead,
  SearchInput,
  Select,
  Table,
  Tabs,
  Toolbar,
  cx,
} from "./parts";
import { STATE, cap } from "./tokens";

export type ComprasTab = "ordenes" | "recepciones" | "facturas";
const TAB_LABEL: Record<ComprasTab, string> = {
  ordenes: "Órdenes de Compra",
  recepciones: "Recepciones",
  facturas: "Facturas",
};

/** Compras: órdenes de compra, recepciones y facturas. */
export function ComprasScreen({ tab = "ordenes" }: { tab?: ComprasTab }) {
  const p = demo.purchases;
  const newLabel = tab === "ordenes" ? "Nueva ODC" : tab === "recepciones" ? "Nueva Recepción" : "Nueva Factura";
  return (
    <>
      <PageHead title="Compras" />
      <Tabs tabs={Object.values(TAB_LABEL)} active={TAB_LABEL[tab]} />
      <Toolbar>
        <SearchInput placeholder="Buscar…" width={350} />
        <span className="af-spacer" />
        <BtnNew>{newLabel}</BtnNew>
        <BtnFilter />
        <BtnExport />
      </Toolbar>
      {tab === "ordenes" && (
        <Table
          height={340}
          columns={[
            { label: "N° ODC", w: "130px" },
            { label: "Proveedor", w: "1.4fr" },
            { label: "Fecha", w: "110px" },
            { label: "Total productos", w: "130px", align: "r" },
            { label: "Cant. rec.", w: "110px", align: "r" },
            { label: "Total", w: "120px", align: "r" },
            { label: "Estado", w: "120px", align: "c" },
          ]}
          rows={[...p.orders]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((o) => [
              o.number,
              o.supplier,
              dateEs(o.date),
              num(o.qty),
              num(o.received),
              usd(o.total),
              <Badge key="s" color={STATE.ordenCompra[o.status]}>
                {cap(o.status)}
              </Badge>,
            ])}
        />
      )}
      {tab === "recepciones" && (
        <Table
          height={340}
          columns={[
            { label: "N° NR", w: "130px" },
            { label: "ODC", w: "130px" },
            { label: "Proveedor", w: "1.4fr" },
            { label: "Fecha", w: "110px" },
            { label: "Usuario", w: "130px" },
            { label: "Estado", w: "120px", align: "c" },
          ]}
          rows={[...p.receptions]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((r) => [
              r.number,
              r.order.replace("ODC-", "ODC-"),
              r.supplier,
              dateEs(r.date),
              r.user,
              <Badge key="s" color={STATE.recepcion[r.status]}>
                {cap(r.status)}
              </Badge>,
            ])}
        />
      )}
      {tab === "facturas" && (
        <Table
          height={340}
          columns={[
            { label: "N° Compra", w: "130px" },
            { label: "ODC", w: "130px" },
            { label: "Proveedor", w: "1.4fr" },
            { label: "Fecha", w: "110px" },
            { label: "Condición", w: "110px" },
            { label: "Total", w: "120px", align: "r" },
            { label: "Estado", w: "120px", align: "c" },
          ]}
          rows={[...p.invoices]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((f) => [
              f.number,
              f.order,
              f.supplier,
              dateEs(f.date),
              f.condition === "contado" ? "Contado" : "Crédito",
              usd(f.total),
              <Badge key="s" color={STATE.facturaCompra[f.status]}>
                {cap(f.status)}
              </Badge>,
            ])}
        />
      )}
      <Pager label={`Página 1 de 1 (${tab === "ordenes" ? p.orders.length : tab === "recepciones" ? p.receptions.length : p.invoices.length})`}>
        <Btn>
          <Eye size={15} /> Ver Detalle
        </Btn>
        {tab === "ordenes" && (
          <Btn>
            <SquarePen size={15} /> Enmendar
          </Btn>
        )}
        {tab === "recepciones" && (
          <Btn>
            <Undo2 size={15} /> Rechazar (Devolución)
          </Btn>
        )}
      </Pager>
    </>
  );
}

const CXC_LABEL: Record<CxcStatus, string> = { vencida: "Vencida", parcial: "Parcial", pagada: "Pagada", pendiente: "Pendiente" };

/** Estado de la fila por cliente: parcial si la factura más antigua ya tiene abonos; si no, el de la factura. */
export function clientStatus(invoices: string[]): CxcStatus {
  const rows = demo.receivables.filter((r) => invoices.includes(r.invoice));
  const oldest = [...rows].sort((a, b) => (a.issued < b.issued ? -1 : 1))[0];
  return oldest.paid > 0 ? "parcial" : oldest.status;
}

/** Cuentas por Cobrar, agrupadas por cliente. */
export function CxcScreen() {
  const rows = [...demo.receivablesByClient].sort((a, b) => b.balance - a.balance);
  return (
    <>
      <PageHead
        title="Cuentas por Cobrar"
        chips={
          <>
            <Chip>{rows.length} clientes con deuda</Chip>
            <Chip tone="green-strong">{usd(rows.reduce((s, r) => s + r.balance, 0))}</Chip>
            <Chip>Tasa BCV: {demo.rates.bcv.toFixed(2)} Bs/USD ({dateEs(demo.today)})</Chip>
          </>
        }
      />
      <Toolbar>
        <SearchInput placeholder="Buscar por cliente…" width={400} focus />
        <span className="af-spacer" />
        <BtnFilter />
        <BtnExport />
      </Toolbar>
      <Table
        height={364}
        columns={[
          { label: "Cliente", w: "1.6fr" },
          { label: "Saldo pendiente", w: "1fr", align: "r" },
          { label: "Saldo a favor", w: "1fr", align: "r" },
          { label: "Días", w: "90px", align: "r" },
          { label: "Fecha factura", w: "1fr" },
          { label: "Estado", w: "120px", align: "c" },
        ]}
        rows={rows.map((c) => {
          const st = clientStatus(c.invoices);
          return [
            c.client,
            usd(c.balance),
            usd(c.creditBalance),
            c.days,
            dateEs(c.issued),
            <Badge key="s" color={STATE.cuenta[st]}>
              {CXC_LABEL[st]}
            </Badge>,
          ];
        })}
      />
      <Pager>
        <Btn>
          <List size={15} /> Ver Detalle
        </Btn>
      </Pager>
    </>
  );
}

/** Días de `b` respecto de `a` (negativo si `a` es posterior): así la app muestra los días vencidos de lo vigente. */
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

const RANGE_LABEL: Record<AgingRange, string> = {
  Vigente: "Vigente",
  "1-30": "1-30 días",
  "31-60": "31-60 días",
  "61-90": "61-90 días",
  "90+": "90+ días",
};

/** Reportes: Antigüedad de Saldos (CxC). */
export function ReportesScreen() {
  const a = demo.aging;
  const ranges: AgingRange[] = ["Vigente", "1-30", "31-60", "61-90", "90+"];
  const lbl = (t: string) => <span className="af-label-chip" style={{ border: 0, background: "none", paddingRight: 4 }}>{t}</span>;
  return (
    <>
      <PageHead
        title={
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="af-dlg-ico" style={{ width: 40, height: 40 }}>
              <BarChart3 size={20} />
            </span>
            <span>
              Reportes
              <span className="af-page-sub" style={{ display: "block", fontSize: 12, fontWeight: 400 }}>
                Reportes financieros y de cumplimiento fiscal
              </span>
            </span>
          </span>
        }
        right={<Chip>{a.rows.length} cuentas abiertas</Chip>}
      />
      <div className="af-card" style={{ padding: 8, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          {lbl("Reporte:")}
          <Select width={360}>Antigüedad de Saldos (CxC)</Select>
          <span className="af-spacer" />
          <Btn kind="primary">
            <Play size={13} fill="currentColor" /> Generar
          </Btn>
          <BtnExport />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {lbl("Corte:")}
          <Select width={130}>{dateEs(a.cutoff)}</Select>
          {lbl("Cliente:")}
          <Select width={200}>Todos los clientes</Select>
          {lbl("Vendedor:")}
          <Select width={200}>Todos los vendedores</Select>
          {lbl("Orden:")}
          <Select width={170}>Vencimiento</Select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {ranges.map((r) => (
          <span
            key={r}
            className="af-chip"
            style={
              r === "Vigente"
                ? undefined
                : { background: "#FEE2E2", color: "#DC2626" }
            }
          >
            {RANGE_LABEL[r]}: {usd(a.totals[r])}
          </span>
        ))}
        <span className="af-chip" style={{ background: "#0D47A1", color: "#fff" }}>
          Total general: {usd(a.total)}
        </span>
      </div>
      <Table
        height={326}
        columns={[
          { label: "Factura", w: "120px" },
          { label: "Cliente", w: "1.4fr" },
          { label: "Vencimiento", w: "120px" },
          { label: "Saldo pendiente", w: "150px", align: "r" },
          { label: "Días vencido", w: "130px", align: "r" },
          { label: "Días transcurridos", w: "160px", align: "r" },
          { label: "Rango", w: "110px" },
        ]}
        rows={a.rows.map((r) => [
          r.invoice,
          r.client,
          dateEs(r.due),
          usd(r.balance),
          daysBetween(r.due, a.cutoff),
          r.elapsedDays,
          RANGE_LABEL[r.range],
        ])}
      />
    </>
  );
}

/** Comisiones (gestión) y "Mis Comisiones" (rol vendedor). */
export function ComisionesScreen({ mine }: { mine?: boolean }) {
  const seller = "María";
  const rows = demo.commissions
    .filter((c) => c.seller === seller)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const pend = rows.filter((r) => r.status === "pendiente").reduce((s, r) => s + r.commission, 0);
  const lib = rows.filter((r) => r.status === "liberada").reduce((s, r) => s + r.commission, 0);
  return (
    <>
      <PageHead
        title={mine ? "Mis Comisiones" : "Comisiones"}
        chips={
          <Chip>
            Por cobrar: {usd(pend)} · Liberada: {usd(lib)}
          </Chip>
        }
      />
      <Toolbar>
        {!mine && (
          <>
            <span className="af-label-chip" style={{ fontWeight: 600 }}>
              Vendedor:
            </span>
            <Select width={250}>{seller}</Select>
          </>
        )}
        <span className="af-spacer" />
        <Check>Solo con porcentaje BCV</Check>
        <BtnFilter />
        <BtnExport />
      </Toolbar>
      <Table
        height={mine ? 300 : 280}
        columns={[
          { label: "Factura", w: "110px" },
          { label: "Cliente", w: "1.5fr" },
          { label: "Fecha cálculo", w: "130px" },
          { label: "Líneas", w: "80px", align: "r" },
          { label: "Monto base", w: "120px", align: "r" },
          { label: "Monto venta", w: "120px", align: "r" },
          { label: "Comisión", w: "100px", align: "r" },
          { label: "Estado", w: "120px", align: "c" },
          { label: "", w: "56px", align: "c" },
        ]}
        rows={rows.map((c) => [
          c.invoice,
          c.client,
          dateEs(c.date),
          c.lines,
          usd(c.base),
          usd(c.sale),
          usd(c.commission),
          <Badge key="s" color={STATE.comision[c.status]}>
            {cap(c.status)}
          </Badge>,
          <List key="l" size={16} color="#64748b" />,
        ])}
      />
      <div className="af-pager" style={{ justifyContent: "flex-end" }}>
        {!mine && (
          <Btn>
            <Banknote size={15} /> Pagar Comisiones
          </Btn>
        )}
      </div>
    </>
  );
}

/** Auditoría: bitácora de eventos por usuario. */
export function AuditoriaScreen() {
  const rows = [...demo.audit].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <PageHead title="Auditoría" chips={<Chip>{rows.length} eventos</Chip>} />
      <Toolbar>
        <SearchInput placeholder="Buscar por acción, módulo, usuario o detalle…" width={340} />
        <span className="af-label-chip" style={{ border: 0, background: "none", fontWeight: 600 }}>
          Desde:
        </span>
        <Select width={150}>{dateEs("2026-09-06")}</Select>
        <span className="af-label-chip" style={{ border: 0, background: "none", fontWeight: 600 }}>
          Hasta:
        </span>
        <Select width={150}>{dateEs(demo.today)}</Select>
        <span className="af-spacer" />
        <BtnFilter />
      </Toolbar>
      <Table
        height={370}
        columns={[
          { label: "Fecha", w: "190px" },
          { label: "Usuario", w: "1fr" },
          { label: "Módulo", w: "130px" },
          { label: "Acción", w: "190px" },
          { label: "Detalle", w: "2.2fr" },
        ]}
        rows={rows.map((r) => [`${dateEs(r.date)} ${r.date.slice(11)}:00`, r.user, r.module, r.action, r.detail])}
      />
      <Pager>
        <Btn>
          <Info size={15} /> Ver detalle
        </Btn>
      </Pager>
    </>
  );
}

/** Cajas: apertura, cierre y corte. */
export function CajasScreen() {
  return (
    <>
      <PageHead title="Cajas" />
      <Toolbar>
        <span className="af-spacer" />
        <BtnNew>Nueva Caja</BtnNew>
        <Btn>Actualizar</Btn>
      </Toolbar>
      <Table
        height={200}
        columns={[
          { label: "Caja", w: "1.2fr" },
          { label: "Estado", w: "110px", align: "c" },
          { label: "Cajero", w: "1fr" },
          { label: "Apertura", w: "160px" },
          { label: "Saldo apertura", w: "130px", align: "r" },
          { label: "Saldo cierre", w: "120px", align: "r" },
          { label: "Movimientos", w: "120px", align: "r" },
        ]}
        rows={demo.cashRegisters.map((c) => [
          c.name,
          <Badge key="s" color={c.status === "ABIERTA" ? "#16A34A" : "#64748B"}>
            {c.status}
          </Badge>,
          c.cashier,
          `${dateEs(c.opened)} ${c.opened.slice(11)}`,
          usd(c.openingBalance),
          c.closingBalance == null ? "—" : usd(c.closingBalance),
          c.movements,
        ])}
      />
      <Pager label="">
        <Btn>Movimiento Manual</Btn>
        <Btn>Ver Historial</Btn>
        <Btn>Cerrar Turno</Btn>
      </Pager>
    </>
  );
}

const LICENSE_TITLE = {
  ACTIVA: "Licencia activa",
  SIN_LICENCIA: "Sin licencia",
  VENCIDA: "Licencia vencida",
  VALIDAR_EN_LINEA: "Validación pendiente",
} as const;
const LICENSE_COLOR = {
  ACTIVA: STATE.licencia.ACTIVA,
  SIN_LICENCIA: STATE.licencia.SIN_LICENCIA,
  VENCIDA: STATE.licencia.otros,
  VALIDAR_EN_LINEA: STATE.licencia.VALIDAR_EN_LINEA,
} as const;

export const READONLY_BANNER_SUFFIX =
  "La app está en modo solo lectura: puede consultar, pero no registrar operaciones. Gestione la licencia en Configuración > Licencia.";

export type LicenseState = keyof typeof LICENSE_TITLE;
export { LICENSE_TITLE, LICENSE_COLOR };

/** Configuración > Licencia. */
export function LicenciaScreen({ state = "ACTIVA" }: { state?: LicenseState }) {
  const l = demo.license;
  return (
    <>
      <PageHead title="Configuración" />
      <Tabs tabs={["Empresa", "Correo", "Licencia"]} active="Licencia" />
      <div className="af-card" style={{ padding: "18px 22px" }}>
        <div className="af-panel-title" style={{ fontSize: 17 }}>
          Licencia
        </div>
        <div className="af-lic-state" style={{ color: LICENSE_COLOR[state], marginTop: 10 }}>
          {LICENSE_TITLE[state]}
        </div>
        {/* TODO(luis): confirmar la redacción exacta del mensaje de cada estado */}
        <div className="af-lic-line">
          Cliente: {l.client} &nbsp; Plan: {l.plan} &nbsp; Vence: {dateEs(l.expires)}
        </div>
        <div className="af-lic-line">Este equipo: SERVIDOR — activa y renueva la licencia de toda la red.</div>
        <div className="af-lic-list" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>
            Estaciones registradas: {l.stations.length} (la licencia permite {l.stationsAllowed})
          </div>
          {l.stations.map((s) => (
            <p key={s.name}>
              • {s.name}
              {s.thisPc ? " (este equipo)" : ""} — último uso {dateEs(s.lastUse)} {s.lastUse.slice(11)} —{" "}
              {s.seat ? "con puesto" : "sin puesto"}
            </p>
          ))}
        </div>
        <div className="af-lic-line" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          ID de este equipo: {l.machineId}… <Btn small>Copiar</Btn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <span className="af-field-label" style={{ margin: 0 }}>
            Clave de licencia:
          </span>
          <span className={cx("af-input")} style={{ width: 280 }}>
            XXXXX-XXXXX-XXXXX-XXXXX
          </span>
          <Btn>Validar ahora</Btn>
          <Btn kind="primary">Activar licencia</Btn>
        </div>
      </div>
    </>
  );
}
