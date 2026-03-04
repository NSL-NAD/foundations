import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-foreground/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <CategoryBadge category={post.category} className="mb-3 self-start" />

        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
          <time dateTime={post.date}>
            {format(new Date(post.date), "MMM d, yyyy")}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
