"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Key,
  Trophy,
  Users,
  Map,
  BarChart2,
  DollarSign,
  Link as LinkIcon,
  Calendar,
  ChevronDown,
  Download,
  Zap,
  TrendingUp,
  User,
  ArrowRight,
  AlertTriangle,
  Target,
  Lightbulb,
  FileText,
  CheckCircle,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import type { StrategySection } from "@/components/admin/StrategyTab";

// ─── Colors ─────────────────────────────────────────────
const COLORS = {
  terracotta: "#C4704F",
  blue: "#3D7EC4",
  amber: "#E8A94A",
  teal: "#2A9D8F",
  dark: "#0F1923",
  cream: "#F7F3EE",
};

// ─── Icons per section ──────────────────────────────────
const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "seo-audit": Search,
  "keyword-universe": Key,
  competitive: Trophy,
  audience: Users,
  "customer-journey": Map,
  "platform-strategy": BarChart2,
  "paid-acquisition": DollarSign,
  partnerships: LinkIcon,
  "content-calendar": Calendar,
  "strategic-summary": Star,
};

// ─── Nav labels per section ─────────────────────────────
const NAV_LABELS: Record<string, string> = {
  "seo-audit": "SEO",
  "keyword-universe": "Keywords",
  competitive: "Competitors",
  audience: "Audience",
  "customer-journey": "Journey",
  "platform-strategy": "Platforms",
  "paid-acquisition": "Paid",
  partnerships: "Partnerships",
  "content-calendar": "Content",
  "strategic-summary": "Summary",
};

// ─── Count-up hook ──────────────────────────────────────
function useCountUp(target: number, duration = 800, trigger = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!trigger) { setValue(0); return; }
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, trigger]);

  return value;
}

// ─── Animations ─────────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

// ─── Platform SVGs ──────────────────────────────────────
function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
function PinterestLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.635 24 24 18.633 24 12.017 24 5.396 18.635 0 12.017 0z"/>
    </svg>
  );
}
function RedditLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.462.342.342 0 00-.465 0c-.533.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/>
    </svg>
  );
}
function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

// ─── Key Findings Card ──────────────────────────────────
function KeyFindings({ findings }: { findings: string[] }) {
  return (
    <motion.div {...scaleIn} className="mb-6 rounded-xl border p-5"
      style={{
        backgroundColor: `${COLORS.amber}12`,
        borderColor: `${COLORS.amber}40`,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4" style={{ color: COLORS.amber }} />
        <h4 className="font-heading text-sm font-bold tracking-wide uppercase" style={{ color: COLORS.amber }}>
          Key Findings
        </h4>
      </div>
      <ul className="space-y-2">
        {findings.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS.amber }} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Stat Card with count-up ────────────────────────────
function StatCard({ value, label, suffix = "", color, expanded }: {
  value: number; label: string; suffix?: string; color: string; expanded: boolean;
}) {
  const count = useCountUp(value, 800, expanded);
  const size = 80;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = value > 0 ? count / value : 0;
  const offset = circumference * (1 - (pct * value / 100));

  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-4 rounded-xl border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
      style={{ boxShadow: `0 0 24px ${color}18` }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border/30" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset > 0 ? offset : circumference}
          strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <div>
        <div className="font-heading text-3xl font-bold" style={{ color }}>{count}{suffix}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Schema Badge ───────────────────────────────────────
function SchemaBadge({ name, status, color }: { name: string; status: string; color: string }) {
  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 dark:bg-[#0F1923]/50 bg-white">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{status}</div>
      </div>
    </motion.div>
  );
}

// ─── Priority Card ──────────────────────────────────────
function PriorityCard({ rank, title, borderColor }: { rank: number; title: string; borderColor: string }) {
  return (
    <motion.div variants={fadeInUp} className="rounded-lg border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
      style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}
    >
      <div className="flex items-center gap-3">
        <span className="font-heading text-lg font-bold" style={{ color: borderColor }}>#{rank}</span>
        <span className="text-sm">{title}</span>
      </div>
    </motion.div>
  );
}

// ─── Keyword Table ──────────────────────────────────────
const KEYWORDS = [
  { kw: "architecture courses for homeowners", vol: 480, comp: "Low", priority: "High" },
  { kw: "how to work with an architect", vol: 1900, comp: "Medium", priority: "High" },
  { kw: "home design course online", vol: 720, comp: "Medium", priority: "High" },
  { kw: "residential architecture basics", vol: 390, comp: "Low", priority: "High" },
  { kw: "understanding floor plans", vol: 2400, comp: "Medium", priority: "Medium" },
  { kw: "custom home building process", vol: 1600, comp: "Medium", priority: "Medium" },
  { kw: "how to read blueprints homeowner", vol: 880, comp: "Low", priority: "Medium" },
  { kw: "home renovation planning guide", vol: 1200, comp: "High", priority: "Low" },
  { kw: "architect vs designer", vol: 3100, comp: "High", priority: "Low" },
  { kw: "modern home design trends 2026", vol: 5400, comp: "High", priority: "Low" },
];

function priorityColor(p: string) {
  if (p === "High") return COLORS.terracotta;
  if (p === "Medium") return COLORS.blue;
  return COLORS.teal;
}

function KeywordTable() {
  const maxVol = Math.max(...KEYWORDS.map(k => k.vol));
  return (
    <motion.div variants={fadeInUp} className="mb-6 overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Keyword</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Est. Volume</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Competition</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Priority</th>
          </tr>
        </thead>
        <tbody>
          {KEYWORDS.map((k, i) => (
            <tr key={i} className="border-b border-border/30 last:border-0">
              <td className="px-4 py-2.5 font-medium">{k.kw}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-right tabular-nums">{k.vol.toLocaleString()}</span>
                  <div className="h-1.5 w-20 rounded-full bg-border/30">
                    <div className="h-full rounded-full" style={{ width: `${(k.vol / maxVol) * 100}%`, backgroundColor: COLORS.blue }} />
                  </div>
                </div>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{k.comp}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColor(k.priority) }} />
                  <span style={{ color: priorityColor(k.priority) }} className="text-xs font-semibold">{k.priority}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

// ─── Quick Wins (published posts targeting priority keywords) ─
function QuickWinsCallout() {
  const posts = [
    { title: "What Is Architectural Scale", keyword: "exact match keyword", date: "March 1" },
    { title: "How Much Does It Cost to Build a House 2026", keyword: "high-volume TOFU", date: "March 4" },
    { title: "Best AI Tools for Home Design 2026", keyword: "trending cluster, well-timed", date: "March 3" },
  ];
  return (
    <motion.div variants={fadeInUp} className="mt-6 rounded-xl border p-5"
      style={{ backgroundColor: `${COLORS.teal}10`, borderColor: `${COLORS.teal}40` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Target className="h-4 w-4" style={{ color: COLORS.teal }} />
        <h4 className="font-heading text-sm font-bold" style={{ color: COLORS.teal }}>Quick Wins</h4>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">Published posts already targeting priority keywords — optimize and promote these first.</p>
      <div className="flex flex-wrap gap-2">
        {posts.map((p) => (
          <div key={p.title} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-white px-3 py-1.5 dark:bg-[#0F1923]/50">
            <span className="inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
              style={{ backgroundColor: `${COLORS.teal}20`, color: COLORS.teal }}
            >Published</span>
            <span className="text-xs font-medium">{p.title}</span>
            <span className="text-[10px] text-muted-foreground">— {p.keyword}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Trending Topics ────────────────────────────────────
const TRENDS = [
  { name: "Multi-generational Design", desc: "Homes designed for extended family living" },
  { name: "Net-zero Residential", desc: "Energy-neutral custom home planning" },
  { name: "ADU + Guest Houses", desc: "Accessory dwelling units as investment" },
  { name: "Biophilic Interiors", desc: "Nature-integrated home design principles" },
  { name: "Smart Home Integration", desc: "Architectural planning for tech-forward homes" },
  { name: "Aging-in-Place Design", desc: "Universal design for long-term livability" },
];

function TrendingGrid() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TRENDS.map((t, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="group rounded-xl border border-border/50 p-4 transition-shadow hover:shadow-md dark:bg-[#0F1923]/50 bg-white"
          style={{ ["--hover-glow" as string]: `0 0 24px ${COLORS.blue}18` }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${COLORS.blue}18`; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: COLORS.teal }} />
            <span className="font-heading text-sm font-semibold">{t.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Competitor Cards ───────────────────────────────────
const COMPETITORS = [
  { name: "30x40 Design Workshop", stat: 1190000, statLabel: "subscribers", positioning: "Architects-in-training, not homeowners", advantage: "Zero audience overlap" },
  { name: "NEVER TOO SMALL", stat: 3260000, statLabel: "subscribers", positioning: "Small-space architecture inspiration", advantage: "Entertainment, not education" },
  { name: "Florence Is An Architect", stat: 17, statLabel: "subscribers", positioning: "Closest homeowner-facing content", advantage: "17 subscribers, no course" },
  { name: "Udemy (Generic)", stat: 500, statLabel: "max reviews on closest course", positioning: "Generic architecture modules", advantage: "No homeowner-specific curriculum" },
];

function CompetitorCard({ competitor, expanded }: { competitor: typeof COMPETITORS[number]; expanded: boolean }) {
  const count = useCountUp(competitor.stat, 800, expanded);
  return (
    <motion.div variants={fadeInUp}
      className="rounded-xl border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
    >
      <div className="mb-2 font-heading text-sm font-bold">{competitor.name}</div>
      <div className="mb-1 font-heading text-2xl font-bold" style={{ color: COLORS.blue }}>
        {competitor.stat >= 1000000 ? `${(count / 1000000).toFixed(2)}M` : competitor.stat >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString()}
      </div>
      <div className="mb-2 text-xs text-muted-foreground">{competitor.statLabel}</div>
      <p className="mb-2 text-xs text-foreground/70">{competitor.positioning}</p>
      <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${COLORS.teal}20`, color: COLORS.teal }}
      >
        FOA Advantage: {competitor.advantage}
      </span>
    </motion.div>
  );
}

function CompetitorCards({ expanded }: { expanded: boolean }) {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mb-6 grid gap-3 sm:grid-cols-2">
      {COMPETITORS.map((c, i) => (
        <CompetitorCard key={i} competitor={c} expanded={expanded} />
      ))}
    </motion.div>
  );
}

// ─── White Space Callout ────────────────────────────────
function WhiteSpaceCallout() {
  return (
    <motion.div variants={fadeInUp} className="rounded-xl border p-5"
      style={{ backgroundColor: `${COLORS.teal}10`, borderColor: `${COLORS.teal}40` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Target className="h-4 w-4" style={{ color: COLORS.teal }} />
        <h4 className="font-heading text-sm font-bold" style={{ color: COLORS.teal }}>The Gap</h4>
      </div>
      <p className="text-sm text-foreground/80">
        No comprehensive online course teaching homeowners (not architects) how to confidently engage with the design + build process. FOA owns this niche.
      </p>
    </motion.div>
  );
}

// ─── Strategic Implication (Competitive) ────────────────
function StrategicImplicationCallout() {
  return (
    <motion.div variants={fadeInUp} className="mt-4 rounded-xl border p-5"
      style={{ backgroundColor: `${COLORS.blue}10`, borderColor: `${COLORS.blue}40` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" style={{ color: COLORS.blue }} />
        <h4 className="font-heading text-sm font-bold" style={{ color: COLORS.blue }}>Strategic Implication</h4>
      </div>
      <p className="text-sm text-foreground/80">
        30x40 Design Workshop serves architects-in-training (supply side). FOA serves homeowners who will hire those architects (demand side). Audiences barely overlap — potential affiliate or cross-promotion opportunity. Eric Reinholdt also hosts a separate podcast on architecture entrepreneurship.
      </p>
    </motion.div>
  );
}

// ─── Key Stat Callout (Audience) ────────────────────────
function KeyStatCallout() {
  return (
    <motion.div variants={fadeInUp} className="mb-6 rounded-xl border p-6"
      style={{ backgroundColor: `${COLORS.terracotta}08`, borderColor: `${COLORS.terracotta}40` }}
    >
      <div className="flex items-start gap-4">
        <div className="font-heading text-5xl font-bold" style={{ color: COLORS.terracotta }}>22%</div>
        <div>
          <p className="text-sm text-foreground/80">
            of homeowners report difficulty visualizing finished spaces before renovation — maps directly to FOA&apos;s how-to-read-drawings curriculum.
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Source: Houzz Q1 2026 Renovation Barometer</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Persona Cards ──────────────────────────────────────
const PERSONAS = [
  {
    name: "The Planner",
    color: COLORS.terracotta,
    tags: ["30-45", "HHI $150K+", "Pre-build"],
    quote: "I have the budget but zero idea how to talk to an architect without getting steamrolled.",
    platforms: ["LinkedIn", "Pinterest", "Reddit"],
    secondaryPlatform: { name: "X", rationale: "Secondary — Hook/Provoke pillar, smaller but engaged architecture community." },
  },
  {
    name: "The Researcher",
    color: COLORS.blue,
    tags: ["35-50", "HHI $200K+", "Custom build"],
    quote: "I spent 80 hours on Houzz and still don't know what questions to ask my contractor.",
    platforms: ["Reddit", "YouTube", "Instagram"],
    secondaryPlatform: { name: "X", rationale: "Secondary — Hook/Provoke pillar, smaller but engaged architecture community." },
  },
  {
    name: "The Renovator",
    color: COLORS.teal,
    tags: ["40-55", "HHI $175K+", "Major renovation"],
    quote: "My architect speaks a different language. I need a translator.",
    platforms: ["Pinterest", "Instagram", "LinkedIn"],
    secondaryPlatform: { name: "X", rationale: "Secondary — Hook/Provoke pillar, smaller but engaged architecture community." },
  },
];

function PersonaCards() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mb-6 grid gap-4 md:grid-cols-3">
      {PERSONAS.map((p, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="rounded-xl border border-border/50 p-5 dark:bg-[#0F1923]/50 bg-white"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${p.color}20` }}>
              <User className="h-5 w-5" style={{ color: p.color }} />
            </div>
            <h4 className="font-heading text-sm font-bold">{p.name}</h4>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{t}</span>
            ))}
          </div>
          <p className="mb-3 text-xs italic text-foreground/70">&ldquo;{p.quote}&rdquo;</p>
          <div className="flex flex-wrap gap-1.5">
            {p.platforms.map((pl) => (
              <span key={pl} className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] font-medium">{pl}</span>
            ))}
            <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
              style={{ borderColor: `${COLORS.amber}60`, color: COLORS.amber }}
              title={p.secondaryPlatform.rationale}
            >
              {p.secondaryPlatform.name}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Platform Audience Row ──────────────────────────────
const PLATFORM_AUDIENCES = [
  { name: "LinkedIn", desc: "Decision-makers researching home investments. Long-form thought leadership.", logo: LinkedInLogo },
  { name: "X", desc: "Hot takes on architecture misconceptions. Quick engagement loops.", logo: XLogo },
  { name: "Instagram", desc: "Visual inspiration seekers. Reels for reach, carousels for saves.", logo: InstagramLogo },
  { name: "Pinterest", desc: "High-intent planners saving ideas for upcoming builds.", logo: PinterestLogo },
  { name: "Reddit", desc: "Research-heavy buyers in r/architecture and r/homebuilding.", logo: RedditLogo },
];

function PlatformAudienceRow() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {PLATFORM_AUDIENCES.map((p, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="rounded-xl border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
        >
          <div className="mb-2 flex items-center gap-2">
            <p.logo className="h-4 w-4" />
            <span className="text-xs font-semibold">{p.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{p.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Funnel ─────────────────────────────────────────────
const FUNNEL_STAGES = [
  { label: "Awareness", desc: "Blog SEO, Pinterest, social content", tool: "Organic content", color: COLORS.teal },
  { label: "Consideration", desc: "Lead magnet, email nurture, Reels", tool: "Email + retargeting", color: COLORS.blue },
  { label: "Purchase", desc: "Sales page, testimonials, urgency", tool: "Course checkout", color: COLORS.amber },
  { label: "Advocacy", desc: "Student wins, referral program", tool: "Community + UGC", color: COLORS.terracotta },
];

function FunnelVisual() {
  return (
    <motion.div variants={fadeInUp} className="mb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {FUNNEL_STAGES.map((s, i) => (
          <div key={i} className="flex flex-1 items-center gap-0">
            <div className="flex-1 rounded-xl border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
              style={{ borderTopWidth: 3, borderTopColor: s.color }}
            >
              <div className="font-heading text-sm font-bold" style={{ color: s.color }}>{s.label}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              <p className="mt-1 text-[10px] font-medium text-foreground/50">{s.tool}</p>
            </div>
            {i < FUNNEL_STAGES.length - 1 && (
              <ArrowRight className="mx-1 hidden h-4 w-4 shrink-0 text-muted-foreground/40 md:block" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Funnel Gap Cards ───────────────────────────────────
const FUNNEL_GAPS = [
  { title: "No email capture", desc: "Every blog visitor leaves with no way to return" },
  { title: "No retargeting pixel", desc: "Cannot build lookalike audiences from site traffic" },
  { title: "No social proof yet", desc: "No testimonials, case studies, or student wins to showcase" },
];

function FunnelGapCards() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-3">
      {FUNNEL_GAPS.map((g, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="rounded-xl border p-4 dark:bg-[#0F1923]/50 bg-white"
          style={{ borderColor: `${COLORS.amber}40` }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: COLORS.amber }} />
            <span className="text-sm font-semibold">{g.title}</span>
          </div>
          <p className="text-xs text-muted-foreground">{g.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Leaking Funnel Callout Cards (enrichment) ──────────
function LeakingFunnelCards() {
  const leaks = [
    { title: "No email capture", desc: "Every blog visitor leaves permanently. Highest-priority funnel fix.", borderColor: COLORS.amber },
    { title: "No retargeting pixel", desc: "Visitors cannot be re-engaged with paid ads. Install Meta Pixel + Google Tag immediately.", borderColor: COLORS.blue },
    { title: "No social proof yet", desc: "Validate content pillar on hold until first enrolled student.", borderColor: COLORS.teal },
  ];
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mt-6 grid gap-3 sm:grid-cols-3">
      {leaks.map((l, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="rounded-xl border-2 p-4 dark:bg-[#0F1923]/50 bg-white"
          style={{ borderColor: `${l.borderColor}60` }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: l.borderColor }} />
            <span className="text-sm font-bold" style={{ color: l.borderColor }}>{l.title}</span>
          </div>
          <p className="text-xs text-foreground/70">{l.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Weekly Cadence Bar (Platform Strategy enrichment) ───
function WeeklyCadenceBar() {
  const cadences = [
    { name: "LinkedIn", logo: LinkedInLogo, cadence: "3-4x/week" },
    { name: "X", logo: XLogo, cadence: "5x/week" },
    { name: "Instagram", logo: InstagramLogo, cadence: "3-4x/week" },
    { name: "Pinterest", logo: PinterestLogo, cadence: "5-10 pins/week" },
    { name: "Reddit", logo: RedditLogo, cadence: "2x/month" },
  ];
  return (
    <motion.div variants={fadeInUp} className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
      <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Weekly Cadence</h4>
      <div className="flex flex-wrap gap-3">
        {cadences.map((c) => (
          <div key={c.name} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-white px-3 py-1.5 dark:bg-[#0F1923]/50">
            <c.logo className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">{c.name}</span>
            <span className="text-[10px] text-muted-foreground">{c.cadence}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Platform Strategy Cards ────────────────────────────
const PLATFORMS = [
  {
    name: "LinkedIn", logo: LinkedInLogo, hoverColor: "#0A66C2",
    cadence: "3-4x/week",
    bullets: ["Single images dominate (62.7% of top content)", "Thought leadership + industry POV", "CTA: comment or save, not click"],
  },
  {
    name: "X (Twitter)", logo: XLogo, hoverColor: "#000000",
    cadence: "5x/week",
    bullets: ["Thread format for education", "Quote-tweet industry news with hot takes", "CTA: follow + bookmark"],
  },
  {
    name: "Instagram", logo: InstagramLogo, hoverColor: "#E4405F",
    cadence: "3-4x/week",
    bullets: ["Reels 15-30s for reach (80%+ watch)", "Carousels for saves and shares", "CTA: save this for later"],
  },
  {
    name: "Pinterest", logo: PinterestLogo, hoverColor: "#BD081C",
    cadence: "5-10 pins/week",
    bullets: ["40% YoY increase in home design saves", "Long-tail evergreen traffic driver", "CTA: click through to blog"],
  },
  {
    name: "Reddit", logo: RedditLogo, hoverColor: "#FF4500",
    cadence: "2x/month",
    bullets: ["Highest-trust discovery channel", "Value-first, never self-promote directly", "CTA: helpful answers with profile link"],
  },
  {
    name: "YouTube", logo: YouTubeLogo, hoverColor: "#FF0000",
    cadence: "1-2x/month",
    bullets: ["Long-form explainer content", "SEO-rich titles for search discovery", "CTA: subscribe + course link in description"],
  },
];

function PlatformStrategyGrid() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PLATFORMS.map((p, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="group rounded-xl border border-border/50 p-4 transition-shadow dark:bg-[#0F1923]/50 bg-white"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${p.hoverColor}18`; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p.logo className="h-5 w-5" />
              <span className="font-heading text-sm font-bold">{p.name}</span>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{p.cadence}</span>
          </div>
          <ul className="space-y-1.5">
            {p.bullets.map((b, j) => (
              <li key={j} className="flex items-start gap-2 text-xs text-foreground/70">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Budget Timeline ────────────────────────────────────
const PHASES = [
  { phase: "Phase 1", trigger: "0 sales", title: "Organic Only", desc: "Build retargeting audiences with Meta Pixel + Google Tag", color: COLORS.teal },
  { phase: "Phase 2", trigger: "5+ sales", title: "Pinterest Ads $300/mo", desc: "MOFU campaigns to lead magnet — women 25-54 at 2-3x lower CPM", color: COLORS.blue },
  { phase: "Phase 3", trigger: "3x ROAS", title: "Google Ads $500/mo", desc: "Search intent campaigns — manual CPC after 50+ conversion events", color: COLORS.terracotta },
];

function BudgetTimeline() {
  return (
    <motion.div variants={fadeInUp} className="mb-6">
      <div className="relative grid gap-4 md:grid-cols-3">
        {/* connecting line */}
        <div className="absolute left-6 top-0 hidden h-full w-0.5 md:left-0 md:top-1/2 md:h-0.5 md:w-full" style={{ backgroundColor: `${COLORS.terracotta}30` }} />
        {PHASES.map((p, i) => (
          <div key={i} className="relative flex flex-col">
            <div className="flex h-full flex-col rounded-xl border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
              style={{ borderTopWidth: 3, borderTopColor: p.color }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.phase}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{p.trigger}</span>
              </div>
              <div className="font-heading text-sm font-bold">{p.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── CPC Table ──────────────────────────────────────────
const CPC_DATA = [
  { platform: "Google Search", format: "Text ads", cpc: "$1.50-3.00", audience: "Intent-based searchers", notes: "Wait for 50+ conversions" },
  { platform: "Pinterest", format: "Promoted Pins", cpc: "$0.10-0.50", audience: "Women 25-54 planning homes", notes: "2-3x lower CPM than IG" },
  { platform: "Reddit", format: "Promoted posts", cpc: "$0.20-0.80", audience: "r/homebuilding, r/architecture", notes: "High trust, niche targeting" },
  { platform: "Meta Retargeting", format: "Carousel + video", cpc: "$0.30-1.00", audience: "Site visitors (pixel)", notes: "2-4x more efficient than cold" },
];

function CPCTable() {
  return (
    <motion.div variants={fadeInUp} className="overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Platform</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Format</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Est. CPC</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Audience</th>
            <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Notes</th>
          </tr>
        </thead>
        <tbody>
          {CPC_DATA.map((r, i) => (
            <tr key={i} className="border-b border-border/30 last:border-0">
              <td className="px-4 py-2.5 font-medium">{r.platform}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{r.format}</td>
              <td className="px-4 py-2.5 font-mono text-xs" style={{ color: COLORS.blue }}>{r.cpc}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.audience}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

// ─── Partnership Tiers ──────────────────────────────────
const TIERS = [
  {
    tier: "Tier 1 — Dream",
    color: COLORS.terracotta,
    glow: true,
    partners: ["Architectural Digest", "Dwell Magazine", "30x40 Design Workshop", "Houzz Pro"],
  },
  {
    tier: "Tier 2 — Reachable",
    color: COLORS.blue,
    glow: false,
    partners: ["ArchDaily", "Business of Architecture Podcast", "Build Show Network", "Young House Love"],
  },
  {
    tier: "Tier 3 — Grassroots",
    color: COLORS.teal,
    glow: false,
    partners: ["Local AIA chapters", "Houzz Ideabook contributor", "Reddit AMAs", "Home design Facebook groups"],
  },
];

function PartnershipTiers() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mb-6 space-y-3">
      {TIERS.map((t, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="rounded-xl border border-border/50 p-4 dark:bg-[#0F1923]/50 bg-white"
          style={{
            borderLeftWidth: 3,
            borderLeftColor: t.color,
            boxShadow: t.glow ? `0 0 24px ${t.color}18` : "none",
          }}
        >
          <h4 className="mb-3 font-heading text-sm font-bold" style={{ color: t.color }}>{t.tier}</h4>
          <div className="flex flex-wrap gap-2">
            {t.partners.map((p) => (
              <span key={p} className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs font-medium">{p}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Quick Wins — Zero Budget (Partnerships enrichment) ─
function PartnershipQuickWins() {
  const wins = [
    { name: "ArchDaily", desc: "Free editorial project submission. High-value backlink, zero cost. Submit an educational article via archdaily.com editorial portal." },
    { name: "Houzz", desc: "Create FOA Pro profile and build Ideabook collections. Organic Houzz discovery at zero cost via Houzz community." },
    { name: "Eric Reinholdt (30x40)", desc: "Hosts both 30x40 Design Workshop AND a separate architecture entrepreneurship podcast. Two distinct outreach opportunities with one creator." },
  ];
  return (
    <motion.div variants={fadeInUp} className="mt-6 rounded-xl border-2 p-5"
      style={{ borderColor: `${COLORS.teal}60` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle className="h-4 w-4" style={{ color: COLORS.teal }} />
        <h4 className="font-heading text-sm font-bold" style={{ color: COLORS.teal }}>3 Quick Wins — Zero Budget</h4>
      </div>
      <div className="space-y-3">
        {wins.map((w, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: COLORS.teal }}
            >{i + 1}</span>
            <div>
              <span className="text-sm font-semibold">{w.name}</span>
              <p className="mt-0.5 text-xs text-foreground/70">{w.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Outreach Templates ─────────────────────────────────
const OUTREACH_TEMPLATES = [
  {
    tier: "Tier 1 — Dream Partners",
    preview: "High-touch, personalized outreach for premium publications and influencers...",
    content: `Subject: Collaboration: Architecture Education for Homeowners

Hi [Name],

I'm Nic, founder of Foundations of Architecture — the first online course designed to teach homeowners how to confidently navigate the design and build process.

I've followed [Publication/Channel] for years and believe there's a natural alignment between your audience and what we're building. We're not training architects — we're empowering the people who hire them.

Would you be open to a quick conversation about how we might collaborate? I'm thinking [guest article / podcast appearance / co-created content] that would genuinely serve your audience.

Best,
Nic DeMore
Foundations of Architecture`,
  },
  {
    tier: "Tier 2 — Reachable Partners",
    preview: "Value-forward outreach with specific content ideas and mutual benefit...",
    content: `Subject: Guest Contribution Idea — Architecture for Non-Architects

Hi [Name],

I run Foundations of Architecture — an online course helping homeowners understand residential design before they hire an architect.

I'd love to contribute a piece to [Platform] on [specific topic, e.g., "5 Questions Every Homeowner Should Ask Before Hiring an Architect"]. It's a topic I see constant demand for and that your audience would find immediately useful.

Happy to tailor the angle to fit your editorial style. Here's a link to our blog for context: foacourse.com/blog

Thanks for considering,
Nic`,
  },
  {
    tier: "Tier 3 — Grassroots Partners",
    preview: "Community-first engagement, no hard pitch, pure value contribution...",
    content: `Subject: Happy to Contribute — Architecture Education Resources

Hi [Moderator/Organizer],

I'm Nic, an architect who created Foundations of Architecture — a course for homeowners learning to navigate the design process.

I noticed your [community/group/chapter] discusses topics I specialize in. I'd love to contribute — whether that's answering questions, doing a Q&A session, or sharing a resource guide your members could use.

No pitch, just genuinely want to help. Let me know if there's interest.

Best,
Nic`,
  },
];

function OutreachAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-2">
      {OUTREACH_TEMPLATES.map((t, i) => (
        <motion.div key={i} variants={fadeInUp}
          className="rounded-xl border border-border/50 dark:bg-[#0F1923]/50 bg-white overflow-hidden"
        >
          <button type="button" onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div>
              <span className="text-sm font-semibold">{t.tier}</span>
              {openIdx !== i && <p className="mt-0.5 text-xs text-muted-foreground">{t.preview}</p>}
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="border-t border-border/30 px-4 py-3">
                  <pre className="whitespace-pre-wrap text-xs text-foreground/80 font-sans">{t.content}</pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Content Calendar ───────────────────────────────────
const PILLAR_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  educate: { bg: `${COLORS.teal}20`, text: COLORS.teal, label: "Educate" },
  inspire: { bg: `${COLORS.blue}20`, text: COLORS.blue, label: "Inspire" },
  empower: { bg: `${COLORS.terracotta}20`, text: COLORS.terracotta, label: "Empower" },
  hook: { bg: `${COLORS.amber}20`, text: COLORS.amber, label: "Hook/Provoke" },
  process: { bg: "rgba(100,116,139,0.15)", text: "#64748b", label: "Process" },
  beforeafter: { bg: "rgba(168,162,158,0.15)", text: "#a8a29e", label: "Before/After" },
};

const CALENDAR: { channel: string; weeks: { topic: string; pillar: string }[] }[] = [
  {
    channel: "Blog Post",
    weeks: [
      { topic: "What Does an Architect Actually Do?", pillar: "educate" },
      { topic: "5 Questions Before Hiring an Architect", pillar: "empower" },
      { topic: "How to Read a Floor Plan", pillar: "educate" },
      { topic: "Why FOA Exists: From Architect to Educator", pillar: "inspire" },
    ],
  },
  {
    channel: "LinkedIn",
    weeks: [
      { topic: "The homeowner knowledge gap is real", pillar: "hook" },
      { topic: "What I learned from 50 client conversations", pillar: "inspire" },
      { topic: "Floor plan literacy = project confidence", pillar: "educate" },
      { topic: "Enrollment opens: here's what students get", pillar: "empower" },
    ],
  },
  {
    channel: "X (Twitter)",
    weeks: [
      { topic: "Architects aren't taught to teach clients", pillar: "hook" },
      { topic: "Thread: the custom home process in 10 steps", pillar: "process" },
      { topic: "Before/after: floor plan that saved $40K", pillar: "beforeafter" },
      { topic: "Course launch thread with enrollment link", pillar: "empower" },
    ],
  },
  {
    channel: "Instagram",
    weeks: [
      { topic: "Reel: 3 things your architect won't tell you", pillar: "hook" },
      { topic: "Carousel: anatomy of a great floor plan", pillar: "educate" },
      { topic: "Reel: before/after walkthrough", pillar: "beforeafter" },
      { topic: "Story series: student transformation", pillar: "inspire" },
    ],
  },
];

function ContentCalendar() {
  return (
    <motion.div variants={fadeInUp}>
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.values(PILLAR_COLORS).map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: p.bg, color: p.text }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.text }} />
            {p.label}
          </span>
        ))}
      </div>
      {/* Grid */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Channel</th>
              {[1, 2, 3, 4].map((w) => (
                <th key={w} className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider text-muted-foreground">Week {w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CALENDAR.map((row, i) => (
              <tr key={i} className="border-b border-border/30 last:border-0">
                <td className="px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{row.channel}</td>
                {row.weeks.map((cell, j) => {
                  const pillar = PILLAR_COLORS[cell.pillar];
                  return (
                    <td key={j} className="px-3 py-2">
                      <div className="rounded-lg border border-border/30 p-2.5 dark:bg-[#0F1923]/30 bg-white/50">
                        <p className="mb-1.5 text-xs leading-tight">{cell.topic}</p>
                        <span className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold"
                          style={{ backgroundColor: pillar.bg, color: pillar.text }}
                        >{pillar.label}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Emerging Pillars Callout ────────────────────────────
function EmergingPillarsCallout() {
  return (
    <motion.div variants={fadeInUp} className="rounded-xl border p-5"
      style={{ backgroundColor: `${COLORS.amber}12`, borderColor: `${COLORS.amber}40` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" style={{ color: COLORS.amber }} />
        <h4 className="font-heading text-sm font-bold" style={{ color: COLORS.amber }}>2 New Pillars Recommended</h4>
      </div>
      <div className="space-y-3 text-sm text-foreground/80">
        <div>
          <strong>Process:</strong> The home build timeline made visual — sequencing, milestones, what to expect. Strongest signal on Reddit (r/Homebuilding), YouTube, and Pinterest.
        </div>
        <div>
          <strong>Before/After:</strong> Decisions made visible, not just aesthetics. Transform &ldquo;before I understood architectural drawings&rdquo; into a content series. High emotional resonance, excellent for ads and Reels.
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section 10: Strategic Summary Components ───────────

function InsightCards() {
  const insights = [
    { title: "First-Mover Advantage", body: "No course exists for homeowner architecture literacy. Closest competitor has 17 subscribers. FOA owns this niche by default — window is finite." },
    { title: "The Funnel Has One Critical Gap", body: "No email capture means every blog visitor is lost permanently. Building the list is the single highest-leverage item remaining." },
    { title: "Organic Search Is Just Getting Started", body: "0 impressions today; www canonical fix deployed March 17. First keyword data in 30-60 days. Strong opportunities in low-competition niche." },
    { title: "Platform Clarity", body: "Instagram and Pinterest are highest-potential visual platforms. LinkedIn for professional credibility. X for reach via Hook/Provoke. Reddit for deep trust-building." },
  ];
  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <h3 className="mb-4 font-heading text-base font-bold">What We Found</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((ins, i) => (
          <motion.div key={i} variants={fadeInUp}
            className="rounded-xl border border-border/50 p-5 dark:bg-[#0F1923]/50 bg-white"
            style={{ boxShadow: `0 0 24px ${COLORS.terracotta}10` }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: COLORS.terracotta }}
              >{i + 1}</span>
              <h4 className="text-sm font-bold">{ins.title}</h4>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">{ins.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PriorityOrderList() {
  const items = [
    { text: "Fix www canonical and submit sitemap to www GSC property", tag: "Done — March 17, 2026", tagColor: COLORS.teal },
    { text: "Build email capture — lead magnet + opt-in on all blog posts (Phase 4.5)", tag: null, tagColor: "" },
    { text: "Execute 4-week content calendar from Section 9 across LI/X/IG", tag: null, tagColor: "" },
    { text: "Set up Pinterest Business account and begin pinning cadence", tag: null, tagColor: "" },
    { text: "Begin Reddit presence — karma-build 2-4 weeks before mentioning FOA", tag: null, tagColor: "" },
    { text: "Install Meta Pixel + Google Tag — start building retargeting audiences immediately", tag: null, tagColor: "" },
    { text: "First enrollment push at 5+ organic sales → activate Pinterest Ads $300/mo", tag: null, tagColor: "" },
    { text: "Tier 3 partnership outreach — Remodelista and ArchDaily editorial submissions (free)", tag: null, tagColor: "" },
    { text: "Re-run Strategy Baseline v3 at 90 days with live GSC data (June 2026)", tag: null, tagColor: "" },
  ];
  return (
    <motion.div variants={fadeInUp} className="mt-8">
      <h3 className="mb-4 font-heading text-base font-bold">Priority Order</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 p-3 dark:bg-[#0F1923]/50 bg-white">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: item.tag ? `${COLORS.teal}20` : `${COLORS.terracotta}15`,
                color: item.tag ? COLORS.teal : COLORS.terracotta,
              }}
            >{i + 1}</span>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <span className="text-sm">{item.text}</span>
              {item.tag && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${item.tagColor}20`, color: item.tagColor }}
                >
                  <CheckCircle className="h-3 w-3" />
                  {item.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NextMilestoneCard() {
  return (
    <motion.div variants={fadeInUp} className="mt-8 rounded-xl border-2 p-6"
      style={{
        borderColor: `${COLORS.terracotta}60`,
        background: `radial-gradient(ellipse at center, ${COLORS.terracotta}08 0%, transparent 70%)`,
      }}
    >
      <h3 className="mb-4 font-heading text-base font-bold">Next Milestone</h3>
      <div className="flex items-start gap-4">
        <div className="font-heading text-6xl font-bold" style={{ color: COLORS.terracotta, textShadow: `0 0 40px ${COLORS.terracotta}30` }}>5</div>
        <div>
          <p className="text-sm font-semibold leading-relaxed">
            First 5 organic course sales. This unlocks paid acquisition (Pinterest Ads) and proves the funnel. Everything before this milestone is foundation-building.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function StrategicSummaryContent() {
  return (
    <div>
      <InsightCards />
      <PriorityOrderList />
      <NextMilestoneCard />
    </div>
  );
}

// ─── Section-specific content map ───────────────────────
const KEY_FINDINGS: Record<string, string[]> = {
  "seo-audit": [
    "0 of 13 submitted pages indexed — www/non-www canonical mismatch is the root cause",
    "Organization, Website, and Course schemas present — sameAs array empty, needs social handles",
    "Article schema on blog posts has parse errors — needs debugging before rich results",
  ],
  "keyword-universe": [
    "No GSC data yet — site pre-index. First real keyword data expected in 30-60 days.",
    "architecture courses for homeowners has low competition and is FOA's exact-match keyword",
    "January-March is peak planning season — FOA launched at the right moment",
  ],
  competitive: [
    "No direct competition — FOA owns the homeowner architecture literacy niche by default",
    "Closest YouTube competitor (Florence Is An Architect) has 17 subscribers",
    "30x40 Design Workshop serves architects-in-training, not homeowners — zero audience overlap",
  ],
  audience: [
    "Primary audience: homeowners 30-50, HHI $150k+, planning custom build or major renovation",
    "22% of homeowners report difficulty visualizing spaces — maps directly to FOA curriculum",
    "Multi-generational design is an underserved content niche with affluent, motivated audience",
  ],
  "customer-journey": [
    "No email capture = every blog visitor leaves forever. Highest-leverage gap in the funnel.",
    "Pinterest traffic has 30-90 day purchase latency — start now to build delayed return pipeline",
    "Reddit is highest-trust discovery channel for the research-heavy buyer persona",
  ],
  "platform-strategy": [
    "LinkedIn: single images dominate at 62.7% of top content — consistent 3-4x/week cadence",
    "Instagram Reels (15-30s) get highest reach — algorithm rewards 80%+ watch completion",
    "Pinterest users saved 40% more home design pins YoY — high-intent planning audience",
  ],
  "paid-acquisition": [
    "Install Meta Pixel + Google Tag immediately — retargeting is 2-4x more efficient than cold traffic",
    "Pinterest Ads reach women 25-54 at 2-3x lower CPM than Instagram for home design",
    "Do not run Google Ads until 50+ conversion events — use manual CPC on Search first",
  ],
  partnerships: [
    "ArchDaily accepts free editorial submissions — high-value backlink with zero budget",
    "Business of Architecture host is Enoch Sears (not Eric Reinholdt — that is 30x40)",
    "Houzz Ideabook as FOA Pro contributor = organic Houzz discovery at zero cost",
  ],
  "content-calendar": [
    "4-week plan grounded in keyword gaps, platform research, and FOA content pillars",
    "Week 4 is conversion week — all content pushes toward enrollment",
    "Blog topics prioritized by keyword opportunity from Section 2",
  ],
  "strategic-summary": [
    "FOA is a first-mover in homeowner architecture literacy — no direct competitor exists",
    "Email capture is the single highest-leverage gap — fix before scaling any channel",
    "First 5 organic sales is the milestone that unlocks paid acquisition",
  ],
};

function SectionContent({ sectionKey, expanded }: { sectionKey: string; expanded: boolean }) {
  switch (sectionKey) {
    case "seo-audit":
      return (
        <motion.div variants={stagger} initial="initial" animate="animate">
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <StatCard value={0} label="Pages Indexed" suffix=" / 13" color={COLORS.terracotta} expanded={expanded} />
            <div className="space-y-2">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Schema Status</h4>
              <div className="grid grid-cols-2 gap-2">
                <SchemaBadge name="Organization" status="Complete" color={COLORS.teal} />
                <SchemaBadge name="Website" status="Complete" color={COLORS.teal} />
                <SchemaBadge name="Course" status="Needs Fix" color={COLORS.terracotta} />
                <SchemaBadge name="Article" status="Error" color={COLORS.amber} />
              </div>
            </div>
          </div>
          <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority Fixes</h4>
          <div className="space-y-2">
            <PriorityCard rank={1} title="Fix www canonical mismatch" borderColor={COLORS.terracotta} />
            <PriorityCard rank={2} title="Debug Article schema parse errors" borderColor={COLORS.blue} />
            <PriorityCard rank={3} title="Add sameAs social handles to Organization schema" borderColor={COLORS.teal} />
          </div>
        </motion.div>
      );
    case "keyword-universe":
      return (
        <div>
          <KeywordTable />
          <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Trending Topics</h4>
          <TrendingGrid />
          <QuickWinsCallout />
        </div>
      );
    case "competitive":
      return (
        <div>
          <CompetitorCards expanded={expanded} />
          <WhiteSpaceCallout />
          <StrategicImplicationCallout />
        </div>
      );
    case "audience":
      return (
        <div>
          <KeyStatCallout />
          <PersonaCards />
          <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Audience Breakdown</h4>
          <PlatformAudienceRow />
        </div>
      );
    case "customer-journey":
      return (
        <div>
          <FunnelVisual />
          <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Funnel Gaps</h4>
          <FunnelGapCards />
          <LeakingFunnelCards />
        </div>
      );
    case "platform-strategy":
      return (
        <div>
          <WeeklyCadenceBar />
          <PlatformStrategyGrid />
          <EmergingPillarsCallout />
        </div>
      );
    case "paid-acquisition":
      return (
        <div>
          <BudgetTimeline />
          <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated CPC by Platform</h4>
          <CPCTable />
        </div>
      );
    case "partnerships":
      return (
        <div>
          <PartnershipTiers />
          <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Outreach Templates</h4>
          <OutreachAccordion />
          <PartnershipQuickWins />
        </div>
      );
    case "content-calendar":
      return <ContentCalendar />;
    case "strategic-summary":
      return <StrategicSummaryContent />;
    default:
      return null;
  }
}

// ─── Status Badge ───────────────────────────────────────
function StatusBadge({ status }: { status: StrategySection["status"] }) {
  if (status === "complete") {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${COLORS.teal}20`, color: COLORS.teal }}
      >
        Complete
      </span>
    );
  }
  if (status === "researching") {
    return (
      <span className="inline-flex animate-pulse items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${COLORS.amber}20`, color: COLORS.amber }}
      >
        Researching
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: `${COLORS.amber}20`, color: COLORS.amber }}
      >
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

// ─── Main Dashboard ─────────────────────────────────────
export function StrategyDashboard({ sections }: { sections: StrategySection[] }) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState(1);
  const [showFullResearch, setShowFullResearch] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function toggleSection(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleFullResearch(key: string) {
    setShowFullResearch((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function scrollToSection(num: number) {
    const section = sections.find((s) => s.section_number === num);
    if (section && sectionRefs.current[section.section_key]) {
      sectionRefs.current[section.section_key]!.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const allExpanded = sections.every((s) => expandedKeys.has(s.section_key));

  function toggleAll() {
    if (allExpanded) {
      setExpandedKeys(new Set());
    } else {
      setExpandedKeys(new Set(sections.map((s) => s.section_key)));
    }
  }

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-section-key");
            const section = sections.find((s) => s.section_key === key);
            if (section) setActiveSection(section.section_number);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const latestResearch = sections
    .filter((s) => s.researched_at)
    .sort((a, b) => new Date(b.researched_at!).getTime() - new Date(a.researched_at!).getTime())
    [0]?.researched_at;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            FOA Strategy Baseline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {latestResearch
              ? `Last researched: ${format(new Date(latestResearch), "MMM d, yyyy")} \u00B7 v2`
              : "Research pending \u00B7 v2"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${allExpanded ? "rotate-180" : ""}`} />
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
          <a
            href="/FOA-STRATEGY-BASELINE.md"
            download
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
            style={{ backgroundColor: COLORS.terracotta, boxShadow: `0 0 24px ${COLORS.terracotta}18` }}
          >
            <Download className="h-4 w-4" />
            Download Full Report
          </a>
        </div>
      </div>

      {/* Sticky Section Nav */}
      <div className="sticky top-0 z-20 -mx-6 mb-8 border-b border-border/50 bg-background/95 px-6 py-3 backdrop-blur-sm md:-mx-10 md:px-10">
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.section_number}
              type="button"
              onClick={() => scrollToSection(s.section_number)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                backgroundColor: activeSection === s.section_number ? COLORS.terracotta : "transparent",
                color: activeSection === s.section_number ? "white" : undefined,
                border: activeSection === s.section_number ? "none" : "1px solid var(--border)",
              }}
            >
              {NAV_LABELS[s.section_key] || String(s.section_number).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedKeys.has(section.section_key);
          const Icon = sectionIcons[section.section_key];
          const isComplete = section.status === "complete";
          const isPending = section.status === "pending";
          const markdown = isComplete && section.content?.markdown ? String(section.content.markdown) : null;
          const findings = KEY_FINDINGS[section.section_key] || [];
          const isResearchOpen = showFullResearch.has(section.section_key);
          const isStrategicSummary = section.section_key === "strategic-summary";

          return (
            <div
              key={section.section_key}
              ref={(el) => { sectionRefs.current[section.section_key] = el; }}
              data-section-key={section.section_key}
              className="scroll-mt-20"
            >
              <div
                className="overflow-hidden rounded-xl border border-border/50 transition-shadow dark:bg-[#0F1923]/30 bg-white"
                style={{
                  borderLeftWidth: isComplete ? 2 : undefined,
                  borderLeftColor: isComplete ? COLORS.terracotta : undefined,
                  ...(isStrategicSummary ? { backgroundColor: `${COLORS.dark}0A` } : {}),
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${COLORS.terracotta}10`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.section_key)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6"
                >
                  {/* Number badge */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-heading text-lg font-bold ${isPending ? "animate-pulse" : ""}`}
                    style={{ backgroundColor: `${COLORS.terracotta}15`, color: COLORS.terracotta }}
                  >
                    {String(section.section_number).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  {Icon && <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />}

                  {/* Title block */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-heading text-base font-bold md:text-lg">{section.title}</span>
                      <StatusBadge status={section.status} />
                    </div>
                    {!isExpanded && section.summary && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{section.summary}</p>
                    )}
                  </div>

                  {/* Date + Chevron */}
                  <div className="flex shrink-0 items-center gap-3">
                    {section.researched_at && (
                      <span className="hidden text-xs text-muted-foreground md:inline">
                        {format(new Date(section.researched_at), "MMM yyyy")}
                      </span>
                    )}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/30 px-5 pb-6 pt-5 md:px-6">
                        {/* Key Findings */}
                        {findings.length > 0 && <KeyFindings findings={findings} />}

                        {/* Section-specific components */}
                        <SectionContent sectionKey={section.section_key} expanded={isExpanded} />

                        {/* Full Research Accordion */}
                        {markdown && (
                          <div className="mt-6">
                            <div className="mb-3 border-t border-border/30 pt-4">
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Full Research</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFullResearch(section.section_key)}
                              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Full Research (14,700 words)
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isResearchOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                              {isResearchOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 rounded-xl border border-border/30 p-5 dark:bg-[#0F1923]/20">
                                    <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-1.5 [&_table]:text-xs [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted/50 [&_th]:font-medium">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdown}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
