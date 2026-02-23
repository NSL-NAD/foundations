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
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  tipTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8,
    color: colors.accent,
    marginBottom: 1,
  },
  tipText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
});

/* -- Data ------------------------------------------------ */

const coreMaterials = [
  { name: "Concrete", desc: "Strong in compression, versatile, high thermal mass. Foundation, floors, walls." },
  { name: "Wood", desc: "Warm, renewable, easy to work. Framing, flooring, trim, finishes." },
  { name: "Steel", desc: "Strongest per unit weight, long spans. Beams, columns, connections." },
  { name: "Glass", desc: "Transparency, daylight, views. Windows, curtain walls, skylights." },
  { name: "Stone", desc: "Durable, timeless character. Cladding, counters, flooring, fireplaces." },
  { name: "Brick", desc: "Modular, excellent compression. Walls, veneers, paving, chimneys." },
];

const buildingSystems = [
  { name: "Moisture Management", desc: "Barriers, flashing, drainage planes keep water out of the envelope." },
  { name: "Plumbing (DWV)", desc: "Supply, waste, and vent piping for kitchens, baths, and fixtures." },
  { name: "HVAC", desc: "Heating, ventilation, and cooling — forced air, radiant, or heat pumps." },
  { name: "Electrical", desc: "Power distribution, lighting circuits, outlets, and panels." },
  { name: "Fire Protection", desc: "Smoke detection, fire-rated assemblies, sprinklers in some codes." },
];

const sustainableStrategies = [
  "Low-VOC paints, adhesives, and sealants",
  "FSC-certified or reclaimed wood",
  "Recycled-content materials (steel, glass, insulation)",
  "Locally sourced materials to reduce transport impact",
  "Life cycle thinking — durability over disposability",
];

const finishingChecklist = [
  "Material transitions planned at every junction",
  "Reveal details specified where materials meet",
  "Hardware selections match overall design intent",
  "Interior and exterior palettes feel cohesive",
  "Concept board completed with 5+ materials and systems",
];

/* -- Component ------------------------------------------- */

export function Module4CheatSheet() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Module 4 Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Key concepts and quick references from Materiality &amp; Systems.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Core Materials */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Core Materials</Text>
              </View>
              {coreMaterials.map((m) => (
                <View key={m.name} style={s.entryCard}>
                  <Text style={s.entryName}>{m.name}</Text>
                  <Text style={s.entryDesc}>{m.desc}</Text>
                </View>
              ))}
            </View>

            {/* Sustainability */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Sustainable Strategies</Text>
              </View>
              {sustainableStrategies.map((item) => (
                <View key={item} style={s.checkRow}>
                  <View style={s.checkbox} />
                  <Text style={s.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Building Systems */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Building Systems</Text>
              </View>
              {buildingSystems.map((sys) => (
                <View key={sys.name} style={s.entryCard}>
                  <Text style={s.entryName}>{sys.name}</Text>
                  <Text style={s.entryDesc}>{sys.desc}</Text>
                </View>
              ))}
            </View>

            {/* Budget Tips */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Budget Tip</Text>
              </View>
              <View style={s.tipCard}>
                <Text style={s.tipTitle}>Splurge Where It Counts</Text>
                <Text style={s.tipText}>
                  Invest in high-impact areas (kitchen, master bath, entry).
                  Economize on background spaces (secondary bedrooms, utility
                  areas).
                </Text>
              </View>
            </View>

            {/* Finishing Checklist */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Finishing Checklist</Text>
              </View>
              {finishingChecklist.map((item) => (
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
            FOUNDATIONS OF ARCHITECTURE - MODULE 4 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
