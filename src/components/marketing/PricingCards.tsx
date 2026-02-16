"use client";

import { Button } from "@/components/ui/button";
import { Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const products = [
  {
    key: "course",
    name: "Course Only",
    price: 93,
    description: "Full digital course access",
    features: [
      "62 lessons across 10 modules",
      "Two learning paths (Drawer & Brief Builder)",
      "34 downloadable PDFs & worksheets",
      "Lifetime access (founding students)",
      "All future updates included",
    ],
    highlighted: false,
  },
  {
    key: "bundle",
    name: "Course + Starter Kit",
    price: 123,
    originalPrice: 135,
    description: "Everything you need to start",
    features: [
      "Everything in Course Only",
      "Architecture Starter Kit shipped to you",
      "Grid paper, ruler, pencils, eraser",
      "Architecture journal & carry pouch",
      "Save $12 vs. buying separately",
    ],
    highlighted: true,
  },
  {
    key: "kit",
    name: "Starter Kit Only",
    price: 42,
    description: "Physical tools for the Drawer path",
    features: [
      "Architectural grid paper pad",
      "Scaled ruler",
      "Pencil set & eraser",
      "Architecture journal",
      "Canvas carry pouch",
    ],
    highlighted: false,
    note: "Course access sold separately",
  },
];

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(productKey: string) {
    setLoading(productKey);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: productKey }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error("Checkout failed:", data);
        toast.error("Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Founding Student Pricing
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Invest in Your Dream Home
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the option that fits your learning style. All options include
            lifetime access for founding students.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.key}
              className={`relative flex flex-col rounded-card border p-8 ${
                product.highlighted
                  ? "border-2 border-primary brass-glow"
                  : "border-foreground/10 bg-card"
              }`}
            >
              {product.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                  Best Value
                </span>
              )}
              <div className="text-center">
                <h3 className="font-heading text-lg font-semibold uppercase">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-6">
                  {product.originalPrice && (
                    <span className="mr-2 text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="font-heading text-5xl font-bold">
                    ${product.price}
                  </span>
                  <span className="text-sm text-muted-foreground"> USD</span>
                </div>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {product.note && (
                <p className="mt-4 text-xs text-muted-foreground italic">
                  {product.note}
                </p>
              )}
              <Button
                className="mt-8 w-full"
                size="lg"
                variant={product.highlighted ? "default" : "outline"}
                onClick={() => handleCheckout(product.key)}
                disabled={loading !== null}
              >
                {loading === product.key
                  ? "Redirecting..."
                  : `Get ${product.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-8 text-xs uppercase tracking-wider text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>30-day guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>
    </section>
  );
}
