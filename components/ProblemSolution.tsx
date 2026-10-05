import { CloudOff, Coins, DatabaseZap, Check, X } from "lucide-react";
import Reveal, { SectionHeader } from "@/components/Reveal";

const ROWS = [
  {
    icon: CloudOff,
    title: "El internet se corta",
    before: "Los sistemas web dejan de facturar en cuanto cae la conexión del galpón o la zona comercial.",
    after:
      "La facturación y el almacén siguen al 100% sobre la red local. Sin fibra, sin datos móviles, sin pérdida de ventas.",
  },
  {
    icon: Coins,
    title: "El laberinto del dólar y el bolívar",
    before:
      "Las cajas viejas cuadran en una sola moneda y obligan a llevar hojas de Excel manuales para el resto.",
    after:
      "Registra cada ingreso en la moneda real en que se cobró y genera un libro de caja unificado y conciliable.",
  },
  {
    icon: DatabaseZap,
    title: "Inconsistencias de inventario",
    before: "Las conexiones lentas provocan doble descuento de stock y ventas de mercancía que ya no existe.",
    after: "La consistencia la garantizan triggers ACID en SQL Server 2022, no la buena voluntad del operador.",
  },
];

export default function ProblemSolution() {
  return (
    <section id="realidad" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeader
            kicker="La realidad del negocio"
            title="Tu operación no puede esperar a que vuelva el internet."
            description="Tres problemas que cuestan dinero todos los días en una distribuidora venezolana, y cómo se resuelven de raíz."
          />
        </Reveal>

        <div className="mt-14 space-y-4">
          <div className="hidden grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-5 text-xs uppercase tracking-wider text-fg-muted lg:grid">
            <span />
            <span>Software en la nube / sistemas obsoletos</span>
            <span className="text-primary-light">Distribuidora DJ</span>
          </div>

          {ROWS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className="card-surface grid grid-cols-1 gap-4 rounded-2xl p-5 lg:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-field text-primary-light">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-[15px] font-medium leading-snug text-fg">{r.title}</h3>
                </div>

                <div className="flex gap-3 rounded-xl border border-line bg-field p-4">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted" aria-hidden />
                  <p className="text-sm leading-relaxed text-fg-muted">
                    <span className="sr-only">Sistema tradicional: </span>
                    {r.before}
                  </p>
                </div>

                <div className="flex gap-3 rounded-xl border border-success/30 bg-success/[0.06] p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  <p className="text-sm leading-relaxed text-fg">
                    <span className="sr-only">Distribuidora DJ: </span>
                    {r.after}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
