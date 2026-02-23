import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateDesignBriefDocx } from "@/lib/design-brief-docx";

export const maxDuration = 30;

interface BriefSection {
  title: string;
  content: string;
}

/**
 * POST /api/design-brief/download
 * Generates a downloadable PDF or DOCX from the design brief content.
 *
 * Body: {
 *   format: "pdf" | "docx",
 *   briefTitle: string,
 *   firmName?: string,
 *   colorPalette: string,
 *   fontStyle: string,
 *   sections: BriefSection[],
 *   studentName: string,
 *   generatedDate: string,
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      format,
      briefTitle,
      firmName,
      colorPalette,
      fontStyle,
      sections,
      studentName,
      generatedDate,
    } = await req.json();

    if (!format || !briefTitle || !sections || !studentName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const safeName = briefTitle.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-");

    if (format === "docx") {
      const buffer = await generateDesignBriefDocx({
        briefTitle,
        firmName,
        sections: sections as BriefSection[],
        studentName,
        generatedDate: generatedDate || new Date().toLocaleDateString(),
      });

      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeName}.docx"`,
        },
      });
    }

    if (format === "pdf") {
      // Dynamic import to avoid SSR issues with @react-pdf/renderer
      const { pdf } = await import("@react-pdf/renderer");
      const { DesignBriefDocument } = await import(
        "@/components/account/DesignBriefDocument"
      );
      const React = await import("react");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = React.createElement(DesignBriefDocument as any, {
        briefTitle,
        firmName,
        colorPalette: colorPalette || "classic",
        fontStyle: fontStyle || "clean",
        sections: sections as BriefSection[],
        studentName,
        generatedDate: generatedDate || new Date().toLocaleDateString(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(doc as any).toBlob();
      const arrayBuffer = await blob.arrayBuffer();

      return new Response(arrayBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid format. Use 'pdf' or 'docx'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Design brief download error:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
