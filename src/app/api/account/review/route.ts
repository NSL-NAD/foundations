import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rating, review_text } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("course_reviews").upsert(
    {
      user_id: user.id,
      rating,
      review_text: review_text || "",
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to save review:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
