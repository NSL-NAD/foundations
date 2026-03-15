import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Foundations of Architecture";
  const category = searchParams.get("category");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(145deg, #17202B 0%, #1E2A38 50%, #17202B 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar with gold accent line */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #C4A84C, #D4B85C)",
              borderRadius: "2px",
            }}
          />
          {category && (
            <div
              style={{
                display: "flex",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#BE5B37",
                }}
              >
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? "42px" : "52px",
              fontWeight: 700,
              color: "#EDE8E0",
              lineHeight: 1.2,
              margin: 0,
              maxWidth: "90%",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer branding */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "4px",
                color: "#5A7E96",
              }}
            >
              Foundations of Architecture
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#8A9AAA",
              }}
            >
              foacourse.com
            </span>
          </div>
          {/* Decorative corner element */}
          <div
            style={{
              display: "flex",
              width: "40px",
              height: "40px",
              borderRight: "3px solid #C4A84C",
              borderBottom: "3px solid #C4A84C",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
