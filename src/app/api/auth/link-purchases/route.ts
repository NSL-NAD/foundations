import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing userId or email" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Link any purchases with matching email to this user
    await supabase
      .from("purchases")
      .update({ user_id: userId })
      .eq("email", email)
      .is("user_id", null);

    // Link any kit orders with matching email to this user
    await supabase
      .from("kit_orders")
      .update({ user_id: userId })
      .eq("email", email)
      .is("user_id", null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Link purchases error:", error);
    return NextResponse.json(
      { error: "Failed to link purchases" },
      { status: 500 }
    );
  }
}
