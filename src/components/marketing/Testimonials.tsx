const testimonials = [
  {
    name: "Natasha P.",
    role: "Founding Student",
    quote:
      "Awesome course! I learned so much and enjoyed every minute.",
  },
  {
    name: "Nic D.",
    role: "Founding Student",
    quote:
      "This course is incredible already — the layout is amazing. Very impressed.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Terracotta header card */}
          <div className="flex flex-col justify-between rounded-card bg-accent p-5 text-white md:min-h-[420px]">
            <div>
              <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-white/70">
                Founding Students
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
                Join the Founding Class
              </h2>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/80">
              Founding students get exclusive pricing and lifetime access to all
              future content and updates.
            </p>
          </div>

          {/* Testimonial cards */}
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col rounded-card border border-transparent bg-card p-5 transition-all hover:border-[#171C24]/40 md:min-h-[420px]"
            >
              <div className="font-heading text-4xl font-bold text-brass/20 transition-colors group-hover:text-accent/40">
                FA.
              </div>
              <p className="mt-6 flex-1 text-sm leading-relaxed text-muted-foreground">
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
