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

const componentsLeft = [
  {
    name: "Vision Statement",
    desc: "A written summary of your home's feeling, purpose, and inspiration. Anchors the entire project.",
  },
  {
    name: "Site Plan",
    desc: "Top-down drawing showing building placement, orientation, outdoor spaces, and entry points.",
  },
  {
    name: "Floor Plan(s)",
    desc: "Scaled layouts showing room relationships, circulation, furniture, and wall openings.",
  },
  {
    name: "Elevations",
    desc: "Front and side views revealing materials, proportions, and window/door rhythm.",
  },
];

const componentsRight = [
  {
    name: "Section (Optional)",
    desc: "Vertical cut showing interior heights, level changes, and structure-to-space relationships.",
  },
  {
    name: "Environmental Diagram",
    desc: "Sun paths, airflow patterns, shading strategies, and passive or active systems.",
  },
  {
    name: "Materials Board",
    desc: "Curated collection of materials, finishes, and building systems with visual and performance character.",
  },
  {
    name: "Reflection Page",
    desc: "Written reflection on your inspiration, challenges, and how you would evolve the design.",
  },
];

const tips = [
  {
    title: "Reference Your Notes",
    text: "Revisit your original thoughts from earlier modules and refine them with everything you now know.",
  },
  {
    title: "Tell a Story",
    text: "Arrange your portfolio so a viewer understands your vision, spaces, materials, and response to environment.",
  },
];

const checklist = [
  "Vision Statement written and revised",
  "Site Plan shows orientation, landscape, entries",
  "Floor Plan demonstrates circulation and flow",
  "Elevations express visual personality",
  "Environmental Diagram addresses sun, wind, climate",
  "Materials Board includes 5+ materials with rationale",
  "Reflection Page addresses inspiration and growth",
  "Portfolio organized in clear sequential format",
];

/* -- Component ------------------------------------------- */

export function Module6CheatSheet() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Module 6 Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Key concepts and quick references from Portfolio Project.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Portfolio Components 1-4 */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Portfolio Components</Text>
              </View>
              {componentsLeft.map((c) => (
                <View key={c.name} style={s.entryCard}>
                  <Text style={s.entryName}>{c.name}</Text>
                  <Text style={s.entryDesc}>{c.desc}</Text>
                </View>
              ))}
            </View>

            {/* Pro Tips */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Pro Tips</Text>
              </View>
              {tips.map((t) => (
                <View key={t.title} style={s.tipCard}>
                  <Text style={s.tipTitle}>{t.title}</Text>
                  <Text style={s.tipText}>{t.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Portfolio Components 5-8 */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>More Components</Text>
              </View>
              {componentsRight.map((c) => (
                <View key={c.name} style={s.entryCard}>
                  <Text style={s.entryName}>{c.name}</Text>
                  <Text style={s.entryDesc}>{c.desc}</Text>
                </View>
              ))}
            </View>

            {/* Completion Checklist */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Completion Checklist</Text>
              </View>
              {checklist.map((item) => (
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
            FOUNDATIONS OF ARCHITECTURE - MODULE 6 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
