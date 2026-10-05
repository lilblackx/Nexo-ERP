"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { CONTACTS, whatsappLink } from "@/lib/config";

const FIELDS = [
  { name: "nombre", label: "Nombre", autoComplete: "name", type: "text" },
  { name: "empresa", label: "Empresa", autoComplete: "organization", type: "text" },
  { name: "ciudad", label: "Ciudad", autoComplete: "address-level2", type: "text" },
  { name: "telefono", label: "Teléfono", autoComplete: "tel", type: "tel" },
] as const;

export default function FinalCta() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const message =
      `Hola, quiero agendar una demostración de Distribuidora DJ.\n` +
      `Nombre: ${get("nombre")}\nEmpresa: ${get("empresa")}\nCiudad: ${get("ciudad")}\nTeléfono: ${get("telefono")}`;
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <section id="contacto" className="px-4 pb-24 pt-10 sm:pb-32">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary p-6 shadow-[0_32px_70px_-28px_rgb(13_71_161/0.7)] sm:p-10 lg:p-14">
          <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl animate-glow-pulse" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Moderniza la operación de tu distribuidora con la plataforma más sólida del mercado.
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/85">
                Instalación in situ o remota, configuración de base de datos local y migración de clientes e
                inventario incluida.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {CONTACTS.map((c) => (
                  <Button key={c.number} asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
                    <a
                      href={whatsappLink("Hola, quiero agendar una demostración personalizada de Distribuidora DJ para mi empresa.", c.number)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp <span className="num">{c.display}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
              {sent ? (
                <div className="py-8 text-center" role="status">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-success" />
                  <p className="mt-3 text-base font-medium text-fg">Solicitud lista en WhatsApp</p>
                  <p className="mt-1.5 text-sm text-fg-medium">
                    Envía el mensaje que se abrió y te contactaremos para coordinar la demostración.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-4 text-sm text-primary-light underline-offset-4 hover:underline"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-fg">
                    <CalendarCheck className="h-4 w-4 text-primary-light" /> Agenda tu demostración
                  </p>
                  {FIELDS.map((f) => (
                    <div key={f.name}>
                      <label htmlFor={f.name} className="mb-1.5 block text-xs text-fg-medium">
                        {f.label}
                      </label>
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.type}
                        required
                        autoComplete={f.autoComplete}
                        className="h-11 w-full rounded-lg border border-line bg-field px-3.5 text-sm text-fg placeholder:text-fg-light transition-colors hover:border-primary-light/50 focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500/30"
                      />
                    </div>
                  ))}
                  <Button type="submit" className="w-full" size="lg">
                    Solicitar demostración
                  </Button>
                  <p className="text-center text-[11px] text-fg-muted">
                    Al enviar se abre WhatsApp con tus datos. No almacenamos información en este sitio.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
