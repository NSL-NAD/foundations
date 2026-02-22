import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  instructions: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 9,
    color: colors.body,
    lineHeight: 1.6,
    marginBottom: 14,
  },
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
  promptHint: {
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
  exampleBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
  },
  exampleLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  exampleText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.7,
  },
  draftLabel: {
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
  hint: string;
  lines: number;
}

const reflectPrompts: Prompt[] = [
  {
    question: "What feelings do you want your space to create?",
    hint: "Calm, energy, warmth, openness, safety, joy — list the ones that matter most.",
    lines: 3,
  },
  {
    question: "What purpose does your space serve?",
    hint: "A retreat from the world, a gathering place, a creative studio, a launchpad for your day?",
    lines: 3,
  },
  {
    question: "What spaces have inspired you?",
    hint: "A cabin in the woods, a sunlit loft, a library with tall windows, a kitchen where everyone gathers.",
    lines: 3,
  },
];

const valuePrompts: Prompt[] = [
  {
    question: "What values should your home reflect?",
    hint: "Simplicity, connection, creativity, sustainability, privacy, openness — choose your top three.",
    lines: 2,
  },
  {
    question: "What goals should your home support?",
    hint: "How you live, work, rest, and connect with others.",
    lines: 2,
  },
];

/* ── Component ────────────────────────────────────────── */

function PromptBlock({ prompt }: { prompt: Prompt }) {
  const lines = Array.from({ length: prompt.lines });
  return (
    <View style={s.promptGroup}>
      <Text style={s.promptLabel}>{prompt.question}</Text>
      <Text style={s.promptHint}>{prompt.hint}</Text>
      {lines.map((_, i) => (
        <View key={i} style={s.writeLine} />
      ))}
    </View>
  );
}

export function VisionStatementWorksheet() {
  const draftLines = Array.from({ length: 12 });
  const revisedLines = Array.from({ length: 22 });

  return (
    <Document>
      {/* ── Page 1: Header + Step 1 Reflect ──────────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Vision Statement Worksheet</Text>
          <Text style={s.subtitle}>
            Write a short, focused statement that captures the essence of your
            design intentions — how you want to feel, how you want to live, and
            what your space should say about the life you are building.
          </Text>
        </View>

        {/* Step 1: Reflect */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Step 1: Reflect</Text>
          </View>
          <Text style={s.instructions}>
            Before you write, sit with these questions. You do not need formal
            answers — just let your thinking settle.
          </Text>
          {reflectPrompts.map((p) => (
            <PromptBlock key={p.question} prompt={p} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — VISION STATEMENT WORKSHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Step 2 + Example + Step 3 Draft ──────── */}
      <Page size="LETTER" style={s.page}>
        {/* Step 2: Values & Goals */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Step 2: Values &amp; Goals</Text>
          </View>
          {valuePrompts.map((p) => (
            <PromptBlock key={p.question} prompt={p} />
          ))}
        </View>

        {/* Example */}
        <View style={s.exampleBox}>
          <Text style={s.exampleLabel}>Example Vision Statement</Text>
          <Text style={s.exampleText}>
            &quot;My home is a place of calm and light. It connects me to the
            outdoors through large windows and natural materials. It is simple
            but warm, with spaces that invite conversation and corners that
            allow solitude. It reflects my belief that a good life does not
            require excess — just thoughtful choices, honest materials, and
            room to breathe.&quot;
          </Text>
        </View>

        {/* Step 3: Draft */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Step 3: Draft Your Statement</Text>
          </View>
          <Text style={s.instructions}>
            Write one paragraph (4-8 sentences) that weaves your reflections
            into a cohesive vision. Touch on the feelings your home should
            evoke, the values it should reflect, and the goals it should
            support. Do not worry about perfect prose — write honestly.
          </Text>
          <Text style={s.draftLabel}>Your Vision Statement</Text>
          {draftLines.map((_, i) => (
            <View key={i} style={s.writeLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — VISION STATEMENT WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>

      {/* ── Page 3: Revised Statement ────────────────────── */}
      <Page size="LETTER" style={s.notesPage}>
        <View style={s.notesHeaderCard}>
          <Text style={s.notesTitle}>Revised Statement</Text>
          <Text style={s.notesSubtitle}>
            Read your draft out loud. Revise until it sounds like you.
          </Text>
        </View>

        <View>
          {revisedLines.map((_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — VISION STATEMENT WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 3</Text>
        </View>
      </Page>
    </Document>
  );
}
