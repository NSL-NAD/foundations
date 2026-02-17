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
        {/* Left-aligned header */}
        <div className="mx-auto max-w-5xl">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Founding Students
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Join the First 1,000
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Founding students get exclusive pricing and lifetime access to all
            future content and updates.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="group rounded-card border border-transparent bg-card p-5 transition-all hover:border-[#171C24]/40"
            >
              <div className="font-heading text-4xl font-bold text-brass/20 transition-colors group-hover:text-[#171C24]/40">
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
