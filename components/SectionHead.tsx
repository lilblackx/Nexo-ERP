import InView from "@/components/InView";
import { cn } from "@/lib/utils";

// Margen corto: las cabeceras quedan cerca del pie de la ventana al llegar a cada sección.
const MARGIN = "0px 0px -80px 0px";

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
        "grid grid-cols-12 gap-x-2 md:gap-x-6 gap-y-4 border-t pt-5",
        onBlue ? "border-white/25" : "border-line",
        className,
      )}
    >
      <InView
        y={24}
        margin={MARGIN}
        className="col-span-12 flex items-baseline gap-3 md:col-span-3 md:block lg:col-span-2"
      >
        <p className={cn("folio", onBlue && "!text-tint-200")}>{n}</p>
        <p className={cn("text-sm font-semibold md:mt-1", onBlue ? "text-white" : "text-fg")}>{label}</p>
      </InView>
      <div className="col-span-12 md:col-span-9 lg:col-span-10">
        <InView y={24} margin={MARGIN} delayMs={80}>
          <h2 className={cn("max-w-[22ch] text-h2 lg:max-w-[24ch]", onBlue && "!text-white")}>{title}</h2>
        </InView>
        {children && (
          <InView y={24} margin={MARGIN} delayMs={160} className="mt-5">
            <div className={cn("max-w-2xl text-lead", onBlue ? "text-tint-100" : "text-fg-medium")}>{children}</div>
          </InView>
        )}
      </div>
    </div>
  );
}
