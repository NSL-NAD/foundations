import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/ai";
import { NextRequest } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

const FREE_MESSAGE_LIMIT = 25;

/* Use FOA_ANTHROPIC_API_KEY first, fall back to ANTHROPIC_API_KEY.
   This avoids conflicts when ANTHROPIC_API_KEY is set (empty) at the
   system/shell level by other tools (e.g. Claude Code). */
function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = getAnthropicApiKey();

    // Validate API key early
    if (!apiKey) {
      console.error(
        "Anthropic API key is missing. Set FOA_ANTHROPIC_API_KEY or ANTHROPIC_API_KEY in .env.local"
      );
      return new Response(
        JSON.stringify({
          error: "config_error",
          message: "AI service not configured",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const anthropic = createAnthropic({
      apiKey,
      baseURL: "https://api.anthropic.com/v1",
    });

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, moduleSlug, lessonSlug } = await req.json();

    // Check if user has paid for AI Chat
    const { data: hasAccess, error: accessError } = await supabase.rpc(
      "has_ai_chat_access",
      {
        p_user_id: user.id,
      }
    );
    if (accessError) {
      console.error("has_ai_chat_access RPC error:", accessError);
    }

    // If no paid access, check usage limits
    let messagesUsed = 0;
    if (!hasAccess) {
      const { data: count, error: countError } = await supabase.rpc(
        "get_chat_message_count",
        {
          p_user_id: user.id,
        }
      );
      if (countError) {
        console.error("get_chat_message_count RPC error:", countError);
      }
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
    const { data: existingConvo, error: convoError } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (convoError) {
      console.error("chat_conversations query error:", convoError);
    }

    if (existingConvo) {
      conversationId = existingConvo.id;
    } else {
      const { data: newConvo, error: insertConvoError } = await supabase
        .from("chat_conversations")
        .insert({ user_id: user.id, title: "Chat" })
        .select("id")
        .single();
      if (insertConvoError) {
        console.error("chat_conversations insert error:", insertConvoError);
      }
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

      const { error: msgError } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: textContent,
        module_slug: moduleSlug || null,
        lesson_slug: lessonSlug || null,
      });
      if (msgError) {
        console.error("chat_messages insert error:", msgError);
      }
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

    // Convert UIMessages (from @ai-sdk/react useChat) to ModelMessages (for streamText)
    const modelMessages = await convertToModelMessages(
      messages as UIMessage[]
    );

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages: modelMessages,
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
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "server_error", message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
