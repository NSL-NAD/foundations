import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  conceptGroup: {
    marginBottom: 10,
  },
  conceptLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 9,
    color: colors.dark,
    marginBottom: 1,
  },
  conceptDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.5,
  },
  pillarCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  pillarName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  pillarLatin: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    marginBottom: 4,
  },
  pillarDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.5,
  },
  twoCol: {
    flexDirection: "row",
    gap: 16,
  },
  col: {
    flex: 1,
  },
  roleItem: {
    marginBottom: 4,
  },
  roleLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
  },
  roleDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.muted,
    lineHeight: 1.4,
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

/* ── Data ──────────────────────────────────────────────── */

const pillars = [
  {
    name: "Firmitas",
    latin: "Structural Integrity",
    desc: "A building must stand up — sound, durable, built to endure. Materials used well, loads distributed, systems that hold for decades.",
  },
  {
    name: "Utilitas",
    latin: "Usefulness & Function",
    desc: "A building must work for the people who use it. Smart layouts, intuitive flow, spaces that serve daily life.",
  },
  {
    name: "Venustas",
    latin: "Beauty & Delight",
    desc: "A building must move you. Proportion, harmony, light, material expression — the qualities that make a space feel alive.",
  },
];

const conceptsLeft = [
  { label: "Space & Meaning", desc: "Space is the primary material of architecture — how it is shaped changes how it feels." },
  { label: "Form & Proportion", desc: "The 3D shape and relationship between parts. Invisible when right, obvious when wrong." },
  { label: "Scale", desc: "How a space relates to the human body. Appropriate scale creates comfort and purpose." },
  { label: "Light & Shadow", desc: "The most powerful free tool. Natural light creates mood, movement, and depth." },
];

const conceptsRight = [
  { label: "Texture & Materiality", desc: "Every material has character — how it looks, sounds, smells, and feels under your hand." },
  { label: "Rhythm & Repetition", desc: "Repeating elements create visual order and guide the eye through a space." },
  { label: "Symmetry & Asymmetry", desc: "Balance through mirror or deliberate tension. Both are valid — intention is what matters." },
  { label: "Emotional Experience", desc: "Every space creates an emotional response. Great architecture is deliberate about what that response is." },
];

const rolesLeft = [
  { label: "Architect", desc: "Leads design vision and coordinates the project" },
  { label: "Interior Designer", desc: "Shapes interiors, finishes, and furnishings" },
  { label: "Civil Engineer", desc: "Site work, grading, drainage, infrastructure" },
  { label: "Structural Engineer", desc: "Ensures the building stands up safely" },
  { label: "MEP Engineer", desc: "Mechanical, electrical, and plumbing systems" },
];

const rolesRight = [
  { label: "Landscape Architect", desc: "Outdoor environment and site integration" },
  { label: "Contractors/Builders", desc: "Turn drawings into reality on site" },
  { label: "Surveyor", desc: "Measures land, establishes boundaries" },
  { label: "Project Manager", desc: "Coordinates timelines, budgets, communication" },
  { label: "Town Planner", desc: "Zoning, approvals, community planning" },
  { label: "The Client (You)", desc: "Your vision drives the entire process" },
];

/* ── Component ─────────────────────────────────────────── */

export function Module1CheatSheet() {
  return (
    <Document>
      {/* ── Page 1: Vitruvian Principles + Core Concepts ── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Module 1 Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Architecture as an Idea — key principles, concepts, and vocabulary
            at a glance.
          </Text>
        </View>

        {/* Vitruvian Principles */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>The Vitruvian Principles</Text>
          </View>
          {pillars.map((p) => (
            <View key={p.name} style={s.pillarCard}>
              <Text style={s.pillarName}>{p.name}</Text>
              <Text style={s.pillarLatin}>{p.latin}</Text>
              <Text style={s.pillarDesc}>{p.desc}</Text>
            </View>
          ))}
        </View>

        {/* Core Concepts — two columns */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Core Architectural Concepts</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {conceptsLeft.map((c) => (
                <View key={c.label} style={s.conceptGroup}>
                  <Text style={s.conceptLabel}>{c.label}</Text>
                  <Text style={s.conceptDesc}>{c.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {conceptsRight.map((c) => (
                <View key={c.label} style={s.conceptGroup}>
                  <Text style={s.conceptLabel}>{c.label}</Text>
                  <Text style={s.conceptDesc}>{c.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — MODULE 1 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Practical Realities + Key Roles ──────── */}
      <Page size="LETTER" style={s.page}>
        {/* Practical Realities */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Practical Realities</Text>
          </View>

          <View style={s.tipBox}>
            <Text style={s.tipLabel}>The 15% Rule</Text>
            <Text style={s.tipText}>
              In most residential projects, roughly 15% of the design is your
              freedom zone — personal expression, bold choices, creative
              experimentation. The other 85% is governed by codes, structure,
              site, and budget. Knowing where your freedom lies lets you make
              the most of it.
            </Text>
          </View>

          <View style={s.tipBox}>
            <Text style={s.tipLabel}>Buildability & Budget</Text>
            <Text style={s.tipText}>
              Every design decision carries a cost in materials, labor, and
              time. The best architects turn constraints into creative
              opportunities rather than ignoring them.
            </Text>
          </View>

          <View style={s.tipBox}>
            <Text style={s.tipLabel}>Respect for Context</Text>
            <Text style={s.tipText}>
              No building exists alone. Good architecture is in conversation
              with its landscape, neighbors, climate, and cultural history.
            </Text>
          </View>
        </View>

        {/* Key Roles — two columns */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Who Makes It All Happen</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {rolesLeft.map((r) => (
                <View key={r.label} style={s.roleItem}>
                  <Text style={s.roleLabel}>{r.label}</Text>
                  <Text style={s.roleDesc}>{r.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {rolesRight.map((r) => (
                <View key={r.label} style={s.roleItem}>
                  <Text style={s.roleLabel}>{r.label}</Text>
                  <Text style={s.roleDesc}>{r.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Key Takeaway */}
        <View style={s.tipBox}>
          <Text style={s.tipLabel}>Key Takeaway</Text>
          <Text style={s.tipText}>
            Architecture is not just about what a building does — it is about
            what it says. About the people who made it, and the people who live
            in it. Your design philosophy is the bridge between learning these
            principles and applying them to your own vision.
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — MODULE 1 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
