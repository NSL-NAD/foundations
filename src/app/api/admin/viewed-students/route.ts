import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("purchases")
    .update({ admin_viewed_at: new Date().toISOString() })
    .is("admin_viewed_at", null)
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed")
    .select("id");

  if (error) {
    console.error("Failed to mark students as viewed:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, count: data?.length || 0 });
}
