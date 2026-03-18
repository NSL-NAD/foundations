"use client";

import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

export interface StrategySection {
  id: string;
  section_key: string;
  section_number: number;
  title: string;
  content: Record<string, unknown>;
  summary: string | null;
  researched_at: string | null;
  status: "pending" | "researching" | "complete" | "error";
  created_at: string;
  updated_at: string;
}

export function StrategyTab({ sections }: { sections: StrategySection[] }) {
  const completeCount = sections.filter((s) => s.status === "complete").length;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "rgba(196,112,79,0.15)" }}
      >
        <Target className="h-8 w-8" style={{ color: "#C4704F" }} />
      </div>
      <h2 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
        FOA Strategy Baseline
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {completeCount} of {sections.length} sections researched. View the full
        premium strategy deck with charts, competitive analysis, and actionable
        roadmaps.
      </p>
      <Link
        href="/admin/strategy"
        className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
        style={{ backgroundColor: "#C4704F" }}
      >
        View Full Strategy
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
