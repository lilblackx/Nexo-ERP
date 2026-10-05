"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, WA_DEMO } from "@/lib/config";
import { RATES, bs, gap, pct } from "@/components/appframe/data";

/**
 * Header de ancho completo: franja de tasas (motivo de la app) + navegación delgada.
 * La franja usa valores de ejemplo y lo dice.
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-page">
      <div className="on-blue bg-primary-deep text-white">
        <div className="container flex h-7 items-center gap-4 whitespace-nowrap font-mono text-[11px]">
          <span className="text-tint-200">
            <span className="hidden sm:inline">Tasa </span>BCV <b className="font-medium text-white">{bs(RATES.bcv)}</b>
          </span>
          <span className="text-tint-200">
            <span className="hidden sm:inline">Dólar </span>paralelo{" "}
            <b className="font-medium text-white">{bs(RATES.paralelo)}</b>
          </span>
          <span className="hidden text-tint-200 md:inline">
            Brecha <b className="font-medium text-white">{pct(gap(RATES.bcv, RATES.paralelo))}</b>
          </span>
          <span className="ml-auto text-tint-300">valores de ejemplo</span>
        </div>
      </div>

      <nav aria-label="Principal" className="container flex h-14 items-center justify-between gap-6">
        <a href="#inicio" aria-label="Nexo ERP, inicio">
          <Logo />
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-fg-medium transition-colors duration-200 hover:text-primary">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp
            </a>
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded text-fg-slate hover:bg-field lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-movil" className="border-t border-line bg-page lg:hidden">
          <ul className="container divide-y divide-line py-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-fg hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-3">
              <Button asChild className="w-full">
                <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
