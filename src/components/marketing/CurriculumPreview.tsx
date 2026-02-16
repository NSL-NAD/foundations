"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Welcome & Orientation",
    lessons: 4,
    description:
      "Meet your instructor, set up your workspace, choose your learning path, and get ready for the journey.",
    tags: ["Getting Started"],
  },
  {
    title: "Kickoff: Dream Home Discovery",
    lessons: 4,
    description:
      "Define what home means to you. Explore your lifestyle, needs, and the vision for your dream space.",
    tags: ["Interactive"],
  },
  {
    title: "Module 1: Architecture as an Idea",
    lessons: 6,
    description:
      "Discover how architecture shapes daily life. Explore what makes a space feel like home and the ideas behind great design.",
    tags: ["Foundations"],
  },
  {
    title: "Module 2: Definitions of Architecture",
    lessons: 15,
    description:
      "Learn the essential vocabulary — space planning, circulation, scale, proportion, light, views, and more.",
    tags: ["Core Theory", "Largest Module"],
  },
  {
    title: "Module 3: Drawing Foundations",
    lessons: 14,
    description:
      "Master floor plans, elevations, sections, and site plans. Learn to read and create architectural drawings.",
    tags: ["Hands-On", "Drawer Path"],
  },
  {
    title: "Module 4: Materiality & Systems",
    lessons: 12,
    description:
      "Explore building materials, structural systems, and how homes are actually put together.",
    tags: ["Technical"],
  },
  {
    title: "Module 5: Environmental Design",
    lessons: 10,
    description:
      "Understand passive design, climate response, sustainability principles, and designing with nature.",
    tags: ["Sustainability"],
  },
  {
    title: "Module 6: Portfolio Project + AI Tools",
    lessons: 15,
    description:
      "Bring it all together in a capstone project. Plus, explore AI tools that can help visualize your designs.",
    tags: ["Capstone", "AI Tools"],
  },
  {
    title: "Bonus Modules",
    lessons: 10,
    description:
      "Universal design, zoning basics, storage design, room-specific tips, budget planning, and buildability.",
    tags: ["Bonus"],
  },
  {
    title: "Resources & Completion",
    lessons: 5,
    description:
      "Recommended reading, tool lists, glossary, and your course completion certificate.",
    tags: ["Reference"],
  },
];

export function CurriculumPreview() {
  return (
    <section id="curriculum" className="bg-surface py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            What You&apos;ll Learn
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            62 lessons across 10 sections — from foundational concepts to your
            own capstone project.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {sections.map((section, index) => (
              <AccordionItem
                key={section.title}
                value={`section-${index}`}
                className="rounded-lg border bg-card px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-4 text-left">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-xs text-muted-foreground/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {section.lessons} lessons
                        </p>
                      </div>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                      {section.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-2 text-muted-foreground">
                    {section.description}
                  </p>
                  <div className="flex gap-2 sm:hidden">
                    {section.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
