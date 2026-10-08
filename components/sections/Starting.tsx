import InView from "@/components/InView";
import { Button } from "@/components/ui/button";
import SectionHead from "@/components/SectionHead";
import { WA_DEMO } from "@/lib/config";
import { features } from "@/lib/features";

/*
 * "Estamos empezando": sin prueba social falsa. Qué incluye hoy (solo lo verificado), cómo sería una
 * implementación acompañada y una invitación honesta. Los escenarios son de ejemplo, nunca clientes.
 */

const MARGIN = "0px 0px -60px 0px";

const TODAY = [
  features.pagoMixto && "Cobro mixto en dólares, bolívares, pesos y USDT, con vuelto",
  "Facturas de contado y a crédito, con IVA configurable",
  features.cajasYUnidades && "Inventario por cajas y unidades sueltas, con tres niveles de precio",
  features.compras && "Compras con órdenes, recepciones y devoluciones",
  features.cuentasPorCobrarFifo && "Cuentas por cobrar y por pagar, con antigüedad de saldos",
  features.comisiones && "Comisiones de vendedor que se liberan al cobrar",
  "Varias cajas, con apertura, cierre y corte impreso",
  "44 reportes con exportación a Excel y PDF",
  features.roles && "Roles, permisos y autorización de supervisor",
  features.auditoria && "Bitácora de auditoría por usuario",
].filter(Boolean) as string[];

const SCENARIOS = [
  {
    title: "El mostrador",
    text: "Una distribuidora de alimentos con una caja. Cada mañana registra la tasa; al mediodía, un cliente paga con Zelle y bolívares y se lleva el vuelto.",
  },
  {
    title: "El vendedor de ruta",
    text: "Un vendedor factura a crédito a un abasto. Su comisión queda pendiente hasta que el abasto paga la factura completa; ese día pasa a liberada.",
  },
];

export default function Starting() {
  return (
    <section id="empezando" className="py-16 sm:py-24" aria-labelledby="empezando-titulo">
      <div className="container">
        <SectionHead
          n="07"
          label="Estamos empezando"
          title={<span id="empezando-titulo">Nexo es nuevo y no vamos a inventarte clientes.</span>}
        >
          Es un producto recién salido: todavía no tenemos distribuidoras que citar. Lo que sí podemos mostrarte es
          lo que hace hoy, con su límite a la vista.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 gap-y-12 md:gap-x-6">
          <div className="col-span-12 lg:col-span-5">
            <h3 className="text-h3">Qué incluye hoy</h3>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {TODAY.map((t, i) => (
                <InView
                  as="li"
                  key={t}
                  y={24}
                  margin={MARGIN}
                  delayMs={Math.min(i, 6) * 60}
                  className="py-3 text-[15px] text-fg-slate"
                >
                  {t}
                </InView>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <h3 className="text-h3">Cómo sería empezar</h3>
            <p className="mt-5 max-w-[58ch] text-body text-fg-medium">
              Si decides probarlo, lo instalamos contigo y te acompañamos en las primeras semanas. Qué incluye ese
              acompañamiento lo conversamos según cada distribuidora.
              {/* TODO(luis): confirmar qué ofrezco: instalación, capacitación, carga de datos, soporte. */}
            </p>

            <h3 className="mt-12 text-h3">Dos escenarios de ejemplo</h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {SCENARIOS.map((s, i) => (
                <InView key={s.title} y={24} margin={MARGIN} delayMs={i * 100} className="border-t border-line pt-4">
                  <p className="folio">Escenario de ejemplo</p>
                  <p className="mt-2 text-base font-bold text-fg">{s.title}</p>
                  <p className="mt-2 text-[15px] text-fg-medium">{s.text}</p>
                </InView>
              ))}
            </div>

            <div className="mt-12 border-t border-line pt-6">
              <p className="max-w-[52ch] text-lead text-fg">
                Si quieres ser de las primeras distribuidoras en usarlo, cuéntanos cómo trabajas y lo vemos juntos.
              </p>
              <Button asChild size="lg" className="mt-6">
                <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
