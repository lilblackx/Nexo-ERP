import { cn } from "@/lib/utils";

/**
 * Cabecera de sección tipo libro contable: folio y rótulo a la izquierda sobre una regla
 * fina, titular a la derecha. Alineado a la izquierda, sin eyebrow centrado.
 */
export default function SectionHead({
  n,
  label,
  title,
  children,
  onBlue,
  className,
}: {
  n: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  onBlue?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-x-6 gap-y-4 border-t pt-5",
        onBlue ? "border-white/25" : "border-line",
        className,
      )}
    >
      <div className="col-span-12 flex items-baseline gap-3 md:col-span-3 md:block lg:col-span-2">
        <p className={cn("folio", onBlue && "!text-tint-200")}>{n}</p>
        <p className={cn("text-sm font-semibold md:mt-1", onBlue ? "text-white" : "text-fg")}>{label}</p>
      </div>
      <div className="col-span-12 md:col-span-9 lg:col-span-10">
        <h2 className={cn("max-w-[22ch] text-h2 lg:max-w-[24ch]", onBlue && "!text-white")}>{title}</h2>
        {children && (
          <div className={cn("mt-5 max-w-2xl text-lead", onBlue ? "text-tint-100" : "text-fg-medium")}>{children}</div>
        )}
      </div>
    </div>
  );
}
