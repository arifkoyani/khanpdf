import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "KhanPDF — Free Online URL to PDF Converter";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "#f16625",
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          K
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.02em" }}>
          KhanPDF
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#f16625",
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          Free Online URL to PDF Converter
        </div>
      </div>
    ),
    { ...size },
  );
}
