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
    padding: 7,
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
  directionRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  directionLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
    width: 50,
    flexShrink: 0,
  },
  directionDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    flex: 1,
    lineHeight: 1.5,
  },
  diagramBox: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  diagramLabel: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    textAlign: "center",
  },
  compassRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  compassLabel: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 10,
    color: colors.primary,
    textAlign: "center",
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

const glazingStrategy = [
  { dir: "South", desc: "Largest windows — consistent, manageable sun. Easy to shade with overhangs." },
  { dir: "North", desc: "Soft, even light without direct sun. Ideal for studios and offices." },
  { dir: "East", desc: "Morning light — generally welcome, easy to manage." },
  { dir: "West", desc: "Caution — low, hot afternoon sun. Use small windows or exterior shading." },
];

const passivePrinciples = [
  { name: "Orient Long Walls South", desc: "Maximize winter sun exposure on the longest facade." },
  { name: "Thermal Mass on South", desc: "Concrete, stone, or tile floors absorb daytime heat and release it at night." },
  { name: "Design Overhangs", desc: "Shade south windows in summer (high sun) while allowing winter sun (low angle) to enter." },
  { name: "Minimize West Glass", desc: "West-facing openings cause overheating from harsh afternoon sun." },
];

const diagramChecklist = [
  "Summer sun arc drawn high overhead",
  "Winter sun arc drawn low on horizon",
  "Window sizes vary by orientation",
  "Overhang depth noted on south face",
  "North arrow included",
];

/* -- Component ------------------------------------------- */

export function SunPathDiagram() {
  return (
    <Document>
      {/* -- Page 1: Reference -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Sun Path Diagram</Text>
          <Text style={s.subtitle}>
            Reference guide for solar orientation and passive design. Use the
            blank diagram on page 2 to sketch your own sun path analysis.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Passive Solar Principles */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Passive Solar Principles</Text>
              </View>
              {passivePrinciples.map((p) => (
                <View key={p.name} style={s.entryCard}>
                  <Text style={s.entryName}>{p.name}</Text>
                  <Text style={s.entryDesc}>{p.desc}</Text>
                </View>
              ))}
            </View>

            {/* Diagram Checklist */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Diagram Checklist</Text>
              </View>
              {diagramChecklist.map((item) => (
                <View key={item} style={s.checkRow}>
                  <View style={s.checkbox} />
                  <Text style={s.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Glazing Strategy */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Glazing Strategy by Facade</Text>
              </View>
              {glazingStrategy.map((g) => (
                <View key={g.dir} style={s.directionRow}>
                  <Text style={s.directionLabel}>{g.dir}</Text>
                  <Text style={s.directionDesc}>{g.desc}</Text>
                </View>
              ))}
            </View>

            {/* Key Numbers */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Key Numbers</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Summer Sun Angle (40°N)</Text>
                <Text style={s.entryDesc}>
                  ~73° at noon — sun is nearly overhead, easy to shade with
                  short overhangs.
                </Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Winter Sun Angle (40°N)</Text>
                <Text style={s.entryDesc}>
                  ~27° at noon — low angle, penetrates deep into rooms through
                  south-facing glass.
                </Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Overhang Rule of Thumb</Text>
                <Text style={s.entryDesc}>
                  For south windows, overhang depth ≈ window height ÷ 4 to ÷ 3
                  blocks summer sun while admitting winter sun.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - SUN PATH DIAGRAM
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Blank diagram worksheet -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Your Sun Path Sketch</Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 12 }}>
            Sketch your home in plan view below. Mark north, draw the summer and
            winter sun arcs, and annotate window sizes and overhang strategies
            for each facade.
          </Text>
        </View>

        {/* Large blank sketch area */}
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            marginBottom: 16,
            padding: 16,
          }}
        >
          {/* Compass hints */}
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <Text style={s.compassLabel}>N</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Text style={{ ...s.compassLabel, alignSelf: "center" }}>W</Text>
            <Text style={{ ...s.compassLabel, alignSelf: "center" }}>E</Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={s.compassLabel}>S</Text>
          </View>
        </View>

        {/* Notes lines */}
        <View style={{ marginBottom: 0 }}>
          <Text style={s.promptText}>Notes:</Text>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={s.writeLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - SUN PATH DIAGRAM
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
