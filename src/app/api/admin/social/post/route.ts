import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
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

async function uploadImageToSupabase(imageUrl: string, filename: string): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase Storage not configured");
  }

  const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey);

  // Fetch the image
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error("Failed to fetch image for upload");
  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get("content-type") || "image/png";

  // Upload to og-images bucket
  const { error } = await adminClient.storage
    .from("og-images")
    .upload(filename, buffer, { contentType, upsert: true });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: publicUrlData } = adminClient.storage
    .from("og-images")
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
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

    const { blogSlug, platform, copy: rawCopy, imageUrl: providedImageUrl } = await req.json();

    // Hard enforce X 280 char limit
    const copy: string = platform === "x" && rawCopy?.length > 280
      ? rawCopy.slice(0, 277) + "..."
      : rawCopy;

    if (!platform || !VALID_PLATFORMS.includes(platform) || !copy) {
      return NextResponse.json(
        { error: "Missing or invalid platform or copy" },
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

    // Build platform-specific extras
    let assetsInput = "";
    let metadataInput = "";

    if (platform === "instagram") {
      let finalImageUrl = "";

      if (providedImageUrl) {
        // fal.ai CDN URL or other external URL — use directly
        finalImageUrl = providedImageUrl;
      } else {
        // Blog-to-social: render OG image, upload to Supabase Storage for a stable URL
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://foacourse.com";
        let imageTitle = "";

        if (blogSlug) {
          const post = getPostBySlugUnfiltered(blogSlug);
          if (post) {
            imageTitle = post.title;
          }
        }

        if (!imageTitle) {
          imageTitle = copy.replace(/[#@\n]/g, " ").trim().split(/\s+/).slice(0, 8).join(" ");
        }

        const ogUrl = `${baseUrl}/api/og/instagram?title=${encodeURIComponent(imageTitle)}`;
        const slug = blogSlug || `composer-${Date.now()}`;
        const filename = `${slug}-${Date.now()}.png`;
        finalImageUrl = await uploadImageToSupabase(ogUrl, filename);
      }

      assetsInput = `assets: { images: [{ url: "${finalImageUrl}" }] }`;
      metadataInput = `metadata: { instagram: { type: post, shouldShareToFeed: true } }`;
    }

    const mutation = `
      mutation CreatePost {
        createPost(input: {
          channelId: "${channelId}"
          text: ${JSON.stringify(copy)}
          schedulingType: automatic
          mode: addToQueue
          ${assetsInput}
          ${metadataInput}
        }) {
          ... on PostActionSuccess {
            post {
              id
              status
              dueAt
            }
          }
          ... on InvalidInputError {
            message
          }
          ... on UnexpectedError {
            message
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

    if (!result?.post) {
      return NextResponse.json({ error: result?.message || "Buffer did not return a post" }, { status: 502 });
    }

    // Mark as shared in Supabase — always write for weekly count tracking
    if (blogSlug) {
      await supabase.from("social_shares").upsert(
        { blog_slug: blogSlug, platform, shared_at: new Date().toISOString() },
        { onConflict: "blog_slug,platform" }
      );
    } else {
      // Composer post (no blog slug) — insert as standalone row for count tracking
      await supabase.from("social_shares").insert({
        blog_slug: `composer-${Date.now()}`,
        platform,
        generated_copy: copy,
        shared_at: new Date().toISOString(),
      });
    }

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
