import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getPostBySlugUnfiltered } from "@/lib/blog";
import {
  SOCIAL_SYSTEM_PROMPT,
  buildSocialPrompt,
  type SocialPlatform,
} from "@/lib/social-prompts";

export const maxDuration = 60;

function getAnthropicApiKey(): string {
  return (
    process.env.FOA_ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

const VALID_PLATFORMS: SocialPlatform[] = ["linkedin", "x", "instagram"];

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

    const { blogSlug, platform } = await req.json();

    if (!blogSlug || !platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: "Missing or invalid blogSlug / platform" },
        { status: 400 }
      );
    }

    // Check for cached copy
    const { data: existing } = await supabase
      .from("social_shares")
      .select("generated_copy")
      .eq("blog_slug", blogSlug)
      .eq("platform", platform)
      .single();

    if (existing?.generated_copy) {
      return NextResponse.json({ copy: existing.generated_copy });
    }

    // Read blog post
    const post = getPostBySlugUnfiltered(blogSlug);
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Generate copy
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
      system: SOCIAL_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildSocialPrompt(platform, {
            title: post.title,
            description: post.description,
            content: post.content,
            tags: post.tags,
            slug: post.slug,
            category: post.category,
          }),
        },
      ],
      maxOutputTokens: 1024,
    });

    // Upsert to cache
    await supabase.from("social_shares").upsert(
      {
        blog_slug: blogSlug,
        platform,
        generated_copy: result.text,
      },
      { onConflict: "blog_slug,platform" }
    );

    return NextResponse.json({ copy: result.text });
  } catch (error) {
    console.error("Social copy generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate social copy" },
      { status: 500 }
    );
  }
}
