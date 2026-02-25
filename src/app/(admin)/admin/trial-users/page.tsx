import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Trial Users — Admin",
};

export default async function TrialUsersPage() {
  const supabase = createClient();

  // Get user IDs who have purchased course or bundle
  const { data: purchasedUsers } = await supabase
    .from("purchases")
    .select("user_id")
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed")
    .not("user_id", "is", null);

  const purchasedIds = Array.from(
    new Set((purchasedUsers || []).map((p) => p.user_id).filter(Boolean))
  );

  // Get all non-admin profiles that haven't purchased
  let query = supabase
    .from("profiles")
    .select("id, full_name, email, created_at, trial_started_at")
    .neq("role", "admin")
    .order("created_at", { ascending: false });

  if (purchasedIds.length > 0) {
    query = query.not("id", "in", `(${purchasedIds.join(",")})`);
  }

  const { data: trialUsers } = await query;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Trial Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {trialUsers?.length || 0} user{trialUsers?.length !== 1 ? "s" : ""}{" "}
          on free trial (no course or bundle purchase)
        </p>
      </div>

      <div className="rounded-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Signed Up
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Days Active
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trialUsers && trialUsers.length > 0 ? (
              trialUsers.map((user) => {
                const daysActive = Math.floor(
                  (Date.now() - new Date(user.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "—"}
                    </TableCell>
                    <TableCell>{user.email || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {daysActive} day{daysActive !== 1 ? "s" : ""}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No trial users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
