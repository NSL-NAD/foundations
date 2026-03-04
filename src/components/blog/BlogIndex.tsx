"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BlogCard } from "./BlogCard";
import { CategoryFilter } from "./CategoryFilter";
import type { BlogPost } from "@/lib/blog";

function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const filtered =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      <CategoryFilter />

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No articles in this category yet. Check back soon!
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

interface BlogIndexProps {
  posts: BlogPost[];
}

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <Suspense
      fallback={
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      }
    >
      <BlogGrid posts={posts} />
    </Suspense>
  );
}
