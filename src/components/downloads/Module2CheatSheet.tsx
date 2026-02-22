import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  elementCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  elementName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  elementDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  twoCol: {
    flexDirection: "row",
    gap: 14,
  },
  col: {
    flex: 1,
  },
  conceptGroup: {
    marginBottom: 8,
  },
  conceptLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8.5,
    color: colors.dark,
    marginBottom: 1,
  },
  conceptDesc: {
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

const elementsLeft = [
  { name: "Space", desc: "The void between physical elements, where life actually happens." },
  { name: "Form", desc: "The visible shape and configuration that gives a building its identity." },
  { name: "Proportion", desc: "The relationship between parts and the whole, guided by ratios and visual harmony." },
  { name: "Scale", desc: "How the size of architectural elements relates to the human body." },
  { name: "Light and Shadow", desc: "The interplay that reveals form, creates mood, and defines atmosphere." },
  { name: "Texture and Materiality", desc: "The tangible surface qualities that connect people physically and emotionally to a space." },
];

const elementsRight = [
  { name: "Rhythm and Repetition", desc: "The organized repetition of elements that creates movement and order." },
  { name: "Symmetry and Asymmetry", desc: "The balance between mirroring and dynamism in a composition." },
  { name: "Context and Site", desc: "The surroundings, landscape, and climate that a building must respond to." },
  { name: "Structure and Tectonics", desc: "The load-bearing systems and the art of expressing how things are put together." },
  { name: "Transitions", desc: "The thoughtful way materials, surfaces, and spatial experiences meet and shift." },
  { name: "Color", desc: "The visual property of surfaces that shapes mood, spatial character, and atmosphere." },
];

const formTypes = [
  { label: "Rectilinear", desc: "Straight lines and right angles - orderly, stable, rational" },
  { label: "Curvilinear", desc: "Curves, arcs, and circular geometries - movement and fluidity" },
  { label: "Organic", desc: "Irregular, nature-inspired shapes that feel grown rather than built" },
  { label: "Geometric", desc: "Pure mathematical shapes - spheres, pyramids, cones" },
  { label: "Hybrid", desc: "Combines multiple form types in a unified composition" },
];

const rhythmTypes = [
  { label: "Regular", desc: "Identical elements at equal intervals - steady and predictable" },
  { label: "Alternating", desc: "Cycling between two or more different elements" },
  { label: "Progressive", desc: "Gradual change across a sequence - creates direction" },
  { label: "Random", desc: "Irregular spacing - energetic but risks chaos" },
  { label: "Pattern / Modular", desc: "2D field repetition - tilework, screen walls, facade panels" },
];

/* -- Component ------------------------------------------- */

export function Module2CheatSheet() {
  return (
    <Document>
      {/* -- Page 1: The 12 Elements -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Module 2 Cheat Sheet</Text>
          <Text style={s.subtitle}>
            The 12 Elements of Architecture - definitions, concepts, and
            vocabulary at a glance.
          </Text>
        </View>

        {/* Elements - two columns */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>The 12 Elements</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {elementsLeft.map((e) => (
                <View key={e.name} style={s.elementCard}>
                  <Text style={s.elementName}>{e.name}</Text>
                  <Text style={s.elementDesc}>{e.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {elementsRight.map((e) => (
                <View key={e.name} style={s.elementCard}>
                  <Text style={s.elementName}>{e.name}</Text>
                  <Text style={s.elementDesc}>{e.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MODULE 2 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Key Concepts -- */}
      <Page size="LETTER" style={s.page}>
        {/* Types of Form */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Types of Form</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {formTypes.slice(0, 3).map((f) => (
                <View key={f.label} style={s.conceptGroup}>
                  <Text style={s.conceptLabel}>{f.label}</Text>
                  <Text style={s.conceptDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {formTypes.slice(3).map((f) => (
                <View key={f.label} style={s.conceptGroup}>
                  <Text style={s.conceptLabel}>{f.label}</Text>
                  <Text style={s.conceptDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Types of Rhythm */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Types of Rhythm</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {rhythmTypes.slice(0, 3).map((r) => (
                <View key={r.label} style={s.conceptGroup}>
                  <Text style={s.conceptLabel}>{r.label}</Text>
                  <Text style={s.conceptDesc}>{r.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {rhythmTypes.slice(3).map((r) => (
                <View key={r.label} style={s.conceptGroup}>
                  <Text style={s.conceptLabel}>{r.label}</Text>
                  <Text style={s.conceptDesc}>{r.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Proportion Systems */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Proportion Systems</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              <View style={s.conceptGroup}>
                <Text style={s.conceptLabel}>Golden Ratio (1:1.618)</Text>
                <Text style={s.conceptDesc}>The most widely recognized proportioning system, found throughout nature and classical architecture.</Text>
              </View>
              <View style={s.conceptGroup}>
                <Text style={s.conceptLabel}>Classical Orders</Text>
                <Text style={s.conceptDesc}>Doric, Ionic, Corinthian - each with distinct proportional rules for columns, entablatures, and spacing.</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.conceptGroup}>
                <Text style={s.conceptLabel}>Le Corbusier{"'"}s Modulor</Text>
                <Text style={s.conceptDesc}>A proportioning system based on human body dimensions and the golden ratio</Text>
              </View>
              <View style={s.conceptGroup}>
                <Text style={s.conceptLabel}>Tatami Mat Module</Text>
                <Text style={s.conceptDesc}>Japanese spatial unit (roughly 90x180cm) - a human-scaled module that governs room sizes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Universal Design Quick Reference */}
        <View style={s.tipBox}>
          <Text style={s.tipLabel}>Universal Design Quick Reference</Text>
          <Text style={s.tipText}>
            Doorways: 36{'"'} min. Hallways: 42-48{'"'} wide. Lever handles over knobs.
            Flush thresholds. Switches at 42-44{'"'}. Outlets at 18-24{'"'}. At least one
            zero-step entrance. Main floor half-bath accessible.
          </Text>
        </View>

        {/* Key Takeaway */}
        <View style={s.tipBox}>
          <Text style={s.tipLabel}>Key Takeaway</Text>
          <Text style={s.tipText}>
            These 12 elements are the vocabulary of architecture. They are not
            isolated ideas - they work together in every building you see. The
            elements you gravitate toward will shape your design voice.
            Understanding all of them gives you the ability to create spaces
            that are structurally sound, functionally excellent, and
            emotionally resonant.
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MODULE 2 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
