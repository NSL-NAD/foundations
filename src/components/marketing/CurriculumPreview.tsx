"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    title: "Welcome & Orientation",
    lessons: 4,
    description:
      "Meet your instructor, set up your workspace, choose your learning path, and get ready for the journey.",
    tag: "Getting Started",
  },
  {
    title: "Kickoff: Dream Home Discovery",
    lessons: 4,
    description:
      "Define what home means to you. Explore your lifestyle, needs, and the vision for your dream space.",
    tag: "Interactive",
  },
  {
    title: "Module 1: Architecture as an Idea",
    lessons: 6,
    description:
      "Discover how architecture shapes daily life. Explore what makes a space feel like home and the ideas behind great design.",
    tag: "Foundations",
  },
  {
    title: "Module 2: Definitions of Architecture",
    lessons: 15,
    description:
      "Learn the essential vocabulary — space planning, circulation, scale, proportion, light, views, and more.",
    tag: "Core Theory",
  },
  {
    title: "Module 3: Drawing Foundations",
    lessons: 14,
    description:
      "Master floor plans, elevations, sections, and site plans. Learn to read and create architectural drawings.",
    tag: "Hands-On",
  },
  {
    title: "Module 4: Materiality & Systems",
    lessons: 12,
    description:
      "Explore building materials, structural systems, and how homes are actually put together.",
    tag: "Technical",
  },
  {
    title: "Module 5: Environmental Design",
    lessons: 10,
    description:
      "Understand passive design, climate response, sustainability principles, and designing with nature.",
    tag: "Sustainability",
  },
  {
    title: "Module 6: Portfolio Project",
    lessons: 9,
    description:
      "Bring it all together in a capstone project that showcases your design thinking.",
    tag: "Capstone",
  },
  {
    title: "Bonus Modules",
    lessons: 10,
    description:
      "Mood boards, presentation tips, hiring professionals, 3D modeling overview, and more.",
    tag: "Bonus",
  },
  {
    title: "Bonus: AI for Architecture",
    lessons: 10,
    description:
      "Use AI tools to visualize, refine, and present your dream home designs. Covers Rayon, Spacely AI, Nano Banana Pro, D5 Render, and more.",
    tag: "AI Tools",
  },
  {
    title: "Resources & Completion",
    lessons: 5,
    description:
      "Recommended reading, tool lists, glossary, and your course completion certificate.",
    tag: "Reference",
  },
];

export function CurriculumPreview() {
  return (
    <section id="curriculum" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            What You&apos;ll Learn
          </h2>
          <p className="mt-4 text-muted-foreground">
            99 lessons across 11 sections — from foundational concepts to your
            own capstone project.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {sections.map((section, index) => (
              <AccordionItem
                key={section.title}
                value={`section-${index}`}
                className="rounded-card border bg-card px-4 md:px-5"
              >
                <AccordionTrigger className="hover:no-underline py-3.5">
                  <div className="flex flex-1 items-center justify-between pr-4 text-left">
                    <div className="flex items-start gap-4">
                      <span className="font-heading text-2xl font-bold text-primary/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
                          {section.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {section.lessons} lessons
                        </p>
                      </div>
                    </div>
                    <span className="hidden rounded-full bg-accent/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-accent sm:inline-block">
                      {section.tag}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-2 pl-10 text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
