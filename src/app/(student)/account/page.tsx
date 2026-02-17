import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/account/AvatarUpload";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Account</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="pb-2">
            <AvatarUpload
              userId={user!.id}
              currentAvatarUrl={profile?.avatar_url ?? null}
              fullName={profile?.full_name ?? null}
              email={profile?.email ?? ""}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{profile?.full_name || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="font-medium">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases && purchases.length > 0 ? (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {purchase.product_type === "bundle"
                        ? "Course + Starter Kit"
                        : purchase.product_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      ${(purchase.amount_cents / 100).toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        purchase.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {purchase.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No purchases yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
