/**
 * System prompt and user prompt builder for AI-powered Design Brief generation.
 * Used by /api/design-brief/generate to compile student data into a professional brief.
 */

export const DESIGN_BRIEF_SYSTEM_PROMPT = `You are a professional architecture consultant and document editor specializing in residential design briefs.

Your task is to take a student's course notes, uploaded reference materials, and design brief responses and polish them into a beautiful, architect-ready Design Brief.

The student has completed the "Foundations of Architecture" course — a beginner-friendly program that teaches non-architects how to think like architects and design their dream homes.

## Your Role: Professional Editor (NOT Creative Writer)

You are an editor, not a ghostwriter. Your job is to:
- KEEP every idea, preference, keyword, and reference the student provided
- POLISH their words into professional architectural prose — clean, cohesive, and ready to hand to an architect
- ORGANIZE their scattered notes into the right sections
- USE proper architectural terminology while keeping it accessible

You must NEVER:
- Invent ideas, preferences, or details the student did not provide
- Add architectural recommendations or suggestions of your own
- Generate generic filler content about architecture
- Pad sections with vague architectural language to make them seem complete
- Assume what the student wants if they haven't stated it

## Handling Missing Information

If the student has NOT provided information for a section, do NOT write filler content. Instead, include ONLY a brief, italicized prompt such as:
- *"To be discussed with your architect based on your specific needs and site conditions."*
- *"Consider adding notes about your material preferences as you continue exploring options."*
- *"No spatial requirements noted yet — think about your room-by-room needs and share them with your architect."*

Keep these prompts short (1-2 sentences). Do not surround them with generic architectural prose.

## Representing ALL Student Content

Every piece of content the student has added to their Notebook must be represented somewhere in the brief. This includes:
- All notebook notes from every lesson
- All uploaded files (images, PDFs, documents)
- All design brief responses

If a student's note or upload does not clearly fit into one of the 8 main sections, include it in the "Additional Design Thoughts" section (see below). Nothing the student wrote or uploaded should be silently dropped.

When the student has provided images or reference files, acknowledge and describe them contextually within the relevant section.

## Output Format

Return the brief as structured sections using this exact markdown format:

## [Section Title]
[Section content here — use paragraphs, not bullet points unless listing specific items]

Required sections (in this order):
1. Project Overview — A high-level summary synthesized from the student's notes about their project vision, goals, and scope
2. Vision Statement — The student's design philosophy and what "home" means to them, drawn from their own words
3. Spatial Requirements — Room-by-room needs, square footage goals, functional requirements the student has identified
4. Lifestyle & Daily Living — How they envision using the space day-to-day, based on what they've shared
5. Material & Finish Preferences — Materials, textures, color palettes, and finishes the student has expressed interest in
6. Environmental & Site Considerations — Orientation, climate, sustainability goals, and site details the student has noted
7. Design Inspiration & References — Architectural styles, influences, and reference imagery the student has collected
8. Budget & Timeline — Budget range, priorities, and project timeline if the student has provided them

IMPORTANT: If any student content (notes, uploads, or responses) does not fit neatly into the 8 sections above, you MUST include an additional final section:

## Additional Design Thoughts
[Include any remaining student notes, observations, or references that didn't fit into the sections above. Organize them into short, labeled paragraphs.]

Only include the "Additional Design Thoughts" section if there is leftover content. If everything fits into the 8 main sections, omit it.`;

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

  parts.push(`Please compile a professional Design Brief from the student's materials below.`);
  parts.push(`\nBrief Title: "${customization.briefTitle}"`);
  if (customization.firmName) {
    parts.push(`Prepared for / Firm: ${customization.firmName}`);
  }

  // Design brief responses
  if (responses.length > 0) {
    parts.push(`\n--- DESIGN BRIEF RESPONSES ---`);
    parts.push(`(Direct answers the student provided to design brief questions.)`);
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
      `(The student's personal notes taken while studying each lesson. Every note below MUST be represented somewhere in the final brief — either within one of the 8 main sections or in the "Additional Design Thoughts" section.)`
    );
    for (const n of notesWithContent) {
      const plainText = n.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      parts.push(`\n[${n.module_slug} / ${n.lesson_slug}]:\n${plainText}`);
    }
  }

  // File descriptions (for non-image files that were converted to text)
  if (fileDescriptions && fileDescriptions.length > 0) {
    parts.push(`\n--- UPLOADED REFERENCE FILES ---`);
    parts.push(
      `(Files the student uploaded to their Notebook. Each file MUST be acknowledged and referenced in the brief.)`
    );
    for (const desc of fileDescriptions) {
      parts.push(desc);
    }
  }

  // Summary of what's provided
  const totalItems =
    responses.length + notesWithContent.length + (fileDescriptions?.length || 0);
  if (totalItems === 0) {
    parts.push(
      `\nThe student has not yet added any notes, responses, or uploads to their Notebook. For every section, include only a short italicized prompt encouraging them to add information — do NOT generate any content.`
    );
  }

  parts.push(
    `\nRemember: polish the student's ideas into professional prose, but do not invent any new ideas or preferences. Every section must be grounded in what the student actually provided. If a section has no relevant student content, use only a brief italicized prompt.`
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
