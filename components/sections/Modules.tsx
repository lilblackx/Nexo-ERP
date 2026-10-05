"use client";

import { useState } from "react";
import AppFrame, { type ScreenId } from "@/components/appframe/AppFrame";
import SectionHead from "@/components/SectionHead";
import { features } from "@/lib/features";
import { cn } from "@/lib/utils";

type Mod = {
  id: string;
  name: string;
  group: string;
  summary: string;
  points: string[];
  screen: ScreenId;
};

/*
 * Basado en el menú real de la app. Solo funciones vistas en las capturas o confirmadas.
 * TODO(luis): detallar Cuentas por Cobrar BCV, Cajas, Bancos, Usuarios, Auditoría y la lista completa de reportes.
 */
const MODULES: Mod[] = [
  {
    id: "facturacion",
    name: "Facturación y cobro",
    group: "Operaciones",
    summary:
      "Listado de ventas con búsqueda, filtros y exportación. Cada factura lleva condición de pago, método y estado; puedes ver el detalle o anularla. La caja abierta se ve desde la misma pantalla.",
    points: [
      "Nueva factura desde el listado",
      ...(features.pagoMixto ? ["Pago mixto: efectivo en dólares y pago móvil en bolívares"] : []),
      ...(features.vuelto ? ["Vuelto anotado en el cobro"] : []),
      "Estados: Emitida, Pagada, Parcial, Vencida y Anulada",
    ],
    screen: "facturacion",
  },
  {
    id: "compras",
    name: "Compras y proveedores",
    group: "Compras",
    summary:
      "Órdenes de compra, recepciones y facturas de proveedor en pestañas. Cada proveedor tiene sus días de crédito.",
    points: [
      "Nueva orden de compra, ver detalle y enmendar",
      "Recepciones de mercancía",
      "Proveedores con identificación, teléfono, correo y días de crédito",
    ],
    screen: "compras",
  },
  {
    id: "inventario",
    name: "Inventario",
    group: "Inventario",
    summary:
      "Catálogo de productos con la existencia por caja y a granel, el costo y tres niveles de precio.",
    points: [
      "Código, categoría, cantidad, cajas y a granel",
      "Costo y tres precios por producto",
      "Editar, cambiar estado y exportar",
      "Auditoría desde el catálogo",
    ],
    screen: "productos",
  },
  {
    id: "cuentas",
    name: "Cuentas por cobrar y por pagar",
    group: "Finanzas",
    summary:
      "Cuentas por Cobrar, Cuentas por Cobrar BCV y Cuentas por Pagar tienen su propio módulo en Finanzas. El reporte de antigüedad de saldos las resume por rango de vencimiento.",
    points: [
      "Vigente, 1-30, 31-60, 61-90 y más de 90 días",
      "Filtros por corte, cliente y vendedor",
      "Generar y exportar",
    ],
    screen: "reportes",
  },
  {
    id: "cajas",
    name: "Cajas y bancos",
    group: "Finanzas",
    summary:
      "Cajas, Cuentas Bancarias y Bancos viven en Finanzas. Facturación muestra qué caja está abierta y el panel lista las cajas activas.",
    points: ["Caja abierta visible al facturar", "Cajas activas en el panel general", "Cuentas bancarias y bancos"],
    screen: "panel",
  },
  {
    id: "tasas",
    name: "Tasas de cambio",
    group: "Finanzas",
    summary:
      "Registras la tasa del día y queda fija en la barra superior de toda la aplicación, con su hora de actualización.",
    points: [
      "Tasa BCV, dólar paralelo y peso colombiano",
      "Brecha entre BCV y paralelo",
      "Histórico y exportación",
      "Registro manual de la tasa del día",
    ],
    screen: "tasas",
  },
  {
    id: "comisiones",
    name: "Comisiones",
    group: "Finanzas",
    summary:
      "Las comisiones se consultan por vendedor, factura por factura, con lo que está por cobrar y lo que ya está liberado.",
    points: [
      "Base, monto de venta, comisión y estado",
      "Filtro de solo con porcentaje BCV",
      "Pago de comisiones desde la pantalla",
    ],
    screen: "comisiones",
  },
  {
    id: "reportes",
    name: "Reportes",
    group: "Reportes",
    summary: "Reportes financieros y de cumplimiento fiscal, con filtros y exportación.",
    points: ["Antigüedad de saldos (CxC)", "Corte, cliente, vendedor y orden", "Generar y exportar"],
    screen: "reportes",
  },
  {
    id: "admin",
    name: "Usuarios y auditoría",
    group: "Administración",
    summary:
      "La administración reúne Configuración, Usuarios y Auditoría. En Configuración están los datos de la empresa, el logo, el IVA, la impresora predeterminada, el pie de factura y la licencia.",
    points: ["Datos de la empresa y logo", "IVA configurable", "Impresora predeterminada y pie de factura", "Licencia"],
    screen: "panel",
  },
];

export default function Modules() {
  const [active, setActive] = useState(MODULES[0].id);
  const mod = MODULES.find((m) => m.id === active)!;
  const idx = MODULES.findIndex((m) => m.id === active);

  return (
    <section id="modulos" className="py-20 sm:py-28">
      <div className="container">
        <SectionHead n="04" label="Módulos" title="El menú completo, módulo por módulo.">
          Estos son los módulos del sistema tal como aparecen en el menú de la aplicación.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-6">
          <div
            role="tablist"
            aria-label="Módulos del sistema"
            aria-orientation="vertical"
            className="scrollbar-none -mx-4 col-span-12 flex gap-2 overflow-x-auto px-4 lg:col-span-4 lg:mx-0 lg:block lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0"
          >
            {MODULES.map((m, i) => {
              const on = m.id === active;
              return (
                <button
                  key={m.id}
                  role="tab"
                  id={`mod-${m.id}`}
                  aria-selected={on}
                  aria-controls="mod-panel"
                  onClick={() => setActive(m.id)}
                  className={cn(
                    "flex shrink-0 items-baseline gap-3 whitespace-nowrap border px-3.5 py-2.5 text-left text-sm transition-colors duration-200 ease-nexo lg:w-full lg:whitespace-normal lg:border-0 lg:border-b lg:border-l-2 lg:px-4 lg:py-3.5",
                    on
                      ? "border-primary bg-primary font-semibold text-white lg:border-b-line lg:border-l-primary lg:bg-tint-50 lg:text-primary"
                      : "border-line bg-card text-fg-slate hover:text-primary lg:border-b-line lg:border-l-transparent lg:bg-transparent",
                  )}
                >
                  <span className={cn("num hidden w-5 text-xs lg:inline", on ? "text-primary" : "text-fg-light")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m.name}
                </button>
              );
            })}
          </div>

          <div
            id="mod-panel"
            role="tabpanel"
            aria-labelledby={`mod-${mod.id}`}
            className="col-span-12 min-w-0 lg:col-span-8"
          >
            <div key={mod.id} className="animate-fade">
              <p className="folio">
                {String(idx + 1).padStart(2, "0")} · {mod.group}
              </p>
              <h3 className="mt-2 text-h3">{mod.name}</h3>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-fg-medium">{mod.summary}</p>
              <ul className="mt-5 grid max-w-[60ch] gap-x-8 sm:grid-cols-2">
                {mod.points.map((p) => (
                  <li key={p} className="border-t border-line py-2.5 text-sm text-fg-slate">
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <AppFrame screen={mod.screen} dense />
                <p className="mt-2 font-mono text-[12px] text-fg-muted">Pantalla de ejemplo con datos ficticios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
