import {
  Compass,
  PenTool,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Compass,
    title: "Think Like an Architect",
    description:
      "Learn how architects see the world — from space planning and circulation to light, materials, and proportion.",
  },
  {
    icon: PenTool,
    title: "Choose Your Path",
    description:
      "Drawer path for hands-on sketching, or Brief Builder path for creating a detailed written plan. Both lead to your dream home.",
  },
  {
    icon: Lightbulb,
    title: "No Prerequisites",
    description:
      "No degree, no experience, no expensive software. Just curiosity about the space you live in and want to create.",
  },
  {
    icon: MessageSquare,
    title: "Speak the Language",
    description:
      "Gain the vocabulary and confidence to communicate your vision to architects, contractors, and designers.",
  },
];

export function ValueProposition() {
  return (
    <section className="bg-surface py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Why This Course Exists
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Architecture shapes every moment of your life at home. You deserve to
            understand it.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <Card key={item.title} className="border-0 bg-card shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
