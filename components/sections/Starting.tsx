import SectionHead from "@/components/SectionHead";
import { Button } from "@/components/ui/button";
import { WA_DEMO } from "@/lib/config";

/*
 * Sin prueba social: Nexo ERP es un producto nuevo y no hay clientes que citar.
 * "Qué incluye hoy" sale del menú real de la app.
 * TODO(luis): confirmar el alcance real de la implementación (instalación, capacitación, migración y soporte).
 */
const TODAY = [
  ["Operaciones", "Panel General, Facturación, Clientes, Vendedores"],
  ["Compras", "Compras, Proveedores"],
  ["Inventario", "Productos"],
  [
    "Finanzas",
    "Cuentas Bancarias, Bancos, Cuentas por Cobrar, Cuentas por Cobrar BCV, Cuentas por Pagar, Cajas, Comisiones, Tasas de Cambio",
  ],
  ["Reportes", "Reportes"],
  ["Administración", "Configuración, Usuarios, Auditoría"],
] as const;

const STEPS = [
  "Nos cuentas cómo trabajas hoy: con Excel, con otro sistema o con papel.",
  "Vemos contigo qué módulos necesitas y qué datos tendrías que cargar.",
  "Definimos juntos la instalación en tu red.",
];

export default function Starting() {
  return (
    <section id="empezando" className="py-20 sm:py-28">
      <div className="container">
        <SectionHead n="06" label="Estamos empezando" title="Nexo ERP es nuevo, y no vamos a inventarte clientes.">
          Todavía no hay distribuidoras que citar, y preferimos decírtelo antes que fabricar testimonios. Lo que
          sí puedes hacer es ver el sistema funcionando, preguntar lo que quieras y decidir con datos de tu propia
          operación.
        </SectionHead>

        <div className="mt-14 grid grid-cols-12 gap-x-2 lg:gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <h3 className="text-h3">Qué incluye hoy</h3>
            <dl className="mt-5 border-t-2 border-fg">
              {TODAY.map(([g, items]) => (
                <div key={g} className="grid gap-x-6 border-b border-line py-3.5 sm:grid-cols-[9.5rem_1fr]">
                  <dt className="font-mono text-xs uppercase tracking-wide text-fg-muted sm:pt-0.5">{g}</dt>
                  <dd className="text-[15px] text-fg-slate">{items}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <h3 className="text-h3">Cómo sería empezar</h3>
            <ol className="mt-5 border-t-2 border-fg">
              {STEPS.map((s, i) => (
                <li key={s} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-4">
                  <span className="num text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] text-fg-slate">{s}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="max-w-[44ch] text-[15px] text-fg-medium">
                Si quieres ser de las primeras distribuidoras en usarlo, escríbenos.
              </p>
              <Button asChild variant="outline">
                <a href={WA_DEMO} target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
