import SectionHead from "@/components/SectionHead";
import { resolveScreens } from "@/lib/screens";
import ScreenGallery from "./ScreenGallery";

/**
 * "La app, tal cual": capturas de la app con datos de demostración. Server component: comprueba al construir
 * que cada captura exista y coincida con la huella aprobada (lib/screens-approved.json).
 */
export default function RealScreens() {
  const screens = resolveScreens();
  return (
    <section id="capturas" className="border-y border-line bg-white py-16 sm:py-24" aria-labelledby="capturas-titulo">
      <div className="container">
        <SectionHead
          n="05"
          label="La app, tal cual"
          title={<span id="capturas-titulo">Así se ve Nexo por dentro, sin retoques.</span>}
        >
          Capturas de la aplicación real, con una base de demostración: los datos y las tasas son de ejemplo.
        </SectionHead>
        <div className="mt-12">
          <ScreenGallery screens={screens} />
        </div>
      </div>
    </section>
  );
}
