"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import SectionHead from "@/components/SectionHead";
import { Button } from "@/components/ui/button";
import { CONTACTS, whatsappLink } from "@/lib/config";
import { cn } from "@/lib/utils";

/*
 * Momento 5: CTA a WhatsApp con intención. Arma el mensaje y lo muestra como chat antes de enviar.
 * No hay backend: nada se guarda en el sitio.
 */

const TYPES = ["Alimentos y consumo masivo", "Repuestos", "Ferretería y construcción", "Otro rubro"];
const TOOLS = ["Excel", "Otro sistema", "Papel", "Nada todavía"];
const SERVER = ["Sí", "No", "No sé"];

const inputCls =
  "h-11 w-full border border-line bg-card px-3 text-[15px] text-fg placeholder:text-fg-muted transition-colors hover:border-fg-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelCls = "mb-1.5 block text-[13px] font-medium text-fg-slate";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [boxes, setBoxes] = useState("");
  const [users, setUsers] = useState("");
  const [server, setServer] = useState("");
  const [tool, setTool] = useState("");
  const [line, setLine] = useState<string>(CONTACTS[0].number);

  const message = useMemo(() => {
    const parts = [
      `Hola, soy ${name.trim() || "…"}. Tengo una distribuidora (${type.toLowerCase()}) y quiero ver Nexo ERP.`,
      "",
      `• Cajas: ${boxes.trim() || "…"}`,
      `• Usuarios: ${users.trim() || "…"}`,
      `• Ya tenemos servidor: ${server || "…"}`,
      `• Hoy usamos: ${tool || "…"}`,
    ];
    return parts.join("\n");
  }, [name, type, boxes, users, server, tool]);

  const ready = name.trim().length > 1;
  const href = whatsappLink(message, line);
  const display = CONTACTS.find((c) => c.number === line)?.display ?? "";

  return (
    <section id="contacto" className="on-blue bg-primary-deep text-white">
      <div className="container py-20 sm:py-28">
        <SectionHead onBlue n="08" label="Contacto" title="Cuéntanos cómo trabajas y arma tu mensaje.">
          Responde lo que sepas. Verás el mensaje tal como llegará por WhatsApp antes de enviarlo.
        </SectionHead>

        <div className="mt-12 grid grid-cols-12 gap-x-2 lg:gap-x-8 gap-y-10">
          <form
            className="col-span-12 bg-card p-5 text-fg sm:p-7 lg:col-span-7"
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) window.open(href, "_blank", "noopener,noreferrer");
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="lf-name" className={labelCls}>
                  Tu nombre
                </label>
                <input id="lf-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="lf-type" className={labelCls}>
                  Tipo de distribuidora
                </label>
                <select id="lf-type" className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lf-boxes" className={labelCls}>
                  ¿Cuántas cajas?
                </label>
                <input id="lf-boxes" className={inputCls} inputMode="numeric" placeholder="Ej.: 2" value={boxes} onChange={(e) => setBoxes(e.target.value)} />
              </div>
              <div>
                <label htmlFor="lf-users" className={labelCls}>
                  ¿Cuántos usuarios?
                </label>
                <input id="lf-users" className={inputCls} inputMode="numeric" placeholder="Ej.: 5" value={users} onChange={(e) => setUsers(e.target.value)} />
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className={labelCls}>¿Ya tienen un servidor?</legend>
              <div className="flex flex-wrap gap-2">
                {SERVER.map((o) => (
                  <label
                    key={o}
                    className={cn(
                      "cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-light",
                      server === o ? "border-primary bg-primary text-white" : "border-line text-fg-slate hover:border-primary",
                    )}
                  >
                    <input type="radio" name="server" className="sr-only" checked={server === o} onChange={() => setServer(o)} />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className={labelCls}>¿Qué usan hoy?</legend>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((o) => (
                  <label
                    key={o}
                    className={cn(
                      "cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-light",
                      tool === o ? "border-primary bg-primary text-white" : "border-line text-fg-slate hover:border-primary",
                    )}
                  >
                    <input type="radio" name="tool" className="sr-only" checked={tool === o} onChange={() => setTool(o)} />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className={labelCls}>Escribir a</legend>
              <div className="flex flex-wrap gap-2">
                {CONTACTS.map((c) => (
                  <label
                    key={c.number}
                    className={cn(
                      "num cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-light",
                      line === c.number ? "border-primary bg-tint-50 text-primary" : "border-line text-fg-slate hover:border-primary",
                    )}
                  >
                    <input type="radio" name="line" className="sr-only" checked={line === c.number} onChange={() => setLine(c.number)} />
                    {c.display}
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 text-xs text-fg-muted">
              Al enviar se abre WhatsApp con este mensaje. Este sitio no guarda tus datos.
            </p>
          </form>

          <div className="col-span-12 lg:col-span-5">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-tint-300">Vista previa del mensaje</p>
            <div className="border border-white/25">
              <div className="flex items-center justify-between border-b border-white/25 px-4 py-2.5 text-sm">
                <span>
                  <b className="font-semibold">Nexo ERP</b>
                  <span className="num ml-2 text-xs text-tint-200">{display}</span>
                </span>
                <span className="text-xs text-tint-300">WhatsApp</span>
              </div>
              <div className="bg-tint-50 p-4">
                <div className="ml-auto max-w-[92%] rounded-lg rounded-tr-none bg-success-bg px-3.5 py-2.5 text-[14px] leading-relaxed text-fg shadow-sm" aria-live="polite">
                  <p className="whitespace-pre-line">{message}</p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-fg-medium">
                    ahora <Check className="h-3 w-3 text-primary-light" aria-hidden />
                  </p>
                </div>
              </div>
            </div>
            {ready ? (
              <Button asChild variant="inverse" size="lg" className="mt-5 w-full">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  Abrir WhatsApp con este mensaje
                </a>
              </Button>
            ) : (
              <Button variant="inverse" size="lg" className="mt-5 w-full" disabled>
                Abrir WhatsApp con este mensaje
              </Button>
            )}
            {!ready && <p className="mt-2 text-xs text-tint-200">Escribe tu nombre para habilitar el envío.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
