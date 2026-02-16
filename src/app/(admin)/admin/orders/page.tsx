import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "@/components/admin/OrderActions";

export const metadata = {
  title: "Kit Orders — Admin",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
};

export default async function OrdersPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from("kit_orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Kit Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders?.filter((o) => o.status === "pending").length || 0} pending,{" "}
          {orders?.length || 0} total
        </p>
      </div>

      <div className="rounded-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Email</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Ship To</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Tracking</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Ordered</TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.email}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="text-sm">
                      <p>{order.shipping_name}</p>
                      <p className="text-muted-foreground">
                        {order.shipping_address_line1}
                        {order.shipping_address_line2 &&
                          `, ${order.shipping_address_line2}`}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shipping_city}, {order.shipping_state}{" "}
                        {order.shipping_postal_code}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[order.status] ||
                        "bg-muted text-muted-foreground"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.tracking_number || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderActions order={order} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No kit orders yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
