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

/** POST — update blog idea status (approve / dismiss) */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const authError = await authenticateAdmin(supabase);
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

    const { id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    if (!status || !["approved", "dismissed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("blog_ideas")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update blog idea:", updateError);
      return NextResponse.json(
        { error: "Failed to update blog idea" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog idea update error:", error);
    return NextResponse.json(
      { error: "Failed to update blog idea" },
      { status: 500 }
    );
  }
}

/** PATCH — edit blog idea fields (hook, outline, pillar) */
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

    const { id, hook, outline, pillar } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updates: Record<string, string> = {};
    if (typeof hook === "string" && hook.trim()) updates.hook = hook.trim();
    if (typeof outline === "string") updates.outline = outline.trim();
    if (typeof pillar === "string" && pillar.trim()) updates.pillar = pillar.trim();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("blog_ideas")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("Failed to edit blog idea:", updateError);
      return NextResponse.json(
        { error: "Failed to edit blog idea" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog idea edit error:", error);
    return NextResponse.json(
      { error: "Failed to edit blog idea" },
      { status: 500 }
    );
  }
}
