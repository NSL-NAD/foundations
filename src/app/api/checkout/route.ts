import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRODUCTS: Record<
  string,
  { priceId: string; name: string; shipping?: boolean }
> = {
  course: {
    priceId: (process.env.STRIPE_PRICE_COURSE || "").trim(),
    name: "Foundations of Architecture Course",
  },
  kit: {
    priceId: (process.env.STRIPE_PRICE_KIT || "").trim(),
    name: "Architecture Starter Kit",
    shipping: true,
  },
  bundle: {
    priceId: (process.env.STRIPE_PRICE_BUNDLE || "").trim(),
    name: "Course + Starter Kit Bundle",
    shipping: true,
  },
  ai_chat: {
    priceId: (process.env.STRIPE_PRICE_AI_CHAT || "").trim(),
    name: "AI Chat — Unlimited Access",
  },
  // Upsell variants (10% off)
  kit_upsell: {
    priceId: (process.env.STRIPE_PRICE_KIT_UPSELL || "").trim(),
    name: "Architecture Starter Kit (10% Off)",
    shipping: true,
  },
  ai_chat_upsell: {
    priceId: (process.env.STRIPE_PRICE_AI_CHAT_UPSELL || "").trim(),
    name: "AI Chat — Unlimited Access (10% Off)",
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
    const { productType, email, courseSessionId } = await req.json();

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

    // Determine success + cancel URLs based on product type
    let successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    let cancelUrl = `${baseUrl}/#pricing`;

    if (productType === "course") {
      // Course purchase → upsell page (Kit at 10% off)
      successUrl = `${baseUrl}/checkout/upsell?session_id={CHECKOUT_SESSION_ID}`;
    } else if (productType === "kit_upsell") {
      // Kit upsell → upsell page step 2 (AI Chat at 10% off)
      // Pass original course session for account creation on success page
      const csParam = courseSessionId ? `&cs=${courseSessionId}` : "";
      successUrl = `${baseUrl}/checkout/upsell?step=2&session_id={CHECKOUT_SESSION_ID}${csParam}`;
      cancelUrl = `${baseUrl}/checkout/upsell?step=2${csParam}`;
    } else if (productType === "ai_chat_upsell") {
      // AI Chat upsell → success page with original course session
      const csParam = courseSessionId ? `&cs=${courseSessionId}` : "";
      successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}${csParam}`;
      cancelUrl = courseSessionId
        ? `${baseUrl}/checkout/success?session_id=${courseSessionId}`
        : `${baseUrl}/checkout/success`;
    } else if (productType === "ai_chat") {
      cancelUrl = `${baseUrl}/course`;
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email || undefined,
      metadata: { productType },
    };

    // Apply 10% off coupon for upsell products
    const upsellCoupon = (
      process.env.STRIPE_COUPON_UPSELL || "qBLI4Nl6"
    ).trim();
    if (
      (productType === "kit_upsell" || productType === "ai_chat_upsell") &&
      upsellCoupon
    ) {
      params.discounts = [{ coupon: upsellCoupon }];
    }

    // Collect shipping for products that require it
    if (product.shipping) {
      params.shipping_address_collection = {
        allowed_countries: ["US"],
      };
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
