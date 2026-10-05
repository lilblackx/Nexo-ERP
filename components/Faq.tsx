import Reveal, { SectionHeader } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "¿Qué requerimientos de hardware necesita el servidor y las estaciones?",
    a: "No necesitas un centro de datos. Un equipo Windows en tu red local aloja SQL Server y las estaciones de trabajo son PCs Windows convencionales. Dimensionamos el servidor según tu volumen de facturas, número de usuarios y cantidad de productos, y te lo indicamos antes de instalar.",
  },
  {
    q: "¿Cómo funciona si nos quedamos sin servicio de internet o luz?",
    a: "Sin internet, nada cambia: la base de datos y las estaciones están en tu red local, así que se sigue facturando, despachando y cobrando. La licencia se verifica con firma criptográfica y no bloquea la aplicación si el galpón pasa días desconectado. Ante un corte de luz, el motor transaccional de SQL Server protege la integridad de las operaciones en curso; recomendamos respaldo eléctrico (UPS) para el servidor.",
  },
  {
    q: "¿Cómo se actualizan las tasas de cambio de las monedas (BCV, paralelo, peso colombiano, USDT)?",
    a: "Registras las tasas vigentes de cada día para cada moneda y el sistema las aplica a las operaciones, conservando la tasa usada en cada cobro para que el libro de caja y las conciliaciones sean verificables en cualquier momento.",
  },
  {
    q: "¿Cómo se realizan las copias de seguridad de la base de datos?",
    a: "La información está en SQL Server dentro de tu red, por lo que los respaldos son locales y bajo tu control. Te entregamos el procedimiento documentado de copia y restauración y te ayudamos a programarlo durante la instalación.",
  },
  {
    q: "¿El sistema incluye soporte técnico e inducción para el personal de almacén y caja?",
    a: "Sí. La implementación incluye instalación (in situ o remota), configuración de la base de datos local, migración de clientes e inventario, y capacitación del personal de caja, almacén y administración. Después cuentas con soporte técnico directo por WhatsApp.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <Reveal>
          <SectionHeader kicker="Preguntas frecuentes" title="Lo que suelen preguntar antes de decidir." />
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion type="single" collapsible defaultValue="item-0" className="mt-12 space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
