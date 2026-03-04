"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { blogCategories } from "@/lib/blog-config";

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category") || "all";

  function handleFilter(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter("all")}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          activeCategory === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-card/80 border border-foreground/10"
        )}
      >
        All
      </button>
      {blogCategories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleFilter(cat.slug)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            activeCategory === cat.slug
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-card/80 border border-foreground/10"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
