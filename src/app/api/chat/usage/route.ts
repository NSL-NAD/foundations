import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const FREE_MESSAGE_LIMIT = 25;

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has paid for AI Chat
    const { data: hasAccess } = await supabase.rpc("has_ai_chat_access", {
      p_user_id: user.id,
    });

    if (hasAccess) {
      return NextResponse.json({
        used: 0,
        limit: FREE_MESSAGE_LIMIT,
        hasFullAccess: true,
      });
    }

    // Count messages
    const { data: count } = await supabase.rpc("get_chat_message_count", {
      p_user_id: user.id,
    });

    return NextResponse.json({
      used: count || 0,
      limit: FREE_MESSAGE_LIMIT,
      hasFullAccess: false,
    });
  } catch (error) {
    console.error("Chat usage error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
