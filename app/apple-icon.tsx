import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D47A1",
        }}
      >
        <svg width="116" height="116" viewBox="0 0 28 28" fill="none">
          <path d="M6 22V6l16 16V6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="22" r="2.6" fill="#FFFFFF" />
          <circle cx="6" cy="6" r="2.6" fill="#FFFFFF" />
          <circle cx="22" cy="22" r="2.6" fill="#FFFFFF" />
          <circle cx="22" cy="6" r="2.6" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    size,
  );
}
