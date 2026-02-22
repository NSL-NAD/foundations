import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 8,
    flexShrink: 0,
  },
  elementLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 9,
    color: colors.dark,
  },
  elementDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.muted,
    marginLeft: 20,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  twoCol: {
    flexDirection: "row",
    gap: 16,
  },
  col: {
    flex: 1,
  },
  elementBox: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  elementBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  elementBoxTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  elementBoxNumber: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 20,
    color: colors.accent,
    opacity: 0.4,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.muted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 14,
    opacity: 0.5,
  },
  promptBlock: {
    marginBottom: 12,
  },
});

/* -- Data ------------------------------------------------ */

const elements = [
  { name: "Space", desc: "The void between physical elements" },
  { name: "Form", desc: "The visible shape and configuration" },
  { name: "Proportion", desc: "Relationships between parts and the whole" },
  { name: "Scale", desc: "Size relative to the human body" },
  { name: "Light and Shadow", desc: "Interplay that reveals form and mood" },
  { name: "Texture and Materiality", desc: "Tangible surface qualities" },
  { name: "Rhythm and Repetition", desc: "Organized repetition creating movement" },
  { name: "Symmetry and Asymmetry", desc: "Balance through mirroring or tension" },
  { name: "Context and Site", desc: "Surroundings a building must respond to" },
  { name: "Structure and Tectonics", desc: "Load-bearing systems and expression" },
  { name: "Transitions", desc: "How materials and spaces meet and shift" },
  { name: "Color", desc: "Visual property shaping mood and atmosphere" },
];

/* -- Component ------------------------------------------- */

export function ElementPreferencesWorksheet() {
  const leftElements = elements.slice(0, 6);
  const rightElements = elements.slice(6);

  return (
    <Document>
      {/* -- Page 1: Choose Your Three -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Element Preferences</Text>
          <Text style={s.subtitle}>
            Review all 12 architectural elements and select the three that
            resonate most with your design vision.
          </Text>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Step 1: Choose Your Three</Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 12 }}>
            Check the three elements that interest you most - the ones you find
            yourself thinking about or that excite you.
          </Text>

          <View style={s.twoCol}>
            <View style={s.col}>
              {leftElements.map((el) => (
                <React.Fragment key={el.name}>
                  <View style={s.checkRow}>
                    <View style={s.checkbox} />
                    <Text style={s.elementLabel}>{el.name}</Text>
                  </View>
                  <Text style={s.elementDesc}>{el.desc}</Text>
                </React.Fragment>
              ))}
            </View>
            <View style={s.col}>
              {rightElements.map((el) => (
                <React.Fragment key={el.name}>
                  <View style={s.checkRow}>
                    <View style={s.checkbox} />
                    <Text style={s.elementLabel}>{el.name}</Text>
                  </View>
                  <Text style={s.elementDesc}>{el.desc}</Text>
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ELEMENT PREFERENCES
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Describe Your Elements -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>
              Step 2: Describe Your Elements
            </Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 16 }}>
            For each of your three chosen elements, describe a space that
            demonstrates it at its best.
          </Text>
        </View>

        {[1, 2, 3].map((num) => (
          <View key={num} style={s.elementBox}>
            <View style={s.elementBoxHeader}>
              <Text style={s.elementBoxTitle}>Element {num}</Text>
              <Text style={s.elementBoxNumber}>0{num}</Text>
            </View>

            <View style={s.promptBlock}>
              <Text style={s.fieldLabel}>Element Name</Text>
              <View style={s.fieldLine} />
            </View>

            <View style={s.promptBlock}>
              <Text style={s.fieldLabel}>
                Describe a space where this element shines
              </Text>
              <View style={s.fieldLine} />
              <View style={s.fieldLine} />
              <View style={s.fieldLine} />
            </View>

            <View style={s.promptBlock}>
              <Text style={s.fieldLabel}>
                How might this element appear in your dream home?
              </Text>
              <View style={s.fieldLine} />
              <View style={s.fieldLine} />
            </View>
          </View>
        ))}

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ELEMENT PREFERENCES
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>

      {/* -- Page 3: Reflect -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Step 3: Reflect</Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 16 }}>
            Write a short paragraph about why these three elements resonate with
            you. Consider what draws you to them, how you imagine them in your
            dream home, and whether any of your choices surprised you.
          </Text>
        </View>

        {Array.from({ length: 14 }).map((_, i) => (
          <View key={i} style={s.writeLine} />
        ))}

        <View style={{ marginTop: 24 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Visual Inspiration (Optional)</Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 16 }}>
            Find photographs of real buildings that showcase your three chosen
            elements. Save or print them and annotate with notes about what you
            see and why it works. Use the space below for URLs or references.
          </Text>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={s.writeLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ELEMENT PREFERENCES
          </Text>
          <Text style={s.footerAccent}>Page 3</Text>
        </View>
      </Page>
    </Document>
  );
}
