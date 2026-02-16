import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/ai";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

const FREE_MESSAGE_LIMIT = 25;

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

    // Check if user has paid for AI Chat
    const { data: hasAccess } = await supabase.rpc("has_ai_chat_access", {
      p_user_id: user.id,
    });

    // If no paid access, check usage limits
    let messagesUsed = 0;
    if (!hasAccess) {
      const { data: count } = await supabase.rpc("get_chat_message_count", {
        p_user_id: user.id,
      });
      messagesUsed = count || 0;

      if (messagesUsed >= FREE_MESSAGE_LIMIT) {
        return new Response(
          JSON.stringify({
            error: "limit_reached",
            messagesUsed,
            messageLimit: FREE_MESSAGE_LIMIT,
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Ensure a conversation exists for this user to persist messages
    let conversationId: string | null = null;
    const { data: existingConvo } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingConvo) {
      conversationId = existingConvo.id;
    } else {
      const { data: newConvo } = await supabase
        .from("chat_conversations")
        .insert({ user_id: user.id, title: "Chat" })
        .select("id")
        .single();
      conversationId = newConvo?.id || null;
    }

    // Persist the user's latest message for counting
    const lastUserMessage = [...messages]
      .reverse()
      .find((m: { role: string }) => m.role === "user");
    if (conversationId && lastUserMessage) {
      const textContent =
        typeof lastUserMessage.content === "string"
          ? lastUserMessage.content
          : lastUserMessage.parts
              ?.filter((p: { type: string }) => p.type === "text")
              .map((p: { text: string }) => p.text)
              .join("") || "";

      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: textContent,
        module_slug: moduleSlug || null,
        lesson_slug: lessonSlug || null,
      });
    }

    // Look up module/lesson titles from curriculum if slugs provided
    let moduleTitle: string | undefined;
    let lessonTitle: string | undefined;

    if (moduleSlug && lessonSlug) {
      try {
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
      async onFinish({ text }) {
        // Persist assistant response for history
        if (conversationId && text) {
          try {
            const saveSupabase = createClient();
            await saveSupabase.from("chat_messages").insert({
              conversation_id: conversationId,
              role: "assistant",
              content: text,
              module_slug: moduleSlug || null,
              lesson_slug: lessonSlug || null,
            });
          } catch {
            // Non-critical — don't fail the response
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
