"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const fadeUpStats = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="bg-background">
      <div className="container pt-6 pb-3 md:pt-8 md:pb-4">
        {/* Bento grid */}
        <div className="grid gap-3 md:grid-cols-2 md:grid-rows-[1fr_auto]">
          {/* ── Top-left: Main headline card ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between rounded-card bg-card p-2 md:p-3 lg:p-4"
          >
            <div>
              <h1 className="font-heading text-5xl font-light uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.875rem]">
                Design Your
                <br />
                Dream Home
              </h1>
            </div>

            <div className="mt-10 md:mt-12">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                A beginner-friendly online course that teaches homeowners the
                architectural fundamentals to confidently plan, communicate, and
                design your ideal living space or dream home — no degree
                required.
              </p>
            </div>
          </motion.div>

          {/* ── Top-right: Hero image + quote overlay ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.1 }}
            className="relative row-span-2 overflow-hidden rounded-card bg-black"
          >
            <Image
              src={IMAGES.hero.src}
              alt={IMAGES.hero.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Quote overlay with thin outline box */}
            <div className="relative flex min-h-[400px] flex-col justify-end p-2 md:min-h-full md:p-2.5 lg:p-3">
              <div className="mt-auto rounded-[1.25rem] border-[1.5px] border-white p-4 md:p-5 lg:p-6">
                <p className="font-heading text-2xl font-light uppercase leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                  Where vision meets
                  <br />
                  precision, architecture
                  <br />
                  transcends boundaries.
                </p>

                <div className="mt-5">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white bg-white px-5 text-xs font-medium uppercase tracking-wider text-black hover:bg-brass hover:text-white hover:border-brass"
                  >
                    <Link href="#pricing">
                      Enroll Now — $47
                      <ArrowRight className="ml-1.5 h-3 w-3" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Bottom-left: Two feature cards ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {/* Card 1 — Accent (terracotta) */}
            <div className="flex flex-col rounded-card bg-accent p-3.5 text-white md:p-4">
              <span className="font-heading text-5xl font-bold leading-none md:text-6xl lg:text-7xl">
                106
              </span>
              <div className="mt-auto pt-5">
                <p className="font-heading text-sm font-semibold uppercase tracking-wider">
                  Lessons
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/80">
                  Comprehensive coverage across 11 modules, from fundamentals to
                  final design.
                </p>
              </div>
            </div>

            {/* Card 2 — Primary (slate blue) */}
            <div className="flex flex-col rounded-card bg-primary p-3.5 text-white md:p-4">
              <span className="font-heading text-5xl font-bold leading-none md:text-6xl lg:text-7xl">
                02
              </span>
              <div className="mt-auto pt-5">
                <p className="font-heading text-sm font-semibold uppercase tracking-wider">
                  Paths
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/80">
                  Choose the Drawer path for hands-on sketching or Brief Builder
                  for digital planning.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          {...fadeUpStats}
          transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.4 }}
          className="mt-5 flex items-center justify-center border-t border-foreground/8 pt-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>30-day guarantee</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Founding pricing</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Lifetime access</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
