import type { ReactNode } from "react";
import { Bell, LogOut, Search, TriangleAlert } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { demo, bs, pct } from "@/lib/demo";
import { MENU } from "./tokens";
import { WinControls, cx } from "./parts";
import "./tokens.css";
import "./appframe.css";

const SECTION_H = 30;
const ITEM_H = 44;
const VISIBLE = 752 - 32 - 64 - 56;

/** Desplazamiento del menú para que el ítem activo quede a la vista (como el scroll del menú real). */
type Role = "ADMIN" | "VENDEDOR";

/** El menú solo muestra lo que el rol puede ver; una sección sin módulos visibles desaparece. */
const VENDEDOR_ITEMS = ["Productos", "Comisiones"];
function menuFor(role: Role) {
  if (role === "ADMIN") return MENU;
  return MENU.map((g) => ({ section: g.section, items: g.items.filter((i) => VENDEDOR_ITEMS.includes(i)) })).filter(
    (g) => g.items.length > 0,
  );
}

function scrollFor(active: string, menu: ReturnType<typeof menuFor>) {
  let y = 4;
  let activeTop = 0;
  for (const g of menu) {
    y += SECTION_H;
    for (const it of g.items) {
      if (it === active) activeTop = y;
      y += ITEM_H;
    }
  }
  const max = Math.max(0, y + 12 - VISIBLE);
  return Math.min(max, Math.max(0, activeTop - 190));
}

export function Sidebar({ active, role = "ADMIN" }: { active: string; role?: Role }) {
  const menu = menuFor(role);
  const off = scrollFor(active, menu);
  return (
    <aside className="af-sidebar">
      <div className="af-sb-head">
        <span className="af-sb-avatar">{demo.company.initials}</span>
        <div>
          <div className="af-sb-name">Distribuidora Demo</div>
          <div className="af-sb-sub">Sistema de gestión</div>
        </div>
      </div>
      <div className="af-sb-scroll">
        <div className="af-sb-inner" style={{ transform: `translateY(-${off}px)` }}>
          {menu.map((g) => (
            <div key={g.section}>
              <div className="af-sb-section">{g.section}</div>
              {g.items.map((it) => (
                <div key={it} className={cx("af-sb-item", it === active && "is-active")}>
                  {it}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="af-sb-foot">
        <span className="af-sb-avatar">{role === "ADMIN" ? "A" : "V"}</span>
        <span>{role === "ADMIN" ? "ADMINISTRADOR" : demo.users.find((u) => u.role === "VENDEDOR")!.name.toUpperCase()}</span>
        <LogOut size={16} color="rgba(255,255,255,0.85)" />
      </div>
    </aside>
  );
}

/** Franja de tasas: la hora del último registro manual, no una consulta en línea. */
export function Ticker() {
  const r = demo.rates;
  return (
    <div className="af-ticker">
      <div className="af-ticker-l">
        <span>
          Tasa BCV <b>{bs(r.bcv)}</b>
          <i>▲ {pct(r.bcvVsAyerPct)}</i>
        </span>
        <span className="af-ticker-sep" />
        <span>
          Dólar paralelo <b>{bs(r.paralelo)}</b>
          <i>▲ {pct(r.paraleloVsAyerPct)}</i>
        </span>
      </div>
      <span>{r.actualizado}</span>
    </div>
  );
}

export function Topbar({ crumb }: { crumb: string }) {
  return (
    <div className="af-topbar">
      <div className="af-crumb">
        Módulos <span style={{ margin: "0 5px" }}>›</span> <b>{crumb}</b>
      </div>
      <div className="af-topbar-r">
        <span className="af-search">
          <Search size={15} color="#64748b" />
          Buscar en el sistema…
        </span>
        <span className="af-bell">
          <Bell size={19} fill="currentColor" />
          <em>{demo.notifications.length + 1}</em>
        </span>
      </div>
    </div>
  );
}

/** Ventana principal de Nexo ERP: barra de título de Windows, menú, franja de tasas, barra superior y contenido. */
export default function Window({
  active,
  crumb,
  banner,
  overlay,
  role = "ADMIN",
  children,
}: {
  role?: Role;
  active: string;
  crumb: string;
  /** Banner de licencia en modo solo lectura. */
  banner?: string;
  overlay?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="app-frame">
      <div className="af-title">
        <span className="af-title-l">
          <LogoMark className="h-[16px] w-[16px]" />
          Nexo ERP
        </span>
        <WinControls />
      </div>
      <div className="af-body">
        <Sidebar active={active} role={role} />
        <div className="af-main">
          {banner && (
            <div className="af-banner">
              <TriangleAlert size={15} />
              <span>{banner}</span>
            </div>
          )}
          <Ticker />
          <Topbar crumb={crumb} />
          <div className="af-content">{children}</div>
        </div>
        {overlay}
      </div>
    </div>
  );
}

