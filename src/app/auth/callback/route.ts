import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/course";

  const supabase = createClient();

  // Handle PKCE code exchange (standard flow)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Auth callback code exchange failed:", error.message);
  }

  // Handle token_hash verification (recovery/email confirmation flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email",
    });
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Auth callback token verification failed:", error.message);
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
