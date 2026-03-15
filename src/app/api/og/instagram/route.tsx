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
          padding: "80px 60px",
          background: "linear-gradient(160deg, #17202B 0%, #1E2A38 40%, #17202B 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
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
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#5A7E96",
            }}
          >
            Foundations of Architecture
          </span>
        </div>

        {/* Category + Title (centered area) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {category && (
            <div style={{ display: "flex" }}>
              <span
                style={{
                  fontSize: "18px",
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
          <h1
            style={{
              fontSize: title.length > 60 ? "48px" : "58px",
              fontWeight: 700,
              color: "#EDE8E0",
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#8A9AAA",
            }}
          >
            foacourse.com
          </span>
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
      width: 1080,
      height: 1350,
    },
  );
}
