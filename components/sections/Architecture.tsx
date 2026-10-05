"use client";

import SectionHead from "@/components/SectionHead";
import { useInView } from "@/lib/hooks";
import { features } from "@/lib/features";
import { cn } from "@/lib/utils";

/*
 * Momento 4: la LAN como plano técnico. Se dibuja una sola vez al entrar en viewport.
 * Sin cifras de capacidad. TODO(luis): medir y confirmar cuántas cajas y usuarios soporta un servidor.
 * TODO(luis): confirmar si hay soporte para sucursales; por ahora no se dibuja ninguna.
 */

const STATIONS = [
  { x: 110, label: "Caja 1" },
  { x: 250, label: "Caja 2" },
  { x: 390, label: "Almacén" },
  { x: 530, label: "Administración" },
];

const FACTS = [
  {
    title: "SQL Server en tu red",
    text: "Los datos viven en un servidor dentro del local, no en un servicio externo.",
  },
  {
    title: "Estaciones Windows",
    text: "La aplicación de escritorio se conecta al servidor por la red local.",
  },
  {
    title: "Las reglas, en la base de datos",
    text: "El stock, los totales y las cuentas por cobrar y por pagar se mantienen con triggers de SQL Server.",
  },
  {
    title: "Reportes sin congelar la ventana",
    text: "Las consultas pesadas se ejecutan en segundo plano.",
  },
  {
    title: "Licencia",
    text: features.ed25519
      ? "La licencia se verifica con firma criptográfica Ed25519." // TODO(luis): confirmar antes de activar
      : "La licencia se administra desde Configuración, en la pestaña Licencia.",
  },
];

function Blueprint({ drawn }: { drawn: boolean }) {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label="Plano de la red local: un servidor SQL Server conectado por la LAN a dos cajas, el almacén y administración"
      className={cn("w-full text-white", drawn && "is-drawn")}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
    >
      <defs>
        <pattern id="bp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" stroke="currentColor" strokeOpacity="0.09" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="400" fill="url(#bp-grid)" stroke="none" />
      <rect x="0.5" y="0.5" width="639" height="399" strokeOpacity="0.35" />

      {/* Servidor */}
      <rect pathLength={1} className="draw" style={d(0)} x="250" y="32" width="140" height="74" strokeWidth="1.6" />
      <path pathLength={1} className="draw" style={d(250)} d="M250 56H390M250 80H390" strokeOpacity="0.6" />
      <circle className="draw-fade" style={d(700)} cx="268" cy="44" r="3" fill="currentColor" stroke="none" />
      <circle className="draw-fade" style={d(780)} cx="268" cy="68" r="3" fill="currentColor" stroke="none" />
      <circle className="draw-fade" style={d(860)} cx="268" cy="92" r="3" fill="currentColor" stroke="none" />
      <text className="draw-fade" style={d(500)} x="320" y="132" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-mono)" fontSize="12">
        SERVIDOR · SQL SERVER
      </text>

      {/* Bajada al bus de la LAN */}
      <path pathLength={1} className="draw" style={d(500)} d="M320 106V190" strokeWidth="1.6" />
      <circle className="draw-fade" style={d(1100)} cx="320" cy="190" r="4" fill="currentColor" stroke="none" />

      {/* Bus de la LAN */}
      <path pathLength={1} className="draw" style={d(700)} d="M70 190H570" strokeWidth="1.6" />
      <text className="draw-fade" style={d(1300)} x="570" y="180" textAnchor="end" fill="currentColor" stroke="none" fontFamily="var(--font-mono)" fontSize="11" opacity="0.8">
        RED LOCAL (LAN)
      </text>

      {/* Estaciones */}
      {STATIONS.map((s, i) => (
        <g key={s.label}>
          <path pathLength={1} className="draw" style={d(1000 + i * 160)} d={`M${s.x} 190V238`} />
          <rect pathLength={1} className="draw" style={d(1150 + i * 160)} x={s.x - 36} y="238" width="72" height="46" strokeWidth="1.4" />
          <path pathLength={1} className="draw" style={d(1300 + i * 160)} d={`M${s.x - 28} 246H${s.x + 28}M${s.x} 284V298M${s.x - 18} 298H${s.x + 18}`} strokeOpacity="0.7" />
          <text className="draw-fade" style={d(1500 + i * 160)} x={s.x} y="322" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-mono)" fontSize="11">
            {s.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Cota del local */}
      <g className="draw-fade" style={d(2300)} strokeOpacity="0.55">
        <path d="M70 360H570M70 352V368M570 352V368" />
        <text x="320" y="352" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-mono)" fontSize="10.5" opacity="0.85">
          TU LOCAL
        </text>
      </g>
    </svg>
  );
}

export default function Architecture() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "-15% 0px" });

  return (
    <section id="red" className="on-blue bg-primary-deep text-white">
      <div className="container py-20 sm:py-28">
        <SectionHead onBlue n="05" label="Red local" title="Tus datos viven en un servidor dentro de tu red.">
          Nexo ERP es una aplicación de escritorio para Windows que trabaja contra un SQL Server en tu local. Así lo
          dibujaríamos para tu galpón.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 lg:gap-x-8 gap-y-10">
          <div ref={ref} className="col-span-12 lg:col-span-7">
            <Blueprint drawn={inView} />
            <p className="mt-3 font-mono text-[12px] text-tint-300">PLANO 01 · TOPOLOGÍA · SIN ESCALA</p>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <ol className="border-t border-white/25">
              {FACTS.map((f, i) => (
                <li key={f.title} className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-white/25 py-4">
                  <span className="num pt-0.5 text-xs text-tint-300">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-[1.0625rem] font-semibold !text-white">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-tint-100">{f.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm leading-relaxed text-tint-100">
              Si se va el internet, facturación, inventario y caja siguen sobre la red local. Las tasas se
              actualizan cuando hay conexión o se registran a mano.
            </p>
          </div>
        </div>

        {features.ed25519 && (
          // TODO(luis): terminal de licencia offline. Solo se muestra si ed25519 es true.
          <pre className="num mt-12 overflow-x-auto border border-white/25 p-4 text-[13px] leading-7 text-tint-100">
            {"$ licencia.verificar()\n✓ firma Ed25519 válida"}
          </pre>
        )}
      </div>
    </section>
  );
}
