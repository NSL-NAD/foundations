"use client";

import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export function ShareInvite() {
  async function handleCopy() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/#pricing`
        : "https://foundations-of-architecture.vercel.app/#pricing";

    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <Button variant="outline" size="sm" className="min-w-[120px]" onClick={handleCopy}>
      <Link2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
}
