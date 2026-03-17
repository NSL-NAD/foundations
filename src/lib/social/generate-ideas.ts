import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createAdminClient } from "@/lib/supabase/admin";

export type IdeaPlatform = "linkedin" | "x" | "instagram" | "blog";

export const VALID_PLATFORMS: IdeaPlatform[] = [
  "linkedin",
  "x",
  "instagram",
  "blog",
];

function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

const PLATFORM_INSTRUCTIONS: Record<IdeaPlatform, string> = {
  linkedin: `Platform: LinkedIn
Personality: Professional, curious educator. Nic shares what homeowners wish they knew before designing their home — practical insights, process clarity, and confidence-building knowledge. Lead with value, not controversy.
Active pillars: Educate, Empower
Character limit: ~1200 characters
Tone: Warm, authoritative, informative. Teach something useful. Frame ideas as "here's what I've learned" or "here's what most homeowners don't realize." Curiosity-driven, never negative. End with a question or reflection.
AVOID: Negative framing, attacking architects, controversy for its own sake. Every post should make the reader feel more capable and informed.`,

  x: `Platform: X (Twitter)
Personality: Curious, sharp, direct. Nic shares quick insights that make homeowners think differently about design — not hot takes, but aha moments. Teach something in one sentence.
Active pillars: Educate, Hook/Provoke (via curiosity, not controversy)
HARD LIMIT: The entire post body (hook + any body text combined) MUST be 240 characters or fewer. Count every character. No hashtags. No URLs. One tight thought only.
Tone: Confident, informative, occasionally surprising — but always positive and value-forward. Stop-scrolling through curiosity and insight, not controversy.
AVOID: Negative framing, "your architect is hiding this from you" style copy, anything that feels like an attack.`,

  instagram: `Platform: Instagram
Personality: Visual-first, warm, encouraging. Nic helps homeowners feel excited and confident about their design journey. Share knowledge in a way that sparks curiosity and makes people feel capable.
Active pillars: Inspire, Educate, Empower
Character limit: ~2000 characters
Tone: Friendly, uplifting, educational. Lead with something interesting or beautiful, then teach. Use emoji sparingly. End with a question or CTA that invites engagement.
AVOID: Negative framing, fear-based content, controversy. Every post should leave the reader feeling inspired and informed.`,

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

export async function researchWithSonar(): Promise<string> {
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
  anthropic: ReturnType<typeof createAnthropic>,
  ideasPerPlatform: number,
  source: string
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

Based on this research, generate exactly ${ideasPerPlatform} content ideas for this platform. Each idea should be directly inspired by the trending topics above but written in FOA's voice.

Return a JSON array with exactly ${ideasPerPlatform} objects, each having:
- "pillar": which content pillar this hits (${platform === "blog" ? '"SEO"' : 'one of "Educate", "Inspire", "Empower", "Hook/Provoke"'})
- "hook": the opening line or headline (this is the most important part — make it stop the scroll)
- "body": the full post copy, appropriate length for the platform

Return ONLY the JSON array, nothing else.`,
      },
    ],
    maxOutputTokens: 4096,
  });

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
    source,
  }));
}

/**
 * Generate social media content ideas using Perplexity research + Claude.
 *
 * @param platforms - Which platforms to generate for
 * @param ideasPerPlatform - Number of ideas per platform (default 3)
 * @param source - Source label for tracking (default "sonar-research")
 * @returns The inserted idea rows from Supabase
 */
export async function generateIdeas(opts: {
  platforms: IdeaPlatform[];
  ideasPerPlatform?: number;
  source?: string;
}): Promise<{ ideas: Record<string, unknown>[]; count: number }> {
  const {
    platforms,
    ideasPerPlatform = 3,
    source = "sonar-research",
  } = opts;

  // Step 1: Research with Perplexity Sonar
  const research = await researchWithSonar();

  // Step 2: Generate ideas with Anthropic
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new Error("AI service not configured");
  }

  const anthropic = createAnthropic({
    apiKey,
    baseURL: "https://api.anthropic.com/v1",
  });

  const allIdeas = await Promise.all(
    platforms.map((p) =>
      generateIdeasForPlatform(p, research, anthropic, ideasPerPlatform, source)
    )
  );

  const ideas = allIdeas.flat();

  // Step 3: Insert into Supabase using admin client
  const supabase = createAdminClient();

  const rows = ideas.map((idea) => ({
    platform: idea.platform,
    pillar: idea.pillar,
    hook: idea.hook,
    body: idea.body,
    source: idea.source,
    status: "pending" as const,
    generated_at: new Date().toISOString(),
  }));

  const { data: inserted, error: insertError } = await supabase
    .from("social_ideas")
    .insert(rows)
    .select();

  if (insertError) {
    console.error("Failed to insert ideas:", insertError);
    throw new Error("Failed to save ideas");
  }

  return { ideas: inserted ?? [], count: inserted?.length ?? 0 };
}
