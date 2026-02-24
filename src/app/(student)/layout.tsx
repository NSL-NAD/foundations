import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/Header";
import { StudentTools } from "@/components/shared/StudentTools";
import { ToolsPanelProvider } from "@/contexts/ToolsPanelContext";
import { AccessTierProvider } from "@/contexts/AccessTierContext";
import type { AccessTier } from "@/lib/access";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get access tier: 'full', 'trial', or null
  const { data: tier } = (await supabase.rpc("get_course_access_tier", {
    p_user_id: user.id,
  })) as { data: AccessTier };

  // No access at all (shouldn't happen for authenticated users, but safeguard)
  if (!tier) {
    redirect("/#pricing");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <AccessTierProvider tier={tier}>
      <ToolsPanelProvider>
        <Header
          user={
            profile
              ? { email: profile.email, full_name: profile.full_name }
              : null
          }
          isAdmin={profile?.role === "admin"}
          accessTier={tier}
        />
        <main id="main-content" className="min-h-[calc(100dvh-4rem)]">
          {children}
        </main>
        <StudentTools userId={user.id} email={profile?.email || ""} />
      </ToolsPanelProvider>
    </AccessTierProvider>
  );
}
