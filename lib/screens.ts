import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import approved from "./screens-approved.json";

/**
 * Capturas de la galería "La app, tal cual" (public/screens/). Solo se muestra una captura cuya huella SHA-256
 * coincide con la aprobada en lib/screens-approved.json (scripts/aprobar-capturas.mjs): nunca las antiguas.
 * Si falta o no coincide, la galería muestra un marcador neutro.
 * TODO(luis): reemplazar capturas. Tras recapturar con el nombre "Nexo ERP" y los textos corregidos
 * (RIF Empresa, Iniciar Sesión, Contraseña, "A granel"), vuelve a correr los dos scripts.
 */
export interface ScreenSpec {
  id: string;
  label: string;
  /** Nombres de archivo aceptados, en orden de preferencia. */
  files: { name: string; caption: string }[];
}

export const SCREENS: ScreenSpec[] = [
  {
    id: "panel",
    label: "Panel General",
    files: [
      {
        name: "panel-general.png",
        caption:
          "Panel General: ventas de hoy, por cobrar, por pagar, stock bajo, ventas de la semana, cajas activas, facturas recientes e inventario en alerta.",
      },
    ],
  },
  {
    id: "facturacion",
    label: "Facturación",
    files: [
      {
        name: "facturacion.png",
        caption:
          "Nueva Factura en “Formas de Pago”: Zelle y transferencia en bolívares, cubierta, con el vuelto por Pago Móvil.",
      },
    ],
  },
  {
    id: "tasas",
    label: "Tasas de cambio",
    files: [
      {
        name: "tasas-cambio.png",
        caption: "Tasas de Cambio: la tasa vigente de BCV, dólar paralelo y COP, con el histórico y la brecha.",
      },
      {
        name: "tasa-cambio-brusco.png",
        caption: "Registrar la tasa del día: si el cambio es brusco, la app pide confirmarlo antes de guardar.",
      },
    ],
  },
  {
    id: "productos",
    label: "Productos",
    files: [
      {
        name: "productos.png",
        caption: "Catálogo de productos con cajas, unidades sueltas, tres precios y la alerta de stock bajo y por vencer.",
      },
    ],
  },
  {
    id: "comisiones",
    label: "Comisiones",
    files: [
      {
        name: "comisiones.png",
        caption: "Comisiones de un vendedor, con los estados Pendiente, Liberada y Pagada.",
      },
    ],
  },
  {
    id: "reportes",
    label: "Reportes",
    files: [
      {
        name: "reportes.png",
        caption: "Reporte de antigüedad de saldos por rango de vencimiento.",
      },
    ],
  },
];

export interface ResolvedScreen {
  id: string;
  label: string;
  /** Ruta pública del PNG aprobado; null si falta o no coincide con la huella aprobada. */
  src: string | null;
  caption: string;
}

const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

/** Se evalúa en el servidor (en el build, con exportación estática). */
export function resolveScreens(): ResolvedScreen[] {
  const dir = join(process.cwd(), "public", "screens");
  const hashes = approved as Record<string, string>;
  return SCREENS.map((s) => {
    for (const f of s.files) {
      const p = join(dir, f.name);
      if (existsSync(p) && hashes[f.name] && sha(p) === hashes[f.name]) {
        return { id: s.id, label: s.label, src: `/screens/${f.name}`, caption: f.caption };
      }
    }
    return { id: s.id, label: s.label, src: null, caption: s.files[0].caption };
  });
}
