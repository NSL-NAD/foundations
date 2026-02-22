import { Font } from "@react-pdf/renderer";
import path from "path";

const fontsDir = path.join(process.cwd(), "src", "assets", "fonts");

/**
 * Register brand fonts for PDF generation.
 * Call this once before rendering any PDF document.
 *
 * Families available after registration:
 *   - "SpaceGrotesk" (heading font) — Regular, Medium, SemiBold, Bold
 *   - "Syne" (body font)            — Regular, Medium, SemiBold, Bold
 */
export function registerBrandFonts() {
  Font.register({
    family: "SpaceGrotesk",
    fonts: [
      { src: path.join(fontsDir, "SpaceGrotesk-Regular.ttf"), fontWeight: 400 },
      { src: path.join(fontsDir, "SpaceGrotesk-Medium.ttf"), fontWeight: 500 },
      { src: path.join(fontsDir, "SpaceGrotesk-SemiBold.ttf"), fontWeight: 600 },
      { src: path.join(fontsDir, "SpaceGrotesk-Bold.ttf"), fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Syne",
    fonts: [
      { src: path.join(fontsDir, "Syne-Regular.ttf"), fontWeight: 400 },
      { src: path.join(fontsDir, "Syne-Medium.ttf"), fontWeight: 500 },
      { src: path.join(fontsDir, "Syne-SemiBold.ttf"), fontWeight: 600 },
      { src: path.join(fontsDir, "Syne-Bold.ttf"), fontWeight: 700 },
    ],
  });
}
