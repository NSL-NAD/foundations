import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getModule } from "@/lib/course";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ module6Complete: false }, { status: 401 });
  }

  // Get module 6 lessons from curriculum
  const mod6 = getModule("module-6");
  if (!mod6) {
    return NextResponse.json({ module6Complete: false });
  }

  const mod6Slugs = mod6.lessons.map((l) => l.slug);

  // Check how many module 6 lessons the user has completed
  const { data: completed } = await supabase
    .from("lesson_progress")
    .select("lesson_slug")
    .eq("user_id", user.id)
    .eq("module_slug", "module-6")
    .eq("completed", true)
    .in("lesson_slug", mod6Slugs);

  const completedCount = completed?.length || 0;
  const module6Complete = completedCount >= mod6Slugs.length;

  return NextResponse.json({ module6Complete });
}
