import { NextRequest, NextResponse } from "next/server";

// Inline the products to avoid importing from @/lib/stripe (which creates a module-level Stripe client)
const PRODUCTS: Record<string, { priceId: string; name: string }> = {
  course: {
    priceId: process.env.STRIPE_PRICE_COURSE || "",
    name: "Foundations of Architecture Course",
  },
  kit: {
    priceId: process.env.STRIPE_PRICE_KIT || "",
    name: "Architecture Starter Kit",
  },
  bundle: {
    priceId: process.env.STRIPE_PRICE_BUNDLE || "",
    name: "Course + Starter Kit Bundle",
  },
};

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
        { error: "Product not configured", priceId: product.priceId },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://foundations-of-architecture.vercel.app";

    // Build form-encoded body for Stripe API
    const body = new URLSearchParams();
    body.append("mode", "payment");
    body.append("line_items[0][price]", product.priceId);
    body.append("line_items[0][quantity]", "1");
    body.append("success_url", `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    body.append("cancel_url", `${baseUrl}/#pricing`);
    body.append("metadata[productType]", productType);
    if (email) {
      body.append("customer_email", email);
    }
    if (productType !== "course") {
      body.append("shipping_address_collection[allowed_countries][0]", "US");
    }

    const stripeUrl = "https://api.stripe.com/v1/checkout/sessions";
    const stripeKey = process.env.STRIPE_SECRET_KEY || "";

    const response = await fetch(stripeUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", response.status, JSON.stringify(data));
      return NextResponse.json(
        { error: "Stripe error", details: data.error?.message || "Unknown", stripeStatus: response.status, baseUrl, successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl: data.url });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack?.split("\n").slice(0, 5).join("\n") : "";
    console.error("Checkout error:", errMsg, errStack);
    return NextResponse.json(
      { error: "Checkout exception", details: errMsg },
      { status: 500 }
    );
  }
}
