import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlugUnfiltered } from "@/lib/blog";

const VALID_PLATFORMS = ["linkedin", "x", "instagram"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const BUFFER_GRAPHQL = "https://api.buffer.com/graphql";

// Channel IDs fetched from Buffer GraphQL API (2026-03-15)
// Org ID: 69b7026ee4bc4b63e1f6aa1a (N-Squared Lifestyle LLC)
const BUFFER_CHANNEL_IDS: Record<Platform, string> = {
  instagram: "69b702927be9f8b1715c58fe",
  linkedin: "69b7037b7be9f8b1715c5f77",
  x: "69b7042a7be9f8b1715c62ff",
};

async function bufferGraphQL(token: string, query: string, variables?: object) {
  const res = await fetch(BUFFER_GRAPHQL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
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

    const { blogSlug, platform, copy } = await req.json();

    if (!blogSlug || !platform || !VALID_PLATFORMS.includes(platform) || !copy) {
      return NextResponse.json(
        { error: "Missing or invalid blogSlug, platform, or copy" },
        { status: 400 }
      );
    }

    const bufferToken = process.env.BUFFER_ACCESS_TOKEN;
    if (!bufferToken) {
      return NextResponse.json(
        { error: "Buffer API not configured" },
        { status: 503 }
      );
    }

    const channelId = BUFFER_CHANNEL_IDS[platform as Platform];

    // Build assets for Instagram (attach OG image)
    let assetsInput = "";
    if (platform === "instagram") {
      const post = getPostBySlugUnfiltered(blogSlug);
      if (post) {
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://foacourse.com";
        const imageUrl = `${baseUrl}/api/og/instagram?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;
        assetsInput = `assets: { image: { url: "${imageUrl}" } }`;
      }
    }

    const mutation = `
      mutation CreatePost {
        createPost(input: {
          channelId: "${channelId}"
          text: ${JSON.stringify(copy)}
          schedulingType: automatic
          mode: addToQueue
          ${assetsInput}
        }) {
          ... on PostCreate {
            post {
              id
              status
              dueAt
            }
          }
          ... on CoreError {
            message
            code
          }
        }
      }
    `;

    const bufferData = await bufferGraphQL(bufferToken, mutation);

    if (bufferData.errors?.length) {
      return NextResponse.json(
        { error: bufferData.errors[0].message },
        { status: 502 }
      );
    }

    const result = bufferData.data?.createPost;

    if (result?.message) {
      // CoreError returned
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

    // Mark as shared in Supabase
    await supabase.from("social_shares").upsert(
      {
        blog_slug: blogSlug,
        platform,
        shared_at: new Date().toISOString(),
      },
      { onConflict: "blog_slug,platform" }
    );

    return NextResponse.json({
      success: true,
      bufferId: result?.post?.id,
      scheduledFor: result?.post?.dueAt,
    });
  } catch (error) {
    console.error("Buffer post error:", error);
    return NextResponse.json(
      { error: "Failed to post via Buffer" },
      { status: 500 }
    );
  }
}
