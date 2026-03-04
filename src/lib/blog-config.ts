export interface BlogCategory {
  slug: string;
  label: string;
  description: string;
  colorClass: string;
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "architecture-education",
    label: "Architecture Education",
    description: "Foundational concepts explained in plain English",
    colorClass: "bg-primary/10 text-primary",
  },
  {
    slug: "dream-home-inspiration",
    label: "Dream Home",
    description: "Design inspiration and planning guides",
    colorClass: "bg-accent/10 text-accent",
  },
  {
    slug: "behind-the-scenes",
    label: "Behind the Scenes",
    description: "Building FOA Course in public",
    colorClass: "bg-brass/20 text-foreground",
  },
  {
    slug: "ai-design-tools",
    label: "AI + Design Tools",
    description: "Modern tools for architectural visualization",
    colorClass: "bg-primary/10 text-primary",
  },
  {
    slug: "course-highlights",
    label: "Course Highlights",
    description: "A preview of what's inside FOA Course",
    colorClass: "bg-accent/10 text-accent",
  },
  {
    slug: "homebuilding-process",
    label: "Homebuilding Process",
    description: "Navigating permits, professionals, and timelines",
    colorClass: "bg-brass/20 text-foreground",
  },
];

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export const blogConfig = {
  postsPerPage: 12,
  baseUrl: "https://foacourse.com/blog",
  rssTitle: "FOA Course Blog",
  rssDescription:
    "Architecture education, dream home inspiration, and design thinking from Foundations of Architecture.",
};
