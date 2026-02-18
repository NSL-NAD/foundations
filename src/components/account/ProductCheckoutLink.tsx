"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ProductCheckoutLinkProps {
  productType: string;
  label: string;
  icon: LucideIcon;
}

export function ProductCheckoutLink({
  productType,
  label,
  icon: Icon,
}: ProductCheckoutLinkProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-md border px-3 py-2 opacity-50 transition-opacity hover:opacity-80 disabled:cursor-wait"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
      {loading ? (
        <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <ShoppingCart className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
