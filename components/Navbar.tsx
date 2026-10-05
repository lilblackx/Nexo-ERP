"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, WA_DEMO, BUILD_VERSION } from "@/lib/config";
import { cn } from "@/lib/utils";

function LiveIndicator({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 whitespace-nowrap text-xs text-fg-medium", className)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-success" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success " />
      </span>
      <span className="font-medium text-success-text">Funciona sin internet</span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <nav
        aria-label="Principal"
        className={cn(
          "mx-auto max-w-7xl rounded-2xl border backdrop-blur-xl transition-colors duration-300",
          scrolled || open
            ? "border-line bg-white/90 shadow-[0_8px_32px_-12px_rgb(15_23_42/0.25)]"
            : "border-line bg-white/75",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 pl-4 pr-2.5">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Distribuidora DJ, inicio">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[13px] font-bold tracking-tight text-white shadow-btn">
              DJ
            </span>
            <span className="hidden whitespace-nowrap text-sm font-semibold text-fg sm:block">Distribuidora DJ</span>
            <span className="num whitespace-nowrap rounded border border-line bg-field px-1.5 py-0.5 text-[10px] text-fg-medium">
              {BUILD_VERSION} LTS
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] text-fg-medium transition-colors hover:bg-rowhover hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LiveIndicator className="hidden xl:flex" />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                Solicitar Demo en Vivo
              </a>
            </Button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg text-fg-slate hover:bg-rowhover lg:hidden"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="menu-movil"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="space-y-1 border-t border-line p-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-fg-slate hover:bg-rowhover hover:text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="px-3 pb-1 pt-2">
                  <LiveIndicator />
                </li>
                <li className="pt-1">
                  <Button asChild className="w-full">
                    <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                      Solicitar Demo en Vivo
                    </a>
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
