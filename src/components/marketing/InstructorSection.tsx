import { Award, BookOpen, Home } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function InstructorSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          {/* Photo */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={IMAGES.instructor.src}
              alt={IMAGES.instructor.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Bio */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Your Instructor
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Nic DeMore
            </h2>
            <p className="mt-1 text-lg text-muted-foreground">
              Architecture Educator & Home Design Enthusiast
            </p>

            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                After spending years navigating the gap between dreaming about
                a home and actually understanding how to design one, I created
                the course I wish existed when I started.
              </p>
              <p>
                Foundations of Architecture breaks down complex architectural
                concepts into approachable, actionable lessons that anyone
                can follow — whether you want to sketch your ideas or write
                a detailed plan.
              </p>
              <p>
                This isn&apos;t a path to becoming a licensed architect. It&apos;s
                the knowledge you need to design with intention and communicate
                your vision with confidence.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                {
                  icon: BookOpen,
                  value: "62",
                  label: "Lessons",
                },
                {
                  icon: Award,
                  value: "34",
                  label: "Resources",
                },
                {
                  icon: Home,
                  value: "10",
                  label: "Modules",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-surface p-3 text-center"
                >
                  <stat.icon className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
