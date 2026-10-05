import { CONTACTS, NAV_LINKS, RELEASE, WA_DEMO, WA_SUPPORT, whatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[13px] font-bold text-white">
              DJ
            </span>
            <span className="text-sm font-semibold text-fg">Distribuidora DJ</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
            ERP de escritorio para distribuidoras y mayoristas en Venezuela. Operación local, multi-moneda y
            trazable.
          </p>
          <p className="num mt-4 inline-block rounded border border-line bg-field px-2 py-1 text-[11px] text-fg-muted">
            {RELEASE} · Windows · SQL Server
          </p>
        </div>

        <nav aria-label="Secciones">
          <p className="text-xs uppercase tracking-wider text-fg-muted">Producto</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-fg-medium transition-colors hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Contacto y legal">
          <p className="text-xs uppercase tracking-wider text-fg-muted">Contacto</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="text-fg-medium transition-colors hover:text-primary">
                Solicitar demostración
              </a>
            </li>
            <li>
              <a href={WA_SUPPORT} target="_blank" rel="noopener noreferrer" className="text-fg-medium transition-colors hover:text-primary">
                Soporte técnico
              </a>
            </li>
            {CONTACTS.map((c) => (
              <li key={c.number}>
                <a
                  href={whatsappLink("Hola, quiero información sobre Distribuidora DJ.", c.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="num text-fg-medium transition-colors hover:text-primary"
                >
                  {c.display}
                </a>
              </li>
            ))}
            <li>
              <a href="/privacidad" className="text-fg-medium transition-colors hover:text-primary">
                Aviso de privacidad
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col justify-between gap-2 py-5 text-xs text-fg-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Distribuidora DJ. Todos los derechos reservados.</p>
          <p>Ingeniería y desarrollo de software empresarial · Venezuela</p>
        </div>
      </div>
    </footer>
  );
}
