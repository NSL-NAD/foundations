"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GridPaper } from "@/components/decorative/GridPaper";
import { IMAGES } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card">
      <GridPaper opacity={0.02} size={60} />

      <div className="container relative py-12 md:py-0">
        <div className="grid min-h-[85vh] items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="py-8 md:py-20"
          >
            <h1 className="font-heading text-5xl font-light uppercase leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Design Your
              <span className="block font-medium text-primary">Dream Home</span>
            </h1>

            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
              A beginner-friendly course that teaches you the architectural
              fundamentals to confidently plan, communicate, and design your ideal
              living space — no degree required.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="#pricing">
                  Enroll Now — $93
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#curriculum">View Curriculum</Link>
              </Button>
            </div>

            <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
              30-day guarantee &middot; Founding pricing &middot; Lifetime access
            </p>
          </motion.div>

          {/* Right column — image + quote overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-card">
              <Image
                src={IMAGES.hero.src}
                alt={IMAGES.hero.alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-heading text-xl font-light uppercase leading-snug text-white md:text-2xl">
                  Where vision meets precision, architecture transcends boundaries.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t py-10"
        >
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "62", label: "Lessons" },
              { value: "34", label: "Resources" },
              { value: "2", label: "Learning Paths" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
