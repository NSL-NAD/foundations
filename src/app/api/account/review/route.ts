import { createClient } from "@/lib/supabase/server";
import { sendReviewNotification } from "@/lib/resend";
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

  // Send email notification (non-blocking)
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", user.id)
    .single();

  try {
    await sendReviewNotification({
      studentName: profile?.full_name || "Student",
      studentEmail: profile?.email || user.email || "",
      rating,
      reviewText: review_text || "",
    });
  } catch (emailError) {
    console.error("Failed to send review notification:", emailError);
    // Don't fail the request for email errors
  }

  return NextResponse.json({ success: true });
}
