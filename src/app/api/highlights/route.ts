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

    const { data, error } = await supabase
      .from("lesson_highlights")
      .select("id, highlighted_text, prefix_context, suffix_context")
      .eq("user_id", user.id)
      .eq("module_slug", moduleSlug)
      .eq("lesson_slug", lessonSlug)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Highlights GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch highlights" },
        { status: 500 }
      );
    }

    return NextResponse.json({ highlights: data || [] });
  } catch (error) {
    console.error("Highlights GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
      { status: 500 }
    );
  }
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

    const { moduleSlug, lessonSlug, highlightedText, prefixContext, suffixContext } =
      await req.json();

    if (!moduleSlug || !lessonSlug || !highlightedText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lesson_highlights")
      .insert({
        user_id: user.id,
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        highlighted_text: highlightedText,
        prefix_context: prefixContext || "",
        suffix_context: suffixContext || "",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Highlights POST error:", error);
      return NextResponse.json(
        { error: "Failed to save highlight" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Highlights POST error:", error);
    return NextResponse.json(
      { error: "Failed to save highlight" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing highlight id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("lesson_highlights")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Highlights DELETE error:", error);
      return NextResponse.json(
        { error: "Failed to delete highlight" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Highlights DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete highlight" },
      { status: 500 }
    );
  }
}
