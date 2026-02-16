import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notebook_entries")
      .select("module_slug, lesson_slug, content, updated_at")
      .eq("user_id", user.id)
      .order("module_slug")
      .order("lesson_slug");

    if (error) {
      console.error("Notebook all GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ notes: data || [] });
  } catch (error) {
    console.error("Notebook all GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
