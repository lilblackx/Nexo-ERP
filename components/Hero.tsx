import { Database, Terminal, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroWindowMockup from "@/components/HeroWindowMockup";
import { WA_DEMO } from "@/lib/config";

const STATS = [
  { value: "0 ms", label: "de latencia de nube", detail: "Arquitectura cliente/servidor en LAN" },
  { value: "4 divisas", label: "conciliadas a la vez", detail: "USD · VES · COP · USDT en tesorería" },
  { value: "100%", label: "transaccional", detail: "Validación estricta y triggers de stock" },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-slate bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_35%,transparent_100%)]" />
        <div className="absolute inset-0 bg-radial-cobalt" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs text-fg-slate backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
            Diseñado para la realidad operativa del comercio en Venezuela
          </p>

          <h1 className="animate-fade-up mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-fg [animation-delay:80ms] sm:text-5xl lg:text-[3.5rem]">
            El control total de tu distribuidora: sin depender de internet y con{" "}
            <span className="text-primary">
              gestión multi-moneda nativa.
            </span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-fg-medium [animation-delay:160ms] sm:text-lg">
            ERP de escritorio de alto rendimiento sobre SQL Server. Factura de contado o crédito, concilia pagos
            divididos (USD, VES, COP, USDT), controla inventario blindado por base de datos y liquida comisiones con
            velocidad nativa de escritorio.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Agendar Demostración Personalizada
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <a href="#arquitectura">
                <Terminal className="h-4 w-4 text-fg-medium" />
                Explorar Arquitectura Técnica
              </a>
            </Button>
          </div>
        </div>

        <dl className="animate-fade-up mx-auto mt-14 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card [animation-delay:320ms] sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.value} className="bg-card px-5 py-4 text-left">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <p className="num flex flex-wrap items-baseline gap-x-2 text-2xl text-fg">
                  {s.value} <span className="font-sans text-sm font-normal text-fg-medium">{s.label}</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-fg-muted">
                  <Database className="h-3 w-3 text-primary-light" />
                  {s.detail}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16">
          <HeroWindowMockup />
          <p className="mt-4 text-center text-xs text-fg-muted">
            Vista de demostración interactiva. Cliente, cifras y tasas son ilustrativos.
          </p>
        </div>
      </div>
    </section>
  );
}
