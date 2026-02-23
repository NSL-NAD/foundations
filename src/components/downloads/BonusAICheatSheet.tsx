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
    padding: 8,
    marginBottom: 4,
  },
  tipTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8,
    color: colors.accent,
    marginBottom: 2,
  },
  tipText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: "dotted",
  },
  toolName: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.primary,
    width: 80,
    flexShrink: 0,
  },
  toolUse: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    flex: 1,
  },
  toolLevel: {
    fontFamily: heading,
    fontWeight: 500,
    fontSize: 6.5,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    width: 55,
    textAlign: "right",
    flexShrink: 0,
  },
  formulaBox: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  formulaLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 4,
  },
  formulaText: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9.5,
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

const limitations = [
  "Cannot verify structural integrity or building physics",
  "Cannot ensure code compliance or zoning requirements",
  "Cannot produce professional construction documents",
  "Cannot guarantee accurate dimensions or measurements",
  "Cannot understand site-specific constraints automatically",
];

const completionChecklist = [
  "Understand AI as amplifier, not replacement",
  "Can name tool categories and when to use each",
  "Tried at least one beginner-friendly tool",
  "Wrote a detailed prompt using the formula",
  "Generated dream home concept images",
  "Reflected on AI output vs. your vision",
  "Know where AI fits in the design process",
  "Understand current AI limitations",
];

/* -- Component ------------------------------------------- */

export function BonusAICheatSheet() {
  return (
    <Document>
      {/* ── Page 1: Tools + Workflow ──────────────── */}
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
        <View style={{ marginBottom: 12 }}>
          <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
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

        {/* AI-Assisted Workflow */}
        <View style={{ marginBottom: 0 }}>
          <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
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

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — BONUS MODULE AI CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>Page 1 · foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Tips + Limitations + Checklist ─── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Prompting Tips */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Prompting Tips</Text>
              </View>
              <View style={s.tipCard}>
                <Text style={s.tipTitle}>Be Specific About Materials</Text>
                <Text style={s.tipText}>
                  &quot;Honed Carrara marble countertops&quot; beats &quot;marble.&quot;
                  Use your Module 4 vocabulary — texture, finish, color, and type.
                </Text>
              </View>
              <View style={s.tipCard}>
                <Text style={s.tipTitle}>Define the Lighting</Text>
                <Text style={s.tipText}>
                  Golden hour, twilight, overcast, or warm ambient — lighting
                  defines mood more than any other prompt element.
                </Text>
              </View>
              <View style={s.tipCard}>
                <Text style={s.tipTitle}>Choose a Camera Angle</Text>
                <Text style={s.tipText}>
                  Eye-level, bird&apos;s eye, 3/4 perspective, interior looking out.
                  Each angle tells a different story about the space.
                </Text>
              </View>
              <View style={s.tipCard}>
                <Text style={s.tipTitle}>Iterate, Don&apos;t Overload</Text>
                <Text style={s.tipText}>
                  Start with big moves (form, style, mood). Refine details in
                  follow-up prompts. Multiple rounds beat one massive prompt.
                </Text>
              </View>
              <View style={s.tipCard}>
                <Text style={s.tipTitle}>Save What Works</Text>
                <Text style={s.tipText}>
                  When you get a good result, save the exact prompt. Small
                  variations on proven prompts are more reliable than starting fresh.
                </Text>
              </View>
            </View>

            {/* Current Limitations */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Current AI Limitations</Text>
              </View>
              {limitations.map((item) => (
                <View key={item} style={s.checkRow}>
                  <Text style={{ ...s.checkLabel, fontWeight: 400, fontSize: 7.5, color: colors.body }}>
                    • {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Module Completion Checklist */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
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

            {/* Key Takeaway */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Key Takeaway</Text>
              </View>
              <View style={{
                backgroundColor: colors.primary,
                borderRadius: 6,
                padding: 10,
              }}>
                <Text style={{
                  fontFamily: bodyFont,
                  fontWeight: 400,
                  fontSize: 8,
                  color: "#FFFFFF",
                  lineHeight: 1.6,
                }}>
                  AI does not design. You design. AI helps you see what you are
                  imagining — faster, clearer, and from angles you might not have
                  considered. The design thinking you built in this course is what
                  makes AI output meaningful.
                </Text>
              </View>
            </View>

            {/* Quick Links */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Quick Links</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Rayon</Text>
                <Text style={s.entryDesc}>rayon.design</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Spacely AI</Text>
                <Text style={s.entryDesc}>spacely.ai</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Nano Banana Pro</Text>
                <Text style={s.entryDesc}>aistudio.google.com</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>D5 Render</Text>
                <Text style={s.entryDesc}>d5render.com</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Hunyuan 3D</Text>
                <Text style={s.entryDesc}>hy-3d.com</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryName}>Kling 2.6</Text>
                <Text style={s.entryDesc}>klingai.com</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — BONUS MODULE AI CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>Page 2 · foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
