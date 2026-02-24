import { createAdminClient } from "@/lib/supabase/admin";
import { sendPurchaseConfirmation, sendWelcomeEmail } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe((process.env.STRIPE_SECRET_KEY || "").trim(), {
    apiVersion: "2026-01-28.clover",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      (process.env.STRIPE_WEBHOOK_SECRET || "").trim()
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createAdminClient();
    const productType = session.metadata?.productType || "course";

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        email: session.customer_details?.email || session.customer_email || "",
        stripe_customer_id:
          typeof session.customer === "string" ? session.customer : null,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        product_type: productType,
        amount_cents: session.amount_total || 0,
        currency: session.currency || "usd",
        status: "completed",
      })
      .select()
      .single();

    if (purchaseError) {
      console.error("Failed to create purchase:", purchaseError);
      return NextResponse.json(
        { error: "Failed to create purchase record" },
        { status: 500 }
      );
    }

    // If kit, kit_upsell, or bundle, create kit order
    const shippingInfo = session.collected_information?.shipping_details;
    if (["kit", "kit_upsell", "bundle"].includes(productType) && shippingInfo) {
      const shipping = shippingInfo;
      await supabase.from("kit_orders").insert({
        purchase_id: purchase.id,
        email:
          session.customer_details?.email || session.customer_email || "",
        shipping_name: shipping.name || "",
        shipping_address_line1: shipping.address?.line1 || "",
        shipping_address_line2: shipping.address?.line2 || null,
        shipping_city: shipping.address?.city || "",
        shipping_state: shipping.address?.state || "",
        shipping_postal_code: shipping.address?.postal_code || "",
        shipping_country: shipping.address?.country || "US",
        status: "pending",
      });
    }

    // Link to existing user if email matches
    const customerEmail =
      session.customer_details?.email || session.customer_email;
    if (customerEmail) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (existingUser) {
        await supabase
          .from("purchases")
          .update({ user_id: existingUser.id })
          .eq("id", purchase.id);

        // Also link kit order
        if (["kit", "kit_upsell", "bundle"].includes(productType)) {
          await supabase
            .from("kit_orders")
            .update({ user_id: existingUser.id })
            .eq("purchase_id", purchase.id);
        }

        // Send welcome email for existing users on first course/bundle purchase
        if (["course", "bundle"].includes(productType)) {
          try {
            await sendWelcomeEmail({
              email: customerEmail,
              fullName: existingUser.full_name || "",
            });
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
          }
        }
      }

      // Send confirmation email
      try {
        await sendPurchaseConfirmation({
          email: customerEmail,
          productType,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the webhook for email errors
      }
    }
  }

  return NextResponse.json({ received: true });
}
