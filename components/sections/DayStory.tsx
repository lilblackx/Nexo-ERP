"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";
import AppFrame, { SCREEN_LABEL, type ScreenId } from "@/components/appframe/AppFrame";
import LazyFrame from "@/components/appframe/LazyFrame";
import SectionHead from "@/components/SectionHead";
import { cn } from "@/lib/utils";

type Chapter = {
  kicker: string;
  title: string;
  screen: ScreenId;
  cobro?: boolean;
  body: React.ReactNode;
  extra?: React.ReactNode;
};

/*
 * Solo pantallas verificadas en las capturas o confirmadas por Luis.
 * El capítulo 4 (cobro mixto) va en el centro y con más espacio.
 * TODO(luis): confirmar que el cobro aplica la tasa del día a la parte en bolívares.
 */
const CHAPTERS: Chapter[] = [
  {
    kicker: "Antes de abrir la caja",
    title: "Empiezas el día con la tasa",
    screen: "tasas",
    body: (
      <>
        Lo primero es registrar la tasa del día. Nexo guarda la tasa BCV, el dólar paralelo y el peso colombiano,
        calcula la brecha entre las dos primeras y deja la tasa fija en la barra de arriba, en todas las
        pantallas. El histórico queda a un clic. Si no hay conexión, la registras tú a mano.
      </>
    ),
  },
  {
    kicker: "Llega el camión",
    title: "Compras y recepción de mercancía",
    screen: "compras",
    body: (
      <>
        Armas la orden de compra, registras la recepción cuando llega la mercancía y cargas la factura del
        proveedor. Cada proveedor tiene sus días de crédito, así que sabes cuándo te toca pagar.
      </>
    ),
  },
  {
    kicker: "En el almacén",
    title: "El inventario, por caja y a granel",
    screen: "productos",
    body: (
      <>
        Cada producto muestra su existencia en unidades y en cajas, lo que queda a granel, el costo y tres niveles
        de precio. Editas un producto o le cambias el estado sin salir del catálogo.
      </>
    ),
  },
  {
    kicker: "En el mostrador",
    title: "Cobrar en dos monedas",
    screen: "facturacion",
    cobro: true,
    body: (
      <>
        El cliente paga una parte en dólares en efectivo y el resto por pago móvil, en bolívares. Registras los dos
        pagos en la misma factura, con la caja abierta y la tasa del día a la vista. Si hay vuelto, queda anotado
        en el cobro.
      </>
    ),
    extra: (
      <>
        No tienes que confiar en nuestra palabra:{" "}
        <a href="#cobro" className="font-medium text-primary underline underline-offset-4">
          reparte tú mismo un pago de ejemplo
        </a>
        .
      </>
    ),
  },
  {
    kicker: "Revisando la cartera",
    title: "La cuenta que ya se venció",
    screen: "reportes",
    body: (
      <>
        El reporte de antigüedad de saldos separa lo vigente de lo vencido: de 1 a 30 días, de 31 a 60, de 61 a 90
        y más de 90. Filtras por cliente o por vendedor y exportas. Cuentas por Cobrar y Cuentas por Cobrar BCV
        tienen su propio módulo en Finanzas.
      </>
    ),
  },
  {
    kicker: "El vendedor pregunta",
    title: "Liquidar la comisión",
    screen: "comisiones",
    body: (
      <>
        Eliges al vendedor y ves sus comisiones factura por factura: base, monto de venta, lo que está por cobrar
        y lo que ya está liberado. Puedes filtrar las que llevan porcentaje BCV y pagarlas desde la misma
        pantalla.
      </>
    ),
  },
  {
    kicker: "Antes de irte",
    title: "Un vistazo al panel",
    screen: "panel",
    body: (
      <>
        El panel junta las ventas de hoy, lo que tienes por cobrar y por pagar, el stock bajo, las ventas de la
        semana, las facturas recientes, las cajas abiertas y el inventario en alerta. En Administración están
        Usuarios y Auditoría.
      </>
    ),
  },
];

/**
 * Pantalla en línea para móvil. Se monta solo cuando está cerca del viewport y nunca en escritorio
 * (allí se usa el AppFrame sticky): así el HTML inicial no carga siete marcos duplicados.
 */
function InlineFrame({ screen, cobro }: { screen: ScreenId; cobro?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "600px 0px" });
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(!window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  return (
    <div ref={ref} className="-mr-4 mt-6 min-h-[440px] lg:hidden">
      {inView && mobile && <AppFrame screen={screen} cobro={cobro} dense />}
    </div>
  );
}

export default function DayStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx));
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = CHAPTERS[active];

  return (
    <section id="dia" className="py-20 sm:py-28">
      <div className="container">
        <SectionHead n="02" label="Un día con Nexo" title="De la tasa de la mañana al último cobro del día.">
          Siete momentos de una distribuidora, en el orden en que suelen pasar. Las pantallas son las del sistema,
          con datos de ejemplo.
        </SectionHead>

        <div className="mt-14 grid grid-cols-12 gap-x-2 lg:gap-x-8">
          <ol className="col-span-12 min-w-0 lg:col-span-5">
            {CHAPTERS.map((c, i) => (
              <li
                key={c.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-idx={i}
                className={cn(
                  "relative border-l py-9 pl-7 transition-colors duration-300 ease-nexo lg:py-14",
                  i === active ? "border-primary" : "border-line",
                  i === 3 ? "lg:min-h-[115vh]" : "lg:min-h-[72vh]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[5px] top-10 h-[9px] w-[9px] rounded-full border-2 bg-page transition-colors duration-300 ease-nexo lg:top-[3.9rem]",
                    i === active ? "border-primary bg-primary" : "border-line",
                  )}
                />
                <p className="folio">
                  {String(i + 1).padStart(2, "0")} · {c.kicker}
                </p>
                <h3 className={cn("mt-2 text-h3 transition-colors duration-300", i === active ? "text-fg" : "text-fg-medium")}>
                  {c.title}
                </h3>
                <div className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-fg-medium">
                  <p>{c.body}</p>
                  {c.extra && <p className="mt-4">{c.extra}</p>}
                </div>
                {/* En móvil: la pantalla va en línea, sin sticky */}
                <InlineFrame screen={c.screen} cobro={c.cobro} />
              </li>
            ))}
          </ol>

          <div className="relative hidden lg:col-span-7 lg:block">
            <div className="sticky top-32">
              <div key={current.screen + String(current.cobro)} className="animate-fade">
                <LazyFrame screen={current.screen} cobro={current.cobro} dense minH={520} />
              </div>
              <p className="mt-3 flex items-center justify-between font-mono text-[12px] text-fg-muted">
                <span>
                  {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")} ·{" "}
                  {SCREEN_LABEL[current.screen]}
                </span>
                <span>datos de ejemplo</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
