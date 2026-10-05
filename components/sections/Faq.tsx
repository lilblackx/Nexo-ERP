"use client";

import SectionHead from "@/components/SectionHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { features } from "@/lib/features";

/*
 * Respuestas solo con hechos verificados. Donde falta información, se dice con honestidad.
 * TODO(luis): cada respuesta marcada abajo necesita tu confirmación antes de publicar.
 */
const FAQ = [
  {
    q: "¿Qué pasa si se va el internet?",
    a: "Facturación, inventario y caja operan sobre la red local, sin conexión. Las tasas se actualizan cuando hay conexión; si no la hay, las registras a mano en Tasas de Cambio.",
  },
  {
    q: "¿Qué pasa si se daña el servidor?",
    a: "Todas las estaciones leen y escriben en el servidor, así que mientras esté apagado no pueden operar. Por eso importan el respaldo de la base de datos y tener un equipo de contingencia. Te explicamos el procedimiento en la demostración.", // TODO(luis): describir el procedimiento de respaldo y restauración
  },
  {
    q: "¿Cómo son los respaldos?",
    a: "La información está en una base de datos SQL Server dentro de tu red, así que los respaldos son de esa base de datos y quedan bajo tu control.", // TODO(luis): frecuencia recomendada, herramienta y pasos de restauración
  },
  {
    q: "¿Cuántas cajas y usuarios soporta?",
    a: "Todavía no publicamos una cifra porque no queremos darte un número sin haberlo medido. Dinos cuántas cajas y usuarios tienes y lo revisamos contigo.", // TODO(luis): medir y confirmar la capacidad
  },
  {
    q: "¿Puedo pasar mis datos desde Excel u otro sistema?",
    a: "Depende de cómo tengas hoy tus datos. Cuéntanos qué usas y te decimos qué se puede cargar y cómo.", // TODO(luis): confirmar si hay importación y en qué formatos
  },
  {
    q: "¿Qué impresoras y qué datos salen en la factura?",
    a: "En Configuración eliges la impresora predeterminada y editas el pie de factura, el logo y los datos de tu empresa. El IVA también es configurable.", // TODO(luis): confirmar modelos y si hay soporte fiscal
  },
  {
    q: "¿Cómo se registra un pago móvil?",
    a: features.pagoMovil
      ? "En la factura, el pago móvil se registra como un método de pago, junto con el efectivo en dólares. Puedes combinar los dos en una misma factura." // TODO(luis): confirmar el flujo (verificación, referencia, registro manual)
      : "",
  },
  {
    q: "¿Cómo funciona la licencia?",
    a: features.ed25519
      ? "La licencia se verifica con firma criptográfica Ed25519 y se administra desde Configuración." // TODO(luis): confirmar antes de activar
      : "La licencia se administra desde Configuración, en la pestaña Licencia. Si quieres conocer las condiciones, pregúntanos.", // TODO(luis): modelo de licencia, precio y renovación
  },
].filter((f) => f.a);

export default function Faq() {
  return (
    <section id="preguntas" className="border-t border-line bg-card py-20 sm:py-28">
      <div className="container">
        <SectionHead n="07" label="Preguntas" title="Lo que preguntaría el dueño de una distribuidora." />
        <div className="mt-12 grid grid-cols-12">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="col-span-12 border-t-2 border-fg lg:col-span-9 lg:col-start-3"
          >
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
