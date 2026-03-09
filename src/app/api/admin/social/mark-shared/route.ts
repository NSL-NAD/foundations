import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const VALID_PLATFORMS = ["linkedin", "x", "instagram"];

export async function PATCH(req: NextRequest) {
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

    const { blogSlug, platform, clearCopy } = await req.json();

    if (!blogSlug || !platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: "Missing or invalid blogSlug / platform" },
        { status: 400 }
      );
    }

    if (clearCopy) {
      // Clear generated copy to allow regeneration
      await supabase
        .from("social_shares")
        .update({ generated_copy: null })
        .eq("blog_slug", blogSlug)
        .eq("platform", platform);
    } else {
      await supabase.from("social_shares").upsert(
        {
          blog_slug: blogSlug,
          platform,
          shared_at: new Date().toISOString(),
        },
        { onConflict: "blog_slug,platform" }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark shared error:", error);
    return NextResponse.json(
      { error: "Failed to mark as shared" },
      { status: 500 }
    );
  }
}
