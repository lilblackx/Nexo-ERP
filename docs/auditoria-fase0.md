# Auditoría de la landing actual (Fase 0)

Estado de partida: rama `main` con un primer rediseño ya aplicado (Fases 0 a 5 y despliegue), hecho
con el brief anterior. Esta rama (`redesign-nexo`) lo rehace con el brief verificado y los datos demo.

## Verificación de entorno
- La carpeta es la landing (Next.js 15, `app/`, `components/`). `reference/` ya estaba en `.gitignore`
  y nunca entró al historial (`git log --all -- reference` vacío; `git ls-files reference` vacío).
- `public/screens/` contiene 6 PNG sin versionar (antiguos, con marca de agua). No se tocan ni se muestran.
- Faltaba instalar dependencias (`npm install`); `mockup-spec.json` y `datos-demo.json` existen.

## Patrones genéricos que siguen en el sitio actual
- Tipografía distinta a la pedida: Bricolage Grotesque, Instrument Sans e IBM Plex Mono (debe ser Inter + JetBrains Mono).
- `AppFrame` aproximado: sidebar de 158 px, tipografía de la landing, `role="img"`, no escala desde un ancho lógico.
- Las pantallas del `AppFrame` usan datos propios (FAC-000127, "Abasto Ejemplo 01") y no `datos-demo.json`.
- Cifras sueltas en componentes (`components/appframe/data.ts`, `MixedPayment`, `DayStory`).
- Eyebrows en mono y mayúsculas sobre títulos (`SectionHead`) y rejillas de tarjetas iguales en Modules.
- Sin hero a sangre con la factura FV-000013 ni el diálogo "Formas de Pago".

## Afirmaciones del copy actual que contradicen el brief
- El mockup de cobro usa "Pago móvil (Bs.)" como método de cobro: solo existe como vuelto y devolución.
- Declara el cobro de un monto en bolívares sin aclarar que la moneda base es USD.
- FAQ: "los respaldos son de esa base de datos", "puedo pasar mis datos desde Excel": no hay respaldo integrado ni importador.
- FAQ y Architecture: Ed25519 / "terminal de licencia offline": la firma es local, pero la licencia no es offline.
- "Sin conexión" / "operan sin conexión" sin el matiz de la renovación semanal por internet.
- DayStory y Modules mencionan "porcentaje BCV" y "Cuentas por Cobrar BCV" como funciones destacadas (pendiente de confirmar).
- Comisiones presentadas con un porcentaje fijo inventado (3 %); la regla real es diferencia contra el Precio 1.
- Título de ventana del mockup: "Nexo ERP — Sistema de Gestión Administrativa" (nombre de la app real, no de la marca).
- Tasas del brief (BCV 40, paralelo 44, COP 4,000) no sirven para público venezolano: se sustituyen por las de ejemplo.

## Qué se rehace
`lib/features.ts` (flags nuevos), `lib/demo/` (datos con tasas de ejemplo + verificación), tipografía,
tokens, `AppFrame` fiel (ancho lógico 1280 px escalado), hero, cinco momentos, galería, módulos, FAQ,
metadata/JSON-LD y `docs/claims.md`.
