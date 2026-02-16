import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/ai";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: (process.env.ANTHROPIC_API_KEY || "").trim(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, moduleSlug, lessonSlug } = await req.json();

    // Look up module/lesson titles from curriculum if slugs provided
    let moduleTitle: string | undefined;
    let lessonTitle: string | undefined;

    if (moduleSlug && lessonSlug) {
      try {
        // Dynamic import of curriculum
        const curriculum = await import("@/content/curriculum.json");
        const mod = curriculum.default.modules?.find(
          (m: { slug: string }) => m.slug === moduleSlug
        );
        if (mod) {
          moduleTitle = mod.title;
          const lesson = mod.lessons?.find(
            (l: { slug: string }) => l.slug === lessonSlug
          );
          if (lesson) lessonTitle = lesson.title;
        }
      } catch {
        // Curriculum not available, continue without context
      }
    }

    const systemPrompt = buildSystemPrompt({
      moduleTitle,
      lessonTitle,
    });

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages,
      maxOutputTokens: 1024,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
