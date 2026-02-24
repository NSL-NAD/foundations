import { NextRequest, NextResponse } from "next/server";
import {
  sendTrialWelcomeEmail,
  sendTrialSignupAdminNotification,
} from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Send both emails in parallel (non-blocking to the signup flow)
    await Promise.allSettled([
      sendTrialWelcomeEmail({ email, fullName: fullName || "" }),
      sendTrialSignupAdminNotification({ email, fullName: fullName || "" }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Trial welcome email error:", error);
    return NextResponse.json(
      { error: "Failed to send trial emails" },
      { status: 500 }
    );
  }
}
