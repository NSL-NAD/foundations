"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

export function StarterKitButton() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/purchases")
      .then((res) => res.json())
      .then((data) => {
        const types: string[] = data.purchasedTypes || [];
        // Hide if user already has kit or bundle
        if (!types.includes("kit") && !types.includes("bundle")) {
          setVisible(true);
        }
      })
      .catch(() => {
        // If check fails, don't show button
      });
  }, []);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: "kit" }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="not-prose">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}
        {loading ? "Loading..." : "Get the Starter Kit"}
      </button>
    </div>
  );
}
