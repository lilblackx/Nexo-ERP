import { Bell, Minus, Square, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { COMPANY, RATES, bs, gap, pct } from "./data";
import { cn } from "@/lib/utils";

export type ScreenId = "panel" | "nueva" | "facturacion" | "compras" | "productos" | "tasas" | "comisiones" | "reportes";

/** Menú igual al de la app, en el mismo orden. */
const MENU = [
  { group: "Operaciones", items: ["Panel General", "Facturación", "Clientes", "Vendedores"] },
  { group: "Compras", items: ["Compras", "Proveedores"] },
  { group: "Inventario", items: ["Productos"] },
  {
    group: "Finanzas",
    items: [
      "Cuentas Bancarias",
      "Bancos",
      "Cuentas por Cobrar",
      "Cuentas por Cobrar BCV",
      "Cuentas por Pagar",
      "Cajas",
      "Comisiones",
      "Tasas de Cambio",
    ],
  },
  { group: "Reportes", items: ["Reportes"] },
  { group: "Administración", items: ["Configuración", "Usuarios", "Auditoría"] },
] as const;

export const ACTIVE_ITEM: Record<ScreenId, string> = {
  panel: "Panel General",
  nueva: "Facturación",
  facturacion: "Facturación",
  compras: "Compras",
  productos: "Productos",
  tasas: "Tasas de Cambio",
  comisiones: "Comisiones",
  reportes: "Reportes",
};

export function TitleBar() {
  return (
    <div className="flex h-7 items-center justify-between border-b border-line bg-card pl-2.5">
      <div className="flex min-w-0 items-center gap-1.5 text-primary">
        <LogoMark className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-[10px] text-fg-medium">Nexo ERP — Sistema de Gestión Administrativa</span>
      </div>
      <div className="flex h-full shrink-0 text-fg-muted" aria-hidden>
        <span className="grid w-9 place-items-center">
          <Minus className="h-3 w-3" />
        </span>
        <span className="grid w-9 place-items-center">
          <Square className="h-2.5 w-2.5" />
        </span>
        <span className="grid w-9 place-items-center">
          <X className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

/** Desplazamiento (px) para que el ítem activo quede visible, como el scroll del sidebar real. */
function activeOffset(active: string) {
  let y = 56;
  for (const g of MENU) {
    y += 24;
    for (const it of g.items) {
      if (it === active) return Math.max(0, y - 150);
      y += 21;
    }
  }
  return 0;
}

export function Sidebar({ active, className }: { active: string; className?: string }) {
  return (
    <aside className={cn("relative w-[158px] shrink-0 bg-primary text-white", className)} aria-hidden>
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div style={{ transform: `translateY(-${activeOffset(active)}px)` }}>
      <div className="flex items-center gap-2 border-b border-white/10 px-2.5 py-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-[9px] font-bold">DD</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[10px] font-semibold">Distribuidora Demo</span>
          <span className="block truncate text-[8.5px] text-tint-200">Sistema de gestión</span>
        </span>
      </div>
      <nav className="flex-1 px-1.5 pb-2 pt-1.5">
        {MENU.map((g) => (
          <div key={g.group}>
            <p className="px-1.5 pb-0.5 pt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-tint-200">
              {g.group}
            </p>
            {g.items.map((it) => (
              <p
                key={it}
                className={cn(
                  "truncate rounded-sm px-1.5 py-[3px] text-[10px]",
                  it === active ? "bg-primary-light font-semibold text-white" : "text-tint-100",
                )}
              >
                {it}
              </p>
            ))}
          </div>
        ))}
      </nav>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-white/10 bg-primary px-2.5 py-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[8px] font-bold">A</span>
          <span className="text-[9px] text-tint-200">ADMIN</span>
        </div>
      </div>
    </aside>
  );
}

/** Barra superior permanente de la app: tasa BCV, dólar paralelo y hora de actualización. */
export function TopBar({ dense }: { dense?: boolean }) {
  return (
    <div className="flex h-8 items-center justify-between gap-3 border-b border-line bg-card px-3 text-[10px]">
      <div className="flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap">
        <span className="text-fg-muted">
          Tasa BCV: <b className="num text-fg">{bs(RATES.bcv)}</b>
        </span>
        <span className="hidden text-fg-muted min-[420px]:inline">
          Dólar paralelo: <b className="num text-fg">{bs(RATES.paralelo)}</b>
        </span>
        <span className={cn("hidden text-fg-muted", !dense && "lg:inline")}>
          Brecha: <b className="num text-fg">{pct(gap(RATES.bcv, RATES.paralelo))}</b>
        </span>
        <span className="shrink-0 rounded-sm bg-warning-bg px-1 py-px text-[8.5px] font-medium text-warning-text">
          valores de ejemplo
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-fg-muted">
        <span className={cn("hidden", !dense && "sm:inline")}>Actualizado hace 1 min</span>
        <span className={cn("hidden h-6 w-36 items-center gap-1.5 rounded-sm border border-line px-2 text-fg-muted", !dense && "md:flex")}>
          Buscar en el sistema...
        </span>
        <Bell className="h-3.5 w-3.5" aria-hidden />
      </div>
    </div>
  );
}

export { COMPANY };
