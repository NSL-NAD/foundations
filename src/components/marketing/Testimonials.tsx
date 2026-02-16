import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Coming Soon",
    role: "Founding Student",
    quote:
      "Testimonials from founding students will appear here. Be among the first 1,000 to enroll and shape this course.",
  },
  {
    name: "Coming Soon",
    role: "Founding Student",
    quote:
      "As a founding student, you'll get lifetime access to all current and future content — including updates based on your feedback.",
  },
  {
    name: "Coming Soon",
    role: "Founding Student",
    quote:
      "Join the founding class and help build the community around learning architecture for everyday life.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Founding Students
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Join the First 1,000
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Founding students get exclusive pricing and lifetime access to all
            future content and updates.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Card key={i} className="border-0 bg-card shadow-sm">
              <CardContent className="pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary/20 text-primary/20"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
