import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Foundations of Architecture – Design Your Dream Home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  // Load Space Grotesk font for accurate branding
  const spaceGrotesk = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPb54C_k3HqUtEw.woff"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {/* Background hero image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80"
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.55)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          {/* FA monogram box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "12px",
              border: "4px solid rgba(255, 255, 255, 0.9)",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk'",
                fontSize: "40px",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.95)",
                letterSpacing: "0.1em",
              }}
            >
              FA
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: "'Space Grotesk'",
              fontSize: "48px",
              fontWeight: 600,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "12px",
            }}
          >
            Foundations of Architecture
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: "'Space Grotesk'",
              fontSize: "24px",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Design Your Dream Home
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: spaceGrotesk,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
