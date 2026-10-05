import Image from "next/image";
import SectionHead from "@/components/SectionHead";
import { REAL_SCREENSHOTS_READY } from "@/lib/config";

/*
 * Galería de capturas reales, lista para reemplazar. Hasta que REAL_SCREENSHOTS_READY sea true no se renderiza,
 * así no sale ningún hueco ni imagen rota a producción.
 * TODO(luis): ver /public/screens/README.md para nombres, tamaño y requisitos de las capturas.
 */
const SHOTS = [
  { file: "panel-general.png", label: "Panel general", alt: "Panel general de Nexo ERP" },
  { file: "facturacion.png", label: "Facturación", alt: "Listado de facturación de ventas de Nexo ERP" },
  { file: "tasas-cambio.png", label: "Tasas de cambio", alt: "Módulo de tasas de cambio de Nexo ERP" },
  { file: "productos.png", label: "Productos", alt: "Catálogo de productos de Nexo ERP" },
  { file: "comisiones.png", label: "Comisiones", alt: "Módulo de comisiones de Nexo ERP" },
  { file: "reportes.png", label: "Reportes", alt: "Antigüedad de saldos en Nexo ERP" },
] as const;

export default function RealScreens() {
  if (!REAL_SCREENSHOTS_READY) return null;
  return (
    <section id="capturas" className="border-t border-line bg-card py-20 sm:py-28">
      <div className="container">
        <SectionHead n="A" label="Capturas" title="El sistema real, sin maquillaje." />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {SHOTS.map((s) => (
            <figure key={s.file}>
              <div className="aspect-[1600/850] overflow-hidden border border-line bg-field">
                <Image
                  src={`/screens/${s.file}`}
                  alt={s.alt}
                  width={1600}
                  height={850}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 font-mono text-[12px] text-fg-muted">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
