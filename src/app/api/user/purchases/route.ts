import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: purchases } = await supabase
      .from("purchases")
      .select("product_type")
      .eq("user_id", user.id)
      .eq("status", "completed");

    const purchasedTypes = Array.from(
      new Set((purchases || []).map((p) => p.product_type))
    );

    return NextResponse.json({ purchasedTypes });
  } catch (error) {
    console.error("Purchases check error:", error);
    return NextResponse.json(
      { error: "Failed to check purchases" },
      { status: 500 }
    );
  }
}
