import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthorBadgeProps {
  name: string;
  avatar: string;
  className?: string;
}

export function AuthorBadge({ name, avatar, className }: AuthorBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-6 w-6 overflow-hidden rounded-full bg-muted">
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
          sizes="24px"
        />
      </div>
      <span className="text-sm text-muted-foreground">{name}</span>
    </div>
  );
}
