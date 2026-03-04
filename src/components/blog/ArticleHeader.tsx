import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { AuthorBadge } from "./AuthorBadge";
import type { BlogPost } from "@/lib/blog";
import { getCategoryBySlug } from "@/lib/blog-config";

interface ArticleHeaderProps {
  post: BlogPost;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  const category = getCategoryBySlug(post.category);

  return (
    <header>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/blog" className="hover:text-primary transition-colors">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link
              href={`/blog?category=${post.category}`}
              className="hover:text-primary transition-colors"
            >
              {category.label}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="truncate text-foreground">{post.title}</span>
      </nav>

      <CategoryBadge category={post.category} className="mb-4" />

      <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {post.description}
      </p>

      <div className="mt-6 flex items-center gap-4">
        <AuthorBadge name={post.author.name} avatar={post.author.avatar} />
        <span className="text-sm text-muted-foreground" aria-hidden="true">
          &middot;
        </span>
        <time dateTime={post.date} className="text-sm text-muted-foreground">
          {format(new Date(post.date), "MMMM d, yyyy")}
        </time>
        <span className="text-sm text-muted-foreground" aria-hidden="true">
          &middot;
        </span>
        <span className="text-sm text-muted-foreground">
          {post.readingTime}
        </span>
      </div>

      {/* Cover image */}
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-img">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </div>
    </header>
  );
}
