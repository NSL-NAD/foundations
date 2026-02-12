import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <>
      <Header
        user={profile ? { email: profile.email, full_name: profile.full_name } : null}
        isAdmin={profile?.role === "admin"}
      />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
