import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    const { id, status, body } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Build update payload — at least one of status or body must be provided
    const updates: Record<string, string> = {};
    if (status) {
      if (!["approved", "dismissed", "posted"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.status = status;
    }
    if (typeof body === "string") {
      if (!body.trim()) {
        return NextResponse.json({ error: "Body cannot be empty" }, { status: 400 });
      }
      updates.body = body;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update — provide status or body" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("social_ideas")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update idea:", updateError);
      return NextResponse.json(
        { error: "Failed to update idea" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Idea update error:", error);
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    );
  }
}
