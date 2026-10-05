import { Hammer, ShoppingBasket, Wrench, Package } from "lucide-react";
import Reveal, { SectionHeader } from "@/components/Reveal";

const CASES = [
  {
    icon: ShoppingBasket,
    sector: "Alimentos",
    title: "Alto volumen y margen estrecho",
    text: "Ventas por caja y por unidad, control de existencias por producto y cobro en la moneda que el cliente tenga a la mano.",
  },
  {
    icon: Wrench,
    sector: "Repuestos",
    title: "Catálogo extenso, stock exacto",
    text: "Miles de códigos con existencias confiables, precios auditables y cuentas por cobrar a talleres y revendedores.",
  },
  {
    icon: Hammer,
    sector: "Ferretería",
    title: "Crédito a clientes recurrentes",
    text: "Facturas a crédito con seguimiento de cuentas por cobrar, estados de cuenta y notas de crédito con trazabilidad.",
  },
  {
    icon: Package,
    sector: "Consumo masivo",
    title: "Vendedores en calle",
    text: "Cartera por vendedor, rutas de despacho en mapa y comisiones calculadas sobre lo efectivamente cobrado.",
  },
];

export default function UseCases() {
  return (
    <section id="casos" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeader
            kicker="Casos de uso"
            title="Hecho para el mayorista venezolano, sin importar el rubro."
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.06} className="[&>div]:h-full">
              <div className="card-surface group h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-light/50">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-field text-primary-light transition-colors group-hover:text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="num mt-5 text-[11px] uppercase tracking-widest text-primary-light">{c.sector}</p>
                <h3 className="mt-1.5 text-[15px] font-medium leading-snug text-fg">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-medium">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
