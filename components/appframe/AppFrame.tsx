"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DEMO_LABEL } from "@/lib/demo";
import { cn } from "@/lib/utils";
import Window from "./Window";
import {
  AbonoDialog,
  AbrirCajaDialog,
  AutorizacionDialog,
  DevolucionDialog,
  NotaCreditoDialog,
  NuevaFacturaDialog,
  TasaRegistroDialog,
  draftDiscount,
  draftHero,
  type DraftView,
} from "./dialogs";
import { PanelScreen, FacturacionScreen, ProductosScreen, TasasScreen } from "./screens-a";
import {
  AuditoriaScreen,
  CajasScreen,
  ComisionesScreen,
  ComprasScreen,
  CxcScreen,
  LicenciaScreen,
  READONLY_BANNER_SUFFIX,
  ReportesScreen,
  type ComprasTab,
  type LicenseState,
} from "./screens-b";

export type ScreenId =
  | "panel"
  | "facturacion"
  | "compras"
  | "productos"
  | "cxc"
  | "reportes"
  | "comisiones"
  | "tasas"
  | "cajas"
  | "auditoria"
  | "licencia";

export type DialogId =
  | "nueva-factura"
  | "autorizacion"
  | "tasa-registro"
  | "tasa-brusco"
  | "abono"
  | "abrir-caja"
  | "devolucion"
  | "nota-credito";

/** Región de la ventana (en píxeles lógicos de 1280 × 752) que se muestra a escala legible. */
export interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FrameSpec {
  screen: ScreenId;
  dialog?: DialogId;
  /** Pestaña del diálogo "Nueva Factura". */
  tab?: "factura" | "pagos";
  /** Factura en curso: "hero" (FV-000013), "descuento" (FV-000010) o una propia. */
  draft?: "hero" | "descuento" | DraftView;
  comprasTab?: ComprasTab;
  /** Vista del rol vendedor ("Mis Comisiones"). */
  mine?: boolean;
  license?: LicenseState;
}

const FULL: Crop = { x: 0, y: 0, w: 1280, h: 752 };
const SMALL_VIEWPORT = 560;

const CRUMB: Record<ScreenId, [active: string, crumb: string]> = {
  panel: ["Panel General", "Panel General"],
  facturacion: ["Facturación", "Facturación / Ventas"],
  compras: ["Compras", "Compras"],
  productos: ["Productos", "Inventario"],
  cxc: ["Cuentas por Cobrar", "Cuentas por Cobrar"],
  reportes: ["Reportes", "Reportes"],
  comisiones: ["Comisiones", "Comisiones"],
  tasas: ["Tasas de Cambio", "Tasas de Cambio"],
  cajas: ["Cajas", "Cajas"],
  auditoria: ["Auditoría", "Auditoría"],
  licencia: ["Configuración", "Configuración"],
};

export const SCREEN_NAME: Record<ScreenId, string> = {
  panel: "Panel General",
  facturacion: "Facturación",
  compras: "Compras",
  productos: "Productos",
  cxc: "Cuentas por Cobrar",
  reportes: "Reportes",
  comisiones: "Comisiones",
  tasas: "Tasas de Cambio",
  cajas: "Cajas",
  auditoria: "Auditoría",
  licencia: "Configuración > Licencia",
};

function resolveDraft(d: FrameSpec["draft"]): DraftView {
  if (d === "descuento") return draftDiscount();
  if (typeof d === "object") return d;
  return draftHero();
}

function Screen({ spec }: { spec: FrameSpec }): ReactNode {
  switch (spec.screen) {
    case "panel":
      return <PanelScreen />;
    case "facturacion":
      return <FacturacionScreen />;
    case "compras":
      return <ComprasScreen tab={spec.comprasTab} />;
    case "productos":
      return <ProductosScreen />;
    case "cxc":
      return <CxcScreen />;
    case "reportes":
      return <ReportesScreen />;
    case "comisiones":
      return <ComisionesScreen mine={spec.mine} />;
    case "tasas":
      return <TasasScreen />;
    case "cajas":
      return <CajasScreen />;
    case "auditoria":
      return <AuditoriaScreen />;
    case "licencia":
      return <LicenciaScreen state={spec.license} />;
  }
}

function Overlay({ spec }: { spec: FrameSpec }): ReactNode {
  switch (spec.dialog) {
    case "nueva-factura":
      return <NuevaFacturaDialog tab={spec.tab ?? "pagos"} draft={resolveDraft(spec.draft)} />;
    case "autorizacion":
      return (
        <>
          <NuevaFacturaDialog tab="factura" draft={draftDiscount()} />
          <AutorizacionDialog />
        </>
      );
    case "tasa-registro":
      return <TasaRegistroDialog />;
    case "tasa-brusco":
      return <TasaRegistroDialog typo />;
    case "abono":
      return <AbonoDialog />;
    case "abrir-caja":
      return <AbrirCajaDialog />;
    case "devolucion":
      return <DevolucionDialog />;
    case "nota-credito":
      return <NotaCreditoDialog />;
    default:
      return null;
  }
}

/** Ventana de Nexo ERP ya compuesta (sin escalar). Útil para pruebas y para el juego de cobro. */
export function FrameWindow({ spec }: { spec: FrameSpec }) {
  const [active, crumb] = CRUMB[spec.screen];
  const banner =
    spec.screen === "licencia" && spec.license && spec.license !== "ACTIVA"
      ? `${spec.license === "VALIDAR_EN_LINEA" ? "Validación pendiente: el servidor lleva más de 7 días sin renovar." : "Licencia no activa."} ${READONLY_BANNER_SUFFIX}`
      : undefined;
  return (
    <Window
      active={active}
      crumb={crumb}
      banner={banner}
      role={spec.mine ? "VENDEDOR" : "ADMIN"}
      overlay={<Overlay spec={spec} />}
    >
      <Screen spec={spec} />
    </Window>
  );
}

export interface AppFrameProps extends FrameSpec {
  /** Qué muestra, en una frase (figcaption). */
  caption: ReactNode;
  /** Recorte en pantallas anchas. Por defecto, la ventana completa. */
  focus?: Crop;
  /** Recorte en contenedores angostos (móvil): texto a escala legible. */
  mobileFocus?: Crop;
  /** Oculta el pie con la leyenda (cuando el contenedor ya la lleva). */
  hideCaption?: boolean;
  className?: string;
  frameClassName?: string;
  captionClassName?: string;
}

/**
 * Réplica en DOM de Nexo ERP con datos de demostración. Se diseña a un ancho lógico fijo de 1280 px
 * y se escala con transform (el texto sigue siendo DOM nítido). En contenedores angostos muestra un
 * recorte (`mobileFocus`) a escala legible en lugar de la ventana completa.
 * Es decorativo: el interior queda fuera del árbol de accesibilidad y el `<figcaption>` lo resume.
 */
export default function AppFrame({
  caption,
  focus,
  mobileFocus,
  hideCaption,
  className,
  frameClassName,
  captionClassName,
  ...spec
}: AppFrameProps) {
  const outer = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const crop = width && width < SMALL_VIEWPORT && mobileFocus ? mobileFocus : (focus ?? FULL);
  const scale = width ? width / crop.w : 0;

  return (
    <figure className={cn("m-0", className)}>
      <div
        ref={outer}
        aria-hidden
        inert
        className={cn("relative overflow-hidden", frameClassName)}
        style={
          scale
            ? { height: crop.h * scale }
            : { aspectRatio: `${(focus ?? FULL).w} / ${(focus ?? FULL).h}` }
        }
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1280,
            height: 752,
            transformOrigin: "0 0",
            transform: scale ? `translate(${-crop.x * scale}px, ${-crop.y * scale}px) scale(${scale})` : undefined,
            visibility: scale ? "visible" : "hidden",
          }}
        >
          <FrameWindow spec={spec} />
        </div>
      </div>
      {!hideCaption && (
        <figcaption
          className={cn(
            "mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm text-fg-medium",
            captionClassName,
          )}
        >
          <span className="max-w-prose">{caption}</span>
          <span className="font-mono text-xs text-fg-muted">{DEMO_LABEL}</span>
        </figcaption>
      )}
    </figure>
  );
}
