import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/Header";
import { StudentTools } from "@/components/shared/StudentTools";
import { ToolsPanelProvider } from "@/contexts/ToolsPanelContext";

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

  // Check course access
  const { data: hasAccess } = await supabase.rpc("has_course_access", {
    p_user_id: user.id,
  });

  if (!hasAccess) {
    redirect("/#pricing");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <ToolsPanelProvider>
      <Header
        user={profile ? { email: profile.email, full_name: profile.full_name } : null}
        isAdmin={profile?.role === "admin"}
      />
      <main id="main-content" className="min-h-[calc(100dvh-4rem)]">
        {children}
      </main>
      <StudentTools userId={user.id} email={profile?.email || ""} />
    </ToolsPanelProvider>
  );
}
