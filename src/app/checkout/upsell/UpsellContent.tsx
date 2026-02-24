"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  Package,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { toast } from "sonner";

export function UpsellContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const csParam = searchParams.get("cs"); // original course session (passed through upsell chain)
  const stepParam = searchParams.get("step");
  const step = stepParam === "2" ? 2 : 1;

  // The original course session ID:
  // - Step 1: sessionId IS the course session (first landing after course purchase)
  // - Step 2: csParam is the course session (if they bought kit, sessionId is kit session)
  //           OR sessionId is the course session (if they skipped kit)
  const courseSessionId = useMemo(() => {
    if (step === 1) return sessionId;
    return csParam || sessionId;
  }, [step, sessionId, csParam]);

  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<{
    email: string;
    productType: string;
  } | null>(null);

  // Fetch session data to get email for upsell checkout
  // Always use the most recent session to get the email
  useEffect(() => {
    if (sessionId && sessionId !== "skip") {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setSessionData(data);
          }
        })
        .catch(console.error);
    }
  }, [sessionId]);

  async function handleUpsellPurchase(productType: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType,
          email: sessionData?.email,
          courseSessionId: courseSessionId || undefined,
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // Build the "skip to step 2" URL, preserving the course session
  const step2SkipUrl = useMemo(() => {
    const params = new URLSearchParams({ step: "2" });
    if (courseSessionId) params.set("session_id", courseSessionId);
    return `/checkout/upsell?${params.toString()}`;
  }, [courseSessionId]);

  // Build the "skip to success" URL, using the original course session
  const successSkipUrl = useMemo(() => {
    if (courseSessionId) {
      return `/checkout/success?session_id=${courseSessionId}`;
    }
    return "/checkout/success";
  }, [courseSessionId]);

  // Step 1: Kit upsell
  if (step === 1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8">
          <Logo />
        </div>

        {/* Success confirmation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span>Course purchase complete!</span>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Exclusive 10% Off
            </div>
            <CardTitle className="text-2xl">Add the Starter Kit?</CardTitle>
            <CardDescription>
              Get the Architecture Starter Kit shipped to your door with
              everything you need to complete the course exercises.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="rounded-md border p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-sm font-medium uppercase tracking-wide">
                  Architecture Starter Kit
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    $42
                  </span>
                  <span className="text-lg font-bold text-primary">$37.80</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                  Professional-grade drafting tools
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                  Printed reference cards &amp; templates
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                  Ships within 3-5 business days
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => handleUpsellPurchase("kit_upsell")}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}
              {loading
                ? "Redirecting..."
                : "Yes, Add the Starter Kit \u2014 $37.80"}
            </Button>
            <Link
              href={step2SkipUrl}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              No thanks, continue
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Step 2: AI Chat upsell
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>

      {/* Success confirmation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-primary" />
        <span>Almost there — one more offer for you!</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Exclusive 10% Off
          </div>
          <CardTitle className="text-2xl">Unlock AI Chat?</CardTitle>
          <CardDescription>
            Get unlimited access to your AI architecture assistant. Ask
            questions, get feedback on your work, and deepen your understanding
            of every lesson.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="rounded-md border p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-sm font-medium uppercase tracking-wide">
                AI Chat — Lifetime Access
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  $19
                </span>
                <span className="text-lg font-bold text-primary">$17.10</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                Unlimited questions about any lesson
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                Context-aware — knows what you&apos;re studying
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                Available 24/7, instant responses
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => handleUpsellPurchase("ai_chat_upsell")}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            {loading ? "Redirecting..." : "Yes, Unlock AI Chat \u2014 $17.10"}
          </Button>
          <Link
            href={successSkipUrl}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            No thanks, set up my account
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
