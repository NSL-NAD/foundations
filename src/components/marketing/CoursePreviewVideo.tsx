"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Compass,
  Highlighter,
  MessageSquareText,
  Monitor,
  Timer,
} from "lucide-react";

const features = [
  {
    icon: Compass,
    text: "Easy to navigate course platform",
  },
  {
    icon: Highlighter,
    text: "Easily highlight content into your Course Notebook",
  },
  {
    icon: MessageSquareText,
    text: "Chat with our Architecture Assistant AI",
  },
  {
    icon: Monitor,
    text: "Access your course on desktop or mobile",
  },
  {
    icon: Timer,
    text: "Your pace, your learning style",
  },
];

export function CoursePreviewVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#171C24] py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:pl-8 lg:pr-0">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-6">
          {/* Left side — value props + CTA card */}
          <div className="lg:w-[33%] lg:shrink-0">
            <div className="group flex h-full flex-col rounded-card border border-white px-7 py-8 transition-colors duration-300 hover:border-surface hover:bg-surface sm:px-8 sm:py-10">
              <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-foreground/50">
                Course Platform
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-foreground md:text-3xl">
                Built for Learning
              </h2>

              <div className="mt-8 space-y-5">
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brass/15 transition-colors duration-300 group-hover:bg-brass/20">
                      <feature.icon className="h-4 w-4 text-brass" aria-hidden="true" />
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-foreground/70">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <p className="text-base font-medium text-white/70 transition-colors duration-300 group-hover:text-foreground/70">
                  Trial the course for free
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-full border-white bg-white px-5 text-xs font-medium uppercase tracking-wider text-black transition-colors duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-white hover:!border-brass hover:!bg-brass hover:!text-white"
                >
                  <Link href="/signup">
                    Enroll Now
                    <ArrowRight className="ml-1.5 h-3 w-3" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right side — video, bleeds to right edge on desktop */}
          <div className="lg:flex-1">
            {/* Mobile: rounded all sides; Desktop: rounded-left only, bleeds right */}
            <div className="h-full overflow-hidden rounded-card border border-white lg:rounded-r-none lg:border-r-0">
              <video
                ref={videoRef}
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
                aria-label="Preview of the Foundations of Architecture course platform"
              >
                <source
                  src="/videos/course-preview.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
