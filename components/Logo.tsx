import { cn } from "@/lib/utils";

/** Isotipo: una N hecha de nodos conectados (la red local como letra). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden
      className={cn("h-7 w-7", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V6l16 16V6" />
      <g fill="currentColor" stroke="none">
        <circle cx="6" cy="22" r="2.6" />
        <circle cx="6" cy="6" r="2.6" />
        <circle cx="22" cy="22" r="2.6" />
        <circle cx="22" cy="6" r="2.6" />
      </g>
    </svg>
  );
}

export default function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        tone === "dark" ? "text-primary" : "text-white",
        className,
      )}
    >
      <LogoMark />
      <span className="font-display text-[1.375rem] font-bold leading-none tracking-tight">
        Nexo
        <span
          className={cn(
            "ml-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]",
            tone === "dark" ? "text-fg-muted" : "text-tint-200",
          )}
        >
          ERP
        </span>
      </span>
      <span className="sr-only"> — sistema de gestión para distribuidoras</span>
    </span>
  );
}
