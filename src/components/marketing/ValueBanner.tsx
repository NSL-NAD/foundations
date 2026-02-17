import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ValueBanner() {
  return (
    <section className="pb-10 md:pb-16">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 rounded-card bg-card p-6 sm:flex-row md:p-8 lg:p-10">
          <div>
            <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Over $500 in Value
            </p>
            <h3 className="mt-2 font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
              Starting at $47 One-Time for Lifetime Access
            </h3>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full border-foreground bg-foreground px-6 text-xs font-medium uppercase tracking-wider text-background hover:bg-brass hover:text-white hover:border-brass"
          >
            <Link href="#pricing">
              Enroll Now
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
