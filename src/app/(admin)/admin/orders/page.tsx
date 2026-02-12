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
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

export default async function OrdersPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from("kit_orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Kit Orders</h1>
        <p className="text-sm text-muted-foreground">
          {orders?.filter((o) => o.status === "pending").length || 0} pending,{" "}
          {orders?.length || 0} total
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Ship To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Ordered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                        "bg-gray-100 text-gray-800"
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
