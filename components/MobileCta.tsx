"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WA_DEMO } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Barra inferior solo en móvil (el botón del header se oculta bajo `sm`): aparece al pasar el hero
 * y se esconde cuando el formulario de contacto ya está en pantalla.
 */
export default function MobileCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const form = document.getElementById("contacto");
    const watch = (el: HTMLElement | null, set: (v: boolean) => void) => {
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => set(e.isIntersecting));
      io.observe(el);
      return io;
    };
    const a = watch(hero, setHeroVisible);
    const b = watch(form, setFormVisible);
    return () => {
      a?.disconnect();
      b?.disconnect();
    };
  }, []);

  const show = !heroVisible && !formVisible;

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-page/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-[transform,opacity] duration-300 ease-in-out sm:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <Button asChild size="lg" className="w-full">
        <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
          Escríbenos por WhatsApp
        </a>
      </Button>
    </div>
  );
}
