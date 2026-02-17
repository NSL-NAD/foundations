import { createClient } from "@/lib/supabase/server";
import { sendContactEmail } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, message } = await req.json();

  if (!message || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", user.id)
    .single();

  const email = profile?.email || user.email || "";
  const name = profile?.full_name || "Student";

  // Save to database
  const { error } = await supabase.from("contact_messages").insert({
    user_id: user.id,
    email,
    subject: subject || "",
    message,
  });

  if (error) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }

  // Send email
  try {
    await sendContactEmail({ email, name, subject: subject || "Message from FOA Student", message });
  } catch (emailError) {
    console.error("Failed to send contact email:", emailError);
    // Message is saved, don't fail the request
  }

  return NextResponse.json({ success: true });
}
