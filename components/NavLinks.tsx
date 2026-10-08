"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Enlaces del menú de escritorio; resalta la sección que cruza el tercio superior de la ventana. */
export default function NavLinks() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        // Si cruzan dos a la vez, gana la que está más abajo en la página (la que acaba de entrar).
        setActive([...ids].reverse().find((id) => inView.has(id)) ?? null);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <ul className="hidden items-center gap-6 lg:flex">
      {NAV_LINKS.map((l) => {
        const on = l.href === `#${active}`;
        return (
          <li key={l.href}>
            <a
              href={l.href}
              aria-current={on ? "location" : undefined}
              className={cn(
                "border-b-2 py-1 text-sm transition-colors duration-200 hover:text-primary",
                on ? "border-primary font-semibold text-primary" : "border-transparent text-fg-medium",
              )}
            >
              {l.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
