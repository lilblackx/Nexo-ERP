import type { CSSProperties, ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Minus, Plus, Search, Square, X } from "lucide-react";

/** Piezas de interfaz de la app (réplica en DOM). Todo se estiliza con appframe.css bajo `.app-frame`. */

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="af-badge" style={{ color, background: `${color}1a` }}>
      {children}
    </span>
  );
}

export function Btn({
  children,
  kind,
  small,
  className,
  style,
}: {
  children: ReactNode;
  kind?: "primary" | "soft" | "danger-soft";
  small?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cx("af-btn", kind && `is-${kind}`, small && "is-small", className)}
      style={style}
    >
      {children}
    </span>
  );
}

export const BtnNew = ({ children }: { children: ReactNode }) => (
  <Btn kind="primary">
    <Plus size={15} strokeWidth={2.6} />
    {children}
  </Btn>
);
export const BtnFilter = () => (
  <Btn>
    <Filter size={14} fill="currentColor" strokeWidth={0} />
    Filtrar
  </Btn>
);
export const BtnExport = () => (
  <Btn>
    <Download size={15} />
    Exportar
  </Btn>
);

export function SearchInput({ placeholder, width, focus }: { placeholder: string; width?: number; focus?: boolean }) {
  return (
    <span className={cx("af-input", focus && "is-focus")} style={{ width: width ?? 400 }}>
      <Search size={15} color="#64748b" />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{placeholder}</span>
    </span>
  );
}

export function Select({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <span className="af-input af-select is-value" style={{ width: width ?? 160, height: 32 }}>
      {children}
      <ChevronDown size={14} color="#64748b" />
    </span>
  );
}

export function Check({ children, on }: { children: ReactNode; on?: boolean }) {
  return (
    <span className="af-check">
      <i style={on ? { background: "#0D47A1", borderColor: "#0D47A1" } : undefined} />
      {children}
    </span>
  );
}

export function PageHead({
  title,
  chips,
  sub,
  right,
}: {
  title: ReactNode;
  chips?: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="af-page-head">
      <div>
        <div className="af-page-title">
          {title}
          {chips}
        </div>
        {sub && <div className="af-page-sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export const Chip = ({ children, tone }: { children: ReactNode; tone?: "green" | "amber" | "green-strong" }) => (
  <span className={cx("af-chip", tone && `is-${tone}`)}>{children}</span>
);

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="af-card af-toolbar">{children}</div>;
}

export interface Column {
  label: string;
  w: string;
  align?: "r" | "c";
}

/** Tabla con las columnas de la app: encabezado en MAYÚSCULAS, filas de 45 px alternadas. */
export function Table({
  columns,
  rows,
  selected,
  height,
  rowStyle,
}: {
  columns: Column[];
  rows: ReactNode[][];
  selected?: number;
  height?: number;
  rowStyle?: (i: number) => CSSProperties | undefined;
}) {
  const style = { "--cols": columns.map((c) => c.w).join(" ") } as CSSProperties;
  return (
    <div className="af-table" style={{ height }}>
      <div className="af-tr is-head" style={style}>
        {columns.map((c) => (
          <div key={c.label} className={cx("af-td", c.align && `af-${c.align}`)}>
            {c.label}
          </div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          className={cx("af-tr", selected === i && "is-selected")}
          style={{ ...style, ...rowStyle?.(i) }}
        >
          {r.map((cell, j) => (
            <div key={j} className={cx("af-td", columns[j].align && `af-${columns[j].align}`)}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Pager({ label = "Página 1 de 1", children }: { label?: string; children?: ReactNode }) {
  return (
    <div className="af-pager">
      <div className="af-pager-l">
        <span>{label}</span>
        <span className="af-pager-btn">
          <ChevronLeft size={16} />
        </span>
        <span className="af-pager-btn">
          <ChevronRight size={16} />
        </span>
      </div>
      <div className="af-pager-r">{children}</div>
    </div>
  );
}

export function Tabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="af-tabs">
      {tabs.map((t) => (
        <span key={t} className={cx("af-tab", t === active && "is-active")}>
          {t}
        </span>
      ))}
    </div>
  );
}

export function WinControls() {
  return (
    <span className="af-wincontrols">
      <span>
        <Minus size={14} />
      </span>
      <span>
        <Square size={11} />
      </span>
      <span>
        <X size={15} />
      </span>
    </span>
  );
}

/** Diálogo con velo oscuro del 40 % sobre la ventana principal, centrado, con su barra de título nativa. */
export function Dialog({
  title,
  width,
  height,
  children,
  foot,
  top,
}: {
  title: string;
  width: number;
  height?: number;
  children: ReactNode;
  foot?: ReactNode;
  top?: number;
}) {
  return (
    <div className="af-scrim" style={top !== undefined ? { alignItems: "flex-start", paddingTop: top } : undefined}>
      <div className="af-dialog" style={{ width, height }}>
        <div className="af-dlg-bar">
          <span>{title}</span>
          <WinControls />
        </div>
        <div className="af-dlg-body">{children}</div>
        {foot && <div className="af-dlg-foot">{foot}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="af-field">
      <div className="af-field-label">
        {label}
        {required && <i> *</i>}
      </div>
      {children}
    </div>
  );
}

export function Input({
  value,
  placeholder,
  right,
  focus,
  password,
  width,
}: {
  value?: string;
  placeholder?: string;
  right?: boolean;
  focus?: boolean;
  password?: boolean;
  width?: number | string;
}) {
  return (
    <span
      className={cx("af-input", value && "is-value", right && "is-right", focus && "is-focus")}
      style={{ width: width ?? "100%", height: 38, display: "flex" }}
    >
      {value ? (password ? "•".repeat(value.length) : value) : placeholder}
    </span>
  );
}

export function SelectField({ value, width }: { value: string; width?: number | string }) {
  return (
    <span className="af-input af-select is-value" style={{ width: width ?? "100%", height: 38, display: "flex" }}>
      {value}
      <ChevronDown size={14} color="#64748b" />
    </span>
  );
}
