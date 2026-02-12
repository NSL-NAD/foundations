import { PenTool, FileText, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const paths = [
  {
    icon: PenTool,
    title: "The Drawer Path",
    subtitle: "Hands-on & Visual",
    description:
      "Learn by sketching. Build your design skills through floor plans, elevations, and spatial drawings.",
    features: [
      "Sketch floor plans and elevations",
      "Learn architectural drawing conventions",
      "Build a visual portfolio",
      "Use the Architecture Starter Kit tools",
      "Great for visual thinkers",
    ],
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    title: "The Brief Builder Path",
    subtitle: "Written & Strategic",
    description:
      "Create a comprehensive architectural brief — a written plan that captures every detail of your dream home.",
    features: [
      "Write a detailed design brief",
      "Define room-by-room requirements",
      "Document material & style preferences",
      "Create a professional reference document",
      "Great for analytical thinkers",
    ],
    accent: "bg-chart-2/10 text-chart-2",
  },
];

export function PathComparison() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Two Paths, One Destination
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Whether you prefer to sketch or write, there&apos;s a path designed
            for you. Switch anytime — both are included.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          {paths.map((path) => (
            <Card key={path.title} className="relative overflow-hidden">
              <CardHeader>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${path.accent}`}
                >
                  <path.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-3 text-xl">{path.title}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">
                  {path.subtitle}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {path.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {path.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
