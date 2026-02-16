"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, Package } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [sessionData, setSessionData] = useState<{
    email: string;
    productType: string;
  } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (sessionId) {
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

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionData?.email) return;

    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: sessionData.email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Link purchases to the new user and send welcome email
    if (signUpData.user) {
      try {
        await Promise.all([
          fetch("/api/auth/link-purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: signUpData.user.id,
              email: sessionData.email,
            }),
          }),
          fetch("/api/auth/welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: sessionData.email,
              fullName,
            }),
          }),
        ]);
      } catch {
        // Non-critical — don't block account creation
      }
    }

    setAccountCreated(true);
    setLoading(false);
  }

  // For ai_chat purchases, auto-redirect back to course (user already has account)
  useEffect(() => {
    if (sessionData?.productType === "ai_chat") {
      const timer = setTimeout(() => {
        window.location.href = "/course";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionData]);

  const productNames: Record<string, string> = {
    course: "Foundations of Architecture Course",
    kit: "Architecture Starter Kit",
    bundle: "Course + Starter Kit Bundle",
    ai_chat: "AI Chat — Unlimited Access",
  };

  const includesKit =
    sessionData?.productType === "kit" ||
    sessionData?.productType === "bundle";
  const includesCourse =
    sessionData?.productType === "course" ||
    sessionData?.productType === "bundle";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Thank you!</CardTitle>
          <CardDescription>
            {sessionData
              ? `You've purchased ${productNames[sessionData.productType] || "your course"}`
              : "Your purchase was successful"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {sessionData?.productType === "ai_chat" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                AI Chat is now unlocked! Redirecting you back to the
                course...
              </p>
              <Loader2 className="mx-auto mt-3 h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {includesKit && (
            <div className="flex items-start gap-3 rounded-md border p-3">
              <Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Starter Kit</p>
                <p className="text-xs text-muted-foreground">
                  Your kit will ship within 3-5 business days. We&apos;ll
                  send tracking info to your email.
                </p>
              </div>
            </div>
          )}

          {includesCourse && !accountCreated && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Create your account to access the course:
                </p>
                {sessionData?.email && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={sessionData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account & Start Learning
              </Button>
            </form>
          )}

          {accountCreated && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Your account is ready! Start learning now.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2">
          {sessionData?.productType === "ai_chat" ? (
            <Button asChild className="w-full">
              <Link href="/course">Back to Course</Link>
            </Button>
          ) : accountCreated || !includesCourse ? (
            <Button asChild className="w-full">
              <Link href={includesCourse ? "/dashboard" : "/"}>
                {includesCourse ? "Go to Dashboard" : "Return Home"}
              </Link>
            </Button>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
