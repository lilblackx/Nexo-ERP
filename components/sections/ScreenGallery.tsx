"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import screensLoader from "@/lib/image-loader";
import type { ResolvedScreen } from "@/lib/screens";
import { cn } from "@/lib/utils";

// Relación fija de las capturas (3200 × 1800): evita saltos de maquetación.
const W = 1600;
const H = 900;

export default function ScreenGallery({ screens }: { screens: ResolvedScreen[] }) {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = screens[sel];

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (sel + dir + screens.length) % screens.length;
    setSel(n);
    tabs.current[n]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Capturas de la app" onKeyDown={onKey} className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {screens.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`cap-tab-${s.id}`}
            aria-selected={i === sel}
            aria-controls="cap-panel"
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            className={cn(
              "shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-[15px] transition-colors duration-200 ease-nexo",
              i === sel ? "border-primary font-bold text-primary" : "border-line text-fg-medium hover:text-fg",
            )}
          >
            <span className="folio">{String(i + 1).padStart(2, "0")}</span> {s.label}
          </button>
        ))}
      </div>

      <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-tab-${cur.id}`} className="mt-6">
      <figure className="m-0">
        {/* Marco de ventana sobrio */}
        <div className="overflow-hidden rounded border border-line bg-white">
          <div className="flex h-7 items-center gap-1.5 border-b border-line bg-field px-3" aria-hidden>
            <i className="h-2 w-2 rounded-full bg-line" />
            <i className="h-2 w-2 rounded-full bg-line" />
            <i className="h-2 w-2 rounded-full bg-line" />
          </div>
          <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
            {cur.src ? (
              <Image
                key={cur.src}
                loader={screensLoader}
                src={cur.src}
                alt={cur.caption}
                width={W}
                height={H}
                sizes="(min-width: 1280px) 1216px, 100vw"
                loading="lazy"
                className="h-auto w-full"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-page p-6 text-center">
                {/* TODO(luis): reemplazar capturas (ver public/screens/README.md) */}
                <p className="max-w-sm text-sm text-fg-muted">
                  Captura pendiente: <b className="text-fg">{cur.label}</b>. Se mostrará aquí cuando esté aprobada.
                </p>
              </div>
            )}
          </div>
        </div>
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm text-fg-medium">
          <span className="max-w-prose">{cur.caption}</span>
          <span className="font-mono text-xs text-fg-muted">Captura de la app con datos de demostración</span>
        </figcaption>
      </figure>
      </div>
    </div>
  );
}
