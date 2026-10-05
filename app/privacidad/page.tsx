import Link from "next/link";

export const metadata = { title: "Aviso de privacidad — Distribuidora DJ" };

export default function Privacidad() {
  return (
    <main className="container max-w-2xl py-24">
      <Link href="/" className="text-sm text-primary-light hover:underline">
        ← Volver al inicio
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-fg">Aviso de privacidad</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-fg-medium">
        <p>
          Este sitio no almacena datos en servidores propios. El formulario de contacto solicita nombre, empresa,
          ciudad y teléfono únicamente para armar un mensaje de WhatsApp que tú decides enviar.
        </p>
        <p>
          Al enviar ese mensaje, la información se procesa bajo las condiciones de WhatsApp y se utiliza solo para
          coordinar una demostración o brindar soporte sobre Distribuidora DJ.
        </p>
        <p>
          Si deseas que eliminemos una conversación o tienes preguntas sobre el tratamiento de tus datos, escríbenos
          por el mismo canal.
        </p>
      </div>
    </main>
  );
}
