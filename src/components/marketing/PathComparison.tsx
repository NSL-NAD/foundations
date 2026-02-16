"use client";

import { PenTool, FileText, Check } from "lucide-react";

const paths = [
  {
    icon: PenTool,
    title: "The Drawer Path",
    subtitle: "Hands-on & Visual",
    description:
      "Learn by sketching. Build your design skills through floor plans, elevations, and spatial drawings.",
    features: [
      "Sketch floor plans and elevations",
      "Learn architectural drawing conventions",
      "Build a visual portfolio",
      "Use the Architecture Starter Kit tools",
      "Great for visual thinkers",
    ],
    bgClass: "bg-primary text-white",
  },
  {
    icon: FileText,
    title: "The Brief Builder Path",
    subtitle: "Written & Strategic",
    description:
      "Create a comprehensive architectural brief — a written plan that captures every detail of your dream home.",
    features: [
      "Write a detailed design brief",
      "Define room-by-room requirements",
      "Document material & style preferences",
      "Create a professional reference document",
      "Great for analytical thinkers",
    ],
    bgClass: "bg-accent text-white",
  },
];

export function PathComparison() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Two Paths, One Destination
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you prefer to sketch or write, there&apos;s a path designed
            for you. Switch anytime — both are included.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
          {paths.map((path) => (
            <div
              key={path.title}
              className={`rounded-card border border-white/15 p-5 md:p-6 ${path.bgClass}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <path.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-heading text-2xl font-semibold uppercase">
                {path.title}
              </h3>
              <p className="mt-1 text-sm font-medium opacity-70">
                {path.subtitle}
              </p>
              <p className="mt-4 text-sm opacity-80">
                {path.description}
              </p>
              <ul className="mt-6 space-y-3">
                {path.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
