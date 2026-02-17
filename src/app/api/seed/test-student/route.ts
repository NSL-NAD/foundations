import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  // Only allow admins to seed test data
  const authSupabase = createClient();
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await authSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();

  // Create auth user
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email: "test@foa.com",
      password: "TestStudent2026!",
      email_confirm: true,
      user_metadata: { full_name: "Test Student" },
    });

  if (authError) {
    // If user already exists, try to get their ID
    if (authError.message?.includes("already been registered")) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", "test@foa.com")
        .single();

      if (existingProfile) {
        // Ensure purchase exists
        const { data: existingPurchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("email", "test@foa.com")
          .eq("product_type", "course")
          .single();

        if (!existingPurchase) {
          await supabase.from("purchases").insert({
            user_id: existingProfile.id,
            email: "test@foa.com",
            product_type: "course",
            amount_cents: 0,
            status: "completed",
            stripe_checkout_session_id: "seed_test_student",
          });
        }

        return NextResponse.json({
          message: "Test student already exists",
          userId: existingProfile.id,
        });
      }
    }

    console.error("Failed to create test user:", authError);
    return NextResponse.json(
      { error: authError.message },
      { status: 500 }
    );
  }

  // The handle_new_user trigger creates the profile automatically.
  // Now create a purchase record for course access.
  const userId = authUser.user.id;

  const { error: purchaseError } = await supabase.from("purchases").insert({
    user_id: userId,
    email: "test@foa.com",
    product_type: "course",
    amount_cents: 0,
    status: "completed",
    stripe_checkout_session_id: "seed_test_student",
  });

  if (purchaseError) {
    console.error("Failed to create purchase:", purchaseError);
    return NextResponse.json(
      { error: purchaseError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Test student created successfully",
    userId,
    email: "test@foa.com",
    password: "TestStudent2026!",
  });
}
