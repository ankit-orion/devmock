import { ImageResponse } from "next/og";

export const alt = "devmock — Practice real interviews, land your dream role";
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
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0b0b0e 0%, #15151b 100%)",
          color: "#f1f1f4",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* brand glows */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(167,139,250,0.45), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(122,162,247,0.40), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: 120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(240,168,192,0.30), transparent 70%)",
          }}
        />

        {/* top row: logo + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(180deg, #3b3b41, #161619)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {"</>"}
            </div>
            <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
              devmock
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: "#c9c9d2",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: "#a78bfa",
              }}
            />
            AI-Powered Mock Interviews
          </div>
        </div>

        {/* headline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 70,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Practice real interviews, land your dream role
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#a6a6b0",
              maxWidth: 880,
            }}
          >
            Company-specific AI interviews that plan your rounds, ask the
            questions you&apos;ll actually face, and grade you in detail.
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            {["Amazon", "Google", "Meta", "Microsoft"].map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#d4d4dc",
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
