import { PRODUCTS, type ProductKey } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { productType, email } = await req.json();

    const product = PRODUCTS[productType as ProductKey];
    if (!product) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    if (!product.priceId || product.priceId === "undefined") {
      console.error("Missing price ID for product:", productType, "priceId:", product.priceId);
      return NextResponse.json(
        { error: "Product not configured" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://foundations-of-architecture.vercel.app";

    // Create Stripe client fresh in handler
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // Build checkout session params
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      customer_email: email || undefined,
      metadata: { productType },
    };

    // Collect shipping for kit and bundle
    if (productType !== "course") {
      params.shipping_address_collection = {
        allowed_countries: ["US"],
      };
    }

    const session = await stripeClient.checkout.sessions.create(params);

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", errMsg);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: errMsg },
      { status: 500 }
    );
  }
}
