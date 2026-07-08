import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#060B17",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,138,30,0.35) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(34,211,196,0.28) 0%, transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 76,
              height: 76,
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #FFA51E, #F2680A)",
            }}
          />
          <div style={{ display: "flex", color: "#FFA51E", fontSize: 34, fontWeight: 700 }}>
            Soleil Pour Tous
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 60,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Passez au solaire et réduisez vos factures d&apos;électricité
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
          Étude d&apos;éligibilité gratuite — sans engagement
        </div>
      </div>
    ),
    { ...size }
  );
}
