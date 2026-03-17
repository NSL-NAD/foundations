"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search,
  Key,
  Trophy,
  Users,
  Map,
  BarChart2,
  DollarSign,
  Link,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export interface StrategySection {
  id: string;
  section_key: string;
  section_number: number;
  title: string;
  content: Record<string, unknown>;
  summary: string | null;
  researched_at: string | null;
  status: "pending" | "researching" | "complete" | "error";
  created_at: string;
  updated_at: string;
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "seo-audit": Search,
  "keyword-universe": Key,
  competitive: Trophy,
  audience: Users,
  "customer-journey": Map,
  "platform-strategy": BarChart2,
  "paid-acquisition": DollarSign,
  partnerships: Link,
  "content-calendar": Calendar,
};

const sectionPlaceholders: Record<string, string> = {
  "seo-audit":
    "Schema markup validation, meta title/description audit, page speed and Core Web Vitals, sitemap and indexation status",
  "keyword-universe":
    "Current keyword rankings from GSC, page 2 opportunities (positions 11-20), gap keywords, trending searches in home design and architecture",
  competitive:
    "Top 5 competitors analyzed, content gaps identified, white space opportunities for FOA",
  audience:
    "2-3 detailed buyer personas, demographics and behaviors, per-platform audience analysis",
  "customer-journey":
    "Discovery to purchase touchpoint map, funnel gap analysis, CTA recommendations per stage",
  "platform-strategy":
    "Per-channel strategy for LinkedIn, X, Instagram, Pinterest, and community platforms including Reddit and Houzz",
  "paid-acquisition":
    "Google Ads keyword targets and CPCs, Pinterest and Reddit Ads strategy, budget sequencing by revenue milestone",
  partnerships:
    "Tiered partner list with audience sizes, POC research, and outreach email templates for top 3 targets",
  "content-calendar":
    "4-week content plan: blog topics with target keywords, LinkedIn posts, X posts, and Instagram posts grounded in research",
};

function StatusBadge({ status }: { status: StrategySection["status"] }) {
  if (status === "complete") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
        Complete
      </span>
    );
  }
  if (status === "researching") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 animate-pulse">
        Researching
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
        Error
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
      Pending
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-3 top-3 rounded-md border border-border/50 bg-background/80 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title="Copy section markdown"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function StrategyTab({ sections }: { sections: StrategySection[] }) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  function toggleSection(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll() {
    setExpandedKeys((prev) => {
      if (prev.size === sections.length) return new Set();
      return new Set(sections.map((s) => s.section_key));
    });
  }

  const allExpanded = expandedKeys.size === sections.length;

  const latestResearch = sections
    .filter((s) => s.researched_at)
    .sort(
      (a, b) =>
        new Date(b.researched_at!).getTime() -
        new Date(a.researched_at!).getTime()
    )[0]?.researched_at;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
            FOA Strategy Baseline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {latestResearch
              ? `Last researched: ${format(new Date(latestResearch), "MMM d, yyyy 'at' h:mm a")}`
              : "Research pending"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAll}
            className="text-xs text-muted-foreground"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Run Research
          </Button>
        </div>
      </div>

      {/* Section Cards */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedKeys.has(section.section_key);
          const Icon = sectionIcons[section.section_key];
          const placeholder = sectionPlaceholders[section.section_key];
          const isComplete = section.status === "complete";
          const markdown =
            isComplete && section.content?.markdown
              ? String(section.content.markdown)
              : null;

          return (
            <Card
              key={section.section_key}
              className={`overflow-hidden border-border/50 transition-colors hover:border-border ${
                isComplete ? "border-l-2 border-l-[#C4704F]" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.section_key)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                {/* Section number badge */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C4704F]/15 text-xs font-bold text-[#C4704F]">
                  {String(section.section_number).padStart(2, "0")}
                </span>

                {/* Icon */}
                {Icon && (
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                {/* Title + status + summary */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm">
                      {section.title}
                    </span>
                    <StatusBadge status={section.status} />
                  </div>
                  {!isExpanded && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {section.summary || placeholder || ""}
                    </p>
                  )}
                </div>

                {/* Chevron */}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <CardContent className="border-t px-5 pb-5 pt-4">
                  {isComplete && markdown ? (
                    <div className="relative">
                      <CopyButton text={markdown} />
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {markdown}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        This section will contain
                      </p>
                      <ul className="space-y-2">
                        {(placeholder || "").split(", ").map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C4704F]/40" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
