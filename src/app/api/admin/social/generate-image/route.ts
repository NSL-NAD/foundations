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

    const { copy, platform } = await req.json();

    if (platform !== "instagram") {
      return NextResponse.json(
        { error: "Image generation is only supported for Instagram" },
        { status: 400 }
      );
    }

    if (!copy) {
      return NextResponse.json(
        { error: "Missing copy text" },
        { status: 400 }
      );
    }

    const falApiKey = process.env.FAL_API_KEY;
    if (!falApiKey) {
      return NextResponse.json(
        { error: "fal.ai API not configured" },
        { status: 503 }
      );
    }

    const anthropicKey = getAnthropicApiKey();
    if (!anthropicKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    // Step 1: Use Claude to derive a visual image prompt from the post copy
    const anthropic = createAnthropic({
      apiKey: anthropicKey,
      baseURL: "https://api.anthropic.com/v1",
    });

    const promptResult = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: `You are a visual prompt engineer. Given social media post copy about home design and architecture, generate a descriptive image prompt suitable for FLUX image generation.

Rules:
- Output ONLY the image prompt, nothing else
- Focus on interior design, architecture, or home-related visuals that match the post topic
- Style: photorealistic, warm natural light, architectural photography
- Include specific visual details: materials, colors, spatial composition
- NEVER include text, words, letters, or typography in the image
- Keep the prompt under 200 words`,
      messages: [
        {
          role: "user",
          content: `Generate an image prompt for this Instagram post:\n\n${copy}`,
        },
      ],
      maxOutputTokens: 256,
    });

    const imagePrompt = promptResult.text.trim();

    // Step 2: Call fal.ai FLUX schnell model
    const falRes = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: imagePrompt,
        image_size: { width: 1080, height: 1350 },
        num_images: 1,
      }),
    });

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("fal.ai error:", errText);
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 502 }
      );
    }

    const falData = await falRes.json();
    const imageUrl = falData.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image returned from fal.ai" },
        { status: 502 }
      );
    }

    return NextResponse.json({ imageUrl, prompt: imagePrompt });
  } catch (error) {
    console.error("Generate image error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
