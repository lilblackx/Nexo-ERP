import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Aviso de privacidad | Nexo ERP",
  alternates: { canonical: "/privacidad" },
};

// TODO(luis): este texto es genérico; que lo revise quien corresponda antes de publicar.
export default function Privacidad() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" aria-label="Nexo ERP, inicio">
            <Logo />
          </Link>
          <Link href="/" className="text-sm text-primary underline underline-offset-4">
            Volver al inicio
          </Link>
        </div>
      </header>
      <main className="container py-16 sm:py-24">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <p className="folio">Legal</p>
            <h1 className="mt-2 text-h2">Aviso de privacidad</h1>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-fg-medium">
              <p>
                Este sitio no guarda tus datos en servidores propios. El formulario de contacto te pide tu nombre,
                el tipo de distribuidora, cuántas cajas y usuarios tienes, si ya cuentan con servidor y qué usan hoy,
                únicamente para armar un mensaje de WhatsApp que tú decides enviar.
              </p>
              <p>
                Al enviar ese mensaje, la información se procesa según las condiciones de WhatsApp y la usamos solo
                para responderte y coordinar una demostración de Nexo ERP.
              </p>
              <p>
                Todas las pantallas, nombres, tasas y cifras que ves en el sitio son ejemplos con datos ficticios.
              </p>
              <p>
                Si quieres que borremos una conversación o tienes preguntas sobre tus datos, escríbenos por el mismo
                canal.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
