import { createClient } from "@/lib/supabase/server";
import { sendContactEmail } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  if (!email || !email.trim()) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  if (!message || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const senderName = name?.trim() || "Website Visitor";

  // If user is logged in, save to contact_messages table
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("contact_messages").insert({
        user_id: user.id,
        email: email.trim(),
        subject: subject || "",
        message,
      });
    }
  } catch {
    // Non-blocking — still send the email even if DB save fails
  }

  // Send email
  try {
    await sendContactEmail({
      email: email.trim(),
      name: senderName,
      subject: subject || "Message from FOA Website",
      message,
    });
  } catch (emailError) {
    console.error("Failed to send contact email:", emailError);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
