"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CourseCTACard } from "./CourseCTACard";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function ArticleSidebar() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector(".prose-blog");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements).map((el) => {
      // Ensure each heading has an id for scroll targeting
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "";
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      };
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return <CourseCTACard />;

  return (
    <div className="flex flex-col gap-8">
      {/* Table of Contents */}
      <nav aria-label="Table of contents">
        <h4 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
          On This Page
        </h4>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "block text-sm transition-colors hover:text-primary",
                  h.level === 3 && "pl-3",
                  activeId === h.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <CourseCTACard />
    </div>
  );
}
