import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe((process.env.STRIPE_SECRET_KEY || "").trim(), {
    apiVersion: "2026-01-28.clover",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      email: session.customer_details?.email || session.customer_email,
      productType: session.metadata?.productType,
    });
  } catch {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }
}
