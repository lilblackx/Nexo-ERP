import { ArrowDown } from "lucide-react";
import AppFrame from "@/components/appframe/AppFrame";
import { Button } from "@/components/ui/button";
import { WA_DEMO } from "@/lib/config";
import { features } from "@/lib/features";
import { demo, usd } from "@/lib/demo";

/*
 * Opciones de titular (voz local y concreta, ancladas en lo verificable):
 *  A. "Cobra en dólares y bolívares en una sola factura."          <- elegida
 *  B. "Zelle, bolívares y el vuelto: todo en la misma factura."
 *  C. "La tasa del día, el cobro mixto y el vuelto, sin calculadora."
 * A es el hecho más fuerte y más fácil de comprobar (cobro mixto en varias monedas, C01 y C03 en docs/claims.md).
 * B es más específica pero exige explicar Zelle. C junta tres ideas y pierde fuerza. Ninguna promete
 * "sin internet" de forma absoluta: el matiz va en el subtítulo ("en tu red local", C37).
 */
export default function Hero() {
  return (
    <section id="inicio" className="pt-10 sm:pt-14 lg:pt-16">
      <div className="container">
        <div className="grid grid-cols-12 gap-x-2 md:gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="text-display max-w-[16ch] sm:max-w-[18ch]">
              Cobra en dólares y bolívares en una sola factura.
            </h1>
            <p className="mt-6 max-w-[58ch] text-lead text-fg-medium">
              Nexo ERP es el sistema de gestión de escritorio para distribuidoras y mayoristas. Cobras en dólares,
              bolívares, pesos y USDT con la tasa del día, entregas el vuelto y llevas la caja, el inventario y las
              cuentas por cobrar en tu red local.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button asChild size="lg">
                <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </Button>
              <a
                href="#cobro"
                className="group inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
              >
                Prueba el cobro mixto
                <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-nexo group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Pie de factura: solo hechos verificados */}
          <dl className="col-span-12 grid grid-cols-[auto_1fr] content-end gap-x-5 gap-y-1.5 self-end border-t border-line pt-4 text-sm lg:col-span-4 lg:col-start-9">
            <dt className="folio">Sistema</dt>
            <dd>De escritorio, para Windows</dd>
            <dt className="folio">Datos</dt>
            <dd>SQL Server en tu red</dd>
            {features.licenciaFirmada && (
              <>
                <dt className="folio">Licencia</dt>
                <dd>Por empresa, firmada con Ed25519</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* El AppFrame sangra contra el borde derecho del viewport: factura FV-000013 en "Formas de Pago". */}
      <div className="mt-10 pl-4 sm:pl-6 md:mt-14 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]">
        <AppFrame
          screen="facturacion"
          dialog="nueva-factura"
          tab="pagos"
          draft="hero"
          mobileFocus={{ x: 372, y: 232, w: 470, h: 470 }}
          frameClassName="rounded-l border border-r-0 border-line"
          caption={`Factura ${demo.invoiceDraft.number} en “Formas de Pago”: Zelle en dólares y transferencia en bolívares, cubierta, con ${usd(demo.invoiceDraft.change.usd)} de vuelto.`}
          captionClassName="pr-4 sm:pr-6 lg:pr-8"
        />
      </div>
    </section>
  );
}
