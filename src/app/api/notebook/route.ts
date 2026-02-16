import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const moduleSlug = req.nextUrl.searchParams.get("moduleSlug");
    const lessonSlug = req.nextUrl.searchParams.get("lessonSlug");

    if (!moduleSlug || !lessonSlug) {
      return NextResponse.json(
        { error: "Missing moduleSlug or lessonSlug" },
        { status: 400 }
      );
    }

    const { data } = await supabase
      .from("notebook_entries")
      .select("content, updated_at")
      .eq("user_id", user.id)
      .eq("module_slug", moduleSlug)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle();

    return NextResponse.json({
      content: data?.content || "",
      updatedAt: data?.updated_at || null,
    });
  } catch (error) {
    console.error("Notebook GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleSlug, lessonSlug, content } = await req.json();

    if (!moduleSlug || !lessonSlug) {
      return NextResponse.json(
        { error: "Missing moduleSlug or lessonSlug" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("notebook_entries").upsert(
      {
        user_id: user.id,
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        content: content || "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_slug,lesson_slug" }
    );

    if (error) {
      console.error("Notebook upsert error:", error);
      return NextResponse.json(
        { error: "Failed to save note" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notebook PUT error:", error);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}
