import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ValueBanner() {
  return (
    <section className="pb-10 md:pb-16">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Left card — 2/3 width: Founder pricing */}
          <div className="group relative flex flex-col justify-between rounded-card bg-foreground p-4 text-background transition-all duration-300 hover:bg-transparent hover:text-foreground hover:ring-2 hover:ring-foreground md:col-span-2 md:p-5">
            <div>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-background/60 transition-colors duration-300 group-hover:text-foreground/60">
                Founder Pricing — 50% Off
              </p>
              <h3 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
                Starting at $47
              </h3>
              <p className="mt-2 text-sm text-background/60 transition-colors duration-300 group-hover:text-foreground/60">
                Course only · Founding students
              </p>
            </div>
            <div className="mt-auto pt-6">
              <p className="text-base font-medium text-background/70 transition-colors duration-300 group-hover:text-foreground/70">
                Save hours of your architect&apos;s time
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-4 shrink-0 rounded-full border-background bg-background px-6 text-xs font-medium uppercase tracking-wider text-foreground transition-all duration-300 hover:bg-brass hover:text-white hover:border-brass group-hover:border-foreground group-hover:bg-foreground group-hover:text-background group-hover:hover:bg-brass group-hover:hover:border-brass group-hover:hover:text-white"
              >
                <Link href="#pricing">
                  Enroll Now
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right card — 1/3 width: Value highlight */}
          <div className="flex flex-col justify-between rounded-card bg-accent p-4 text-accent-foreground md:p-5">
            <div>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-accent-foreground/50">
                Total Value
              </p>
              <h3 className="mt-3 font-heading text-5xl font-bold uppercase tracking-tight text-accent-foreground/80 md:text-6xl">
                $500+
              </h3>
            </div>
            <p className="mt-6 font-heading text-sm font-medium uppercase tracking-wider text-accent-foreground/60">
              Lifetime Access
            </p>
          </div>

          {/* Image card — full width below */}
          <div className="relative h-[180px] overflow-hidden rounded-card md:col-span-3 md:h-[220px]">
            <Image
              src="/images/architecture-detail.jpg"
              alt="Architectural detail"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
