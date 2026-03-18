import { createClient } from "@/lib/supabase/server";
import { StrategyDashboard } from "@/components/admin/strategy/StrategyDashboard";
import type { StrategySection } from "@/components/admin/StrategyTab";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Strategy | Admin",
};

const DEFAULT_STRATEGY_SECTIONS: StrategySection[] = [
  { id: "default-1", section_key: "seo-audit", section_number: 1, title: "Technical SEO Audit", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-2", section_key: "keyword-universe", section_number: 2, title: "Keyword Universe", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-3", section_key: "competitive", section_number: 3, title: "Competitive Landscape", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-4", section_key: "audience", section_number: 4, title: "Audience Definition", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-5", section_key: "customer-journey", section_number: 5, title: "Customer Journey", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-6", section_key: "platform-strategy", section_number: 6, title: "Platform Strategy", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-7", section_key: "paid-acquisition", section_number: 7, title: "Paid Acquisition Strategy", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-8", section_key: "partnerships", section_number: 8, title: "Partnerships and Outreach", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-9", section_key: "content-calendar", section_number: 9, title: "Content Calendar Foundation", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-10", section_key: "strategic-summary", section_number: 10, title: "Strategic Summary", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
];

export default async function AdminStrategyPage() {
  const supabase = createClient();

  const { data: strategyData } = await supabase
    .from("strategy_sections")
    .select("*")
    .order("section_number");

  const sections: StrategySection[] =
    strategyData && strategyData.length > 0
      ? (strategyData as StrategySection[])
      : DEFAULT_STRATEGY_SECTIONS;

  return (
    <div className="p-6 md:p-10">
      <StrategyDashboard sections={sections} />
    </div>
  );
}
