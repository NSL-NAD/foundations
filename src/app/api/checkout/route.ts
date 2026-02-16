import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRODUCTS: Record<string, { priceId: string; name: string }> = {
  course: {
    priceId: (process.env.STRIPE_PRICE_COURSE || "").trim(),
    name: "Foundations of Architecture Course",
  },
  kit: {
    priceId: (process.env.STRIPE_PRICE_KIT || "").trim(),
    name: "Architecture Starter Kit",
  },
  bundle: {
    priceId: (process.env.STRIPE_PRICE_BUNDLE || "").trim(),
    name: "Course + Starter Kit Bundle",
  },
  ai_chat: {
    priceId: (process.env.STRIPE_PRICE_AI_CHAT || "").trim(),
    name: "AI Chat — Unlimited Access",
  },
};

function getStripe() {
  return new Stripe((process.env.STRIPE_SECRET_KEY || "").trim(), {
    apiVersion: "2026-01-28.clover",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { productType, email } = await req.json();

    const product = PRODUCTS[productType];
    if (!product) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    if (!product.priceId) {
      return NextResponse.json(
        { error: "Product not configured" },
        { status: 500 }
      );
    }

    const baseUrl = (
      process.env.NEXT_PUBLIC_URL ||
      "https://foundations-of-architecture.vercel.app"
    ).trim();

    const stripe = getStripe();

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      customer_email: email || undefined,
      metadata: { productType },
    };

    // Collect shipping for kit and bundle only
    if (["kit", "bundle"].includes(productType)) {
      params.shipping_address_collection = {
        allowed_countries: ["US"],
      };
    }

    // For ai_chat, cancel URL goes back to course (not pricing)
    if (productType === "ai_chat") {
      params.cancel_url = `${baseUrl}/course`;
    }

    const session = await stripe.checkout.sessions.create(params);

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
