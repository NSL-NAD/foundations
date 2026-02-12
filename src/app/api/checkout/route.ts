import { PRODUCTS, type ProductKey } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json(
        { error: "Product not configured" },
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

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Failed to create checkout session", details: data.error?.message || "Unknown error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl: data.url });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", errMsg);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: errMsg },
      { status: 500 }
    );
  }
}
