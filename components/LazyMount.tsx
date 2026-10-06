"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks";

/**
 * Monta a sus hijos solo al acercarse al viewport. Reserva `minHeight` para no mover el layout.
 * Un contenedor oculto con display:none nunca intersecta, así que sus hijos no se montan.
 */
export default function LazyMount({
  children,
  minHeight = 320,
  rootMargin = "400px 0px",
  className,
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin });
  return (
    <div ref={ref} className={className} style={inView ? undefined : { minHeight }}>
      {inView ? children : null}
    </div>
  );
}
