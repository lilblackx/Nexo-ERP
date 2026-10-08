"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Entrada al hacer scroll: sube, se desenfoca y aparece una sola vez al entrar en vista.
 * Mismo efecto que InView de Motion-Primitives, sin la dependencia: IntersectionObserver + transición CSS.
 * Con prefers-reduced-motion, globals.css reduce las transiciones a ~0 ms.
 */

interface InViewProps {
  children: ReactNode;
  className?: string;
  /** Desplazamiento vertical inicial, en px. */
  y?: number;
  /** Desenfoque inicial, en px. */
  blur?: number;
  /** Margen del observador; negativo abajo = espera a que el bloque suba un poco. */
  margin?: string;
  durationMs?: number;
  delayMs?: number;
  /** Etiqueta que se renderiza; `li` para listas, para no romper la estructura. */
  as?: "div" | "li";
}

export default function InView({
  children,
  className,
  y = 100,
  blur = 4,
  margin = "0px 0px -200px 0px",
  durationMs = 300,
  delayMs = 0,
  as: Tag = "div",
}: InViewProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <Tag
      ref={ref as never}
      className={cn("transition-[opacity,transform,filter] ease-in-out", className)}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        filter: shown ? "blur(0px)" : `blur(${blur}px)`,
      }}
    >
      {children}
    </Tag>
  );
}
