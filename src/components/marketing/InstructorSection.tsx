import Image from "next/image";
import { ArchCurve } from "@/components/decorative/ArchCurve";

export function InstructorSection() {
  return (
    <section className="relative overflow-hidden bg-[#171C24] py-20 md:py-28">
      <ArchCurve position="top-right" size={300} className="text-brass/50" />

      <div className="container">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          {/* Photo */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted">
            <Image
              src="/images/nic-demore.jpg"
              alt="Nic DeMore — Foundations of Architecture instructor"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="rounded-[1.25rem] border-[1.5px] border-white p-5 md:p-6">
                <p className="font-heading text-xl font-light uppercase leading-snug text-white md:text-2xl">
                  I created the course I wish existed when I started.
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="text-white">
            <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-white/50">
              Your Instructor
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
              Nic DeMore
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Architecture Educator & Home Design Enthusiast
            </p>

            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/70">
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

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: "11", label: "Modules" },
                { value: "31", label: "Resources" },
                { value: "99", label: "Lessons" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-img border border-accent/30 bg-accent/5 p-2.5 text-center"
                >
                  <div className="font-heading text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
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
