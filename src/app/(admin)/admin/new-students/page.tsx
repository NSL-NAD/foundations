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
import { ViewedAllButton } from "@/components/admin/ViewedAllButton";

export const metadata = {
  title: "New Students — Admin",
};

export default async function NewStudentsPage() {
  const supabase = createClient();

  const { data: newStudents } = await supabase
    .from("purchases")
    .select("id, email, product_type, amount_cents, created_at, user_id")
    .is("admin_viewed_at", null)
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
            New Students
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {newStudents?.length || 0} unviewed student
            {newStudents?.length !== 1 ? "s" : ""}
          </p>
        </div>
        {(newStudents?.length || 0) > 0 && <ViewedAllButton />}
      </div>

      <div className="rounded-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Product
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Amount
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Enrolled
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Account
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newStudents && newStudents.length > 0 ? (
              newStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.product_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    ${(student.amount_cents / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(student.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {student.user_id ? (
                      <Badge variant="default" className="text-xs">
                        Linked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        No account
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  All caught up — no new students
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
