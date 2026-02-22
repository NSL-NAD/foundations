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
    marginBottom: 10,
  },
  promptNumber: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 2,
  },
  promptLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 10,
    color: colors.dark,
    marginBottom: 2,
  },
  promptHint: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  writeLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 14,
    opacity: 0.5,
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
  number: string;
  question: string;
  hint: string;
  lines: number;
}

const prompts: Prompt[] = [
  {
    number: "01",
    question: "What emotions should your space evoke?",
    hint: "Describe the feelings you want to experience every day. Think about how different zones might create different moods.",
    lines: 2,
  },
  {
    number: "02",
    question: "How should function and beauty balance?",
    hint: "Are you drawn to minimalism where every object earns its place? Or layered, collected spaces where beauty comes from warmth?",
    lines: 2,
  },
  {
    number: "03",
    question: "What principles matter most to you?",
    hint: "Light, materiality, proportion, context, symmetry, emotional experience — which feel most essential to your vision?",
    lines: 2,
  },
  {
    number: "04",
    question: "What should your space say about you?",
    hint: "If your home could communicate one thing to anyone who walked through the door, what would it be?",
    lines: 2,
  },
];

/* ── Component ────────────────────────────────────────── */

function PromptBlock({ prompt }: { prompt: Prompt }) {
  const lines = Array.from({ length: prompt.lines });
  return (
    <View style={s.promptGroup}>
      <Text style={s.promptNumber}>{prompt.number}</Text>
      <Text style={s.promptLabel}>{prompt.question}</Text>
      <Text style={s.promptHint}>{prompt.hint}</Text>
      {lines.map((_, i) => (
        <View key={i} style={s.writeLine} />
      ))}
    </View>
  );
}

export function DesignPhilosophyWorksheet() {
  const draftLines = Array.from({ length: 18 });
  const revisedLines = Array.from({ length: 22 });

  return (
    <Document>
      {/* ── Page 1: Header + Reflection Prompts ────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Design Philosophy Worksheet</Text>
          <Text style={s.subtitle}>
            Use these prompts to clarify your design values, then weave your
            answers into a personal design philosophy — a statement of intent
            that will guide every decision you make from here.
          </Text>
        </View>

        {/* Reflection Prompts */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Reflection Prompts</Text>
          </View>
          <Text style={s.instructions}>
            Write a few sentences for each prompt. There are no wrong answers.
            Let your instincts guide you.
          </Text>
          {prompts.map((p) => (
            <PromptBlock key={p.number} prompt={p} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DESIGN PHILOSOPHY WORKSHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Your Design Philosophy Draft ───────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Your Design Philosophy</Text>
          </View>
          <Text style={s.instructions}>
            Weave your answers into a cohesive statement (1-3 paragraphs).
            Write in your own voice — it should sound like you, not a textbook.
            Start with your values, move through the qualities you want, and
            end with the kind of life your space should support.
          </Text>
          <Text style={s.draftLabel}>Draft</Text>
          {draftLines.map((_, i) => (
            <View key={i} style={s.writeLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DESIGN PHILOSOPHY WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>

      {/* ── Page 3: Revised Statement ────────────────── */}
      <Page size="LETTER" style={s.notesPage}>
        <View style={s.notesHeaderCard}>
          <Text style={s.notesTitle}>Revised Statement</Text>
          <Text style={s.notesSubtitle}>
            Read your draft aloud. Revise until it sounds like you.
          </Text>
        </View>

        <View>
          {revisedLines.map((_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DESIGN PHILOSOPHY WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 3</Text>
        </View>
      </Page>
    </Document>
  );
}
