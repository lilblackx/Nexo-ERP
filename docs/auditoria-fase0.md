# Auditoría de la landing previa (Fase 0)

## Patrones genéricos detectados
- Navbar píldora flotante con sombra, badge "v2.4 LTS" y punto verde pulsante.
- Hero centrado: píldora, última frase del titular en azul, dos botones lado a lado, tira de 3 cifras en caja.
- Eyebrow en mono y mayúsculas sobre cada título centrado.
- Grillas de 3 y 5 tarjetas iguales con icono en cuadrito redondeado; `rounded-2xl/3xl` en todo.
- Comparativa ✗ gris / ✓ verde en cajas; glow-pulse, ping-soft y blobs decorativos.
- Todo centrado y simétrico, con el mismo ritmo vertical.
- Copy con afirmaciones sin verificar (ver `claims.md`): USDT, rutas, Ed25519, "0 ms", "100% transaccional".
- Datos sensibles: capturas con nombre, correo, teléfono y RIF reales; marca de agua "sesión no comercial".

## Dirección elegida: "libro contable + galpón"
- Editorial y alineado a la izquierda, grilla de 12 columnas, secciones numeradas como folios ("01 Sin conexión").
- Reglas finas de 1px (#CBD5E1) en lugar de tarjetas con sombra; radios de 2 a 6px; superficies planas.
- Secciones sobre #F8FAFC alternadas con secciones a sangre en azul profundo derivado del primary.
- El producto es el protagonista: mockups en código (`AppFrame`) que replican la estructura real de la app.
- Motivo de marca: la barra de tasas (BCV · paralelo · brecha) como franja fina en el header.
- Cinco momentos propios: interruptor "corta el internet", un día en la distribuidora (scrollytelling),
  cobro mixto jugable, plano técnico de la LAN, CTA a WhatsApp con vista previa de chat.
- Tipografía: Bricolage Grotesque (titulares), Instrument Sans (texto), IBM Plex Mono (cifras).
- Sin framer-motion: CSS + IntersectionObserver para mantener el JS inicial mínimo.
