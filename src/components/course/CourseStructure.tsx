const modules = [
  {
    title: "Welcome & Orientation",
    lessons: 3,
    description:
      "Meet your instructor, set up your workspace, and get your materials ready.",
  },
  {
    title: "Kickoff: Dream Home Discovery",
    lessons: 4,
    description:
      "Define what home means to you. Create mood boards, vision statements, and explore your inspiration.",
  },
  {
    title: "Module 1: Architecture as an Idea",
    lessons: 7,
    description:
      "Discover how architecture shapes daily life. Learn the Vitruvian principles, study the masters, and begin forming your own design philosophy.",
  },
  {
    title: "Module 2: Definitions of Architecture",
    lessons: 16,
    description:
      "Learn the essential vocabulary of architecture — space, form, proportion, scale, light, texture, rhythm, symmetry, context, structure, transitions, and universal design.",
  },
  {
    title: "Module 3: Drawing Foundations",
    lessons: 14,
    description:
      "Master the fundamentals of architectural drawing — site plans, floor plans, elevations, sections, circulation, storage design, zoning, and space requirements.",
  },
  {
    title: "Module 4: Materiality & Systems",
    lessons: 18,
    description:
      "Explore building materials (concrete, wood, steel, glass, stone, timber, copper, brass, tile, plaster, and more), sustainable options, building systems, and construction basics.",
  },
  {
    title: "Module 5: Environmental Design",
    lessons: 10,
    description:
      "Understand passive design, solar orientation, natural ventilation, insulation, energy systems, and how to design in harmony with your site.",
  },
  {
    title: "Module 6: Portfolio Project",
    lessons: 11,
    description:
      "Bring it all together in a capstone project — from vision statement through site plan, floor plan, elevations, materials board, and environmental diagram to final compilation.",
  },
  {
    title: "Bonus Lessons",
    lessons: 7,
    description:
      "Extra content including mood board deep dives, presentation tips, design brief best practices, hiring tips, timelines, and an introduction to 3D modeling.",
  },
  {
    title: "Bonus: AI for Architecture",
    lessons: 11,
    description:
      "Use AI tools to visualize, refine, and present your dream home designs — covering floor plan generators, interior visualization, concept images, rendering, and prompting techniques.",
  },
  {
    title: "Resources & Completion",
    lessons: 5,
    description:
      "Recommended reading, tools and software, next steps, closing remarks, and your certificate of completion.",
  },
];

export function CourseStructure() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-card border">
      {modules.map((mod, i) => (
        <div
          key={mod.title}
          className={`flex items-start gap-4 px-5 py-4 ${
            i < modules.length - 1 ? "border-b" : ""
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
                {mod.title}
              </h3>
              <span className="shrink-0 text-xs text-muted-foreground">
                {mod.lessons} lessons
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {mod.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
