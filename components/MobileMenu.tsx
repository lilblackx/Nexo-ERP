"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, WA_DEMO } from "@/lib/config";

/** Menú de navegación para pantallas angostas. Se cierra al elegir un enlace o con Escape. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded text-fg-slate hover:bg-field"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div id="menu-movil" className="fixed inset-x-0 top-[5.25rem] max-h-[calc(100vh-5.25rem)] overflow-auto border-b border-line bg-page">
          <ul className="container divide-y divide-line py-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-base text-fg hover:text-primary">
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
    </div>
  );
}
