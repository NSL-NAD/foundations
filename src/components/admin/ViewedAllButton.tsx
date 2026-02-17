"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

export function ViewedAllButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleViewedAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/viewed-students", {
        method: "PATCH",
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleViewedAll}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Check className="mr-2 h-4 w-4" />
      )}
      Viewed All
    </Button>
  );
}
