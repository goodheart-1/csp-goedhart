import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Protect ~ Daantje Goedhart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const phases = [
    { name: "STABIEL", color: "#34d399" },
    { name: "WAARSCHUWING", color: "#fbbf24" },
    { name: "ERNSTIG", color: "#fb923c" },
    { name: "CRISIS", color: "#f87171" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0a0f0d 0%, #0f1e17 50%, #0a1512 100%)",
          padding: "72px 80px",
          fontFamily: "serif",
          color: "#f5f5f4",
          position: "relative",
        }}
      >
        {/* Top: brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span style={{ fontSize: 28 }}>🍀</span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.24em",
              color: "#a7f3d0",
              textTransform: "uppercase",
            }}
          >
            Goodheart
          </span>
        </div>

        {/* Main: big editorial headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            marginTop: "-40px",
          }}
        >
          <div
            style={{
              fontSize: 180,
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#fafaf9",
              fontStyle: "italic",
            }}
          >
            Protect.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: 32,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div
              style={{
                width: 48,
                height: 1,
                backgroundColor: "#57534e",
              }}
            />
            <span
              style={{
                fontSize: 22,
                color: "#a8a29e",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              Een persoonlijk document van Daantje Goedhart
            </span>
          </div>
        </div>

        {/* Bottom: phase gradient bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              height: 6,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {phases.map((p) => (
              <div
                key={p.name}
                style={{
                  flex: 1,
                  backgroundColor: p.color,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {phases.map((p) => (
              <span
                key={p.name}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  color: p.color,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* URL bottom right */}
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "#57534e",
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          protect.goodheart.earth
        </div>
      </div>
    ),
    { ...size }
  );
}
