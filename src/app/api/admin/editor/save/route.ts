import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { commitFile } from "@/lib/github";
import { getLesson } from "@/lib/course";

export const maxDuration = 30;

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

    const { moduleSlug, lessonSlug, content } = await req.json();

    if (!moduleSlug || !lessonSlug || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing moduleSlug, lessonSlug, or content" },
        { status: 400 }
      );
    }

    // Validate the lesson exists in curriculum
    const lesson = getLesson(moduleSlug, lessonSlug);
    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found in curriculum" },
        { status: 404 }
      );
    }

    const filePath = `src/content/lessons/${moduleSlug}/${lessonSlug}.mdx`;
    const message = `Update lesson: ${lesson.title}`;

    const result = await commitFile(filePath, content, message);

    return NextResponse.json({
      success: true,
      sha: result.sha,
      commitSha: result.commitSha,
      url: result.url,
    });
  } catch (error) {
    console.error("Editor save error:", error);
    return NextResponse.json(
      { error: "Failed to save lesson content" },
      { status: 500 }
    );
  }
}
