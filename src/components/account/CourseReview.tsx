"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CourseReviewProps {
  existingReview: {
    rating: number;
    review_text: string;
  } | null;
  compact?: boolean;
}

export function CourseReview({ existingReview, compact }: CourseReviewProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(
    existingReview?.review_text || ""
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review_text: reviewText }),
      });

      if (res.ok) {
        toast("Thank you for your review!");
        setSubmitted(true);
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        {reviewText && (
          <p className="mt-2 text-sm text-muted-foreground">{reviewText}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Thank you for your review!
        </p>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${compact ? "gap-2" : "gap-3"}`}>
      <div>
        {!compact && <Label className="mb-2 block">Your Rating</Label>}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`${compact ? "h-5 w-5" : "h-6 w-6"} ${
                  star <= (hoverRating || rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {!compact && <Label htmlFor="review-text">Your Review (optional)</Label>}
        <Textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Tell us about your experience..."
          className={`${compact ? "min-h-[60px] text-sm" : "min-h-[120px]"} flex-1 resize-y`}
        />
      </div>
      <div className="mt-auto">
        <Button onClick={handleSubmit} disabled={loading || rating === 0} size="sm">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </div>
    </div>
  );
}
