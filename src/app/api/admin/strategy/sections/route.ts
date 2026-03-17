import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function authenticateAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", status: 401 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Forbidden", status: 403 };

  return null;
}

/** PATCH — update a strategy section by section_key */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient();
    const authError = await authenticateAdmin(supabase);
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

    const { section_key, content, summary, status, researched_at } =
      await req.json();

    if (!section_key) {
      return NextResponse.json(
        { error: "Missing section_key" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (content !== undefined) updates.content = content;
    if (summary !== undefined) updates.summary = summary;
    if (status !== undefined) updates.status = status;
    if (researched_at !== undefined) updates.researched_at = researched_at;

    const { data, error: updateError } = await supabase
      .from("strategy_sections")
      .update(updates)
      .eq("section_key", section_key)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update strategy section:", updateError);
      return NextResponse.json(
        { error: "Failed to update strategy section" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Strategy section update error:", error);
    return NextResponse.json(
      { error: "Failed to update strategy section" },
      { status: 500 }
    );
  }
}
