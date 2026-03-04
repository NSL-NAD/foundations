import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CourseCTACard() {
  return (
    <div className="rounded-card border border-foreground/10 bg-card p-6">
      <h3 className="font-heading text-lg font-semibold tracking-tight">
        Foundations of Architecture
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Learn to design your dream home — from architectural fundamentals to
        floor plans. No degree required.
      </p>
      <div className="mt-3 flex items-baseline gap-2 text-sm">
        <span className="font-heading text-2xl font-bold">$93</span>
        <span className="text-muted-foreground">course</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-heading text-2xl font-bold">$123</span>
        <span className="text-muted-foreground">bundle</span>
      </div>
      <Button asChild className="mt-4 w-full" size="sm">
        <Link href="/#pricing">
          Explore the Course
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
