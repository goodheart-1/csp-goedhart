import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bescherm Plan - Daantje Goedhart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const phases = [
    { emoji: "😊", name: "Stabiel", color: "#16a34a", bg: "#f0fdf4" },
    { emoji: "😐", name: "Waarschuwing", color: "#ca8a04", bg: "#fefce8" },
    { emoji: "😟", name: "Ernstig", color: "#ea580c", bg: "#fff7ed" },
    { emoji: "🆘", name: "Crisis", color: "#dc2626", bg: "#fef2f2" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#fafaf9",
          padding: "60px 70px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: 52 }}>🔰</span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#1c1917",
              letterSpacing: "-0.02em",
            }}
          >
            Bescherm Plan
          </span>
        </div>

        <span
          style={{
            fontSize: 24,
            color: "#78716c",
            marginTop: 12,
            marginBottom: 48,
          }}
        >
          Crisissignaleringsplan - 4 fases van stabiliteit tot crisis
        </span>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flex: 1,
            alignItems: "stretch",
          }}
        >
          {phases.map((phase) => (
            <div
              key={phase.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                backgroundColor: phase.bg,
                borderRadius: 20,
                borderLeft: `5px solid ${phase.color}`,
                padding: "32px 16px",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: 56 }}>{phase.emoji}</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: phase.color,
                }}
              >
                {phase.name}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <span style={{ fontSize: 18, color: "#a8a29e" }}>
            Daantje Goedhart
          </span>
          <span style={{ fontSize: 18, color: "#a8a29e" }}>
            csp-goedhart.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
