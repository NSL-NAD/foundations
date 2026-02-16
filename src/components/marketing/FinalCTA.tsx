import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";
import { ArchCurve } from "@/components/decorative/ArchCurve";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-card">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.ctaBackground.src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <ArchCurve position="top-left" size={200} className="text-brass/30" />
          <ArchCurve position="bottom-right" size={200} className="text-brass/30" />

          {/* Content */}
          <div className="relative px-8 py-20 text-center text-white md:px-16 md:py-28">
            <h2 className="font-heading text-4xl font-light uppercase leading-tight tracking-tight md:text-6xl">
              Your Dream Home
              <span className="block font-medium">Starts Here</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              For less than a single hour of an architect&apos;s time, gain the
              knowledge to design with confidence. Join the founding class today.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/85"
              >
                <Link href="#pricing">
                  Enroll Now — $93
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/40">
              30-day guarantee &middot; Founding pricing &middot; Lifetime access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
