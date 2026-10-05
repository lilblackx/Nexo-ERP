import Logo from "@/components/Logo";
import { CONTACTS, CONTACT_EMAIL, NAV_LINKS, whatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-page">
      <div className="container grid grid-cols-12 gap-x-2 md:gap-x-6 gap-y-10 py-14">
        <div className="col-span-12 md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-medium">
            Sistema de gestión de escritorio para distribuidoras y mayoristas en Venezuela. Windows y SQL Server
            sobre tu red local.
          </p>
        </div>

        <nav aria-label="Secciones" className="col-span-6 md:col-span-3 md:col-start-7">
          <p className="folio">Secciones</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-fg-medium transition-colors hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3">
          <p className="folio">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CONTACTS.map((c) => (
              <li key={c.number}>
                <a
                  href={whatsappLink("Hola, quiero información sobre Nexo ERP.", c.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="num text-fg-medium transition-colors hover:text-primary"
                >
                  {c.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-fg-medium transition-colors hover:text-primary">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href="/privacidad" className="text-fg-medium transition-colors hover:text-primary">
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
