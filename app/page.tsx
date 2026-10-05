import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

// Página temporal de verificación del sistema (Fase 1). Se reemplaza en la Fase 2.
export default function Home() {
  return (
    <main className="container py-16">
      <Logo />
      <h1 className="mt-8 max-w-3xl text-display">Cobra en dólares y bolívares sin sacar la calculadora.</h1>
      <p className="mt-6 max-w-xl text-lead text-fg-medium">Texto de apoyo con Instrument Sans.</p>
      <p className="num mt-6 text-3xl">Bs. 871.36 · $1,250.00</p>
      <div className="mt-8 flex gap-3">
        <Button>Primaria</Button>
        <Button variant="outline">Secundaria</Button>
      </div>
    </main>
  );
}
