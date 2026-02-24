import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Bento grid */}
        <div className="grid gap-3 md:grid-cols-2 md:grid-rows-[1fr_auto]">
          {/* ── Top-left: Headline + CTA card ── */}
          <div className="flex flex-col justify-between rounded-card bg-card p-4 md:p-5 lg:p-6">
            <div>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-accent">
                Start Your Journey
              </p>
              <h2 className="mt-3 font-heading text-4xl font-light uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
                Your Dream Home
                <span className="block font-medium">Starts Here</span>
              </h2>
            </div>

            <div className="mt-10 md:mt-12">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                For less than a single hour of an architect&apos;s time, gain the
                knowledge to design with confidence. Your completed design brief
                could save your architect hours of work — potentially hundreds
                of dollars. Join the founding class today.
              </p>

              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full border-foreground bg-foreground px-6 text-xs font-medium uppercase tracking-wider text-background hover:bg-brass hover:text-white hover:border-brass"
                >
                  <Link href="#pricing">
                    Enroll Now — $47
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* ── Top-right: Residential image + quote overlay ── */}
          <div className="relative row-span-2 overflow-hidden rounded-card bg-black">
            <Image
              src={IMAGES.ctaResidential.src}
              alt={IMAGES.ctaResidential.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Quote overlay with thin outline box */}
            <div className="relative flex min-h-[400px] flex-col justify-end p-2 md:min-h-full md:p-2.5 lg:p-3">
              <div className="mt-auto rounded-[1.25rem] border-[1.5px] border-white p-4 md:p-5 lg:p-6">
                <p className="font-heading text-2xl font-light uppercase leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                  Where your vision
                  <br />
                  becomes the blueprint
                  <br />
                  for home.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom-left: Three feature cards ── */}
          <div className="grid grid-cols-3 gap-3">
            {/* Card 1 — Terracotta */}
            <div className="flex flex-col justify-between rounded-card bg-accent p-3.5 text-white md:p-4">
              <ShieldCheck className="h-5 w-5 text-white/70" />
              <div className="mt-5">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                  30-Day
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/80">
                  Money-back guarantee, no questions asked.
                </p>
              </div>
            </div>

            {/* Card 2 — Slate Blue */}
            <div className="flex flex-col justify-between rounded-card bg-primary p-3.5 text-white md:p-4">
              <Star className="h-5 w-5 text-white/70" />
              <div className="mt-5">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                  Founding
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/80">
                  Exclusive founding student pricing.
                </p>
              </div>
            </div>

            {/* Card 3 — Dark Navy */}
            <div className="flex flex-col justify-between rounded-card bg-[#171C24] p-3.5 text-white md:p-4">
              <Clock className="h-5 w-5 text-white/70" />
              <div className="mt-5">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                  Lifetime
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/80">
                  Access all current &amp; future content forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
