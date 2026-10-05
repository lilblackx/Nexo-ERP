"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  Percent,
} from "lucide-react";
import Reveal, { SectionHeader } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const SCREENS = [
  {
    id: "panel",
    label: "Panel general",
    icon: LayoutDashboard,
    src: "/screens/panel-general.png",
    alt: "Panel general de Distribuidora DJ con ventas de hoy, cuentas por cobrar, cuentas por pagar, stock bajo, cajas activas y facturas recientes",
    title: "Toda la operación en una sola pantalla",
    text: "Ventas del día, por cobrar, por pagar y stock bajo de un vistazo. Cajas abiertas, facturas recientes e inventario en alerta, sin abrir ningún reporte.",
  },
  {
    id: "facturacion",
    label: "Facturación",
    icon: FileText,
    src: "/screens/facturacion.png",
    alt: "Módulo de facturación de ventas con buscador, filtros, exportación y estado de la caja abierta",
    title: "Facturación con la caja siempre a la vista",
    text: "Listado de ventas con condición de pago, método y estado. Nueva factura en un clic, ver detalle y anulación controlada, con la caja abierta visible en todo momento.",
  },
  {
    id: "tasas",
    label: "Tasas de cambio",
    icon: ArrowLeftRight,
    src: "/screens/tasas-cambio.png",
    alt: "Módulo de tasas de cambio con tasa BCV, dólar paralelo y peso colombiano, e histórico con la brecha",
    title: "BCV, paralelo y peso colombiano, registrados cada día",
    text: "Registra la tasa del día y consulta el histórico con la brecha entre BCV y paralelo. La tasa vigente queda siempre visible en la barra superior de la aplicación.",
  },
  {
    id: "productos",
    label: "Productos",
    icon: Package,
    src: "/screens/productos.png",
    alt: "Catálogo de productos con código, categoría, cantidad, cajas, costo y tres niveles de precio",
    title: "Catálogo con existencia por caja y tres niveles de precio",
    text: "Código, categoría, existencias en unidades y cajas, costo y hasta tres precios por producto. Con auditoría de cambios y exportación a un clic.",
  },
  {
    id: "comisiones",
    label: "Comisiones",
    icon: Percent,
    src: "/screens/comisiones.png",
    alt: "Módulo de comisiones por vendedor con totales por cobrar y liberadas",
    title: "Comisiones por vendedor, sin hojas de cálculo",
    text: "Selecciona al vendedor y revisa sus comisiones por factura: base, monto de venta y estado. Totales por cobrar y liberadas, y pago de comisiones desde la misma pantalla.",
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: BarChart3,
    src: "/screens/reportes.png",
    alt: "Módulo de reportes con antigüedad de saldos de cuentas por cobrar por rangos de vencimiento",
    title: "Reportes financieros y de cumplimiento fiscal",
    text: "Antigüedad de saldos por rangos de vencimiento, con filtros por cliente y vendedor. Genera el reporte y expórtalo para auditoría o para cobranza.",
  },
] as const;

export default function ProductGallery() {
  const [active, setActive] = useState<(typeof SCREENS)[number]["id"]>("panel");
  const reduce = useReducedMotion();
  const current = SCREENS.find((s) => s.id === active)!;

  return (
    <section id="producto" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeader
            kicker="El sistema real"
            title="Así se ve Distribuidora DJ por dentro."
            description="Capturas de la aplicación en funcionamiento. Lo que ves aquí es lo que tu equipo usa cada día."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div
            role="tablist"
            aria-label="Módulos de la aplicación"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {SCREENS.map((s) => {
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={on}
                  aria-controls="panel-captura"
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                    on
                      ? "border-primary bg-primary text-white shadow-btn"
                      : "border-line bg-card text-fg-slate shadow-card hover:border-primary-light/50 hover:bg-rowhover",
                  )}
                >
                  <s.icon className={cn("h-4 w-4 shrink-0", on ? "text-white" : "text-primary-light")} />
                  <span className="whitespace-nowrap">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div id="panel-captura" role="tabpanel" aria-labelledby={`tab-${current.id}`} className="mx-auto w-full min-w-0 max-w-[800px]">
            <div className="overflow-hidden rounded-xl border border-line bg-card shadow-window">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    width={589}
                    height={314}
                    sizes="(min-width: 1024px) 860px, 100vw"
                    quality={95}
                    className="h-auto w-full"
                    priority={current.id === "panel"}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold text-fg">{current.title}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-medium">{current.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
