import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

/* ── Brand Colors ──────────────────────────────────────── */
const colors = {
  primary: "#5F7F96",     // Slate blue  hsl(204, 25%, 47%)
  accent: "#B8593B",      // Terracotta  hsl(16, 55%, 48%)
  brass: "#C4A44E",       // Brass/gold  hsl(38, 45%, 54%)
  dark: "#1a1a1a",
  body: "#333333",
  muted: "#666666",
  light: "#F5F3EE",       // Warm cream
  white: "#FFFFFF",
  border: "#D4D0C8",
  checkboxBorder: "#999999",
};

/* ── Brand Fonts ───────────────────────────────────────── */
const heading = "SpaceGrotesk";  // Heading font (matches website)
const body = "Syne";            // Body font (matches website)

const s = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: body,
    backgroundColor: colors.white,
  },

  /* ── Header ──────────────────────────────────────────── */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  logo: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: 3,
    color: colors.primary,
  },
  schoolName: {
    fontFamily: heading,
    fontWeight: 400,
    fontSize: 8,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: colors.muted,
  },
  headerBar: {
    height: 3,
    backgroundColor: colors.primary,
    marginBottom: 4,
  },
  accentBar: {
    height: 1,
    backgroundColor: colors.accent,
    marginBottom: 24,
  },

  /* ── Title ───────────────────────────────────────────── */
  title: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 20,
    color: colors.dark,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: body,
    fontWeight: 400,
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.6,
    marginBottom: 24,
  },

  /* ── Sections ────────────────────────────────────────── */
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    backgroundColor: colors.accent,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  /* ── Checklist Items ─────────────────────────────────── */
  checkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 11,
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 1.2,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontFamily: body,
    fontWeight: 600,
    fontSize: 10,
    color: colors.dark,
  },
  itemDesc: {
    fontFamily: body,
    fontWeight: 400,
    fontSize: 9,
    color: colors.body,
    lineHeight: 1.5,
    marginTop: 1,
  },
  itemOptional: {
    fontFamily: body,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    marginTop: 1,
  },

  /* ── Notes Section ───────────────────────────────────── */
  notesBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 14,
    minHeight: 80,
  },
  notesLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 6,
  },
  notesLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
    opacity: 0.5,
  },

  /* ── Footer ──────────────────────────────────────────── */
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontFamily: heading,
    fontWeight: 400,
    fontSize: 7,
    color: colors.muted,
    letterSpacing: 1,
  },
  footerAccent: {
    fontFamily: body,
    fontWeight: 500,
    fontSize: 7,
    color: colors.accent,
  },
});

/* ── Data ──────────────────────────────────────────────── */

interface ChecklistItem {
  label: string;
  desc: string;
  optional?: boolean;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

const sections: ChecklistSection[] = [
  {
    title: "Drawing & Sketching Supplies",
    items: [
      {
        label: "Grid paper or plain drawing paper",
        desc: "Grid paper is especially helpful for floor plans and spatial exercises. Letter or A4 size works well.",
      },
      {
        label: "Straightedge and triangles",
        desc: "A basic ruler (12\u201318 inches) and a 45\u00b0 or 30/60\u00b0 triangle for clean lines and accurate angles.",
      },
      {
        label: "Architectural scale",
        desc: "A three-sided ruler for drawing at scale. We will explain how to use it in Module 3.",
      },
      {
        label: "Mechanical pencil (0.5mm or 0.7mm)",
        desc: "Gives you consistent line weight. Pick up a few lead refills too.",
      },
      {
        label: "Eraser",
        desc: "A good quality white eraser lets you iterate without smudging.",
      },
      {
        label: "Colored pencils or markers",
        desc: "Helpful for adding emphasis, distinguishing zones on a floor plan, or mood boards.",
        optional: true,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        label: "Folder, binder, or digital portfolio",
        desc: "Keep your exercises, sketches, and notes in one place. By the end of the course, you will have a personal design portfolio worth holding onto.",
      },
      {
        label: "Notebook or journal",
        desc: "For jotting down ideas, sketching thumbnails, or reflecting on lessons. A simple composition book works great.",
        optional: true,
      },
    ],
  },
  {
    title: "Digital Tools",
    items: [
      {
        label: "Computer or tablet with internet access",
        desc: "For accessing the course, watching videos, and using the AI chat assistant.",
      },
      {
        label: "Scanner or phone camera",
        desc: "To digitize your hand-drawn work for your portfolio or design brief uploads.",
        optional: true,
      },
    ],
  },
];

/* ── Component ─────────────────────────────────────────── */

function CheckItem({ item }: { item: ChecklistItem }) {
  return (
    <View style={s.checkItem}>
      <View style={s.checkbox} />
      <View style={s.itemContent}>
        <Text style={s.itemLabel}>{item.label}</Text>
        <Text style={s.itemDesc}>{item.desc}</Text>
        {item.optional && (
          <Text style={s.itemOptional}>Optional — nice to have but not required</Text>
        )}
      </View>
    </View>
  );
}

export function MaterialsChecklist() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>FA</Text>
          <Text style={s.schoolName}>Foundations of Architecture</Text>
        </View>
        <View style={s.headerBar} />
        <View style={s.accentBar} />

        {/* Title */}
        <Text style={s.title}>Materials Checklist</Text>
        <Text style={s.subtitle}>
          Everything you need for the course. Most items are common art supplies
          you may already have at home. Optional items are marked — skip them if
          you prefer to keep things simple.
        </Text>

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.title} style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item) => (
              <CheckItem key={item.label} item={item} />
            ))}
          </View>
        ))}

        {/* Notes */}
        <View style={s.notesBox}>
          <Text style={s.notesLabel}>Notes</Text>
          <View style={s.notesLine} />
          <View style={s.notesLine} />
          <View style={s.notesLine} />
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — MATERIALS CHECKLIST
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
