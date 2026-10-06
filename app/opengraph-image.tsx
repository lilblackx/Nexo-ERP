import { ImageResponse } from "next/og";
import { demo, num, RATES_LABEL } from "@/lib/demo";

export const dynamic = "force-static";
export const alt = "Nexo ERP: cobra en dólares y bolívares en una sola factura";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#072B63",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 56,
            padding: "0 64px",
            background: "#0D47A1",
            fontSize: 24,
            color: "#DBE7F7",
          }}
        >
          {`Tasa BCV Bs. ${num(demo.rates.bcv)} · Dólar paralelo Bs. ${num(demo.rates.paralelo)} · ${RATES_LABEL}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 64px 48px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg width="64" height="64" viewBox="0 0 28 28" fill="none">
              <path d="M6 22V6l16 16V6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="22" r="2.6" fill="#FFFFFF" />
              <circle cx="6" cy="6" r="2.6" fill="#FFFFFF" />
              <circle cx="22" cy="22" r="2.6" fill="#FFFFFF" />
              <circle cx="22" cy="6" r="2.6" fill="#FFFFFF" />
            </svg>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700, marginLeft: 18, letterSpacing: -1 }}>
              Nexo ERP
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 52,
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -3,
              maxWidth: 1040,
            }}
          >
            Cobra en dólares y bolívares en una sola factura.
          </div>
          <div style={{ display: "flex", flex: 1 }} />
          <div
            style={{
              display: "flex",
              borderTop: "2px dashed #4B6FAF",
              paddingTop: 22,
              fontSize: 28,
              color: "#B7CDEE",
            }}
          >
            Sistema de gestión para distribuidoras · Windows · SQL Server · red local
          </div>
        </div>
      </div>
    ),
    size,
  );
}
