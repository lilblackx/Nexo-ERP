import { cn } from "@/lib/utils";
import { ACTIVE_ITEM, Sidebar, TitleBar, TopBar, type ScreenId } from "./Shell";
import {
  ComisionesScreen,
  ComprasScreen,
  FacturacionScreen,
  PanelScreen,
  ProductosScreen,
  ReportesScreen,
  TasasScreen,
} from "./screens";

export type { ScreenId };

export const SCREEN_LABEL: Record<ScreenId, string> = {
  panel: "Panel general",
  facturacion: "Facturación",
  compras: "Compras",
  productos: "Productos",
  tasas: "Tasas de cambio",
  comisiones: "Comisiones",
  reportes: "Reportes · antigüedad de saldos",
};

/**
 * Réplica en código de la interfaz de Nexo ERP, con datos ficticios.
 * Mismo menú, barra de tasas y columnas que la app. Sin imágenes: nítido, liviano y animable.
 * `dense` oculta columnas opcionales; bajo `md` el sidebar desaparece (versión compacta).
 */
export default function AppFrame({
  screen,
  cobro,
  dense,
  bleed,
  tone = "light",
  className,
}: {
  screen: ScreenId;
  cobro?: boolean;
  dense?: boolean;
  bleed?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Vista de ejemplo del módulo ${SCREEN_LABEL[screen]} de Nexo ERP, con datos ficticios`}
      className={cn(
        "overflow-hidden border border-line bg-page text-fg-slate",
        tone === "dark" ? "shadow-frame-dark" : "shadow-frame",
        bleed ? "rounded-l md:border-r-0" : "rounded",
        className,
      )}
    >
      <TitleBar />
      <div className="flex">
        <Sidebar active={ACTIVE_ITEM[screen]} className="hidden md:block" />
        <div className="min-w-0 flex-1">
          <TopBar />
          <div className="relative min-h-[430px] p-3">
            {screen === "panel" && <PanelScreen dense={dense} />}
            {screen === "facturacion" && <FacturacionScreen dense={dense} cobro={cobro} />}
            {screen === "compras" && <ComprasScreen dense={dense} />}
            {screen === "productos" && <ProductosScreen dense={dense} />}
            {screen === "tasas" && <TasasScreen dense={dense} />}
            {screen === "comisiones" && <ComisionesScreen dense={dense} />}
            {screen === "reportes" && <ReportesScreen dense={dense} />}
          </div>
        </div>
      </div>
    </div>
  );
}
