import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  twoCol: {
    flexDirection: "row",
    gap: 14,
  },
  col: {
    flex: 1,
  },
  lineWeightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingLeft: 4,
  },
  lineVisual: {
    width: 60,
    marginRight: 12,
    flexShrink: 0,
  },
  lineThick: {
    height: 0,
    borderBottomWidth: 3,
    borderBottomColor: colors.dark,
  },
  lineMedium: {
    height: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.dark,
  },
  lineThin: {
    height: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.dark,
  },
  lineDashed: {
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    borderStyle: "dashed",
  },
  lineLabel: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 1,
  },
  lineDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  symbolCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  symbolName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  symbolDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  labelEntry: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  labelName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 1,
  },
  labelFormat: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.accent,
    marginBottom: 1,
  },
  labelDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  tipBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  tipLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.accent,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  tipText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.5,
  },
});

/* -- Data ------------------------------------------------ */

const lineWeights = [
  {
    name: "Thick",
    style: "lineThick" as const,
    desc: "Cut lines - walls, floors, and sections cut by the drawing plane. The heaviest weight on any drawing.",
  },
  {
    name: "Medium",
    style: "lineMedium" as const,
    desc: "Object lines - edges of furniture, cabinets, fixtures, and objects visible but not cut through.",
  },
  {
    name: "Thin",
    style: "lineThin" as const,
    desc: "Detail lines - hatching, dimension lines, leaders, and annotation. Lightest continuous weight.",
  },
  {
    name: "Dashed",
    style: "lineDashed" as const,
    desc: "Hidden lines - elements above or below the cut plane, such as upper cabinets or beams overhead.",
  },
];

const symbolsLeft = [
  {
    name: "Door",
    desc: "Shown as a line with a 90-degree arc indicating swing direction. The arc shows the path of the door as it opens.",
  },
  {
    name: "Window",
    desc: "Drawn as a thin line within the wall thickness, often with two parallel lines representing the glass pane.",
  },
];

const symbolsRight = [
  {
    name: "Stairs",
    desc: "Parallel lines with an arrow indicating the direction going up. A break line shows where the stair is cut by the floor above.",
  },
  {
    name: "Fixtures",
    desc: "Simplified outlines of toilets, sinks, tubs, and appliances drawn to scale. Standard symbols used across all plans.",
  },
];

const labelingItems = [
  {
    name: "Room Labels",
    format: "LIVING ROOM  14'-0\" x 18'-0\"",
    desc: "Centered in the room, uppercase text with dimensions. Include square footage for larger rooms.",
  },
  {
    name: "Door & Window Tags",
    format: "D1, D2... / W1, W2...",
    desc: "Sequential tags that reference a door or window schedule with size, type, and hardware details.",
  },
  {
    name: "Dimension Strings",
    format: "12'-6\"  |-----|",
    desc: "Continuous chains of dimensions placed outside the building footprint. Always dimension to wall faces or centerlines.",
  },
  {
    name: "Section Markers",
    format: "Circle with section number / sheet number",
    desc: "Indicates where a section cut is taken. Arrow shows the viewing direction. References the sheet where the section is drawn.",
  },
  {
    name: "Elevation Markers",
    format: "Circle with elevation number / sheet number",
    desc: "Arrow points toward the face of the building being shown. References the corresponding elevation drawing.",
  },
  {
    name: "North Arrow",
    format: "Arrow pointing to true north",
    desc: "Required on every site plan and floor plan. Orients the viewer to the compass direction of the drawing.",
  },
  {
    name: "Scale Notation",
    format: "1/4\" = 1'-0\"",
    desc: "Noted in the title block and below each drawing. Always verify scale matches the printed sheet size.",
  },
];

const annotationTips = [
  "Keep text sizes consistent: titles largest, room labels medium, dimensions and notes smallest.",
  "Place dimensions outside the floor plan perimeter, not inside rooms.",
  "Use leaders (lines with arrows) to connect notes to specific elements.",
  "Avoid crossing dimension lines over each other or over drawing elements.",
  "Always include a title block with project name, drawing title, scale, date, and north arrow.",
  "Use ALL CAPS for labels and notes on architectural drawings - this is industry standard.",
];

/* -- Component ------------------------------------------- */

export function LineWeightReference() {
  return (
    <Document>
      {/* -- Page 1: Line Weights & Symbols -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Line Weight Reference</Text>
          <Text style={s.subtitle}>
            A quick reference for architectural line weights, symbols, and
            labeling conventions.
          </Text>
        </View>

        {/* Line Weights */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Line Weights</Text>
          </View>
          {lineWeights.map((lw) => (
            <View key={lw.name} style={s.lineWeightRow}>
              <View style={s.lineVisual}>
                <View style={s[lw.style]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.lineLabel}>{lw.name}</Text>
                <Text style={s.lineDesc}>{lw.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Common Symbols */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Common Symbols</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {symbolsLeft.map((sym) => (
                <View key={sym.name} style={s.symbolCard}>
                  <Text style={s.symbolName}>{sym.name}</Text>
                  <Text style={s.symbolDesc}>{sym.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {symbolsRight.map((sym) => (
                <View key={sym.name} style={s.symbolCard}>
                  <Text style={s.symbolName}>{sym.name}</Text>
                  <Text style={s.symbolDesc}>{sym.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - LINE WEIGHT REFERENCE
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Labeling Essentials & Tips -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Labeling Essentials</Text>
          </View>
          {labelingItems.map((item) => (
            <View key={item.name} style={s.labelEntry}>
              <Text style={s.labelName}>{item.name}</Text>
              <Text style={s.labelFormat}>{item.format}</Text>
              <Text style={s.labelDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* Annotation Tips */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Annotation Tips</Text>
          </View>
          {annotationTips.map((tip, i) => (
            <View key={i} style={s.tipBox}>
              <Text style={s.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - LINE WEIGHT REFERENCE
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
