import {
  Banknote,
  CalendarDays,
  CircleHelp,
  LayoutGrid,
  Mail,
  MessageCircle,
  Network,
  ShieldCheck,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import { CONTACTS, CONTACT_EMAIL, NAV_LINKS, whatsappLink } from "@/lib/config";

const NAV_ICONS: Record<string, LucideIcon> = {
  "#sin-internet": WifiOff,
  "#dia": CalendarDays,
  "#cobro": Banknote,
  "#modulos": LayoutGrid,
  "#red": Network,
  "#preguntas": CircleHelp,
};

const linkCls = "inline-flex items-center gap-2 text-fg-medium transition-colors hover:text-primary";
const iconCls = "h-4 w-4 shrink-0 text-fg-muted";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-page pb-16 sm:pb-0">
      <div className="container grid grid-cols-12 gap-x-2 gap-y-10 py-14 md:gap-x-6">
        <div className="col-span-12 md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-medium">
            Sistema de gestión de escritorio para distribuidoras y mayoristas en Venezuela. Para Windows, con SQL
            Server en tu red local.
          </p>
        </div>

        <nav aria-label="Secciones" className="col-span-12 sm:col-span-6 md:col-span-3 md:col-start-7">
          <p className="folio">Secciones</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((l) => {
              const Icon = NAV_ICONS[l.href];
              return (
                <li key={l.href}>
                  <a href={l.href} className={linkCls}>
                    {Icon && <Icon aria-hidden className={iconCls} />}
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <p className="folio">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CONTACTS.map((c) => (
              <li key={c.number}>
                <a
                  href={whatsappLink("Hola, quiero información sobre Nexo ERP.", c.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`num ${linkCls}`}
                >
                  <MessageCircle aria-hidden className={iconCls} />
                  {c.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkCls} break-words`}>
                <Mail aria-hidden className={iconCls} />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href="/privacidad" className={linkCls}>
                <ShieldCheck aria-hidden className={iconCls} />
                Aviso de privacidad
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container flex flex-col justify-between gap-1 py-5 text-xs text-fg-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Nexo ERP.</p>
          <p>Las pantallas, nombres, tasas y cifras de este sitio son ejemplos con datos ficticios.</p>
        </div>
      </div>
    </footer>
  );
}
