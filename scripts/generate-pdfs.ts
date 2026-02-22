/**
 * Generate static PDF files from React components.
 *
 * Usage:  npx tsx scripts/generate-pdfs.ts
 *
 * This renders each PDF component to a buffer and writes it to the
 * public/downloads directory so files are served statically by Next.js.
 */

import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Generating course PDFs...\n");

  // Register brand fonts before rendering any PDFs
  const { registerBrandFonts } = await import(
    "../src/components/downloads/pdf-fonts"
  );
  registerBrandFonts();

  const { MaterialsChecklist } = await import(
    "../src/components/downloads/MaterialsChecklist"
  );
  const { DreamHomeWorksheet } = await import(
    "../src/components/downloads/DreamHomeWorksheet"
  );
  const { MoodBoardTemplate } = await import(
    "../src/components/downloads/MoodBoardTemplate"
  );
  const { VisionStatementWorksheet } = await import(
    "../src/components/downloads/VisionStatementWorksheet"
  );

  const pdfs: { component: React.ReactElement; dir: string; filename: string }[] = [
    {
      component: React.createElement(MaterialsChecklist),
      dir: "welcome",
      filename: "materials-checklist.pdf",
    },
    {
      component: React.createElement(DreamHomeWorksheet),
      dir: "kickoff",
      filename: "dream-home-worksheet.pdf",
    },
    {
      component: React.createElement(MoodBoardTemplate),
      dir: "kickoff",
      filename: "mood-board-template.pdf",
    },
    {
      component: React.createElement(VisionStatementWorksheet),
      dir: "kickoff",
      filename: "vision-statement-worksheet.pdf",
    },
  ];

  const publicDir = path.join(process.cwd(), "public", "downloads");

  for (const pdf of pdfs) {
    const outDir = path.join(publicDir, pdf.dir);
    fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, pdf.filename);
    console.log(`  Rendering ${pdf.dir}/${pdf.filename}...`);

    const buffer = await renderToBuffer(pdf.component);
    fs.writeFileSync(outPath, buffer);

    const sizeKb = (buffer.length / 1024).toFixed(1);
    console.log(`  ✓ ${pdf.dir}/${pdf.filename} (${sizeKb} KB)`);
  }

  console.log(`\nDone! ${pdfs.length} PDF(s) generated.`);
}

main().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
