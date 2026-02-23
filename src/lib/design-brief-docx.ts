import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  PageBreak,
} from "docx";

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
 * Runs server-side in an API route.
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
  // Spacer
  children.push(new Paragraph({ spacing: { before: 2400 } }));

  // Logo text
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "FA",
          bold: true,
          size: 72,
          color: "607D95",
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
          size: 20,
          color: "607D95",
          characterSpacing: 120,
          font: "Georgia",
        }),
      ],
    })
  );

  // Divider
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 3,
          color: "C0714A",
          space: 1,
        },
      },
      children: [new TextRun({ text: " ", size: 4 })],
    })
  );

  // Brief title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: briefTitle,
          bold: true,
          size: 52,
          font: "Georgia",
        }),
      ],
    })
  );

  // Firm name
  if (firmName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `Prepared for ${firmName}`,
            italics: true,
            size: 24,
            color: "666666",
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // Student name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: studentName,
          italics: true,
          size: 24,
          color: "666666",
          font: "Calibri",
        }),
      ],
    })
  );

  // Date
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: generatedDate,
          size: 18,
          color: "999999",
          font: "Calibri",
        }),
      ],
    })
  );

  // Page break after cover
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // ============================================
  // Content Sections
  // ============================================
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Section heading
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: i > 0 ? 400 : 0, after: 200 },
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            size: 32,
            color: "607D95",
            font: "Georgia",
          }),
        ],
      })
    );

    // Section content — split by double newlines into paragraphs
    const paragraphs = section.content.split("\n\n");
    for (const para of paragraphs) {
      const trimmed = para.replace(/\n/g, " ").trim();
      if (!trimmed) continue;

      children.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: trimmed,
              size: 22,
              color: "333333",
              font: "Calibri",
            }),
          ],
        })
      );
    }
  }

  // ============================================
  // Build Document
  // ============================================
  const doc = new Document({
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
