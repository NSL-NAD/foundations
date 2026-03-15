"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "blogs", label: "Blogs" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
] as const;

export function SocialHubNav({ activeTab }: { activeTab: string }) {
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`/admin/social?tab=${tab.key}`}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all",
            activeTab === tab.key
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground/80"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
