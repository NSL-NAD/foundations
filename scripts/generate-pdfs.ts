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
  const { DesignPhilosophyWorksheet } = await import(
    "../src/components/downloads/DesignPhilosophyWorksheet"
  );
  const { Module1CheatSheet } = await import(
    "../src/components/downloads/Module1CheatSheet"
  );
  const { Module2CheatSheet } = await import(
    "../src/components/downloads/Module2CheatSheet"
  );
  const { AccessibilityChecklist } = await import(
    "../src/components/downloads/AccessibilityChecklist"
  );
  const { ElementPreferencesWorksheet } = await import(
    "../src/components/downloads/ElementPreferencesWorksheet"
  );
  const { LineWeightReference } = await import(
    "../src/components/downloads/LineWeightReference"
  );
  const { SitePlanGrid } = await import(
    "../src/components/downloads/SitePlanGrid"
  );
  const { FloorPlanGrid } = await import(
    "../src/components/downloads/FloorPlanGrid"
  );
  const { StorageInventoryChecklist } = await import(
    "../src/components/downloads/StorageInventoryChecklist"
  );
  const { StructuralBasicsGuide } = await import(
    "../src/components/downloads/StructuralBasicsGuide"
  );
  const { ZoningChecklist } = await import(
    "../src/components/downloads/ZoningChecklist"
  );
  const { RoomPlanningGuide } = await import(
    "../src/components/downloads/RoomPlanningGuide"
  );
  const { RoomProgramWorksheet } = await import(
    "../src/components/downloads/RoomProgramWorksheet"
  );
  const { Module3CheatSheet } = await import(
    "../src/components/downloads/Module3CheatSheet"
  );
  const { MaterialCostGuide } = await import(
    "../src/components/downloads/MaterialCostGuide"
  );
  const { MaterialsSelectionMatrix } = await import(
    "../src/components/downloads/MaterialsSelectionMatrix"
  );
  const { Module4CheatSheet } = await import(
    "../src/components/downloads/Module4CheatSheet"
  );
  const { SunPathDiagram } = await import(
    "../src/components/downloads/SunPathDiagram"
  );
  const { SustainabilityPrioritiesScorecard } = await import(
    "../src/components/downloads/SustainabilityPrioritiesScorecard"
  );
  const { Module5CheatSheet } = await import(
    "../src/components/downloads/Module5CheatSheet"
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
    {
      component: React.createElement(DesignPhilosophyWorksheet),
      dir: "module-1",
      filename: "design-philosophy-worksheet.pdf",
    },
    {
      component: React.createElement(Module1CheatSheet),
      dir: "module-1",
      filename: "module-1-cheat-sheet.pdf",
    },
    {
      component: React.createElement(Module2CheatSheet),
      dir: "module-2",
      filename: "module-2-cheat-sheet.pdf",
    },
    {
      component: React.createElement(AccessibilityChecklist),
      dir: "module-2",
      filename: "accessibility-checklist.pdf",
    },
    {
      component: React.createElement(ElementPreferencesWorksheet),
      dir: "module-2",
      filename: "element-preferences-worksheet.pdf",
    },
    {
      component: React.createElement(LineWeightReference),
      dir: "module-3",
      filename: "line-weight-reference.pdf",
    },
    {
      component: React.createElement(SitePlanGrid),
      dir: "module-3",
      filename: "site-plan-grid.pdf",
    },
    {
      component: React.createElement(FloorPlanGrid),
      dir: "module-3",
      filename: "floor-plan-grid.pdf",
    },
    {
      component: React.createElement(StorageInventoryChecklist),
      dir: "module-3",
      filename: "storage-inventory-checklist.pdf",
    },
    {
      component: React.createElement(StructuralBasicsGuide),
      dir: "module-3",
      filename: "structural-basics-guide.pdf",
    },
    {
      component: React.createElement(ZoningChecklist),
      dir: "module-3",
      filename: "zoning-checklist.pdf",
    },
    {
      component: React.createElement(RoomPlanningGuide),
      dir: "module-3",
      filename: "room-planning-guide.pdf",
    },
    {
      component: React.createElement(RoomProgramWorksheet),
      dir: "module-3",
      filename: "room-program-worksheet.pdf",
    },
    {
      component: React.createElement(Module3CheatSheet),
      dir: "module-3",
      filename: "module-3-cheat-sheet.pdf",
    },
    {
      component: React.createElement(MaterialCostGuide),
      dir: "module-4",
      filename: "material-cost-guide.pdf",
    },
    {
      component: React.createElement(MaterialsSelectionMatrix),
      dir: "module-4",
      filename: "materials-selection-matrix.pdf",
    },
    {
      component: React.createElement(Module4CheatSheet),
      dir: "module-4",
      filename: "module-4-cheat-sheet.pdf",
    },
    {
      component: React.createElement(SunPathDiagram),
      dir: "module-5",
      filename: "sun-path-diagram.pdf",
    },
    {
      component: React.createElement(SustainabilityPrioritiesScorecard),
      dir: "module-5",
      filename: "sustainability-priorities-scorecard.pdf",
    },
    {
      component: React.createElement(Module5CheatSheet),
      dir: "module-5",
      filename: "module-5-cheat-sheet.pdf",
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
