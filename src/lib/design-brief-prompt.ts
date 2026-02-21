/**
 * System prompt and user prompt builder for AI-powered Design Brief generation.
 * Used by /api/design-brief/generate to compile student data into a professional brief.
 */

export const DESIGN_BRIEF_SYSTEM_PROMPT = `You are a professional architecture consultant and document writer specializing in residential design briefs.

Your task is to compile a student's course notes, design brief responses, and reference materials into a polished, professional Design Brief document.

The student has completed the "Foundations of Architecture" course — a beginner-friendly program that teaches non-architects how to think like architects and design their dream homes.

Guidelines:
- Write in a professional yet approachable tone
- Organize content into clear sections with headings
- Synthesize the student's notes and responses into cohesive narratives — don't just copy/paste their raw inputs
- Where the student has provided images or reference files, acknowledge and reference them contextually
- Fill in any gaps with thoughtful architectural language, but never invent specific details the student didn't provide
- Use proper architectural terminology while keeping it accessible
- The brief should read as a document they could hand to an architect to communicate their vision

Output format:
Return the brief as structured sections. Each section should have a title and content.
Use this exact format for each section:

## [Section Title]
[Section content here - use paragraphs, not bullet points unless listing specific items]

Required sections (in order):
1. Project Overview — A high-level summary of the project vision, goals, and scope
2. Vision Statement — The student's design philosophy and what "home" means to them
3. Spatial Requirements — Room-by-room needs, square footage goals, functional requirements
4. Lifestyle & Daily Living — How they envision using the space day-to-day
5. Material & Finish Preferences — Preferred materials, textures, color palettes, finishes
6. Environmental & Site Considerations — Orientation, climate response, sustainability goals
7. Design Inspiration & References — Architectural styles, influences, and reference imagery themes
8. Budget & Timeline — Budget range, priorities, and project timeline if provided

If the student hasn't provided information for a section, include a brief note like "To be discussed with your architect" rather than omitting the section entirely.`;

interface DesignBriefResponse {
  question_key: string;
  response: string;
}

interface NotebookNote {
  module_slug: string;
  lesson_slug: string;
  content: string;
}

interface BriefCustomization {
  briefTitle: string;
  firmName?: string;
  colorPalette: string;
  fontStyle: string;
}

export function buildDesignBriefPrompt({
  responses,
  notes,
  customization,
  fileDescriptions,
}: {
  responses: DesignBriefResponse[];
  notes: NotebookNote[];
  customization: BriefCustomization;
  fileDescriptions?: string[];
}): string {
  const parts: string[] = [];

  parts.push(`Please compile a professional Design Brief with the following details:`);
  parts.push(`\nBrief Title: "${customization.briefTitle}"`);
  if (customization.firmName) {
    parts.push(`Prepared for / Firm: ${customization.firmName}`);
  }

  // Design brief responses
  if (responses.length > 0) {
    parts.push(`\n--- DESIGN BRIEF RESPONSES ---`);
    for (const r of responses) {
      const label = formatQuestionKey(r.question_key);
      parts.push(`\n${label}:\n${r.response}`);
    }
  }

  // Notebook notes (strip HTML for the API)
  const notesWithContent = notes.filter(
    (n) => n.content && n.content.replace(/<[^>]*>/g, "").trim().length > 0
  );
  if (notesWithContent.length > 0) {
    parts.push(`\n--- STUDENT NOTEBOOK NOTES ---`);
    parts.push(
      `(These are the student's personal notes taken while studying each lesson. Use them as additional context for understanding their preferences and vision.)`
    );
    for (const n of notesWithContent) {
      const plainText = n.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      parts.push(`\n[${n.module_slug} / ${n.lesson_slug}]:\n${plainText}`);
    }
  }

  // File descriptions (for non-image files that were converted to text)
  if (fileDescriptions && fileDescriptions.length > 0) {
    parts.push(`\n--- UPLOADED REFERENCE FILES ---`);
    for (const desc of fileDescriptions) {
      parts.push(desc);
    }
  }

  parts.push(
    `\nPlease compile all of the above into a polished, professional Design Brief following the section structure specified in your instructions.`
  );

  return parts.join("\n");
}

/** Convert question_key like "vision_statement" to "Vision Statement" */
function formatQuestionKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
