import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
      .from("design_brief_responses")
      .select("question_key, response, updated_at")
      .eq("user_id", user.id);

    if (error) {
      console.error("Design brief GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch design brief" },
        { status: 500 }
      );
    }

    return NextResponse.json({ responses: data || [] });
  } catch (error) {
    console.error("Design brief GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch design brief" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionKey, response } = await req.json();

    if (!questionKey) {
      return NextResponse.json(
        { error: "Missing questionKey" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("design_brief_responses").upsert(
      {
        user_id: user.id,
        question_key: questionKey,
        response: response || "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_key" }
    );

    if (error) {
      console.error("Design brief upsert error:", error);
      return NextResponse.json(
        { error: "Failed to save design brief" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Design brief PUT error:", error);
    return NextResponse.json(
      { error: "Failed to save design brief" },
      { status: 500 }
    );
  }
}
