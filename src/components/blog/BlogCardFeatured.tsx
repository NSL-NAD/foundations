import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CategoryBadge } from "./CategoryBadge";
import { AuthorBadge } from "./AuthorBadge";
import type { BlogPost } from "@/lib/blog";

interface BlogCardFeaturedProps {
  post: BlogPost;
}

export function BlogCardFeatured({ post }: BlogCardFeaturedProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-foreground/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg md:flex-row"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] md:aspect-auto md:w-1/2">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
        <CategoryBadge category={post.category} className="mb-4 self-start" />

        <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors md:text-3xl">
          {post.title}
        </h2>

        <p className="mt-3 text-muted-foreground leading-relaxed">
          {post.description}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <AuthorBadge name={post.author.name} avatar={post.author.avatar} />
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            &middot;
          </span>
          <time
            dateTime={post.date}
            className="text-xs text-muted-foreground"
          >
            {format(new Date(post.date), "MMM d, yyyy")}
          </time>
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            &middot;
          </span>
          <span className="text-xs text-muted-foreground">
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
