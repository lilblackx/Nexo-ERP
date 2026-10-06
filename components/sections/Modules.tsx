"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import AppFrame, { type Crop, type FrameSpec } from "@/components/appframe/AppFrame";
import SectionHead from "@/components/SectionHead";
import { features } from "@/lib/features";
import { cn } from "@/lib/utils";

/*
 * Módulos reales de la app (master-detail). Textos de reference/brief/02-modulos/ y sus "qué no prometer"
 * (docs/claims.md: C01-C33). Lo que no existe no se menciona; las limitaciones reales van en "Límites".
 */

const PAGE: Crop = { x: 231, y: 32, w: 1049, h: 720 };
const PAGE_M: Crop = { x: 231, y: 92, w: 520, h: 390 };

interface Mod {
  id: string;
  name: string;
  lead: string;
  points: string[];
  limits?: ReactNode;
  frame?: { spec: FrameSpec; focus: Crop; mobileFocus: Crop; caption: string };
  show?: boolean;
}

const MODULES: Mod[] = [
  {
    id: "facturacion",
    name: "Facturación y cobro",
    lead: "Facturas de contado o a crédito, con el control de caja, de crédito y de descuentos que necesita un mostrador.",
    points: [
      "Contado con pago mixto: varios métodos y monedas en una factura, convertidos a dólares con la tasa vigente.",
      "Vuelto en dólares, registrado como egreso de caja o cargo bancario, y visible en la factura impresa.",
      "Crédito con control de límite y de días de crédito del cliente.",
      "Descuentos con autorización de un supervisor, sin cerrar la sesión de quien factura.",
      "Anular repone el stock, conserva la historia y genera una nota de crédito.",
      "IVA configurable por empresa. Factura en PDF e impresión en hoja carta.",
    ],
    limits: (
      <>
        Sin caja con turno abierto no se puede facturar. La factura es un documento digital propio con número de
        control interno; no usa máquina fiscal ni calcula IGTF. {/* TODO(luis): redacción final sobre el carácter fiscal. */}
      </>
    ),
    frame: {
      spec: { screen: "facturacion" },
      focus: PAGE,
      mobileFocus: PAGE_M,
      caption: "Listado de Facturación de Ventas, con la caja abierta.",
    },
  },
  {
    id: "clientes",
    name: "Clientes y vendedores",
    lead: "La ficha comercial de cada cliente y la fuerza de venta que lo atiende.",
    points: [
      "Cliente con vendedor, categoría, límite y días de crédito, y ubicación en el mapa.",
      "Historial del cliente con saldo corrido y notas de crédito disponibles.",
      "Vendedores con su ruta y una meta de activación (facturas al mes por cliente).",
      "Un cliente inactivo no puede facturarse; nada se borra.",
    ],
    limits: "La ubicación del cliente es obligatoria. No hay portal del cliente ni estado de cuenta por correo.",
  },
  {
    id: "rutas",
    name: "Rutas y mapa",
    show: features.rutasMapa,
    lead: "Zonas de venta dibujadas sobre un mapa, con su vendedor asignado.",
    points: [
      "Cada ruta es una zona de cobertura de al menos tres vértices.",
      "Al crear un cliente dentro de una zona, la app sugiere el vendedor de esa zona.",
      "Un mapa general muestra la zona de cada ruta y sus clientes.",
    ],
    limits:
      "El mapa necesita internet; sin conexión puedes escribir la latitud y la longitud a mano. Son zonas de venta, no seguimiento de entregas.",
  },
  {
    id: "compras",
    name: "Compras y proveedores",
    show: features.compras,
    lead: "Del pedido al proveedor hasta la factura de compra, pasando por la recepción.",
    points: [
      "Órdenes de compra con estados Pendiente, Parcial y Completa, y enmiendas con autorización.",
      "Recepciones: la mercancía entra al stock al recibirla, con cantidad rechazada y nota de devolución por motivo.",
      "Facturas de compra de contado o a crédito, que alimentan las cuentas por pagar.",
      "Proveedores con límite y días de crédito.",
    ],
    limits: "El costo del producto es un dato manual: comprar no lo actualiza.",
    frame: {
      spec: { screen: "compras" },
      focus: PAGE,
      mobileFocus: PAGE_M,
      caption: "Compras: órdenes de compra, recepciones y facturas.",
    },
  },
  {
    id: "inventario",
    name: "Inventario",
    lead: "Un catálogo con las existencias como se cuentan en el galpón: en cajas y en unidades sueltas.",
    points: [
      "Cajas y unidades sueltas por producto; se vende por caja o por unidad.",
      "Tres niveles de precio por producto, que eliges en cada línea de la factura.",
      "Costo, stock mínimo y fecha de vencimiento por producto.",
      "Alertas de stock bajo y de productos por vencer, en el catálogo, en el Panel General y en la campana.",
    ],
    limits: "Sin lotes, series ni almacenes múltiples; sin código de barras.",
    frame: {
      spec: { screen: "productos" },
      focus: PAGE,
      mobileFocus: { x: 231, y: 92, w: 560, h: 420 },
      caption: "Catálogo de productos con alertas de stock bajo y por vencer.",
    },
  },
  {
    id: "cuentas",
    name: "Cuentas por cobrar y por pagar",
    lead: "Qué te deben, qué debes y desde cuándo.",
    points: [
      "Cuentas por cobrar agrupadas por cliente, con cobro por factura.",
      "Abono general: se aplica de la factura más antigua a la más nueva.",
      "Cuentas por pagar de las compras a crédito, con pagos en efectivo o bancarios.",
      "Antigüedad de saldos en rangos: Vigente, 1-30, 31-60, 61-90 y 90+.",
    ],
    limits: "No envía recordatorios de cobro ni calcula intereses de mora.",
    frame: {
      spec: { screen: "cxc" },
      focus: PAGE,
      mobileFocus: PAGE_M,
      caption: "Cuentas por cobrar por cliente, con su estado.",
    },
  },
  {
    id: "cajas",
    name: "Cajas y bancos",
    lead: "El efectivo por caja y el saldo de cada cuenta bancaria.",
    points: [
      "Varias cajas, cada una con su turno, sus movimientos y su saldo.",
      "Apertura, cierre y corte impreso; movimientos manuales de entrada y salida.",
      "Cuentas bancarias con saldo en dólares y en bolívares; cobros, pagos, vueltos y comisiones generan sus movimientos.",
    ],
    limits: (
      <>
        Solo un usuario ADMIN abre y cierra turnos, y el monto contado en el cierre no se guarda.
        {/* TODO(luis): confirmar si se publica este límite. */}
      </>
    ),
    frame: {
      spec: { screen: "cajas" },
      focus: PAGE,
      mobileFocus: PAGE_M,
      caption: "Cajas con su estado, cajero y saldos.",
    },
  },
  {
    id: "tasas",
    name: "Tasas de cambio",
    lead: "La tasa del día, registrada a mano y siempre a la vista.",
    points: [
      "Tasa BCV, dólar paralelo y peso colombiano, con histórico de 30, 60 o 90 días.",
      "Brecha entre BCV y paralelo, y variación contra el día anterior en la franja superior.",
      "Aviso de cambio brusco (más de 30 %) y alerta si hoy no se ha registrado la tasa.",
      "Cada factura guarda la tasa vigente al emitirse.",
    ],
    frame: {
      spec: { screen: "tasas" },
      focus: PAGE,
      mobileFocus: PAGE_M,
      caption: "Tasas de Cambio con histórico y brecha, con valores de ejemplo.",
    },
  },
  {
    id: "comisiones",
    name: "Comisiones",
    show: features.comisiones,
    lead: "Lo que gana cada vendedor, ligado a lo que el cliente de verdad paga.",
    points: [
      "Se calcula al facturar, a partir de la diferencia entre el precio vendido y el de lista.",
      "Nace Liberada en contado y Pendiente en crédito, hasta que el cliente paga la factura completa.",
      "Se paga en lote, desde una caja o un banco.",
      "El vendedor ve las suyas en “Mis Comisiones”.",
    ],
    limits: <>{/* TODO(luis): confirmar la regla de negocio de la comisión. */}No hay comisión por meta ni escalonada.</>,
    frame: {
      spec: { screen: "comisiones" },
      focus: PAGE,
      mobileFocus: { x: 231, y: 92, w: 560, h: 400 },
      caption: "Comisiones de un vendedor: Pendiente, Liberada y Pagada.",
    },
  },
  {
    id: "reportes",
    name: "Reportes",
    lead: "44 reportes con exportación a Excel y a PDF.",
    points: [
      "Antigüedad de saldos de cuentas por cobrar y por pagar.",
      "Ventas por período, cliente, vendedor y ruta; facturas anuladas y notas de crédito emitidas.",
      "Compras, stock bajo mínimo, kardex de producto y valorización de inventario.",
      "Arqueo de caja, cierre diario por cajero y movimientos por cuenta bancaria.",
      "Comisiones por vendedor y comisiones pagadas contra pendientes.",
    ],
    limits: "Son tablas con filtros por período: sin gráficos ni envío programado por correo.",
    frame: {
      spec: { screen: "reportes" },
      focus: PAGE,
      mobileFocus: { x: 231, y: 150, w: 520, h: 390 },
      caption: "Reporte de antigüedad de saldos.",
    },
  },
  {
    id: "usuarios",
    name: "Usuarios, roles y auditoría",
    lead: "Quién puede hacer qué, y un registro de quién lo hizo.",
    points: [
      "Roles ADMIN, CAJERO y VENDEDOR, con permisos por pantalla y acción que un administrador puede ajustar.",
      "Bloqueo de la cuenta tras cinco intentos fallidos; contraseñas protegidas con bcrypt.",
      "Autorización de supervisor para descuentos, días de crédito, vuelto bancario y devolución de notas de crédito.",
      "Bitácora de auditoría por usuario, módulo y acción.",
    ],
    limits: "La bitácora es de solo agregar dentro de la aplicación: no es inmutable.",
    frame: {
      spec: { screen: "auditoria" },
      focus: PAGE,
      mobileFocus: { x: 231, y: 92, w: 560, h: 400 },
      caption: "Auditoría: cada evento con su usuario.",
    },
  },
];

export default function Modules() {
  const list = MODULES.filter((m) => m.show !== false);
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const m = list[sel];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (sel + dir + list.length) % list.length;
    setSel(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="modulos" className="py-20 sm:py-28" aria-labelledby="modulos-titulo">
      <div className="container">
        <SectionHead
          n="04"
          label="Módulos"
          title={<span id="modulos-titulo">Los módulos de Nexo, tal como existen hoy.</span>}
        >
          Once áreas del menú, sin promesas de futuro: lo que hace cada una y dónde se detiene.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 gap-y-8 md:gap-x-6">
          {/* Índice */}
          <div
            role="tablist"
            aria-label="Módulos"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="scrollbar-none col-span-12 -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {list.map((x, i) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`mod-tab-${x.id}`}
                aria-selected={i === sel}
                aria-controls="mod-panel"
                tabIndex={i === sel ? 0 : -1}
                onClick={() => setSel(i)}
                className={cn(
                  "flex shrink-0 items-baseline gap-3 whitespace-nowrap border-b-2 px-2 py-3 text-left text-[15px] transition-colors duration-200 ease-nexo lg:whitespace-normal lg:border-b lg:border-line lg:px-0 lg:py-3.5",
                  i === sel
                    ? "border-primary font-bold text-primary lg:border-primary"
                    : "border-transparent text-fg-medium hover:text-fg lg:border-line",
                )}
              >
                <span className="folio w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{x.name}</span>
              </button>
            ))}
          </div>

          {/* Detalle */}
          <div
            id="mod-panel"
            role="tabpanel"
            aria-labelledby={`mod-tab-${m.id}`}
            className="col-span-12 lg:col-span-8"
          >
            <h3 className="text-h3">{m.name}</h3>
            <p className="mt-3 max-w-[60ch] text-lead text-fg-medium">{m.lead}</p>
            <ul className="mt-6 grid max-w-3xl gap-x-8 gap-y-3 text-body text-fg-slate sm:grid-cols-2">
              {m.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <i aria-hidden className="mt-[0.7em] h-1 w-3 shrink-0 bg-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {m.limits && (
              <p className="mt-6 max-w-3xl border-l-2 border-warning pl-4 text-[15px] text-fg-medium">
                <b className="text-fg">Límites. </b>
                {m.limits}
              </p>
            )}
            {m.frame && (
              <div key={m.id} className="mt-8 animate-fade">
                <AppFrame
                  {...m.frame.spec}
                  focus={m.frame.focus}
                  mobileFocus={m.frame.mobileFocus}
                  frameClassName="rounded border border-line"
                  caption={m.frame.caption}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
