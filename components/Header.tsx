import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, WA_DEMO } from "@/lib/config";
import { RATES_LABEL, demo, num, pct } from "@/lib/demo";

/**
 * Franja de tasas (el motivo de la app) sobre una barra delgada de ancho completo.
 * Son valores de ejemplo: reflejan la hora del último registro manual, no una consulta en línea.
 */
export default function Header() {
  const r = demo.rates;
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-page">
      <div className="on-blue bg-primary-deep text-white">
        <div className="container flex h-7 items-center gap-4 whitespace-nowrap font-mono text-[11px] tabular-nums">
          <span className="text-tint-200">
            BCV <b className="font-medium text-white">Bs. {num(r.bcv)}</b>{" "}
            <span className="text-[#86efac]">▲ {pct(r.bcvVsAyerPct)}</span>
          </span>
          <span className="hidden text-tint-200 min-[420px]:inline">
            Paralelo <b className="font-medium text-white">Bs. {num(r.paralelo)}</b>{" "}
            <span className="text-[#86efac]">▲ {pct(r.paraleloVsAyerPct)}</span>
          </span>
          <span className="hidden text-tint-200 md:inline">
            Brecha <b className="font-medium text-white">{pct(r.gapPct)}</b>
          </span>
          <span className="ml-auto text-tint-300">
            {RATES_LABEL}
            <span className="hidden lg:inline"> · {r.actualizado}</span>
          </span>
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
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
