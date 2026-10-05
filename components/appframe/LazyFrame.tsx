"use client";

import AppFrame from "./AppFrame";
import { useInView } from "@/lib/hooks";

type FrameProps = React.ComponentProps<typeof AppFrame>;

/**
 * AppFrame que se monta solo al acercarse al viewport. El HTML inicial no lo incluye,
 * lo que aligera la primera carga en conexiones lentas. Reserva `minH` para no mover el layout.
 */
export default function LazyFrame({
  minH = 480,
  rootMargin = "500px 0px",
  ...frame
}: FrameProps & { minH?: number; rootMargin?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin });
  return (
    <div ref={ref} style={inView ? undefined : { minHeight: minH }}>
      {inView && <AppFrame {...frame} />}
    </div>
  );
}
