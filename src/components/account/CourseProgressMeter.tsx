"use client";

import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface CourseProgressMeterProps {
  percent: number;
  completed: number;
  total: number;
}

export function CourseProgressMeter({
  percent,
  completed,
  total,
}: CourseProgressMeterProps) {
  return (
    <div className="rounded-card border bg-card p-6">
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Course Progress
        </span>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="font-heading text-3xl font-bold">{percent}%</div>
      <Progress value={percent} className="mt-3" />
      <p className="mt-2 text-xs text-muted-foreground">
        {completed} of {total} lessons completed
      </p>
    </div>
  );
}
