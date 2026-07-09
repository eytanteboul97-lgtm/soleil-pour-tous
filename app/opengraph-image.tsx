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
              borderRadius: 20,
              backgroundColor: "#111C34",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <svg viewBox="0 0 48 48" width="76" height="76">
              <defs>
                <linearGradient id="og-neutral" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="og-accent" x1="24" y1="6" x2="24" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFE9C7" />
                  <stop offset="55%" stopColor="#FFA51E" />
                  <stop offset="100%" stopColor="#F2680A" />
                </linearGradient>
              </defs>
              <line x1="24" y1="17" x2="24" y2="6" stroke="url(#og-accent)" strokeWidth="6.5" strokeLinecap="round" />
              <line x1="30.06" y1="20.5" x2="39.59" y2="15" stroke="url(#og-neutral)" strokeWidth="6.5" strokeLinecap="round" />
              <line x1="30.06" y1="27.5" x2="39.59" y2="33" stroke="url(#og-neutral)" strokeWidth="6.5" strokeLinecap="round" />
              <line x1="24" y1="31" x2="24" y2="42" stroke="url(#og-neutral)" strokeWidth="6.5" strokeLinecap="round" />
              <line x1="17.94" y1="27.5" x2="8.41" y2="33" stroke="url(#og-neutral)" strokeWidth="6.5" strokeLinecap="round" />
              <line x1="17.94" y1="20.5" x2="8.41" y2="15" stroke="url(#og-neutral)" strokeWidth="6.5" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
            <span style={{ color: "#ffffff" }}>Soleil</span>
            <span style={{ color: "rgba(255,255,255,0.7)", marginLeft: 10, fontWeight: 500 }}>
              Pour Tous
            </span>
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
