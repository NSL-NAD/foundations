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
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  entryName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8.5,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  entryDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
  lineWeightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingLeft: 4,
  },
  lineVisual: {
    width: 40,
    marginRight: 8,
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
  lineName: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
  },
  lineDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
  },
  sizeRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  sizeRoom: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7.5,
    color: colors.dark,
    width: 85,
    flexShrink: 0,
  },
  sizeMin: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    width: 65,
    flexShrink: 0,
  },
  sizeComfort: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.primary,
    flex: 1,
  },
  sizeHeader: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  sizeHeaderText: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7,
    color: colors.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  formulaCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  formulaName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8,
    color: colors.accent,
    marginBottom: 1,
  },
  formulaDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1.2,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 8,
    flexShrink: 0,
  },
  checkLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.dark,
    flex: 1,
  },
});

/* -- Data ------------------------------------------------ */

const lineWeights = [
  { name: "Thick", style: "lineThick" as const, desc: "Cut lines - walls, sections" },
  { name: "Medium", style: "lineMedium" as const, desc: "Object lines - furniture, fixtures" },
  { name: "Thin", style: "lineThin" as const, desc: "Detail lines - dimensions, hatching" },
  { name: "Dashed", style: "lineDashed" as const, desc: "Hidden lines - elements above/below" },
];

const symbols = [
  { name: "Door", desc: "Line with 90-degree arc showing swing direction" },
  { name: "Window", desc: "Parallel lines within wall thickness" },
  { name: "Stairs", desc: "Parallel lines with arrow showing up direction" },
  { name: "Fixtures", desc: "Simplified plan-view outlines drawn to scale" },
];

const roomSizes = [
  { room: "Living Room", min: "12x16 (192sf)", comfort: "16x20 (320sf)" },
  { room: "Kitchen", min: "10x12 (120sf)", comfort: "12x16 (192sf)" },
  { room: "Dining Room", min: "10x12 (120sf)", comfort: "12x14 (168sf)" },
  { room: "Master Bedroom", min: "12x14 (168sf)", comfort: "14x16 (224sf)" },
  { room: "Secondary Bed", min: "10x10 (100sf)", comfort: "10x12 (120sf)" },
  { room: "Full Bath", min: "5x8 (40sf)", comfort: "8x10 (80sf)" },
  { room: "Half Bath", min: "3x6 (18sf)", comfort: "4x6 (24sf)" },
  { room: "Home Office", min: "8x10 (80sf)", comfort: "10x12 (120sf)" },
  { room: "Laundry", min: "5x6 (30sf)", comfort: "6x9 (54sf)" },
];

const formulas = [
  { name: "10% Storage Rule", desc: "Dedicate 10-15% of total floor area to storage space." },
  { name: "Work Triangle", desc: "Sink-stove-fridge perimeter should total 12-26 feet." },
  { name: "Circulation", desc: "Add 15-20% to room totals for hallways, stairs, and transitions." },
  { name: "Egress Window", desc: "Minimum 5.7 sf opening, no dimension less than 20 inches." },
];

const drawingChecklist = [
  "Line weights correct (thick for walls, thin for dimensions)",
  "All rooms labeled with name and dimensions",
  "Dimensions added along perimeter",
  "North arrow included",
  "Scale noted on drawing",
  "Doors show swing direction",
  "Windows shown in wall thickness",
];

/* -- Component ------------------------------------------- */

export function Module3CheatSheet() {
  return (
    <Document>
      {/* -- Page 1 -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Module 3 Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Key concepts and quick references from Drawing Foundations.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
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
                    <Text style={s.lineName}>{lw.name}</Text>
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
              {symbols.map((sym) => (
                <View key={sym.name} style={s.entryCard}>
                  <Text style={s.entryName}>{sym.name}</Text>
                  <Text style={s.entryDesc}>{sym.desc}</Text>
                </View>
              ))}
            </View>

            {/* Key Formulas */}
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Key Formulas</Text>
              </View>
              {formulas.map((f) => (
                <View key={f.name} style={s.formulaCard}>
                  <Text style={s.formulaName}>{f.name}</Text>
                  <Text style={s.formulaDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Room Size Quick Reference */}
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Room Size Quick Reference</Text>
              </View>
              <View style={s.sizeHeader}>
                <Text style={{ ...s.sizeHeaderText, width: 85 }}>Room</Text>
                <Text style={{ ...s.sizeHeaderText, width: 65 }}>Minimum</Text>
                <Text style={s.sizeHeaderText}>Comfortable</Text>
              </View>
              {roomSizes.map((r) => (
                <View key={r.room} style={s.sizeRow}>
                  <Text style={s.sizeRoom}>{r.room}</Text>
                  <Text style={s.sizeMin}>{r.min}</Text>
                  <Text style={s.sizeComfort}>{r.comfort}</Text>
                </View>
              ))}
            </View>

            {/* Drawing Checklist */}
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Drawing Checklist</Text>
              </View>
              {drawingChecklist.map((item) => (
                <View key={item} style={s.checkRow}>
                  <View style={s.checkbox} />
                  <Text style={s.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MODULE 3 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
