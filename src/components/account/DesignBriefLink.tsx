"use client";

import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DesignBriefLinkProps {
  hasResponses: boolean;
  responseCount: number;
}

export function DesignBriefLink({
  hasResponses,
  responseCount,
}: DesignBriefLinkProps) {
  if (!hasResponses) {
    return (
      <p className="text-sm text-muted-foreground">
        Complete lessons to start building your Design Brief.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm">
          {responseCount} response{responseCount !== 1 ? "s" : ""} saved
        </p>
        <p className="text-xs text-muted-foreground">
          Your design brief compiles as you progress through the course
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/notebook">
          <FileText className="mr-2 h-4 w-4" />
          View Brief
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
