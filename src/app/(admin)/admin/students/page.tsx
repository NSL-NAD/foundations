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

export const metadata = {
  title: "Students — Admin",
};

export default async function StudentsPage() {
  const supabase = createClient();

  // Get all purchases with course/bundle access
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  // Get progress for each student
  const { data: progressCounts } = await supabase
    .from("lesson_progress")
    .select("user_id")
    .eq("completed", true);

  // Count completions per user
  const completionsByUser = new Map<string, number>();
  progressCounts?.forEach((p) => {
    completionsByUser.set(
      p.user_id,
      (completionsByUser.get(p.user_id) || 0) + 1
    );
  });

  const totalLessons = 95;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Students
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {purchases?.length || 0} enrolled students
        </p>
      </div>

      <div className="rounded-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Email</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Product</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Progress</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Enrolled</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases && purchases.length > 0 ? (
              purchases.map((purchase) => {
                const completed = purchase.user_id
                  ? completionsByUser.get(purchase.user_id) || 0
                  : 0;
                const percent =
                  totalLessons > 0
                    ? Math.round((completed / totalLessons) * 100)
                    : 0;

                return (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">
                      {purchase.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {purchase.product_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {completed}/{totalLessons} ({percent}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {purchase.user_id ? (
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
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No students yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
