import { ArrowDown } from "lucide-react";
import AppFrame from "@/components/appframe/AppFrame";
import { Button } from "@/components/ui/button";
import { WA_DEMO } from "@/lib/config";

/*
 * Opciones de titular (voz local y concreta):
 *  A. "Cobra en dólares y bolívares sin sacar la calculadora."   <- elegida
 *  B. "La tasa cambió a las diez. Tu factura ya lo sabe."
 *  C. "Cierra la caja sin pelear con el Excel."
 * A describe lo confirmado (pago mixto con efectivo USD y pago móvil, vuelto, tasa del día) y nombra la
 * molestia exacta del mostrador. B promete más de lo verificado; C asume un cierre de caja no confirmado.
 */
export default function Hero() {
  return (
    <section id="inicio" className="pt-10 sm:pt-14">
      <div className="container">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-11">
            <h1 className="animate-rise text-display">Cobra en dólares y bolívares sin sacar la calculadora.</h1>
            <p className="animate-rise mt-6 max-w-[60ch] text-lead text-fg-medium [animation-delay:80ms]">
              Nexo ERP es un sistema de gestión de escritorio para distribuidoras. Facturas con pago mixto, llevas el
              inventario por cajas, cobras y pagas cuentas, liquidas comisiones y tienes la tasa del día siempre a la
              vista. Todo sobre un servidor SQL en tu propia red.
            </p>
            <div className="animate-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:160ms]">
              <Button asChild size="lg">
                <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </Button>
              <a
                href="#dia"
                className="group inline-flex items-center gap-2 text-[15px] font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
              >
                Mira un día completo
                <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-nexo group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* El AppFrame sangra contra el borde derecho del viewport */}
      <div className="animate-rise mt-10 pl-4 [animation-delay:240ms] sm:pl-6 md:mt-16 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]">
        <AppFrame screen="facturacion" cobro bleed />
      </div>

      <div className="container">
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-dashed border-line py-4 font-mono text-[12px] text-fg-muted">
          <p>Windows · SQL Server · red local</p>
          <p>Pantalla de ejemplo con datos ficticios</p>
        </div>
      </div>
    </section>
  );
}
