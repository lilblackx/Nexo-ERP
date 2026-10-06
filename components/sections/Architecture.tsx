"use client";

import { useState, type CSSProperties } from "react";
import AppFrame, { type Crop } from "@/components/appframe/AppFrame";
import SectionHead from "@/components/SectionHead";
import { demo } from "@/lib/demo";
import { features } from "@/lib/features";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/*
 * Red local y licencia (C34-C40, C44, C46, C49). Plano técnico tipo "blueprint": línea fina sobre cuadrícula,
 * que se dibuja una sola vez al entrar en viewport, y el panel Configuración > Licencia con los estados reales.
 * Sin cifras de capacidad. TODO(luis): cuántas cajas y estaciones soporta (la licencia admite de 1 a 1000; sin cifras probadas).
 */

const FRAME: Crop = { x: 231, y: 32, w: 1049, h: 560 };
const FRAME_M: Crop = { x: 231, y: 92, w: 560, h: 380 };

const STATES = [
  { id: "ACTIVA", label: "Licencia activa" },
  { id: "VALIDAR_EN_LINEA", label: "Validación pendiente" },
] as const;

const POINTS = [
  {
    t: "SQL Server en tu red",
    d: "Los datos viven en un servidor dentro de tu local, no en un servicio externo.",
  },
  {
    t: "Estaciones Windows",
    d: "La aplicación de escritorio se conecta al servidor por la red local. Las estaciones no salen a internet.",
  },
  {
    t: "Las reglas, en la base de datos",
    d: "El stock, los saldos y los cierres se refuerzan con triggers y bloqueos de fila de SQL Server.",
  },
  features.licenciaFirmada && {
    t: "Una licencia por empresa",
    d: "Firmada con Ed25519 y verificada localmente. Se activa una vez por internet, en el servidor, y se renueva por internet al menos cada 7 días.",
  },
  features.soloLectura && {
    t: "Solo lectura, no bloqueo",
    d: "Si la licencia vence o no se renueva, la app sigue abierta: consultas todo, pero no registras operaciones.",
  },
].filter(Boolean) as { t: string; d: string }[];

const STATIONS = ["CAJA 1", "CAJA 2", "OFICINA"];

/** Plano de la red local a línea fina sobre cuadrícula. Se traza una sola vez al entrar en viewport. */
function BlueprintPlan() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "-10% 0px" });
  const d = (n: number) => ({ "--d": `${n}ms` }) as CSSProperties;
  const slots = [...STATIONS, "OTRA ESTACIÓN"];
  const sx = (i: number) => 96 + i * 168; // centro de cada estación
  const label = { fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, letterSpacing: 1 } as const;
  return (
    <div
      ref={ref}
      className={cn("relative border border-white/35 bg-primary-deep", inView && "is-drawn")}
      style={{
        backgroundImage:
          "linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <svg
        viewBox="0 0 720 410"
        role="img"
        aria-label="Plano de la red local: un servidor con SQL Server conectado por la red local a las estaciones de caja y oficina. Solo el servidor se conecta por internet al servidor de licencias."
        className="block h-auto w-full"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.3"
      >
        {/* Servidor de licencias en internet (línea punteada) */}
        <rect x="470" y="22" width="220" height="44" strokeDasharray="4 4" strokeOpacity="0.6" className="draw-fade" style={d(300)} />
        <path d="M410 70H470" strokeDasharray="4 4" strokeOpacity="0.6" className="draw-fade" style={d(500)} />
        <g stroke="none" fill="#BFDBFE" className="draw-fade" style={d(1600)}>
          <text x="580" y="42" textAnchor="middle" {...label} fontSize={10}>SERVIDOR DE LICENCIAS</text>
          <text x="580" y="57" textAnchor="middle" {...label} fontSize={10}>(INTERNET)</text>
          <text x="418" y="88" {...label} fontSize={9}>RENUEVA CADA ≤ 7 DÍAS</text>
        </g>

        {/* Servidor: rack con tres bandejas */}
        <rect x="300" y="30" width="110" height="82" className="draw" pathLength={1} style={d(100)} />
        <path d="M300 57H410M300 84H410" className="draw" pathLength={1} style={d(500)} />
        <g stroke="none" fill="#FFFFFF" className="draw-fade" style={d(900)}>
          <circle cx="316" cy="43" r="2.6" />
          <circle cx="316" cy="70" r="2.6" />
          <circle cx="316" cy="98" r="2.6" />
        </g>
        <g stroke="none" fill="#DBEAFE" className="draw-fade" style={d(1500)}>
          <text x="355" y="138" textAnchor="middle" {...label}>SERVIDOR · SQL SERVER</text>
        </g>

        {/* Bajada y red local */}
        <path d="M355 112V226" className="draw" pathLength={1} style={d(700)} />
        <path d="M60 226H660" className="draw" pathLength={1} style={d(900)} />
        <circle cx="355" cy="226" r="4" fill="#FFFFFF" stroke="none" className="draw-fade" style={d(1100)} />
        <g stroke="none" fill="#DBEAFE" className="draw-fade" style={d(1500)}>
          <text x="660" y="214" textAnchor="end" {...label}>RED LOCAL (LAN)</text>
        </g>

        {/* Estaciones: monitores de línea fina */}
        {slots.map((name, i) => {
          const free = i === slots.length - 1;
          const cx = sx(i);
          const dash = free ? { strokeDasharray: "4 4", strokeOpacity: 0.6 } : {};
          return (
            <g key={name}>
              <path d={`M${cx} 226V268`} className={free ? "draw-fade" : "draw"} pathLength={1} style={d(1100 + i * 150)} {...dash} />
              <rect x={cx - 38} y="268" width="76" height="50" className={free ? "draw-fade" : "draw"} pathLength={1} style={d(1200 + i * 150)} {...dash} />
              <path d={`M${cx - 26} 278H${cx + 26}`} className="draw-fade" style={d(1700 + i * 150)} strokeOpacity={free ? 0.5 : 1} />
              <path d={`M${cx} 318V328M${cx - 14} 328H${cx + 14}`} className="draw-fade" style={d(1700 + i * 150)} strokeOpacity={free ? 0.5 : 1} />
              <g stroke="none" fill={free ? "#93C5FD" : "#FFFFFF"} className="draw-fade" style={d(1900 + i * 150)}>
                <text x={cx} y="352" textAnchor="middle" {...label} fontSize={10}>{name}</text>
              </g>
            </g>
          );
        })}

        {/* Cota "TU LOCAL" */}
        <path d="M60 376H660M60 370V382M660 370V382" strokeOpacity="0.7" className="draw" pathLength={1} style={d(2300)} />
        <g stroke="none" fill="#DBEAFE" className="draw-fade" style={d(2600)}>
          <rect x="330" y="366" width="64" height="20" fill="#072B63" />
          <text x="362" y="380" textAnchor="middle" {...label} fontSize={10}>TU LOCAL</text>
        </g>
      </svg>
    </div>
  );
}

export default function Architecture() {
  const [state, setState] = useState<(typeof STATES)[number]["id"]>("ACTIVA");
  const l = demo.license;

  return (
    <section id="red" className="on-blue bg-primary-deep py-20 text-white sm:py-28" aria-labelledby="red-titulo">
      <div className="container">
        <SectionHead
          n="06"
          label="Red local"
          onBlue
          title={<span id="red-titulo">Tus datos viven en un servidor dentro de tu red.</span>}
        >
          Nexo es una aplicación de escritorio para Windows que trabaja contra un SQL Server en tu local. Así lo
          dibujaríamos para tu galpón.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 gap-y-10 md:gap-x-6">
          <div className="col-span-12 lg:col-span-7">
            <BlueprintPlan />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#93C5FD]">
              Plano 01 · Topología · Sin escala
            </p>
          </div>

          <ol className="col-span-12 border-t border-white/25 lg:col-span-5">
            {POINTS.map((p, i) => (
              <li key={p.t} className="grid grid-cols-[2.25rem_1fr] gap-x-2 border-b border-white/25 py-4">
                <span className="font-mono text-[12px] text-[#93C5FD]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-base font-semibold text-white">{p.t}</h3>
                  <p className="mt-1 text-[15px] text-tint-100">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 max-w-2xl text-[15px] text-tint-100">
          Opera en tu red local, sin depender de internet para el día a día. La licencia se renueva por internet al
          menos una vez por semana. {/* TODO(luis): confirmar el plazo de 7 días y qué ediciones de SQL Server se soportan (la referencia documentada es 2019). */}
        </p>

        <div className="mt-16 border-t border-white/25 pt-10">
          <h3 className="text-h3 !text-white">La licencia, tal como se ve en la app</h3>
          <div role="tablist" aria-label="Estado de la licencia" className="mb-4 mt-6 flex flex-wrap gap-2">
            {STATES.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={state === s.id}
                onClick={() => setState(s.id)}
                className={cn(
                  "rounded border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ease-nexo",
                  state === s.id
                    ? "border-white bg-white text-primary-deep"
                    : "border-white/40 text-white hover:border-white hover:bg-white/10",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <AppFrame
            screen="licencia"
            license={state}
            focus={FRAME}
            mobileFocus={FRAME_M}
            frameClassName="rounded border border-white/30"
            captionClassName="!text-tint-100 [&_span:last-child]:!text-tint-300"
            caption={
              state === "ACTIVA"
                ? `Configuración > Licencia: ${l.stations.length} estaciones registradas, y la licencia permite ${l.stationsAllowed}.`
                : "Si la licencia no se renueva a tiempo, la app pasa a solo lectura: consulta, pero no registra."
            }
          />
          <p className="mt-6 max-w-3xl text-[15px] text-tint-100">
            Hay un instalador con modo Servidor y modo Estación, para Windows 10 (1809 o superior) o Windows Server 2019
            de 64 bits. La licencia es una por empresa y tiene un límite de estaciones, de 1 a 1000.
          </p>
        </div>
      </div>
    </section>
  );
}
