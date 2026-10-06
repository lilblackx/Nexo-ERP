"use client";

import { useState } from "react";
import AppFrame, { type Crop } from "@/components/appframe/AppFrame";
import SectionHead from "@/components/SectionHead";
import { demo } from "@/lib/demo";
import { features } from "@/lib/features";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/*
 * Red local y licencia (C34-C40, C44). Plano técnico de línea fina que se dibuja una sola vez, y el panel
 * Configuración > Licencia con los estados reales de la app. Sin cifras de capacidad.
 * TODO(luis): cuántas cajas y estaciones soporta (la licencia admite de 1 a 1000; no hay cifras probadas).
 */

const FRAME: Crop = { x: 231, y: 32, w: 1049, h: 640 };
const FRAME_M: Crop = { x: 231, y: 92, w: 560, h: 380 };

const STATES = [
  { id: "ACTIVA", label: "Licencia activa" },
  { id: "VALIDAR_EN_LINEA", label: "Validación pendiente" },
] as const;

/** Plano de la red local a línea fina. Se traza una sola vez al entrar en viewport. */
function NetworkPlan() {
  const { ref, inView } = useInView<SVGSVGElement>({ rootMargin: "-10% 0px" });
  const stations = demo.license.stations;
  const free = demo.license.stationsAllowed - stations.length;
  const stationX = (i: number) => 20 + i * 92;
  const d = (n: number) => ({ "--d": `${n}ms` }) as React.CSSProperties;
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 470"
      role="img"
      aria-label={`Plano de la red local: un servidor con SQL Server y el servicio de licencia, y ${stations.length} estaciones conectadas a él. Solo el servidor se conecta por internet al servidor de licencias.`}
      className={cn("h-auto w-full", inView && "is-drawn")}
      fill="none"
      stroke="#0D47A1"
      strokeWidth="1.25"
    >
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="11" fill="#1E293B" stroke="none">
        {/* Servidor de licencias en internet */}
        <text x="60" y="20" className="draw-fade" style={d(1600)} fill="#64748B">
          Internet
        </text>
      </g>
      <rect x="60" y="28" width="280" height="44" rx="2" strokeDasharray="4 4" className="draw-fade" style={d(200)} />
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="11" fill="#1E293B" stroke="none" className="draw-fade" style={d(1500)}>
        <text x="200" y="54" textAnchor="middle">
          Servidor de licencias
        </text>
      </g>

      {/* Renovación por internet */}
      <path d="M200 72V128" strokeDasharray="4 4" className="draw-fade" style={d(500)} />
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="#475569" stroke="none" className="draw-fade" style={d(1600)}>
        <text x="212" y="96">renueva por internet</text>
        <text x="212" y="110">al menos cada 7 días</text>
      </g>

      {/* Servidor */}
      <rect x="40" y="128" width="320" height="130" rx="2" className="draw" pathLength={1} style={d(700)} />
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="11" fill="#1E293B" stroke="none" className="draw-fade" style={d(1500)}>
        <text x="56" y="150" fontWeight="600">
          Servidor
        </text>
      </g>
      <rect x="56" y="164" width="136" height="72" rx="2" className="draw" pathLength={1} style={d(900)} />
      <rect x="208" y="164" width="136" height="72" rx="2" className="draw" pathLength={1} style={d(1000)} />
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="11" fill="#1E293B" stroke="none" className="draw-fade" style={d(1600)}>
        <text x="124" y="204" textAnchor="middle">SQL Server</text>
        <text x="276" y="198" textAnchor="middle">Servicio de</text>
        <text x="276" y="212" textAnchor="middle">licencia</text>
      </g>

      {/* Red local */}
      <path d="M200 258V300" className="draw" pathLength={1} style={d(1100)} />
      <path d={`M${stationX(0) + 40} 300H${stationX(stations.length + free - 1) + 40}`} className="draw" pathLength={1} style={d(1200)} />
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="#475569" stroke="none" className="draw-fade" style={d(1700)}>
        <text x="212" y="284">red local</text>
      </g>

      {/* Estaciones */}
      {stations.map((s, i) => (
        <g key={s.name}>
          <path d={`M${stationX(i) + 40} 300V340`} className="draw" pathLength={1} style={d(1300 + i * 100)} />
          <rect x={stationX(i)} y="340" width="80" height="62" rx="2" className="draw" pathLength={1} style={d(1400 + i * 100)} />
          <g fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="#1E293B" stroke="none" className="draw-fade" style={d(1800 + i * 100)}>
            <text x={stationX(i) + 40} y="368" textAnchor="middle">Estación</text>
            <text x={stationX(i) + 40} y="384" textAnchor="middle">{String(i + 1).padStart(2, "0")}</text>
          </g>
        </g>
      ))}
      {Array.from({ length: free }).map((_, k) => {
        const i = stations.length + k;
        return (
          <g key={`free-${k}`}>
            <path d={`M${stationX(i) + 40} 300V340`} strokeDasharray="3 3" className="draw-fade" style={d(1600)} />
            <rect x={stationX(i)} y="340" width="80" height="62" rx="2" strokeDasharray="3 3" className="draw-fade" style={d(1700)} />
            <g fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="#64748B" stroke="none" className="draw-fade" style={d(2000)}>
              <text x={stationX(i) + 40} y="368" textAnchor="middle">Puesto</text>
              <text x={stationX(i) + 40} y="384" textAnchor="middle">libre</text>
            </g>
          </g>
        );
      })}

      <g fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="#64748B" stroke="none" className="draw-fade" style={d(2100)}>
        <text x="20" y="432">Las estaciones solo hablan con el</text>
        <text x="20" y="446">SQL Server de la red: no salen a internet.</text>
      </g>
    </svg>
  );
}

export default function Architecture() {
  const [state, setState] = useState<(typeof STATES)[number]["id"]>("ACTIVA");
  const l = demo.license;

  return (
    <section id="red" className="border-y border-line bg-white py-20 sm:py-28" aria-labelledby="red-titulo">
      <div className="container">
        <SectionHead
          n="06"
          label="Red local"
          title={<span id="red-titulo">Un servidor, tus estaciones y una licencia que no te deja a ciegas.</span>}
        >
          Nexo se instala en tu red: un servidor con SQL Server y las estaciones que necesites, con Windows 10 o
          superior. Los datos viven en tu servidor, no en la nube.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <NetworkPlan />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div role="tablist" aria-label="Estado de la licencia" className="mb-4 flex flex-wrap gap-2">
              {STATES.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={state === s.id}
                  onClick={() => setState(s.id)}
                  className={cn(
                    "rounded border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ease-nexo",
                    state === s.id
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-white text-fg-medium hover:border-primary hover:text-primary",
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
              frameClassName="rounded border border-line"
              caption={
                state === "ACTIVA"
                  ? `Configuración > Licencia: ${l.stations.length} estaciones registradas, y la licencia permite ${l.stationsAllowed}.`
                  : "Si la licencia no se renueva a tiempo, la app pasa a solo lectura: consulta, pero no registra."
              }
            />
          </div>
        </div>

        <dl className="mt-14 grid gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.licenciaFirmada && (
            <div>
              <dt className="text-base font-bold text-fg">Firmada y verificada en cada PC</dt>
              <dd className="mt-2 text-[15px] text-fg-medium">
                La licencia es un token firmado con Ed25519. La firma se verifica localmente, con una clave pública
                incluida en el programa.
              </dd>
            </div>
          )}
          <div>
            <dt className="text-base font-bold text-fg">Una licencia por empresa</dt>
            <dd className="mt-2 text-[15px] text-fg-medium">
              Se activa una sola vez, por internet, en el servidor. Tiene un límite de estaciones, de 1 a 1000: las
              estaciones leen la licencia del servidor y no activan nada.
            </dd>
          </div>
          {features.soloLectura && (
            <div>
              <dt className="text-base font-bold text-fg">Solo lectura, no bloqueo</dt>
              <dd className="mt-2 text-[15px] text-fg-medium">
                El servidor renueva la licencia por internet. Si vence o no se renueva, la app sigue abierta: puedes
                consultar todo, pero no registrar operaciones. {/* TODO(luis): confirmar el plazo de 7 días. */}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-base font-bold text-fg">Instalador de servidor y de estación</dt>
            <dd className="mt-2 text-[15px] text-fg-medium">
              Para Windows 10 (1809 o superior) o Windows Server 2019 de 64 bits, sobre SQL Server. La referencia
              documentada es SQL Server 2019. {/* TODO(luis): qué ediciones de SQL Server se soportan (Express). */}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
