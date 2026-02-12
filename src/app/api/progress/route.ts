import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonSlug, moduleSlug, completed } = await req.json();

  if (!lessonSlug || !moduleSlug) {
    return NextResponse.json(
      { error: "Missing lessonSlug or moduleSlug" },
      { status: 400 }
    );
  }

  // Upsert lesson progress
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_slug: lessonSlug,
      module_slug: moduleSlug,
      completed: completed ?? true,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,lesson_slug" }
  );

  if (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }

  // Get updated completion percentage
  const { data: completion } = await supabase.rpc("get_course_completion", {
    p_user_id: user.id,
  });

  return NextResponse.json({
    success: true,
    completionPercentage: completion || 0,
  });
}
