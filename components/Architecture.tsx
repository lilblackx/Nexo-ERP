import { Cpu, Database, KeyRound, Monitor, Server } from "lucide-react";
import Reveal, { SectionHeader } from "@/components/Reveal";

const PILLARS = [
  {
    icon: Database,
    title: "Motor de datos: Microsoft SQL Server",
    text: "Toda la operación vive en una base de datos transaccional dentro de tu red. Las reglas críticas, como stock y totales, se aplican con triggers: ningún usuario ni estación puede saltárselas.",
  },
  {
    icon: Cpu,
    title: "Interfaz multihilo",
    text: "Las consultas pesadas corren en hilos de fondo (QueryWorker). La pantalla no se congela mientras se procesan balances de miles de renglones, y el cajero sigue facturando.",
  },
  {
    icon: KeyRound,
    title: "Licenciamiento seguro y tolerante a fallos",
    text: "Verificación descentralizada con firmas criptográficas Ed25519 y un servicio local de Windows. Si el galpón pasa días sin conexión, la aplicación no se bloquea.",
  },
];

const TERMINAL = [
  { c: "text-slate-400", t: "$ licencia.verificar()" },
  { c: "text-emerald-400", t: "✓ firma Ed25519 válida" },
  { c: "text-emerald-400", t: "✓ servicio local de licencia activo" },
  { c: "text-amber-300", t: "! sin conexión a internet — modo offline" },
  { c: "text-emerald-400", t: "✓ operación LAN continúa sin interrupción" },
];

function LanDiagram() {
  return (
    <div className="card-surface rounded-2xl p-6">
      <p className="num text-[11px] uppercase tracking-widest text-fg-muted">Topología · red local</p>
      <div className="mt-5 flex flex-col items-center">
        <div className="flex items-center gap-3 rounded-xl border border-primary-light/50 bg-primary/10 px-5 py-3 shadow-btn">
          <Server className="h-5 w-5 text-primary-light" />
          <div>
            <p className="text-sm font-medium text-fg">Servidor SQL Server</p>
            <p className="num text-[11px] text-fg-medium">Base de datos transaccional</p>
          </div>
        </div>
        <div aria-hidden className="h-6 w-px bg-gradient-to-b from-primary-light to-line" />
        <div aria-hidden className="h-px w-3/4 bg-line" />
        <div className="grid w-full grid-cols-3 gap-3 pt-0">
          {["Caja", "Almacén", "Gerencia"].map((n) => (
            <div key={n} className="flex flex-col items-center">
              <div aria-hidden className="h-5 w-px bg-line" />
              <div className="flex w-full flex-col items-center gap-1.5 rounded-lg border border-line bg-field px-2 py-3">
                <Monitor className="h-4 w-4 text-fg-medium" />
                <span className="text-xs text-fg-slate">{n}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-fg-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Todo el tráfico ocurre dentro de tu LAN. Internet es opcional.
      </p>
    </div>
  );
}

export default function Architecture() {
  return (
    <section id="arquitectura" className="relative py-20 sm:py-28">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container">
        <Reveal>
          <SectionHeader
            kicker="Solidez de ingeniería"
            title="Potencia de escritorio con rigor de nivel bancario."
            description="Por qué una aplicación de escritorio nativa supera a la nube cuando lo que importa es que el negocio no se detenga."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="card-surface flex gap-4 rounded-2xl p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-field text-primary-light">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-medium text-fg">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-medium">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="min-w-0 space-y-4">
            <Reveal>
              <LanDiagram />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-card">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="num ml-2 text-[11px] text-slate-400">servicio de licencia</span>
                </div>
                <pre className="num overflow-x-auto p-4 text-[13px] leading-7">
                  {TERMINAL.map((l) => (
                    <code key={l.t} className={`block ${l.c}`}>
                      {l.t}
                    </code>
                  ))}
                </pre>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
