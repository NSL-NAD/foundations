import { cn } from "@/lib/utils";
import { getCategoryBySlug } from "@/lib/blog-config";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const cat = getCategoryBySlug(category);
  if (!cat) return null;

  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        cat.colorClass,
        className
      )}
    >
      {cat.label}
    </span>
  );
}
