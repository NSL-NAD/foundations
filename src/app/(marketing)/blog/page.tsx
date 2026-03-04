import type { Metadata } from "next";
import { getPublishedPosts, getFeaturedPost } from "@/lib/blog";
import { BlogCardFeatured } from "@/components/blog/BlogCardFeatured";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog | FOA Course",
  description:
    "Architecture education, dream home inspiration, and design thinking from Foundations of Architecture.",
  openGraph: {
    title: "Blog | FOA Course",
    description:
      "Architecture education, dream home inspiration, and design thinking from Foundations of Architecture.",
  },
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  const featured = getFeaturedPost();

  // Exclude featured post from the main grid
  const gridPosts = featured
    ? posts.filter((p) => p.slug !== featured.slug)
    : posts;

  return (
    <div className="container py-12 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
          Blog
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Architecture education, dream home inspiration, and design thinking.
        </p>
      </div>

      {/* Featured article */}
      {featured && (
        <div className="mb-12">
          <BlogCardFeatured post={featured} />
        </div>
      )}

      {/* Category filter + grid */}
      <BlogIndex posts={gridPosts} />
    </div>
  );
}
