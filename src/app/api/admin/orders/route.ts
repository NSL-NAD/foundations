import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendKitShippedEmail } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  // Verify admin
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId, status, trackingNumber, trackingUrl } = await req.json();

  if (!orderId || !status) {
    return NextResponse.json(
      { error: "Missing orderId or status" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  const updateData: Record<string, string | null> = { status };
  if (trackingNumber) updateData.tracking_number = trackingNumber;
  if (trackingUrl) updateData.tracking_url = trackingUrl;
  if (status === "shipped") updateData.shipped_at = new Date().toISOString();

  const { error } = await adminClient
    .from("kit_orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }

  // Send shipped email
  if (status === "shipped" && trackingNumber) {
    const { data: order } = await adminClient
      .from("kit_orders")
      .select("email")
      .eq("id", orderId)
      .single();

    if (order?.email) {
      try {
        await sendKitShippedEmail({
          email: order.email,
          trackingNumber,
          trackingUrl: trackingUrl || undefined,
        });
      } catch (emailError) {
        console.error("Failed to send shipped email:", emailError);
      }
    }
  }

  return NextResponse.json({ success: true });
}
