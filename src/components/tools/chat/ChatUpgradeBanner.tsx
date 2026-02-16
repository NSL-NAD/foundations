"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Lock } from "lucide-react";

interface ChatUpgradeBannerProps {
  variant: "nudge" | "locked";
  used: number;
  limit: number;
  onDismiss?: () => void;
  email?: string;
}

export function ChatUpgradeBanner({
  variant,
  used,
  limit,
  onDismiss,
  email,
}: ChatUpgradeBannerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: "ai_chat", email }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setIsCheckingOut(false);
      }
    } catch {
      setIsCheckingOut(false);
    }
  };

  if (variant === "locked") {
    return (
      <div className="border-t bg-muted/50 px-4 py-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              You&apos;ve used all {limit} free messages
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlock unlimited AI Chat for the rest of your course
            </p>
          </div>
          <Button
            onClick={handleUpgrade}
            disabled={isCheckingOut}
            className="w-full"
            size="sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isCheckingOut
              ? "Redirecting..."
              : "Unlock AI Chat — $19"}
          </Button>
        </div>
      </div>
    );
  }

  // Nudge variant (dismissible)
  return (
    <div className="relative border-t bg-primary/5 px-4 py-3">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground/60 hover:text-muted-foreground"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="flex items-start gap-3 pr-6">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            You&apos;ve used{" "}
            <span className="font-medium text-foreground">
              {used} of {limit}
            </span>{" "}
            free messages.{" "}
            <button
              onClick={handleUpgrade}
              disabled={isCheckingOut}
              className="inline font-medium text-primary hover:underline disabled:opacity-50"
            >
              {isCheckingOut ? "Redirecting..." : "Unlock unlimited for $19 →"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
