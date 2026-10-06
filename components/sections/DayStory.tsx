"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import AppFrame, { type Crop, type FrameSpec } from "@/components/appframe/AppFrame";
import LazyMount from "@/components/LazyMount";
import SectionHead from "@/components/SectionHead";
import { demo, num0, rates, usd } from "@/lib/demo";
import { features } from "@/lib/features";
import { cn } from "@/lib/utils";

/*
 * Un día en la distribuidora. Escenario sticky (escritorio) donde el AppFrame cambia de pantalla según el
 * capítulo; en móvil, cada capítulo lleva su recorte en línea, sin sticky.
 * Todas las cifras salen de lib/demo (ver docs/claims.md: C01-C03, C06-C07, C10-C13, C17-C29, C32).
 */

const CHAPTERS = [
  "Abrir el día",
  "Comprar al proveedor",
  "Inventario",
  "Cobrar en varias monedas",
  "Cobrar a crédito",
  "La comisión del vendedor",
  "Cerrar el día",
] as const;

// Relación de aspecto única del escenario (ventana sin barra de título ni menú lateral): 1049 × 720.
const R = 1049 / 720;
const crop = (x: number, y: number, w: number): Crop => ({ x, y, w, h: Math.round(w / R) });
const PAGE: Crop = { x: 231, y: 32, w: 1049, h: 720 };
const PAGE_M: Crop = { x: 231, y: 92, w: 520, h: 390 };

interface Beat {
  chapter: number; // 1-7
  heading: string;
  body: ReactNode;
  spec: FrameSpec;
  focus: Crop;
  mobileFocus: Crop;
  caption: string;
  /** El capítulo 4 es el más fuerte: más espacio en el recorrido. */
  big?: boolean;
}

const hero = demo.invoiceDraft;
const odc = demo.purchases.orders.find((o) => o.number === "ODC-000003")!;
const ret = demo.purchases.returns[0];
const norte = demo.receivablesByClient.find((c) => c.client.startsWith("Supermercado Norte"))!;
const maria = demo.commissions.filter((c) => c.seller === "María");
const seller = maria[0].seller;
const montoLiberado = maria.filter((c) => c.status === "liberada").reduce((s, c) => s + c.commission, 0);
const low = demo.products.filter((p) => p.lowStock).length;
const expiring = demo.dashboard.stockAlerts.filter((a) => a.expires).length;
const nc = demo.creditNotes[0];
const cajaAbierta = demo.cashRegisters.find((c) => c.status === "ABIERTA")!;

const BEATS: Beat[] = [
  {
    chapter: 1,
    heading: "Abrir la caja",
    body: (
      <p>
        Sin una caja con turno abierto no se puede facturar. El turno de {cajaAbierta.name} se abre con su saldo de
        apertura; al final del día lo cierras y sacas el corte impreso.
      </p>
    ),
    spec: { screen: "cajas", dialog: "abrir-caja" },
    focus: crop(340, 170, 600),
    mobileFocus: { x: 400, y: 232, w: 480, h: 330 },
    caption: "Apertura de turno de una caja.",
  },
  {
    chapter: 1,
    heading: "Registrar la tasa del día",
    body: (
      <>
        <p>
          La tasa BCV, el dólar paralelo y el peso colombiano se registran a mano, una vez al día. Cada registro queda en
          el histórico con la brecha entre BCV y paralelo.
        </p>
        <p>Cada factura guarda la tasa vigente cuando se emite.</p>
      </>
    ),
    spec: { screen: "tasas", dialog: "tasa-registro" },
    focus: crop(300, 150, 680),
    mobileFocus: { x: 372, y: 190, w: 540, h: 400 },
    caption: "Registrar la tasa del día: BCV, dólar paralelo y peso colombiano, con valores de ejemplo.",
  },
  {
    chapter: 1,
    heading: "Un cero de más",
    body: (
      <p>
        Si tecleas {(rates.bcv * 10).toFixed(2)} en vez de {rates.bcv.toFixed(2)}, la app lo nota: cuando la tasa nueva
        se aleja más de 30 % de la anterior, pide confirmar el “cambio brusco” antes de guardar. Y si pasa el día sin
        tasa registrada, te avisa que falta.
      </p>
    ),
    spec: { screen: "tasas", dialog: "tasa-brusco" },
    focus: crop(310, 130, 660),
    mobileFocus: { x: 400, y: 270, w: 480, h: 360 },
    caption: "Aviso de cambio brusco al registrar la tasa.",
  },
  {
    chapter: 2,
    heading: `La orden llegó incompleta`,
    body: (
      <>
        <p>
          Pides mercancía con una orden de compra. {odc.number} era de {num0(odc.qty)} unidades y llegaron{" "}
          {num0(odc.received)}: queda en estado Parcial hasta que llegue el resto.
        </p>
        <p>La mercancía entra al stock cuando registras la recepción, no antes.</p>
      </>
    ),
    spec: { screen: "compras" },
    focus: PAGE,
    mobileFocus: PAGE_M,
    caption: "Órdenes de compra con estados Pendiente, Parcial y Completa.",
  },
  {
    chapter: 2,
    heading: "Daño en tránsito",
    body: (
      <p>
        {num0(ret.qty)} unidades llegaron dañadas. Rechazas esas unidades desde la recepción {ret.reception} con una
        nota de devolución por “{ret.reason}”.
      </p>
    ),
    spec: { screen: "compras", comprasTab: "recepciones", dialog: "devolucion" },
    focus: crop(340, 170, 600),
    mobileFocus: { x: 400, y: 232, w: 480, h: 330 },
    caption: "Nota de devolución de una recepción, con motivo.",
  },
  {
    chapter: 3,
    heading: "Cajas, unidades sueltas y tres precios",
    body: (
      <>
        <p>
          El inventario se lleva en cajas y en unidades sueltas. Cada producto tiene tres niveles de precio y tú eliges
          cuál va en cada línea de la factura.
        </p>
        {features.alertasStockVencimiento && (
          <p>
            La píldora amarilla del catálogo cuenta los productos con stock bajo o por vencer (en el ejemplo, {low} y{" "}
            {expiring}) y un icono ámbar marca cuáles.
          </p>
        )}
      </>
    ),
    spec: { screen: "productos" },
    focus: PAGE,
    mobileFocus: { x: 231, y: 92, w: 560, h: 420 },
    caption: "Catálogo de productos con cajas, unidades sueltas y tres precios.",
  },
  {
    chapter: 4,
    big: true,
    heading: "Una factura, dos monedas y el vuelto",
    body: (
      <>
        <p>
          {hero.client} compra {usd(hero.total)} con IVA. Paga {usd(hero.payments[0].usd)} por Zelle y el resto por
          transferencia en bolívares: la app convierte con la tasa del día y deja la factura cubierta.
        </p>
        <p>
          Como pagó de más, calcula el vuelto de {usd(hero.change.usd)}. Lo entregas en efectivo o por Pago Móvil o
          transferencia; si es bancario, pide referencia y la autorización de un supervisor. Todo se registra en una
          sola transacción: la factura queda completa o no queda.
        </p>
      </>
    ),
    spec: { screen: "facturacion", dialog: "nueva-factura", tab: "pagos", draft: "hero" },
    focus: { x: 240, y: 190, w: 800, h: 549 },
    mobileFocus: { x: 272, y: 200, w: 500, h: 470 },
    caption: "Factura FV-000013 en “Formas de Pago”: Zelle y transferencia en bolívares, con vuelto.",
  },
  {
    chapter: 4,
    big: true,
    heading: "Un descuento, con firma",
    body: (
      <p>
        Para dar un descuento por “Cliente frecuente”, un supervisor escribe su usuario y su clave en un diálogo, sin
        que tú cierres tu sesión. La factura sale con el descuento y queda registrado quién lo autorizó.
      </p>
    ),
    spec: { screen: "facturacion", dialog: "autorizacion" },
    focus: crop(310, 150, 660),
    mobileFocus: { x: 400, y: 190, w: 480, h: 420 },
    caption: "Autorización de un supervisor para un descuento.",
  },
  {
    chapter: 4,
    big: true,
    heading: "Anular sin borrar la historia",
    body: (
      <p>
        Si una factura se anula por un error al digitar, el stock se repone y la historia queda. Si ya tenía cobros, la
        app genera la nota de crédito {nc.number} por {usd(nc.amount)}: la aplicas a otra factura o devuelves el
        dinero con autorización.
      </p>
    ),
    spec: { screen: "facturacion", dialog: "nota-credito" },
    focus: crop(340, 200, 600),
    mobileFocus: { x: 380, y: 290, w: 520, h: 200 },
    caption: "Aviso de la nota de crédito generada al anular una factura.",
  },
  {
    chapter: 5,
    heading: "Cobrar lo que debe un cliente",
    body: (
      <>
        <p>
          Las cuentas por cobrar se agrupan por cliente. {norte.client} debe {usd(norte.balance)} en {norte.invoices.length}{" "}
          facturas, y puedes cobrarlas con un abono general.
        </p>
        <p>El abono se aplica de la factura más antigua a la más nueva.</p>
      </>
    ),
    spec: { screen: "cxc", dialog: "abono" },
    focus: crop(300, 140, 700),
    mobileFocus: { x: 390, y: 190, w: 500, h: 380 },
    caption: "Abono general: se aplica a las facturas más antiguas primero.",
  },
  {
    chapter: 5,
    heading: "Qué está vencido y desde cuándo",
    body: (
      <p>
        El reporte de antigüedad de saldos separa lo vigente de lo vencido en rangos: Vigente, 1-30, 31-60, 61-90 y 90+
        días. En el ejemplo hay {usd(demo.aging.total)} por cobrar y {usd(demo.aging.total - demo.aging.totals.Vigente)} ya vencidos.
      </p>
    ),
    spec: { screen: "reportes" },
    focus: PAGE,
    mobileFocus: { x: 231, y: 150, w: 520, h: 390 },
    caption: "Reporte de antigüedad de saldos por rango.",
  },
  {
    chapter: 6,
    heading: "La comisión se libera cuando el cliente paga",
    body: (
      <>
        <p>
          La comisión del vendedor sale de la diferencia entre el precio al que vendió y el precio de lista.
          {/* TODO(luis): confirmar la regla de negocio de la comisión (diferencia contra Precio 1). */} En contado nace
          Liberada; en crédito queda Pendiente hasta que el cliente paga la factura completa.
        </p>
        <p>
          Las liberadas ({usd(montoLiberado)} de {seller}) se pagan en lote, desde una caja o un banco.
        </p>
      </>
    ),
    spec: { screen: "comisiones" },
    focus: PAGE,
    mobileFocus: { x: 231, y: 92, w: 560, h: 400 },
    caption: "Comisiones por vendedor: Pendiente, Liberada y Pagada.",
  },
  {
    chapter: 6,
    heading: "Cada vendedor ve las suyas",
    body: (
      <p>
        El vendedor entra con su usuario y ve solo sus comisiones en “Mis Comisiones”, sin selector de vendedor ni botón
        de pago.
      </p>
    ),
    spec: { screen: "comisiones", mine: true },
    focus: PAGE,
    mobileFocus: { x: 231, y: 92, w: 560, h: 400 },
    caption: "Mis Comisiones, la vista del rol vendedor.",
  },
  {
    chapter: 7,
    heading: "El cierre del día",
    body: (
      <p>
        El Panel General resume la jornada: ventas de hoy, por cobrar, por pagar, stock bajo, ventas de la semana, cajas
        activas, facturas recientes e inventario en alerta. Cierras el turno de la caja y sacas el corte impreso.
      </p>
    ),
    spec: { screen: "panel" },
    focus: PAGE,
    mobileFocus: { x: 231, y: 92, w: 560, h: 330 },
    caption: "Panel General con el resumen de la operación.",
  },
  {
    chapter: 7,
    heading: "Quién hizo qué",
    body: (
      <p>
        La auditoría guarda cada evento con su usuario: la apertura de caja, el cambio de tasa, cada factura emitida o
        anulada y el pago de comisiones.
      </p>
    ),
    spec: { screen: "auditoria" },
    focus: PAGE,
    mobileFocus: { x: 231, y: 92, w: 560, h: 400 },
    caption: "Bitácora de auditoría por usuario.",
  },
];

export default function DayStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.beat));
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const beat = BEATS[active];
  const firstOfChapter = (i: number) => i === 0 || BEATS[i - 1].chapter !== BEATS[i].chapter;

  return (
    <section id="dia" className="py-20 sm:py-28" aria-labelledby="dia-titulo">
      <div className="container">
        <SectionHead
          n="02"
          label="Un día"
          title={<span id="dia-titulo">Un día en la distribuidora, de la caja al cierre.</span>}
        >
          Siete momentos de una jornada en las pantallas de Nexo, con datos de demostración. Baja y la ventana cambia con
          cada uno.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 md:gap-x-6">
          {/* Capítulos */}
          <ol className="col-span-12 lg:col-span-4">
            {BEATS.map((b, i) => (
              <li
                key={b.heading}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-beat={i}
                className={cn(
                  "flex flex-col justify-center border-t border-line py-10 lg:min-h-[55vh]",
                  b.big && "lg:min-h-[78vh]",
                )}
              >
                {firstOfChapter(i) && (
                  <p className="folio mb-3">
                    Capítulo {b.chapter} de {CHAPTERS.length} · {CHAPTERS[b.chapter - 1]}
                  </p>
                )}
                <h3 className={cn(b.big ? "text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)]" : "text-h3")}>{b.heading}</h3>
                <div className="mt-4 max-w-[46ch] space-y-3 text-body text-fg-medium">{b.body}</div>

                {/* Móvil: recorte en línea, sin sticky */}
                <LazyMount className="mt-6 lg:hidden" minHeight={260}>
                  <AppFrame
                    {...b.spec}
                    focus={b.mobileFocus}
                    mobileFocus={b.mobileFocus}
                    frameClassName="rounded border border-line"
                    caption={b.caption}
                  />
                </LazyMount>
              </li>
            ))}
          </ol>

          {/* Escritorio: escenario sticky */}
          <div className="hidden lg:col-span-8 lg:block">
            <div className="sticky top-28 pt-10">
              <div className="mb-3 flex items-baseline justify-between gap-4 font-mono text-[12px] text-fg-muted">
                <span>
                  {String(beat.chapter).padStart(2, "0")} · {CHAPTERS[beat.chapter - 1]}
                </span>
                <span className="flex gap-1" aria-hidden>
                  {CHAPTERS.map((c, i) => (
                    <i
                      key={c}
                      className={cn("h-1 w-6 rounded-full", i + 1 <= beat.chapter ? "bg-primary" : "bg-line")}
                    />
                  ))}
                </span>
              </div>
              <div key={active} className="animate-fade">
                <AppFrame
                  {...beat.spec}
                  focus={beat.focus}
                  frameClassName="rounded border border-line"
                  caption={beat.caption}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
