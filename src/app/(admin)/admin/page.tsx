import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Package, ArrowRight } from "lucide-react";
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

      {/* Stats */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-heading text-3xl font-bold">
              {totalStudents || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pending Kit Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-heading text-3xl font-bold">
              {pendingKits || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/students"
          className="group flex items-center justify-between rounded-card border bg-card p-6 transition-all hover:border-foreground/20"
        >
          <div>
            <h2 className="font-heading text-lg font-semibold uppercase">
              Students
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage student accounts and progress
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin/orders"
          className="group flex items-center justify-between rounded-card border bg-card p-6 transition-all hover:border-foreground/20"
        >
          <div>
            <h2 className="font-heading text-lg font-semibold uppercase">
              Kit Orders
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage kit fulfillment and tracking
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
