import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import {
  DESIGN_BRIEF_SYSTEM_PROMPT,
  buildDesignBriefPrompt,
} from "@/lib/design-brief-prompt";

// Allow up to 60 seconds for AI generation
export const maxDuration = 60;

/* Use FOA_ANTHROPIC_API_KEY first, fall back to ANTHROPIC_API_KEY. */
function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

/**
 * POST /api/design-brief/generate
 * Compiles all student data and generates a professional Design Brief via Anthropic.
 *
 * Body: { colorPalette, fontStyle, briefTitle, firmName? }
 * Returns: { content: string, sections: Array<{ title: string; content: string }> }
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

    const { colorPalette, fontStyle, briefTitle, firmName } = await req.json();

    if (!colorPalette || !fontStyle || !briefTitle) {
      return NextResponse.json(
        { error: "Missing required fields: colorPalette, fontStyle, briefTitle" },
        { status: 400 }
      );
    }

    // 1. Gather design brief responses
    const { data: responses } = await supabase
      .from("design_brief_responses")
      .select("question_key, response")
      .eq("user_id", user.id);

    // 2. Gather all notebook notes
    const { data: notes } = await supabase
      .from("notebook_entries")
      .select("module_slug, lesson_slug, content")
      .eq("user_id", user.id);

    // 3. Gather uploaded files
    const { data: files } = await supabase
      .from("notebook_files")
      .select("storage_path, file_name, file_type, file_size")
      .eq("user_id", user.id);

    // 4. Prepare multimodal content parts for Anthropic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentParts: any[] = [];
    const fileDescriptions: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          // Download file from private storage
          const { data: fileData, error: downloadError } = await supabase.storage
            .from("notebook-files")
            .download(file.storage_path);

          if (downloadError || !fileData) continue;

          const buffer = Buffer.from(await fileData.arrayBuffer());
          const base64 = buffer.toString("base64");

          if (file.file_type.startsWith("image/")) {
            // Image files: send as image content parts
            contentParts.push({
              type: "image",
              image: base64,
              mimeType: file.file_type,
            });
            fileDescriptions.push(
              `[Image: ${file.file_name}] - Uploaded reference image`
            );
          } else if (file.file_type === "application/pdf") {
            // PDF files: send as file content parts
            contentParts.push({
              type: "file",
              data: base64,
              mimeType: "application/pdf",
            });
            fileDescriptions.push(
              `[PDF: ${file.file_name}] - Uploaded reference document`
            );
          } else if (
            file.file_type.includes("wordprocessingml") ||
            file.file_type === "text/plain" ||
            file.file_type === "text/csv" ||
            file.file_type === "text/html"
          ) {
            // Text-based files: include content as text
            const text = buffer.toString("utf-8");
            fileDescriptions.push(
              `[Document: ${file.file_name}]\n${text.slice(0, 5000)}`
            );
          }
        } catch {
          // Skip files that can't be downloaded
          continue;
        }
      }
    }

    // 5. Build the prompt
    const userPrompt = buildDesignBriefPrompt({
      responses: responses || [],
      notes: notes || [],
      customization: { briefTitle, firmName, colorPalette, fontStyle },
      fileDescriptions,
    });

    // 6. Call Anthropic
    const apiKey = getAnthropicApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }
    const anthropic = createAnthropic({
      apiKey,
      baseURL: "https://api.anthropic.com/v1",
    });

    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: DESIGN_BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            ...contentParts,
          ],
        },
      ],
      maxOutputTokens: 8192,
    });

    // 7. Parse sections from the generated text
    const sections = parseBriefSections(result.text);

    // 8. Save to generated_briefs table
    await supabase.from("generated_briefs").insert({
      user_id: user.id,
      title: briefTitle,
      firm_name: firmName || null,
      color_palette: colorPalette,
      font_style: fontStyle,
      ai_content: result.text,
    });

    return NextResponse.json({
      content: result.text,
      sections,
    });
  } catch (error) {
    console.error("Design brief generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate design brief" },
      { status: 500 }
    );
  }
}

/**
 * Parse the AI output into sections based on ## headings.
 */
function parseBriefSections(
  text: string
): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];
  const lines = text.split("\n");

  let currentTitle = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      // Save previous section
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentContent.join("\n").trim(),
        });
      }
      currentTitle = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: currentContent.join("\n").trim(),
    });
  }

  return sections;
}
