"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function Hero() {
  return (
    <section className="bg-background">
      <div className="container py-4 md:py-6">
        {/* Bento grid */}
        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-[1fr_auto]">
          {/* ── Top-left: Main headline card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between rounded-card bg-card p-8 md:p-12 lg:p-16"
          >
            <div>
              <h1 className="font-heading text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[6.5rem]">
                Design
                <br />
                Your Home
              </h1>
            </div>

            <div className="mt-12 md:mt-16">
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                A beginner-friendly course that teaches you the architectural
                fundamentals to confidently plan, communicate, and design your
                ideal living space — no degree required.
              </p>
            </div>
          </motion.div>

          {/* ── Top-right: Hero image + quote overlay ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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

            {/* Quote overlay */}
            <div className="relative flex min-h-[400px] flex-col justify-end p-8 md:min-h-full md:p-10 lg:p-12">
              <div className="mt-auto">
                <p className="font-heading text-2xl font-medium uppercase leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                  Where vision meets
                  <br />
                  precision, architecture
                  <br />
                  transcends boundaries.
                </p>

                <div className="mt-8">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/60 bg-transparent text-white hover:bg-white hover:text-black"
                  >
                    <Link href="#pricing">
                      Enroll Now — $93
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Bottom-left: Two feature cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Card 1 — Accent (terracotta) */}
            <div className="flex flex-col justify-between rounded-card bg-accent p-6 text-white md:p-8">
              <span className="font-heading text-5xl font-bold leading-none md:text-6xl lg:text-7xl">
                62
              </span>
              <div className="mt-6">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                  Lessons
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/80">
                  Comprehensive coverage across 10 modules, from fundamentals to
                  your final design.
                </p>
              </div>
            </div>

            {/* Card 2 — Primary (slate blue) */}
            <div className="flex flex-col justify-between rounded-card bg-primary p-6 text-white md:p-8">
              <span className="font-heading text-5xl font-bold leading-none md:text-6xl lg:text-7xl">
                02
              </span>
              <div className="mt-6">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                  Paths
                </h3>
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex items-center justify-between border-t border-foreground/8 pt-6"
        >
          <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>30-day guarantee</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">Founding pricing</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">Lifetime access</span>
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="#curriculum">
              View Curriculum
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
