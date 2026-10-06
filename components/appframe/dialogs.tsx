import { ArrowLeftRight, Check, FileText, Plus, Save, ShieldAlert, Trash2, X } from "lucide-react";
import { CURRENCY_LABEL, METHOD_LABEL, bs, dateEs, demo, num, round2, usd } from "@/lib/demo";
import type { Invoice, InvoiceDraft, InvoiceLine, Payment } from "@/lib/demo";
import { Btn, Dialog, Field, Input, SelectField, Table, Tabs, WinControls, cx } from "./parts";

/** Datos de una factura en curso que muestra el diálogo "Nueva Factura". */
export interface DraftView {
  number?: string;
  client: string;
  seller: string;
  condition: "contado" | "credito";
  due?: string | null;
  lines: InvoiceLine[];
  discount: number;
  ivaPct: number;
  payments: Payment[];
  /** Con `change`, se muestra el vuelto a entregar. */
  change?: { usd: number; method: string; origin: string; note?: string } | null;
}

export const draftHero = (): DraftView => {
  const d: InvoiceDraft = demo.invoiceDraft;
  return {
    number: d.number,
    client: d.client,
    seller: d.seller,
    condition: d.condition,
    lines: d.lines,
    discount: d.discount,
    ivaPct: d.ivaPct,
    payments: d.payments,
    change: d.change,
  };
};

/** FV-000010: crédito con descuento "Cliente frecuente" autorizado por otro usuario. */
export const draftDiscount = (): DraftView => {
  const f = demo.invoices.find((i) => i.number === "FV-000010") as Invoice;
  return {
    number: f.number,
    client: f.client,
    seller: f.seller,
    condition: "credito",
    due: f.due,
    lines: f.lines,
    discount: f.discount,
    ivaPct: f.ivaPct,
    payments: [],
  };
};

export const totalsOf = (v: DraftView) => {
  const subtotal = round2(v.lines.reduce((s, l) => s + l.subtotal, 0));
  const net = round2(subtotal - v.discount);
  const iva = round2(net * (v.ivaPct / 100));
  return { subtotal, iva, total: round2(net + iva) };
};

const Cancel = () => (
  <Btn>
    <X size={14} strokeWidth={3} /> Cancelar
  </Btn>
);

function NewInvoiceHead() {
  return (
    <div className="af-dlg-head">
      <span className="af-dlg-ico">
        <FileText size={22} />
      </span>
      <div>
        <div className="af-dlg-title">Nueva Factura</div>
        <div className="af-dlg-sub">Seleccione el cliente, agregue productos y emita la factura.</div>
      </div>
      <span className="af-rate-pill">
        Tasa BCV: {demo.rates.bcv.toFixed(2)} Bs/USD ({dateEs(demo.today)})
      </span>
    </div>
  );
}

const payAmount = (p: Payment) =>
  p.currency === "USD" ? num(p.amount) : `${num(p.amount)} ($${num(p.usd)})`;

/** Pestaña "Formas de Pago". */
function PaymentsTab({ v }: { v: DraftView }) {
  const t = totalsOf(v);
  const paid = round2(v.payments.reduce((s, p) => s + p.usd, 0));
  const missing = round2(t.total - paid);
  const change = v.change;
  return (
    <>
      <div className="af-card" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            Registre una o más formas de pago que cubran el total de la factura.
          </span>
          <Btn kind="soft">
            <Plus size={15} strokeWidth={2.8} /> Agregar forma de pago
          </Btn>
        </div>
        <Table
          height={238}
          columns={[
            { label: "Método", w: "1.1fr" },
            { label: "Moneda", w: "1.2fr" },
            { label: "Monto", w: "1.3fr", align: "r" },
            { label: "Origen / Referencia", w: "1.4fr" },
            { label: "", w: "88px", align: "c" },
          ]}
          rows={v.payments.map((p) => [
            METHOD_LABEL[p.method] ?? p.method,
            CURRENCY_LABEL[p.currency],
            payAmount(p),
            p.reference ?? p.origin,
            <Btn key="d" kind="danger-soft">
              <Trash2 size={15} fill="currentColor" />
            </Btn>,
          ])}
        />
      </div>
      <div className={missing > 0 ? "af-summary-miss" : "af-summary-ok"}>
        Total factura: {usd(t.total)} &nbsp;·&nbsp; Pagado: {usd(paid)} &nbsp;·&nbsp;{" "}
        {missing > 0 ? `Falta: ${usd(missing)}` : "Cubierto"}
      </div>
      {change && (
        <div>
          <div className="af-change-title">Vuelto a entregar: {usd(change.usd)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Método de vuelto">
              <SelectField value={METHOD_LABEL[change.method] ?? change.method} />
            </Field>
            <Field label="Origen del vuelto">
              <SelectField value={change.origin} />
            </Field>
          </div>
          {change.note && <div className="af-note" style={{ marginTop: -4 }}>{change.note}</div>}
        </div>
      )}
    </>
  );
}

/** Pestaña "Factura": datos, productos y total. */
function InvoiceTab({ v }: { v: DraftView }) {
  const t = totalsOf(v);
  return (
    <>
      <div className="af-card" style={{ padding: "14px 16px", marginBottom: 12 }}>
        <div className="af-section-label">Datos de la factura</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
          <Field label="Cliente" required>
            <Input value={v.client} focus />
          </Field>
          <Field label="Vendedor" required>
            <SelectField value={v.seller} />
          </Field>
          <Field label="Condición de Pago" required>
            <SelectField value={v.condition === "contado" ? "Contado" : "Crédito"} />
          </Field>
          {v.condition === "credito" && v.due ? (
            <Field label="Fecha de Vencimiento">
              <Input value={dateEs(v.due)} />
            </Field>
          ) : (
            <span />
          )}
        </div>
      </div>
      <div className="af-card" style={{ padding: "14px 16px" }}>
        <div className="af-section-label">Productos</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 110px 120px", gap: 10, marginBottom: 10 }}>
          <Input placeholder="Buscar producto…" />
          <SelectField value={v.lines.at(-1)?.product ?? "Producto"} />
          <SelectField value={v.lines.at(-1)?.saleType === "unidad" ? "Unidad" : "Bulto"} />
          <Btn kind="soft" style={{ height: 38, justifyContent: "center" }}>
            <Plus size={14} strokeWidth={2.8} /> Agregar
          </Btn>
        </div>
        <Table
          height={Math.min(46 * 5, 40 + 45 * Math.max(v.lines.length, 3))}
          columns={[
            { label: "Producto", w: "2.2fr" },
            { label: "Cantidad", w: "1fr" },
            { label: "Precio unit.", w: "1fr", align: "r" },
            { label: "Subtotal", w: "1fr", align: "r" },
            { label: "", w: "56px", align: "c" },
          ]}
          rows={v.lines.map((l) => [
            `${l.code} - ${l.product}`,
            `${num(l.qty)} ${l.saleType}`,
            usd(l.price),
            usd(l.subtotal),
            <Trash2 key="d" size={15} color="#DC2626" fill="currentColor" />,
          ])}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569" }}>
            Descuento de factura:
            <span className="af-input is-value is-right" style={{ width: 110, height: 32 }}>
              $ {num(v.discount)}
            </span>
          </span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            Total: {usd(t.subtotal)}
            {v.discount > 0 ? ` − ${usd(v.discount)}` : ""} + {usd(t.iva)} IVA = {usd(t.total)}
          </span>
        </div>
      </div>
    </>
  );
}

/** Diálogo "Nueva Factura" con sus pestañas "Factura" y "Formas de Pago". */
export function NuevaFacturaDialog({ tab, draft }: { tab: "factura" | "pagos"; draft: DraftView }) {
  return (
    <Dialog
      title="Nueva Factura"
      width={790}
      height={716}
      foot={
        <>
          <Cancel />
          <Btn kind="primary">
            <Check size={15} strokeWidth={3} /> Facturar
          </Btn>
        </>
      }
    >
      <NewInvoiceHead />
      <Tabs tabs={["Factura", "Formas de Pago"]} active={tab === "factura" ? "Factura" : "Formas de Pago"} />
      {tab === "factura" ? <InvoiceTab v={draft} /> : <PaymentsTab v={draft} />}
    </Dialog>
  );
}

/** Autorización de supervisor: otro usuario con permiso, sin cerrar la sesión de quien opera. */
export function AutorizacionDialog({ reason = "Cliente frecuente", user = "admin.demo" }: { reason?: string; user?: string }) {
  return (
    <Dialog
      title="Autorización"
      width={460}
      foot={
        <>
          <Btn>Cancelar</Btn>
          <Btn kind="primary">
            <Check size={15} strokeWidth={3} /> Autorizar
          </Btn>
        </>
      }
    >
      <div className="af-dlg-head" style={{ alignItems: "flex-start" }}>
        <ShieldAlert size={26} color="#DC2626" />
        <div>
          <div className="af-dlg-title">Autorización de descuento requerida</div>
          <div className="af-dlg-sub af-wrap" style={{ lineHeight: 1.4 }}>
            Esta factura tiene un item por debajo del precio de lista y/o un descuento manual. Un supervisor debe
            autorizarla.
          </div>
        </div>
      </div>
      <Field label="Motivo del descuento" required>
        <Input value={reason} />
      </Field>
      <Field label="Usuario del supervisor" required>
        <Input value={user} />
      </Field>
      <Field label="Clave" required>
        <Input value="•••••••••••" />
      </Field>
    </Dialog>
  );
}

function RateFields({ bcv, paralelo, cop }: { bcv: string; paralelo: string; cop: string }) {
  return (
    <div className="af-card" style={{ padding: "16px 20px 6px" }}>
      <Field label="Tasa BCV (Bs./USD)" required>
        <Input value={bcv} right />
      </Field>
      <Field label="Dólar paralelo (Bs./USD)">
        <Input value={paralelo} right />
      </Field>
      <Field label="Peso colombiano (COP/USD)">
        <Input value={cop} right />
      </Field>
    </div>
  );
}

/** Registrar Tasa del Día. Con `typo`, se tipeó un cero de más y la app pide confirmar el cambio brusco. */
export function TasaRegistroDialog({ typo }: { typo?: boolean }) {
  const r = demo.rates;
  const bcv = typo ? (r.bcv * 10).toFixed(2) : r.bcv.toFixed(2);
  const jump = typo ? Math.round((Number(bcv) / r.bcv - 1) * 100) : 0;
  return (
    <>
      <Dialog
        title="Registrar Tasa del Día"
        width={525}
        foot={
          <>
            <Cancel />
            <Btn kind="primary">
              <Save size={14} fill="currentColor" /> Registrar
            </Btn>
          </>
        }
      >
        <div className="af-dlg-head">
          <span className="af-dlg-ico">
            <ArrowLeftRight size={22} />
          </span>
          <div>
            <div className="af-dlg-title">Registrar Tasa del Día</div>
            <div className="af-dlg-sub af-wrap">Queda como un registro histórico nuevo, no reemplaza el anterior.</div>
          </div>
        </div>
        <RateFields bcv={bcv} paralelo={r.paralelo.toFixed(2)} cop={num(r.cop)} />
      </Dialog>
      {typo && (
        <div className="af-scrim" style={{ background: "rgba(15,23,42,0.0)" }}>
          <div className="af-dialog" style={{ width: 480 }}>
            <div className="af-dlg-bar">
              <span>Cambio brusco detectado</span>
              <WinControls />
            </div>
            <div className="af-dlg-body">
              <div className="af-msg">
                <span className="af-msg-ico" style={{ fontWeight: 700, color: "#0D47A1", fontSize: 18 }}>
                  ?
                </span>
                <span>
                  La tasa nueva difiere mucho de la última registrada (BCV: {jump}%). ¿Revisaste que no sea un error de
                  tipeo? Esto afecta de inmediato todas las conversiones de VES/COP en Facturación y Compras.
                </span>
              </div>
            </div>
            <div className="af-dlg-foot">
              <Btn>Cancelar</Btn>
              <Btn kind="primary">Confirmar</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Abono General: se aplica de la factura más antigua a la más nueva. */
export function AbonoDialog() {
  const c = [...demo.receivablesByClient].find((x) => x.client.startsWith("Supermercado Norte"))!;
  return (
    <Dialog
      title={`Abono General - ${c.client}`}
      width={500}
      foot={
        <>
          <Btn>Cancelar</Btn>
          <Btn kind="primary">Aplicar Abono</Btn>
        </>
      }
    >
      <div className="af-dlg-title" style={{ marginBottom: 14 }}>
        Abono General - {c.client}
      </div>
      <div className="af-card" style={{ padding: 16 }}>
        <div style={{ color: "#475569", marginBottom: 2 }}>
          Deuda total: {usd(c.balance)} ({bs(round2(c.balance * demo.rates.bcv)).replace("Bs. ", "Bs ")})
        </div>
        <div style={{ fontSize: 11, fontStyle: "italic", color: "#64748b", marginBottom: 10 }}>
          El abono se aplicará automáticamente a las facturas más antiguas (FIFO)
        </div>
        <Field label="Método de Pago" required>
          <SelectField value="Efectivo" />
        </Field>
        <Field label="Monto del Abono (USD)" required>
          <Input value={`$ ${num(c.balance)}`} right />
        </Field>
        <Field label="Origen" required>
          <SelectField value="Caja Principal" />
        </Field>
        <Field label="Referencia">
          <Input placeholder="Opcional" />
        </Field>
      </div>
    </Dialog>
  );
}

/** Abrir Turno de Caja: solo un ADMIN completa la apertura. */
export function AbrirCajaDialog() {
  const c = demo.cashRegisters[0];
  return (
    <Dialog
      title="Abrir Turno de Caja"
      width={470}
      foot={
        <>
          <Btn>Cancelar</Btn>
          <Btn kind="primary">Abrir Turno</Btn>
        </>
      }
    >
      <div className="af-dlg-title">Abrir Turno de Caja</div>
      <div className="af-dlg-sub" style={{ marginBottom: 14 }}>
        Identifíquese para poder facturar.
      </div>
      <div className="af-card" style={{ padding: "16px 20px 6px" }}>
        <Field label="Caja" required>
          <SelectField value={c.name} />
        </Field>
        <Field label="Saldo de Apertura">
          <Input value={`$ ${num(c.openingBalance)}`} right />
        </Field>
      </div>
    </Dialog>
  );
}

/** Nota de Devolución de una recepción. */
export function DevolucionDialog() {
  const r = demo.purchases.returns[0];
  return (
    <Dialog
      title={`Nota de Devolución — ${r.reception}`}
      width={480}
      foot={
        <>
          <Btn>Cancelar</Btn>
          <Btn kind="primary">Registrar Devolución</Btn>
        </>
      }
    >
      <div className="af-dlg-title" style={{ marginBottom: 12 }}>
        Nota de Devolución — {r.reception}
      </div>
      <div className="af-card" style={{ padding: "16px 20px 6px" }}>
        <Field label="Motivo" required>
          <SelectField value={r.reason} />
        </Field>
        <Field label="Cantidad a devolver">
          <Input value={String(r.qty)} right />
        </Field>
      </div>
    </Dialog>
  );
}

/** Aviso al anular una factura: se genera la nota de crédito. */
export function NotaCreditoDialog() {
  const n = demo.creditNotes[0];
  return (
    <Dialog
      title="Factura anulada"
      width={500}
      foot={
        <>
          <Btn>No</Btn>
          <Btn kind="primary">Sí</Btn>
        </>
      }
    >
      <div className="af-msg">
        <span className="af-msg-ico" style={{ fontWeight: 700, color: "#0D47A1", fontSize: 18 }}>
          ?
        </span>
        <span>
          Se generó la nota de crédito {n.number} por {usd(n.amount)}. ¿Deseas devolver el dinero al cliente ahora?
        </span>
      </div>
    </Dialog>
  );
}

export { cx };
