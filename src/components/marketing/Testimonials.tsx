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
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Founding Students
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Join the First 1,000
          </h2>
          <p className="mt-4 text-muted-foreground">
            Founding students get exclusive pricing and lifetime access to all
            future content and updates.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className={`rounded-card border bg-card p-5 ${
                i === 1 ? "md:-translate-y-4 border-2 border-primary" : ""
              }`}
            >
              <div className="font-heading text-4xl font-bold text-brass/30">
                FA.
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-8 border-t pt-4">
                <p className="font-heading text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
