import { NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

/* Use FOA_ANTHROPIC_API_KEY first, fall back to ANTHROPIC_API_KEY. */
function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

/**
 * Temporary debug endpoint to test Anthropic API key validity.
 * GET /api/chat/test
 * Remove before production deployment.
 */
export async function GET() {
  const apiKey = getAnthropicApiKey();

  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      step: "env_check",
      message:
        "Anthropic API key is missing. Set FOA_ANTHROPIC_API_KEY in .env.local",
    });
  }

  // Mask the key for display
  const maskedKey = `${apiKey.slice(0, 12)}...${apiKey.slice(-4)}`;

  try {
    const anthropic = createAnthropic({
      apiKey,
      baseURL: "https://api.anthropic.com/v1",
    });

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: "Say hello in exactly one word.",
      maxOutputTokens: 10,
    });

    return NextResponse.json({
      status: "ok",
      message: "Anthropic API key is valid and working",
      maskedKey,
      model: "claude-sonnet-4-20250514",
      testResponse: text,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      status: "error",
      message: `Anthropic API call failed: ${message}`,
      maskedKey,
      model: "claude-sonnet-4-20250514",
      fullError: String(error),
    });
  }
}
