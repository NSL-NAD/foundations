import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

export const maxDuration = 120;

type IdeaPlatform = "linkedin" | "x" | "instagram" | "blog";

const VALID_PLATFORMS: IdeaPlatform[] = ["linkedin", "x", "instagram", "blog"];

function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

const PLATFORM_INSTRUCTIONS: Record<IdeaPlatform, string> = {
  linkedin: `Platform: LinkedIn
Personality: Professional, thought leader voice. Nic shares insights about the home design process — what homeowners should know before hiring an architect, how to budget realistically, and how to navigate renovation decisions with confidence.
Active pillars: Educate, Empower
Character limit: ~1200 characters
Tone: Warm but authoritative. Conversational, not corporate. Use line breaks for readability. End with a question or call to reflection.`,

  x: `Platform: X (Twitter)
Personality: Fast, punchy, opinionated. Nic shares hot takes and quick insights about home design, architecture, and renovation. Contrarian when appropriate.
Active pillars: Hook/Provoke, Educate
Character limit: 280 characters
Tone: Direct, sharp, slightly provocative. No hashtags. Make people stop scrolling.`,

  instagram: `Platform: Instagram
Personality: Visual-first, warm, approachable. Nic helps homeowners feel confident about their design journey. Content should pair well with a photo or graphic.
Active pillars: Inspire, Educate, Empower
Character limit: ~2000 characters
Tone: Friendly, encouraging, educational. Use emoji sparingly. Include a CTA or question at the end.`,

  blog: `Platform: Blog
Generate blog post topic suggestions focused on SEO and long-form educational content.
For each idea:
- hook = a compelling blog post title (SEO-friendly, specific)
- body = 2-3 sentence description of what the post should cover + 3-5 target keywords
- pillar = "SEO"
Tone: Educational, comprehensive, optimized for search intent.`,
};

const IDEA_SYSTEM_PROMPT = `You are a content strategist for FOA (Fundamentals of Architecture), an online course that teaches homeowners how to navigate the home design process.

CRITICAL: Nic (the founder) is NOT an architect. He is an educator who teaches homeowners how to work effectively with architects and make informed decisions about their home design projects. Never describe him as an architect in any content.

FOA brand voice: Educational, approachable, not pretentious. We demystify the home design process for regular people who want to build or renovate their dream home.

Content Pillars:
- Educate: Teach homeowners something they didn't know about the design/build process
- Inspire: Show what's possible and get people excited about their project
- Empower: Give homeowners confidence and tools to make better decisions
- Hook/Provoke: Challenge conventional wisdom or call out industry problems

You must return ONLY valid JSON — no markdown, no code fences, no commentary.`;

async function researchWithSonar(): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Perplexity API key not configured");
  }

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "user",
          content:
            "What are trending topics, questions, and pain points in home design, architecture, and renovation that homeowners are discussing right now? Focus on topics relevant to people who want to work with an architect or design their dream home. Include specific questions people are searching for.",
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Perplexity API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function generateIdeasForPlatform(
  platform: IdeaPlatform,
  research: string,
  anthropic: ReturnType<typeof createAnthropic>
): Promise<
  Array<{
    platform: IdeaPlatform;
    pillar: string;
    hook: string;
    body: string;
    source: string;
  }>
> {
  const result = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: IDEA_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is current research on trending topics in home design and architecture:

${research}

${PLATFORM_INSTRUCTIONS[platform]}

Based on this research, generate exactly 3 content ideas for this platform. Each idea should be directly inspired by the trending topics above but written in FOA's voice.

Return a JSON array with exactly 3 objects, each having:
- "pillar": which content pillar this hits (${platform === "blog" ? '"SEO"' : 'one of "Educate", "Inspire", "Empower", "Hook/Provoke"'})
- "hook": the opening line or headline (this is the most important part — make it stop the scroll)
- "body": the full post copy, appropriate length for the platform

Return ONLY the JSON array, nothing else.`,
      },
    ],
    maxOutputTokens: 2048,
  });

  // Parse JSON from the response
  const text = result.text.trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse ideas JSON for ${platform}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as Array<{
    pillar: string;
    hook: string;
    body: string;
  }>;

  return parsed.map((idea) => ({
    platform,
    pillar: idea.pillar,
    hook: idea.hook,
    body: idea.body,
    source: "sonar-research",
  }));
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

    const { platform } = await req.json();

    if (
      !platform ||
      (platform !== "all" && !VALID_PLATFORMS.includes(platform))
    ) {
      return NextResponse.json(
        { error: "Missing or invalid platform. Use linkedin, x, instagram, blog, or all" },
        { status: 400 }
      );
    }

    // Step 1: Research with Perplexity Sonar
    const research = await researchWithSonar();

    // Step 2: Generate ideas with Anthropic
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

    const platforms: IdeaPlatform[] =
      platform === "all"
        ? ["linkedin", "x", "instagram"]
        : [platform as IdeaPlatform];

    const allIdeas = await Promise.all(
      platforms.map((p) => generateIdeasForPlatform(p, research, anthropic))
    );

    const ideas = allIdeas.flat();

    // Step 3: Insert into Supabase
    const rows = ideas.map((idea) => ({
      platform: idea.platform,
      pillar: idea.pillar,
      hook: idea.hook,
      body: idea.body,
      source: idea.source,
      status: "pending" as const,
      generated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("social_ideas")
      .insert(rows);

    if (insertError) {
      console.error("Failed to insert ideas:", insertError);
      return NextResponse.json(
        { error: "Failed to save ideas" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas, count: ideas.length });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
