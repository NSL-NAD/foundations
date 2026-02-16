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
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.hero.src}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
      </div>

      {/* Subtle architectural grid pattern */}
      <GridPaper opacity={0.04} size={60} />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Foundations of Architecture
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Design Your Dream Home
            <span className="block text-highlight">for $93, Not $200K</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A beginner-friendly course that teaches you the architectural
            fundamentals to confidently plan, communicate, and design your ideal
            living space — no degree required.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="text-base px-8 hover:scale-[1.02] transition-transform">
              <Link href="#pricing">
                Enroll Now — $93
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base hover:scale-[1.02] transition-transform">
              <Link href="#curriculum">View Curriculum</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            30-day money-back guarantee · Founding student pricing · Lifetime
            access
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t pt-8"
        >
          {[
            { value: "62", label: "Lessons" },
            { value: "34", label: "Downloadable Resources" },
            { value: "2", label: "Learning Paths" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl font-bold text-primary md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
