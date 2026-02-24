import { buildPublicSystemPrompt } from "@/lib/ai";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

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

/* ── Simple in-memory rate limiter ───────────────────── */
const SESSION_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= SESSION_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodically clean up expired entries (every 100 requests)
let requestCounter = 0;
function cleanupRateLimit() {
  requestCounter++;
  if (requestCounter % 100 !== 0) return;
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  });
}

/* ── Route handler ───────────────────────────────────── */

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

    cleanupRateLimit();

    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          message:
            "You've reached the message limit. Sign up for the course to continue chatting!",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    const systemPrompt = buildPublicSystemPrompt();

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages,
      maxOutputTokens: 512,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Public chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "server_error", message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
