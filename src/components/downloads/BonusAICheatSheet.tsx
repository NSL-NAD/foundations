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
    padding: 5,
    marginBottom: 3,
  },
  entryName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  entryDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 6.5,
    color: colors.body,
    lineHeight: 1.4,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 6,
    flexShrink: 0,
  },
  checkLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7,
    color: colors.dark,
    flex: 1,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 5,
    marginBottom: 3,
  },
  tipTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 7,
    color: colors.accent,
    marginBottom: 1,
  },
  tipText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 6.5,
    color: colors.body,
    lineHeight: 1.4,
  },
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: "dotted",
  },
  toolName: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.primary,
    width: 70,
    flexShrink: 0,
  },
  toolUse: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 6.5,
    color: colors.body,
    flex: 1,
  },
  toolLevel: {
    fontFamily: heading,
    fontWeight: 500,
    fontSize: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    width: 50,
    textAlign: "right",
    flexShrink: 0,
  },
  formulaBox: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  formulaLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 6.5,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 3,
  },
  formulaText: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8.5,
    color: "#FFFFFF",
    lineHeight: 1.5,
    letterSpacing: 0.3,
  },
});

/* -- Data ------------------------------------------------ */

const tools = [
  { name: "Rayon", use: "Floor plans, furniture layouts, space planning", level: "Beginner", levelColor: "#3D7A5F" },
  { name: "Spacely AI", use: "Interior style exploration, material testing", level: "Beginner", levelColor: "#3D7A5F" },
  { name: "Nano Banana", use: "Concept images, sketch-to-render, variations", level: "Beginner", levelColor: "#3D7A5F" },
  { name: "RoomGPT", use: "Quick room transformations from photos", level: "Beginner", levelColor: "#3D7A5F" },
  { name: "Planner 5D", use: "Drag-and-drop floor plans and 3D design", level: "Beginner", levelColor: "#3D7A5F" },
  { name: "D5 Render", use: "Photorealistic renders, animations, walkthroughs", level: "Intermediate", levelColor: colors.brass },
  { name: "Hunyuan 3D", use: "Text/image to 3D model generation", level: "Intermediate", levelColor: colors.brass },
  { name: "Kling 2.6", use: "AI video from still images and renders", level: "Intermediate", levelColor: colors.brass },
  { name: "Forma", use: "Site analysis, sun/wind/noise studies", level: "Advanced", levelColor: colors.accent },
];

const workflowSteps = [
  { name: "1. Design Brief", desc: "Start from your vision, spatial requirements, and material preferences" },
  { name: "2. Concept Images", desc: "Use Nano Banana Pro to visualize your vision statement" },
  { name: "3. Floor Plans", desc: "Refine layouts in Rayon, importing hand-drawn sketches" },
  { name: "4. Interior Styles", desc: "Test material and style choices with Spacely AI" },
  { name: "5. Renders", desc: "Create presentation-grade output with D5 Render" },
  { name: "6. Video", desc: "Animate walkthroughs with Kling 2.6" },
];

const tips = [
  { title: "Be Specific", text: "\"Honed Carrara marble\" beats \"marble.\" Use your Module 4 vocabulary." },
  { title: "Define Lighting", text: "Golden hour, twilight, overcast — lighting defines mood more than anything." },
  { title: "Choose a Camera", text: "Eye-level, bird's eye, 3/4 perspective — each tells a different story." },
  { title: "Iterate", text: "Start with big moves (form, style). Refine details in follow-up prompts." },
];

const completionChecklist = [
  "Understand AI as amplifier, not replacement",
  "Can name tool categories and when to use each",
  "Tried at least one beginner-friendly tool",
  "Wrote a detailed prompt using the formula",
  "Generated dream home concept images",
  "Know where AI fits in the design process",
];

/* -- Component ------------------------------------------- */

export function BonusAICheatSheet() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Bonus Module AI Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Quick reference for AI tools, workflow, and prompting for architecture.
          </Text>
        </View>

        {/* Tool Directory */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ ...s.sectionHeader, marginBottom: 4 }}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>AI Tool Directory</Text>
          </View>
          {tools.map((t) => (
            <View key={t.name} style={s.toolRow}>
              <Text style={s.toolName}>{t.name}</Text>
              <Text style={s.toolUse}>{t.use}</Text>
              <Text style={{ ...s.toolLevel, color: t.levelColor }}>{t.level}</Text>
            </View>
          ))}
        </View>

        {/* Prompt Formula */}
        <View style={s.formulaBox}>
          <Text style={s.formulaLabel}>The Architecture Prompt Formula</Text>
          <Text style={s.formulaText}>
            Subject / Building Type + Style + Materials + Lighting + Camera / View + Atmosphere / Mood + Technical Specs
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* AI-Assisted Workflow */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 4 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>AI-Assisted Design Workflow</Text>
              </View>
              {workflowSteps.map((step) => (
                <View key={step.name} style={s.entryCard}>
                  <Text style={s.entryName}>{step.name}</Text>
                  <Text style={s.entryDesc}>{step.desc}</Text>
                </View>
              ))}
            </View>

            {/* Key Takeaway */}
            <View style={{ marginBottom: 0 }}>
              <View style={{
                backgroundColor: colors.primary,
                borderRadius: 6,
                padding: 8,
              }}>
                <Text style={{
                  fontFamily: bodyFont,
                  fontWeight: 400,
                  fontSize: 7,
                  color: "#FFFFFF",
                  lineHeight: 1.5,
                }}>
                  AI does not design. You design. AI helps you see what you are
                  imagining — faster, clearer, and from angles you might not have
                  considered.
                </Text>
              </View>
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Prompting Tips */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 4 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Prompting Tips</Text>
              </View>
              {tips.map((t) => (
                <View key={t.title} style={s.tipCard}>
                  <Text style={s.tipTitle}>{t.title}</Text>
                  <Text style={s.tipText}>{t.text}</Text>
                </View>
              ))}
            </View>

            {/* Completion Checklist */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 4 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Module Completion Checklist</Text>
              </View>
              {completionChecklist.map((item) => (
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
            FOUNDATIONS OF ARCHITECTURE — BONUS MODULE AI CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
