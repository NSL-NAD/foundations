import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";

export const metadata = {
  title: "Reviews — Admin",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "fill-primary text-primary"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const supabase = createClient();

  const { data: reviews } = await supabase
    .from("course_reviews")
    .select("id, rating, review_text, created_at, updated_at, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const totalReviews = reviews?.length || 0;
  const avgRating =
    totalReviews > 0
      ? (
          (reviews?.reduce((sum, r) => sum + r.rating, 0) || 0) / totalReviews
        ).toFixed(1)
      : "—";

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Student Reviews
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""} &middot;{" "}
          {avgRating} avg rating
        </p>
      </div>

      <div className="rounded-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Rating
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Student
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="min-w-[300px] text-xs font-medium uppercase tracking-wider">
                Review
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => {
                const profile = review.profiles as unknown as {
                  full_name: string | null;
                  email: string | null;
                } | null;
                return (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Stars rating={review.rating} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {profile?.full_name || "Student"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {profile?.email || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {review.review_text || (
                        <span className="italic text-muted-foreground/50">
                          No written review
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
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
                  No reviews yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
