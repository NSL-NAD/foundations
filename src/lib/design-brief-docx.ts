import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Tab,
  TabStopType,
  TabStopPosition,
} from "docx";

// ── Brand Colors ──────────────────────────────────────
const colors = {
  primary: "5F7F96",   // Slate blue
  accent: "B8593B",    // Terracotta
  brass: "C4A44E",     // Brass/gold
  dark: "1a1a1a",
  body: "333333",
  muted: "666666",
  light: "999999",
};

interface BriefSection {
  title: string;
  content: string;
}

interface DesignBriefDocxOptions {
  briefTitle: string;
  firmName?: string;
  sections: BriefSection[];
  studentName: string;
  generatedDate: string;
}

/**
 * Generate a DOCX buffer from the Design Brief content.
 * Uses Georgia for headings and Calibri for body text,
 * with brand colors for a polished, professional look.
 */
export async function generateDesignBriefDocx({
  briefTitle,
  firmName,
  sections,
  studentName,
  generatedDate,
}: DesignBriefDocxOptions): Promise<Buffer> {
  const children: Paragraph[] = [];

  // ============================================
  // Cover Page
  // ============================================

  // Top spacer
  children.push(new Paragraph({ spacing: { before: 3200 } }));

  // Logo
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "FA",
          bold: true,
          size: 72,
          color: colors.primary,
          font: "Georgia",
        }),
      ],
    })
  );

  // School name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: "FOUNDATIONS OF ARCHITECTURE",
          size: 16,
          color: colors.muted,
          characterSpacing: 200,
          font: "Calibri",
        }),
      ],
    })
  );

  // Divider
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 4,
          color: colors.accent,
          space: 1,
        },
      },
      children: [new TextRun({ text: " ", size: 4 })],
    })
  );

  // "DESIGN BRIEF" label
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "DESIGN BRIEF",
          size: 16,
          color: colors.muted,
          characterSpacing: 160,
          font: "Calibri",
        }),
      ],
    })
  );

  // Brief title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
      children: [
        new TextRun({
          text: briefTitle,
          bold: true,
          size: 48,
          color: colors.dark,
          font: "Georgia",
        }),
      ],
    })
  );

  // Metadata line
  const metaParts: string[] = [];
  metaParts.push(studentName);
  if (firmName) metaParts.push(`Prepared for ${firmName}`);
  metaParts.push(generatedDate);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: metaParts.join("  ·  "),
          size: 20,
          color: colors.muted,
          font: "Calibri",
        }),
      ],
    })
  );

  // Section count
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${sections.length} sections`,
          size: 18,
          color: colors.light,
          font: "Calibri",
        }),
      ],
    })
  );

  // Page break after cover
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============================================
  // Table of Contents
  // ============================================
  children.push(
    new Paragraph({
      spacing: { after: 400 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 2,
          color: colors.primary,
          space: 8,
        },
      },
      children: [
        new TextRun({
          text: "CONTENTS",
          bold: true,
          size: 28,
          color: colors.primary,
          font: "Georgia",
          characterSpacing: 80,
        }),
      ],
    })
  );

  for (let i = 0; i < sections.length; i++) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        border: {
          bottom: {
            style: BorderStyle.DOT_DOT_DASH,
            size: 1,
            color: "D4D0C8",
            space: 4,
          },
        },
        children: [
          new TextRun({
            text: `${String(i + 1).padStart(2, "0")}`,
            bold: true,
            size: 18,
            color: colors.accent,
            font: "Calibri",
          }),
          new TextRun({
            text: `   ${sections[i].title}`,
            size: 22,
            color: colors.dark,
            font: "Calibri",
          }),
          new TextRun({
            children: [new Tab()],
          }),
          new TextRun({
            text: `${i + 3}`,
            size: 18,
            color: colors.muted,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // Page break after TOC
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============================================
  // Content Sections
  // ============================================
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Section number + accent divider
    children.push(
      new Paragraph({
        spacing: { before: i > 0 ? 200 : 0, after: 80 },
        children: [
          new TextRun({
            text: `SECTION ${String(i + 1).padStart(2, "0")}`,
            size: 14,
            color: colors.accent,
            characterSpacing: 100,
            font: "Calibri",
          }),
        ],
      })
    );

    // Section heading with colored left border
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 240 },
        border: {
          left: {
            style: BorderStyle.SINGLE,
            size: 8,
            color: colors.accent,
            space: 8,
          },
        },
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            size: 30,
            color: colors.primary,
            font: "Georgia",
          }),
        ],
      })
    );

    // Thin divider
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "D4D0C8",
            space: 1,
          },
        },
        children: [new TextRun({ text: " ", size: 4 })],
      })
    );

    // Section content paragraphs
    const paragraphs = section.content.split("\n\n");
    for (const para of paragraphs) {
      const trimmed = para.replace(/\n/g, " ").trim();
      if (!trimmed) continue;

      children.push(
        new Paragraph({
          spacing: { after: 180, line: 360 },
          children: [
            new TextRun({
              text: trimmed,
              size: 22,
              color: colors.body,
              font: "Calibri",
            }),
          ],
        })
      );
    }

    // Page break between sections (except last)
    if (i < sections.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  // ============================================
  // Build Document
  // ============================================
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
            color: colors.body,
          },
        },
        heading1: {
          run: {
            font: "Georgia",
            bold: true,
            size: 30,
            color: colors.primary,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
