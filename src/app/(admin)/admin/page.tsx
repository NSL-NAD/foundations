import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Package, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const supabase = createClient();

  const { count: totalStudents } = await supabase
    .from("purchases")
    .select("*", { count: "exact", head: true })
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed");

  const { data: revenueData } = await supabase
    .from("purchases")
    .select("amount_cents")
    .eq("status", "completed");

  const totalRevenue =
    revenueData?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

  const { count: pendingKits } = await supabase
    .from("kit_orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // New (unviewed) students count
  const { count: newStudentsCount } = await supabase
    .from("purchases")
    .select("*", { count: "exact", head: true })
    .is("admin_viewed_at", null)
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed");

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage students, orders, and track metrics.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">View Site</Link>
        </Button>
      </div>

      {/* Stats + Actions grid */}
      <div className="max-w-4xl">
        {/* Row 1: Total Students | Students | Total Revenue */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex aspect-square flex-col justify-between rounded-card bg-primary p-5 text-white md:aspect-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">
                Total Students
              </span>
              <Users className="h-4 w-4 text-white/50" />
            </div>
            <div className="font-heading text-3xl font-bold">
              {totalStudents || 0}
            </div>
          </div>

          <Link
            href="/admin/students"
            className="group flex aspect-square flex-col justify-between rounded-card bg-accent p-5 text-white transition-opacity hover:opacity-90 md:aspect-auto"
          >
            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">
                Students
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-white/80">
                View and manage accounts
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" />
          </Link>

          <Card className="col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-3xl font-bold">
                ${(totalRevenue / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Pending Kit Orders | Kit Orders | New Students */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex aspect-square flex-col justify-between rounded-card bg-primary p-5 text-white md:aspect-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">
                Pending Kit Orders
              </span>
              <Package className="h-4 w-4 text-white/50" />
            </div>
            <div className="font-heading text-3xl font-bold">
              {pendingKits || 0}
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="group flex aspect-square flex-col justify-between rounded-card bg-accent p-5 text-white transition-opacity hover:opacity-90 md:aspect-auto"
          >
            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">
                Kit Orders
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-white/80">
                Manage fulfillment and tracking
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/admin/new-students"
            className="col-span-2 md:col-span-1"
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  New Students
                </CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-heading text-3xl font-bold">
                  {newStudentsCount || 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(newStudentsCount || 0) > 0
                    ? "Click to view & mark as viewed"
                    : "All caught up"}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
