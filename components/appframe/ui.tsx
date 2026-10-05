import { cn } from "@/lib/utils";

/** Piezas mínimas para replicar la interfaz de la app dentro del AppFrame. */

export function Crumb({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[10px] text-fg-muted">Módulos › {children}</p>;
}

export function Title({
  children,
  sub,
  chip,
}: {
  children: React.ReactNode;
  sub?: string;
  chip?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-display text-[15px] font-semibold leading-tight text-fg">{children}</p>
        {chip}
      </div>
      {sub && <p className="mt-0.5 text-[10px] text-fg-muted">{sub}</p>}
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "blue";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[9.5px] font-medium",
        tone === "neutral" && "bg-thead text-fg-slate",
        tone === "success" && "bg-success-bg text-success-text",
        tone === "warning" && "bg-warning-bg text-warning-text",
        tone === "blue" && "bg-primary text-white",
      )}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  primary,
  className,
}: {
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-sm px-2 text-[10px] font-semibold",
        primary ? "bg-primary text-white" : "border border-line bg-card text-fg-slate",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SearchBox({ placeholder, className }: { placeholder: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-6 min-w-0 items-center gap-1.5 rounded-sm border border-line bg-card px-2 text-[10px] text-fg-muted",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <circle cx="7" cy="7" r="4.5" />
        <path d="m10.5 10.5 3 3" strokeLinecap="round" />
      </svg>
      <span className="truncate">{placeholder}</span>
    </span>
  );
}

export function Select({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center justify-between gap-2 whitespace-nowrap rounded-sm border border-line bg-card px-2 text-[10px] text-fg-slate",
        className,
      )}
    >
      {children}
      <svg viewBox="0 0 10 6" className="h-1.5 w-2 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="m1 1 4 4 4-4" />
      </svg>
    </span>
  );
}

type Col = { label: string; align?: "right" | "center"; min?: "sm" | "md" | "lg"; mono?: boolean; trunc?: boolean };
const MIN_CLASS = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" } as const;

/** Tabla con las columnas de la app. Con `dense`, las columnas con `min` se ocultan. */
export function Grid({
  cols,
  rows,
  dense,
  className,
}: {
  cols: Col[];
  rows: React.ReactNode[][];
  dense?: boolean;
  className?: string;
}) {
  const cell = (c: Col) =>
    cn(
      c.min && (dense ? "hidden" : MIN_CLASS[c.min]),
      c.align === "right" && "text-right",
      c.align === "center" && "text-center",
      c.trunc && "max-w-[4.5rem] truncate sm:max-w-[14rem]",
    );
  return (
    <div className={cn("overflow-hidden rounded-sm border border-line bg-card", className)}>
      <table className="w-full border-collapse text-left text-[10px]">
        <thead>
          <tr className="bg-thead text-[9px] font-semibold uppercase tracking-wide text-fg-slate">
            {cols.map((c) => (
              <th key={c.label} className={cn("whitespace-nowrap px-1.5 py-1.5 sm:px-2", cell(c))}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70 text-fg-slate">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td
                  key={j}
                  className={cn("whitespace-nowrap px-1.5 py-1.5 sm:px-2", cell(cols[j]), cols[j].mono && "num")}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Kpi({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "success" | "warning";
}) {
  return (
    <div className="rounded-sm border border-line bg-card p-2">
      <p className="text-[9px] text-fg-muted">{label}</p>
      <p
        className={cn(
          "num mt-0.5 text-[15px] leading-tight",
          tone === "neutral" && "text-fg",
          tone === "success" && "text-success-text",
          tone === "warning" && "text-warning-text",
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[9px] text-fg-muted">{sub}</p>}
    </div>
  );
}
