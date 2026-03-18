import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gfmPlugin = remarkGfm as any;

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string;
  author: {
    name: string;
    slug: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  pillar: string;
  productLink: string;
  status: "draft" | "scheduled" | "published" | "hidden";
  featured: boolean;
  coverImage: string;
  coverImageAlt: string;
  readingTime: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    canonicalUrl: string;
    noIndex: boolean;
  };
  keywords: {
    primary: string;
    secondary: string[];
  };
  externalLinks: string[];
  internalLinks: string[];
  gasStudioMention: boolean;
  content: string;
}

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      updatedAt: data.updatedAt || data.date || "",
      author: data.author || {
        name: "Nic DeMore",
        slug: "nic-demore",
        avatar: "/images/nic-demore.jpg",
      },
      category: data.category || "",
      tags: data.tags || [],
      pillar: data.pillar || "",
      productLink: data.productLink || "https://foacourse.com/#pricing",
      status: data.status || "draft",
      featured: data.featured || false,
      coverImage: data.coverImage || "",
      coverImageAlt: data.coverImageAlt || "",
      readingTime: stats.text,
      seo: {
        metaTitle: data.seo?.metaTitle || data.title || "",
        metaDescription: data.seo?.metaDescription || data.description || "",
        ogImage: data.seo?.ogImage || data.coverImage || "",
        canonicalUrl:
          data.seo?.canonicalUrl || `https://www.foacourse.com/blog/${slug}`,
        noIndex: data.seo?.noIndex || false,
      },
      keywords: {
        primary: data.keywords?.primary || "",
        secondary: data.keywords?.secondary || [],
      },
      externalLinks: data.externalLinks || [],
      internalLinks: data.internalLinks || [],
      gasStudioMention: data.gasStudioMention || false,
      content,
    } as BlogPost;
  });
}

function isPostVisible(post: BlogPost): boolean {
  if (post.status === "published") return true;
  if (post.status === "scheduled") {
    const today = new Date().toISOString().split("T")[0];
    return post.date <= today;
  }
  return false;
}

export function getPublishedPosts(): BlogPost[] {
  return readAllPosts()
    .filter(isPostVisible)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const post: BlogPost = {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    updatedAt: data.updatedAt || data.date || "",
    author: data.author || {
      name: "Nic DeMore",
      slug: "nic-demore",
      avatar: "/images/nic-demore.jpg",
    },
    category: data.category || "",
    tags: data.tags || [],
    pillar: data.pillar || "",
    productLink: data.productLink || "https://foacourse.com/#pricing",
    status: data.status || "draft",
    featured: data.featured || false,
    coverImage: data.coverImage || "",
    coverImageAlt: data.coverImageAlt || "",
    readingTime: stats.text,
    seo: {
      metaTitle: data.seo?.metaTitle || data.title || "",
      metaDescription: data.seo?.metaDescription || data.description || "",
      ogImage: data.seo?.ogImage || data.coverImage || "",
      canonicalUrl:
        data.seo?.canonicalUrl || `https://www.foacourse.com/blog/${slug}`,
      noIndex: data.seo?.noIndex || false,
    },
    keywords: {
      primary: data.keywords?.primary || "",
      secondary: data.keywords?.secondary || [],
    },
    externalLinks: data.externalLinks || [],
    internalLinks: data.internalLinks || [],
    gasStudioMention: data.gasStudioMention || false,
    content,
  };

  if (!isPostVisible(post)) return null;
  return post;
}

export function getAllPosts(): BlogPost[] {
  return readAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlugUnfiltered(slug: string): BlogPost | null {
  const posts = readAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return getPublishedPosts().filter((p) => p.category === categorySlug);
}

export function getFeaturedPost(): BlogPost | null {
  const posts = getPublishedPosts();
  return posts.find((p) => p.featured) || posts[0] || null;
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3
): BlogPost[] {
  return getPublishedPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}

export function getAllPublishedSlugs(): string[] {
  return getPublishedPosts().map((p) => p.slug);
}

export async function getSerializedMdx(content: string) {
  return serialize(content, {
    mdxOptions: { remarkPlugins: [gfmPlugin] },
  });
}
