"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (!images || images.length === 0) return null;

  return (
    <figure className="group/carousel relative my-8">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {images.map((image, i) => (
          <div
            key={i}
            className="flex shrink-0 snap-start flex-col"
            style={{ width: images.length === 1 ? "100%" : "clamp(260px, 75%, 480px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt || ""}
              className="h-auto w-full rounded-card object-cover ring-1 ring-foreground/10"
              loading="lazy"
            />
            {image.caption && (
              <figcaption className="mt-1.5 text-xs text-muted-foreground">
                {image.caption}
              </figcaption>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows (hidden when only 1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-1.5 shadow-md ring-1 ring-foreground/10 backdrop-blur transition-opacity ${
              canScrollLeft
                ? "opacity-0 group-hover/carousel:opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-1.5 shadow-md ring-1 ring-foreground/10 backdrop-blur transition-opacity ${
              canScrollRight
                ? "opacity-0 group-hover/carousel:opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </figure>
  );
}
