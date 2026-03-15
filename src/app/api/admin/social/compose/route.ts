import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

export const maxDuration = 60;

function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

const VALID_PLATFORMS = ["linkedin", "x", "instagram"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const COMPOSER_SYSTEM_PROMPT = `You are a social media content writer for "Foundations of Architecture" (FOA Course) — a beginner-friendly online course that teaches non-architects how to think like architects and design their dream homes.

The brand voice is:
- Knowledgeable but approachable — never pretentious or jargon-heavy
- Enthusiastic about making architecture accessible to everyone
- Educational — always providing a useful takeaway
- Warm and encouraging to aspiring homeowners

The website is foacourse.com. The course is created by Nic DeMore. Nic is NOT an architect.

Content pillars: Educate, Inspire, Empower, Hook/Provoke

When writing social posts:
- Lead with a hook that creates curiosity or highlights a surprising insight
- Provide a useful takeaway or thought-provoking angle
- Match the platform's native style and conventions
- NEVER use em dashes ( — ) anywhere in the post. Use commas, periods, or colons instead.
- These are standalone posts (not blog promotions), so only include a link to foacourse.com if it fits naturally`;

const platformInstructions: Record<Platform, string> = {
  x: `Write a post for X (Twitter). Rules:
- Maximum 280 characters total (including any URL and hashtags)
- If a link fits naturally, use https://foacourse.com (counts toward limit)
- Use 1-3 relevant hashtags
- Be punchy, direct, and scroll-stopping
- No emojis in the main text (hashtags can include common ones)
- Output ONLY the post text, nothing else`,

  linkedin: `Write a post for LinkedIn. Rules:
- Maximum 1200 characters total including spaces, URL, and hashtags
- Start with a bold opening line that hooks professionals
- Use short paragraphs (1-2 sentences each) for readability
- If a link fits naturally, use https://foacourse.com
- End with a question or call to action to drive engagement
- Use 2-3 relevant hashtags at the end
- Tone: professional but personable
- Output ONLY the post text, nothing else`,

  instagram: `Write a caption for Instagram. Rules:
- Keep the caption concise: 50-150 words max for the main text (before hashtags)
- The first 125 characters are critical — this is what shows before "...more", so lead with a strong hook
- Use line breaks for readability
- Include a call to action mentioning "link in bio"
- Use exactly 3-5 highly relevant, niche-specific hashtags at the end (NOT generic ones like #architecture or #design)
- Separate hashtags from the main caption with two blank lines
- Tone: visual, inspiring, educational
- Output ONLY the caption text, nothing else`,
};

function extractImageTitle(text: string): string {
  const words = text.replace(/[#@\n]/g, " ").trim().split(/\s+/);
  return words.slice(0, 7).join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { platform, prompt, pillar, imagePrompt } = await req.json();

    if (!platform || !VALID_PLATFORMS.includes(platform) || !prompt) {
      return NextResponse.json(
        { error: "Missing or invalid platform or prompt" },
        { status: 400 }
      );
    }

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

    const pillarHint = pillar ? `\nContent pillar to lean into: ${pillar}` : "";

    const userPrompt = `Write a ${platform} post based on this prompt from the course creator:

"${prompt}"
${pillarHint}

${platformInstructions[platform as Platform]}`;

    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: COMPOSER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
      maxOutputTokens: 1024,
    });

    const copy = result.text;

    // Build response
    const response: { copy: string; imageUrl?: string } = { copy };

    if (platform === "instagram") {
      const imageTitle = imagePrompt || extractImageTitle(copy);
      response.imageUrl = `/api/og/instagram?title=${encodeURIComponent(imageTitle)}`;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Compose error:", error);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
