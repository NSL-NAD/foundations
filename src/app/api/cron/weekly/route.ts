import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { generateIdeas, generateBlogIdeas } from "@/lib/social/generate-ideas";

export const maxDuration = 300;

interface PastDuePR {
  number: number;
  title: string;
  branch: string;
  scheduledDate: string;
  url: string;
}

/**
 * Parse a date from a PR title or branch name.
 * Looks for patterns like: 2026-03-15, 03-15-2026, march-15-2026, etc.
 */
function parseDateFromString(str: string): Date | null {
  // ISO-style: 2026-03-15
  const isoMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00Z`);
  }

  // US-style: 03-15-2026
  const usMatch = str.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (usMatch) {
    return new Date(`${usMatch[3]}-${usMatch[1]}-${usMatch[2]}T00:00:00Z`);
  }

  // Month name: march-15-2026 or march-15
  const monthNames =
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[/-](\d{1,2})(?:[/-](\d{4}))?\b/i;
  const monthMatch = str.match(monthNames);
  if (monthMatch) {
    const monthStr = monthMatch[1];
    const day = monthMatch[2];
    const year = monthMatch[3] || new Date().getFullYear().toString();
    const dateStr = `${monthStr} ${day}, ${year}`;
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

async function checkBlogPRs(): Promise<PastDuePR[]> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    console.warn("GITHUB_TOKEN not set — skipping blog PR health check");
    return [];
  }

  const octokit = new Octokit({ auth: token });
  const owner = "NSL-NAD";
  const repo = "foundations";

  const { data: pulls } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
    per_page: 100,
  });

  const now = new Date();
  const pastDue: PastDuePR[] = [];

  for (const pr of pulls) {
    const branch = pr.head.ref;
    const title = pr.title;

    // Only check blog-related PRs
    const isBlogPR =
      branch.startsWith("blog/") ||
      title.toLowerCase().includes("blog") ||
      parseDateFromString(branch) !== null ||
      parseDateFromString(title) !== null;

    if (!isBlogPR) continue;

    const dateFromBranch = parseDateFromString(branch);
    const dateFromTitle = parseDateFromString(title);
    const scheduledDate = dateFromBranch || dateFromTitle;

    if (scheduledDate && scheduledDate < now) {
      pastDue.push({
        number: pr.number,
        title: pr.title,
        branch,
        scheduledDate: scheduledDate.toISOString().split("T")[0],
        url: pr.html_url,
      });
    }
  }

  if (pastDue.length > 0) {
    console.warn(
      `⚠️ Found ${pastDue.length} past-due blog PR(s):`,
      pastDue.map((p) => `#${p.number} "${p.title}" (due ${p.scheduledDate})`)
    );
  }

  return pastDue;
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Part A: Blog health check
    const pastDuePRs = await checkBlogPRs();

    // Part B: Generate 5 ideas per platform (LI, X, IG)
    const socialResult = await generateIdeas({
      platforms: ["linkedin", "x", "instagram"],
      ideasPerPlatform: 5,
      source: "weekly-cron",
    });

    // Part C: Generate 5 blog topic ideas
    const blogResult = await generateBlogIdeas({
      count: 5,
      source: "weekly-cron",
    });

    return NextResponse.json({
      success: true,
      socialIdeasGenerated: socialResult.count,
      blogIdeasGenerated: blogResult.count,
      pastDuePRs,
    });
  } catch (error) {
    console.error("Weekly cron error:", error);
    return NextResponse.json(
      { error: "Weekly cron failed", details: String(error) },
      { status: 500 }
    );
  }
}
