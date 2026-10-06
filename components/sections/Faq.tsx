import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHead from "@/components/SectionHead";
import { features } from "@/lib/features";

/*
 * Preguntas frecuentes: respuestas solo del brief (docs/claims.md).
 * Las marcadas TODO(luis) no prometen nada que no exista (no hay respaldo integrado ni importador de Excel).
 */

const FAQ: { q: string; a: string }[] = [
  {
    q: "¿Qué pasa sin internet?",
    a: "Nexo opera en tu red local, sin depender de internet para el día a día: ventas, inventario, cobros, cajas, reportes, impresión y tasas manuales. La licencia se renueva por internet al menos una vez por semana. El mapa de rutas y el envío de códigos por correo (para recuperar una clave) también necesitan internet.",
  },
  {
    q: "¿Cómo se licencia?",
    a: features.licenciaFirmada
      ? "Con una licencia por empresa, firmada con Ed25519 y verificada localmente. Se activa una sola vez, por internet, en el servidor, y tiene un límite de estaciones. Si la licencia vence o falla la renovación, la app pasa a modo solo lectura en vez de bloquearse: puedes consultar, pero no registrar."
      : "Con una licencia por empresa que se activa una sola vez en el servidor.",
  },
  {
    q: "¿Cómo se registra la tasa del día?",
    a: "A mano, una vez al día: la tasa BCV, el dólar paralelo y el peso colombiano. Queda en un histórico con la brecha entre BCV y paralelo. La app avisa si el cambio es brusco (más de 30 %) o si falta registrar la tasa de hoy, y cada factura guarda la tasa vigente al emitirse.",
  },
  {
    q: "¿Puedo anular una factura?",
    a: "Sí. Anular repone el stock, no borra la historia y genera una nota de crédito por lo cobrado, que aplicas a otra factura o devuelves con la autorización de un supervisor.",
  },
  {
    q: "¿Puede el vendedor ver sus comisiones?",
    a: "Sí. Con su usuario, el vendedor entra a “Mis Comisiones” y ve solo las suyas, con su estado: Pendiente, Liberada o Pagada.",
  },
  {
    q: "¿Qué impresoras sirven?",
    a: "La factura y el corte de caja salen en PDF o impresos en hoja carta, por cualquier impresora de Windows. Por ahora no hay formato de ticket térmico.",
  },
  {
    q: "¿Es una factura fiscal?",
    // TODO(luis): redacción final.
    a: "Es un documento digital propio, con número de factura, número de control interno e IVA configurable. No usa máquina fiscal ni calcula IGTF.",
  },
  {
    q: "¿Qué pasa si se daña el servidor? ¿Cómo se respalda?",
    // TODO(luis): no hay respaldo integrado; no prometer. Decidir el texto final.
    a: "Tus datos viven en el SQL Server de tu servidor, en tu red. Nexo no incluye una función de respaldo integrada: la copia de seguridad de esa base de datos la organizas tú con las herramientas de SQL Server. Si el servidor se apaga o se daña, las estaciones no pueden operar hasta que lo restablezcas.",
  },
  {
    q: "¿Puedo migrar mis datos desde Excel?",
    // TODO(luis): no hay importador; no prometer.
    a: "Hoy no hay un importador de Excel: los productos, clientes y saldos iniciales se cargan dentro de la app. Los reportes sí se exportan a Excel y a PDF.",
  },
  {
    q: "¿Cuántas cajas y estaciones soporta?",
    // TODO(luis): confirmar cifras de capacidad.
    a: "La licencia admite de 1 a 1000 estaciones. Todavía no hay cifras de capacidad probadas, así que no damos un número.",
  },
  {
    q: "¿Qué ediciones de SQL Server se usan?",
    // TODO(luis): el brief documenta SQL Server 2019; Express solo para pruebas.
    a: "La referencia documentada es SQL Server 2019. SQL Server Express se usa para pruebas.",
  },
  {
    q: "¿Qué NO hace todavía?",
    // TODO(luis): decidir si se publica esta lista.
    a: "No incluye respaldos integrados, importación desde Excel, impresión de tickets térmicos, varias sucursales o empresas en una misma instalación ni tasas automáticas.",
  },
];

export default function Faq() {
  return (
    <section id="preguntas" className="border-t border-line bg-white py-20 sm:py-28" aria-labelledby="preguntas-titulo">
      <div className="container">
        <SectionHead
          n="08"
          label="Preguntas"
          title={<span id="preguntas-titulo">Lo que suelen preguntar antes de decidir.</span>}
        >
          Respuestas cortas y sin adornos, incluida la lista de lo que Nexo todavía no hace.
        </SectionHead>
        <div className="mt-10 grid grid-cols-12 gap-x-2 md:gap-x-6">
          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <Accordion type="single" collapsible className="border-t border-line">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`f${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

