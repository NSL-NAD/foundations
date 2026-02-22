import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  instructions: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 9,
    color: colors.body,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  /* Grid of image placeholders */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  gridBoxLarge: {
    width: "48%",
    height: 160,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  gridBoxSmall: {
    width: "31%",
    height: 120,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  boxLabel: {
    fontFamily: heading,
    fontWeight: 400,
    fontSize: 7,
    color: colors.border,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  /* Color palette row */
  paletteRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  paletteSwatch: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 4,
    borderStyle: "dashed",
  },
  paletteLabel: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.muted,
    marginTop: 3,
    textAlign: "center",
    width: 50,
  },
  paletteItem: {
    alignItems: "center",
  },
  /* Material swatches */
  materialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  materialBox: {
    width: 70,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 4,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  /* Write area */
  writeArea: {
    marginTop: 10,
  },
  writeLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 18,
    opacity: 0.5,
  },
  writeLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 10,
  },
});

export function MoodBoardTemplate() {
  const summaryLines = Array.from({ length: 5 });
  const swatches = ["Color 1", "Color 2", "Color 3", "Color 4", "Color 5"];
  const materials = [
    "Material 1",
    "Material 2",
    "Material 3",
    "Material 4",
    "Material 5",
    "Material 6",
  ];

  return (
    <Document>
      {/* ── Page 1: Image Grid ───────────────────────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Mood Board Template</Text>
          <Text style={s.subtitle}>
            Collect images, colors, and materials that capture the feeling of
            your dream space. Paste, sketch, or describe in each area below.
          </Text>
        </View>

        {/* Section: Inspiration Images */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Inspiration Images</Text>
          </View>
          <Text style={s.instructions}>
            Paste or sketch images of rooms, buildings, landscapes, or scenes
            that evoke the mood you want. Aim for 4 to 6 images that feel right.
          </Text>
          <View style={s.grid}>
            <View style={s.gridBoxLarge}>
              <Text style={s.boxLabel}>Image 1</Text>
            </View>
            <View style={s.gridBoxLarge}>
              <Text style={s.boxLabel}>Image 2</Text>
            </View>
            <View style={s.gridBoxLarge}>
              <Text style={s.boxLabel}>Image 3</Text>
            </View>
            <View style={s.gridBoxLarge}>
              <Text style={s.boxLabel}>Image 4</Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — MOOD BOARD TEMPLATE
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Colors, Materials, Summary ───────────── */}
      <Page size="LETTER" style={s.page}>
        {/* Color Palette */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Color Palette</Text>
          </View>
          <Text style={s.instructions}>
            Fill or color in the swatches below with the dominant colors you see
            across your inspiration images. Name each color if you can.
          </Text>
          <View style={s.paletteRow}>
            {swatches.map((label) => (
              <View key={label} style={s.paletteItem}>
                <View style={s.paletteSwatch} />
                <Text style={s.paletteLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Materials */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Materials &amp; Textures</Text>
          </View>
          <Text style={s.instructions}>
            Paste samples, sketch textures, or write the name of materials you
            love — wood, stone, concrete, glass, metal, fabric, leather, ceramic.
          </Text>
          <View style={s.materialRow}>
            {materials.map((label) => (
              <View key={label} style={s.materialBox}>
                <Text style={s.boxLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Overall feeling summary */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Overall Feeling</Text>
          </View>
          <Text style={s.instructions}>
            Step back and look at your board as a whole. In a few sentences,
            describe the mood your board communicates. Does it feel like the
            space you envisioned?
          </Text>
          <View style={s.writeArea}>
            {summaryLines.map((_, i) => (
              <View key={i} style={s.writeLine} />
            ))}
          </View>
        </View>

        {/* Tips */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 6,
            padding: 14,
          }}
        >
          <Text
            style={{
              fontFamily: heading,
              fontWeight: 600,
              fontSize: 9,
              color: colors.primary,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Tips for a Strong Mood Board
          </Text>
          <Text
            style={{
              fontFamily: bodyFont,
              fontWeight: 400,
              fontSize: 8,
              color: colors.body,
              lineHeight: 1.6,
            }}
          >
            Aim for 10-20 images total. Look for patterns in what you
            collected. Include some contrast for energy. Trust your gut — if
            you are drawn to something, include it.
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — MOOD BOARD TEMPLATE
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
