import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  twoCol: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  materialBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 7,
    marginBottom: 5,
  },
  materialBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  materialBoxTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  materialBoxNumber: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 14,
    color: colors.accent,
    opacity: 0.4,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7,
    color: colors.muted,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 6,
    opacity: 0.5,
  },
  promptBlock: {
    marginBottom: 2,
  },
  systemBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 7,
    marginBottom: 4,
  },
  systemLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.primary,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
});

/* -- Component ------------------------------------------- */

export function MaterialsSelectionMatrix() {
  const materialFields = [
    { label: "Material Name & Type", lines: 1 },
    { label: "Where in Your Home", lines: 1 },
    { label: "Why You Chose It (aesthetic / performance / sustainability)", lines: 1 },
  ];

  const systemCategories = [
    "Heating approach",
    "Cooling / ventilation",
    "Insulation strategy",
    "Energy systems (solar, etc.)",
    "Water management",
  ];

  const renderMaterialCard = (num: number) => (
    <View key={num} style={s.materialBox}>
      <View style={s.materialBoxHeader}>
        <Text style={s.materialBoxTitle}>Material {num}</Text>
        <Text style={s.materialBoxNumber}>0{num}</Text>
      </View>
      {materialFields.map((field) => (
        <View key={field.label} style={s.promptBlock}>
          <Text style={s.fieldLabel}>{field.label}</Text>
          {Array.from({ length: field.lines }).map((_, i) => (
            <View key={i} style={s.fieldLine} />
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      {/* -- Page 1: All 5 Materials in 2-column layout -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Materials Selection Matrix</Text>
          <Text style={s.subtitle}>
            Record your 5 key material choices and building system preferences
            for your dream home. This becomes your Material and Systems Concept
            Board for the Module 6 portfolio.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column: Materials 1-3 */}
          <View style={s.col}>
            <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Materials 1–3</Text>
            </View>
            {[1, 2, 3].map(renderMaterialCard)}
          </View>

          {/* Right column: Materials 4-5 */}
          <View style={s.col}>
            <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Materials 4–5</Text>
            </View>
            {[4, 5].map(renderMaterialCard)}
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MATERIALS SELECTION MATRIX
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Building Systems + Reflection -- */}
      <Page size="LETTER" style={s.page}>
        {/* Building Systems */}
        <View style={{ marginBottom: 14 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Building Systems</Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 8 }}>
            Note your preferences for each system category.
          </Text>

          {systemCategories.map((cat) => (
            <View key={cat} style={s.systemBox}>
              <Text style={s.systemLabel}>{cat}</Text>
              <View style={s.fieldLine} />
            </View>
          ))}
        </View>

        {/* Reflection */}
        <View style={{ marginBottom: 0 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Reflection</Text>
          </View>
          <Text style={s.promptText}>
            Do these materials reflect the feeling you want your home to create?
            How do they work together visually and physically?
          </Text>
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={s.writeLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MATERIALS SELECTION MATRIX
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
