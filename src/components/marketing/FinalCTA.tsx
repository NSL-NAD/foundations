import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">
            Your Dream Home Starts Here
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            For less than a single hour of an architect&apos;s time, gain the
            knowledge to design with confidence. Join the founding class today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base px-8"
            >
              <Link href="#pricing">
                Enroll Now — $93
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/60">
            30-day money-back guarantee · Founding student pricing · Lifetime
            access
          </p>
        </div>
      </div>
    </section>
  );
}
