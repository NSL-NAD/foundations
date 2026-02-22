import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  promptGroup: {
    marginBottom: 16,
  },
  promptLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 10,
    color: colors.dark,
    marginBottom: 4,
  },
  promptDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  writeLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 18,
    opacity: 0.5,
  },
  writeArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    minHeight: 80,
    padding: 10,
    opacity: 0.6,
  },
  moodBoardBox: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 6,
    borderStyle: "dashed",
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  moodBoardLabel: {
    fontFamily: heading,
    fontWeight: 400,
    fontSize: 9,
    color: colors.border,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  freewriteLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 10,
  },
});

/* ── Prompt data ──────────────────────────────────────── */

interface Prompt {
  question: string;
  hint?: string;
  lines: number;
}

const reflectionPrompts: Prompt[] = [
  {
    question: "Where do you imagine yourself living?",
    hint: "City, suburb, countryside, coast — describe the setting and why it appeals to you.",
    lines: 3,
  },
  {
    question: "What feelings do you want your home to create?",
    hint: "Calm, energy, warmth, openness, safety, joy — list and describe.",
    lines: 3,
  },
  {
    question: "What features matter most to you?",
    hint: "Natural light, outdoor connection, a chef's kitchen, a quiet reading nook, etc.",
    lines: 3,
  },
  {
    question: "How much space do you need, and how do you use it day to day?",
    hint: "Think about your daily routines, work-from-home needs, and how rooms flow together.",
    lines: 3,
  },
  {
    question: "Who shares your space, and how does that shape what you need?",
    hint: "Partner, children, pets, roommates, frequent guests — how does each person affect your design?",
    lines: 3,
  },
];

const deeperPrompts: Prompt[] = [
  {
    question: "What materials do you love? What materials do you dislike?",
    hint: "Wood, stone, concrete, glass, metal, fabric, leather, ceramic — what do you want to touch every day?",
    lines: 3,
  },
  {
    question: "What colors inspire you? What colors feel wrong?",
    hint: "Think beyond paint chips: the colors of a forest floor, morning light on white walls, a terracotta pot.",
    lines: 3,
  },
  {
    question: "What existing spaces inspire your imagination?",
    hint: "Famous buildings, homes you've visited, hotels, restaurants, spaces from films or books.",
    lines: 3,
  },
];

/* ── Component ────────────────────────────────────────── */

function PromptBlock({ prompt }: { prompt: Prompt }) {
  const lines = Array.from({ length: prompt.lines });
  return (
    <View style={s.promptGroup}>
      <Text style={s.promptLabel}>{prompt.question}</Text>
      {prompt.hint && <Text style={s.promptDesc}>{prompt.hint}</Text>}
      {lines.map((_, i) => (
        <View key={i} style={s.writeLine} />
      ))}
    </View>
  );
}

export function DreamHomeWorksheet() {
  const freewriteLines = Array.from({ length: 22 });

  return (
    <Document>
      {/* ── Page 1: Reflection Questions ─────────────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Dream Home Vision Worksheet</Text>
          <Text style={s.subtitle}>
            Use this worksheet to capture your vision for your dream space.
            There are no wrong answers — write freely and honestly.
          </Text>
        </View>

        {/* Section: Reflection */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Reflection Questions</Text>
          </View>
          {reflectionPrompts.map((p) => (
            <PromptBlock key={p.question} prompt={p} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DREAM HOME VISION WORKSHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Deeper Reflection + Sketch ───────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Deeper Reflection</Text>
          </View>
          {deeperPrompts.map((p) => (
            <PromptBlock key={p.question} prompt={p} />
          ))}
        </View>

        {/* Mood/Sketch area */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Mood Board or Sketch Prompt</Text>
          </View>
          <Text style={s.promptDesc}>
            Sketch, collage, or attach images that capture the feeling of your
            dream home. Use this space to visualize what words alone cannot.
          </Text>
          <View style={s.moodBoardBox}>
            <Text style={s.moodBoardLabel}>
              Sketch / Collage / Attach Images Here
            </Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DREAM HOME VISION WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>

      {/* ── Page 3: Freewriting ──────────────────────────── */}
      <Page size="LETTER" style={s.notesPage}>
        <View style={s.notesHeaderCard}>
          <Text style={s.notesTitle}>Freewriting</Text>
          <Text style={s.notesSubtitle}>
            What kind of life do you want your home to support?
          </Text>
        </View>

        <View>
          {freewriteLines.map((_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DREAM HOME VISION WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 3</Text>
        </View>
      </Page>
    </Document>
  );
}
