import {
  Compass,
  PenTool,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Compass,
    number: "01",
    title: "Think Like an Architect",
    description:
      "Learn how architects see the world — from space planning and circulation to light, materials, and proportion.",
    href: "#curriculum",
  },
  {
    icon: PenTool,
    number: "02",
    title: "Choose Your Path",
    description:
      "Drawer path for hands-on sketching, or Brief Builder path for creating a detailed written plan.",
    href: "#curriculum",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Speak the Language",
    description:
      "Gain the vocabulary and confidence to communicate your vision to architects, contractors, and designers.",
    href: "#curriculum",
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Why This Course Exists
          </h2>
          <p className="mt-4 text-muted-foreground">
            Architecture shapes every moment of your life at home. You deserve to
            understand it.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {values.map((item) => (
            <div
              key={item.title}
              className="group rounded-card border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brass/10">
                <item.icon className="h-5 w-5 text-brass" />
              </div>
              <p className="mt-6 font-heading text-4xl font-bold text-primary/20">
                {item.number}
              </p>
              <h3 className="mt-2 font-heading text-lg font-semibold uppercase">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
