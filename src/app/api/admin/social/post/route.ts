import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlugUnfiltered } from "@/lib/blog";

const VALID_PLATFORMS = ["linkedin", "x", "instagram"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const BUFFER_SERVICE_MAP: Record<Platform, string> = {
  linkedin: "linkedin",
  x: "twitter",
  instagram: "instagram",
};

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

    const { blogSlug, platform, copy } = await req.json();

    if (
      !blogSlug ||
      !platform ||
      !VALID_PLATFORMS.includes(platform) ||
      !copy
    ) {
      return NextResponse.json(
        { error: "Missing or invalid blogSlug, platform, or copy" },
        { status: 400 },
      );
    }

    const bufferToken = process.env.BUFFER_ACCESS_TOKEN;
    if (!bufferToken) {
      return NextResponse.json(
        { error: "Buffer API not configured" },
        { status: 503 },
      );
    }

    // Fetch Buffer profiles
    const profilesRes = await fetch(
      `https://api.bufferapp.com/1/profiles.json?access_token=${bufferToken}`,
    );

    if (!profilesRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Buffer profiles" },
        { status: 502 },
      );
    }

    const profiles = await profilesRes.json();
    const serviceName = BUFFER_SERVICE_MAP[platform as Platform];
    const bufferProfile = profiles.find(
      (p: { service: string }) => p.service === serviceName,
    );

    if (!bufferProfile) {
      return NextResponse.json(
        { error: `No Buffer profile found for ${platform}` },
        { status: 404 },
      );
    }

    // Build form body
    const formBody = new URLSearchParams();
    formBody.append("access_token", bufferToken);
    formBody.append("profile_ids[]", bufferProfile.id);
    formBody.append("text", copy);

    // For Instagram, attach OG image
    if (platform === "instagram") {
      const post = getPostBySlugUnfiltered(blogSlug);
      if (post) {
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://foacourse.com";
        const imageUrl = `${baseUrl}/api/og/instagram?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;
        formBody.append("media[photo]", imageUrl);
      }
    }

    // Create Buffer update
    const bufferRes = await fetch(
      "https://api.bufferapp.com/1/updates/create.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      },
    );

    const bufferData = await bufferRes.json();

    if (!bufferRes.ok || !bufferData.success) {
      return NextResponse.json(
        { error: bufferData.message || "Buffer API error" },
        { status: 502 },
      );
    }

    // Mark as shared in Supabase
    await supabase.from("social_shares").upsert(
      {
        blog_slug: blogSlug,
        platform,
        shared_at: new Date().toISOString(),
      },
      { onConflict: "blog_slug,platform" },
    );

    return NextResponse.json({
      success: true,
      bufferId: bufferData.updates?.[0]?.id || bufferData.update?.id,
    });
  } catch (error) {
    console.error("Buffer post error:", error);
    return NextResponse.json(
      { error: "Failed to post via Buffer" },
      { status: 500 },
    );
  }
}
