import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  generateIdeas,
  VALID_PLATFORMS,
  type IdeaPlatform,
} from "@/lib/social/generate-ideas";

export const maxDuration = 120;

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
        {
          error:
            "Missing or invalid platform. Use linkedin, x, instagram, blog, or all",
        },
        { status: 400 }
      );
    }

    const platforms: IdeaPlatform[] =
      platform === "all"
        ? ["linkedin", "x", "instagram"]
        : [platform as IdeaPlatform];

    const result = await generateIdeas({ platforms });

    return NextResponse.json({ ideas: result.ideas, count: result.count });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
