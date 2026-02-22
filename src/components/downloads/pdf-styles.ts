/**
 * Shared brand styles for all course PDF documents.
 * Re-exports colors, font family names, and common StyleSheet fragments.
 */

import { StyleSheet } from "@react-pdf/renderer";

/* ── Brand Colors ──────────────────────────────────────── */
export const colors = {
  primary: "#5F7F96", // Slate blue  hsl(204, 25%, 47%)
  accent: "#B8593B", // Terracotta  hsl(16, 55%, 48%)
  brass: "#C4A44E", // Brass/gold  hsl(38, 45%, 54%)
  dark: "#1a1a1a",
  body: "#333333",
  muted: "#666666",
  light: "#F5F3EE", // Warm cream
  card: "#EDEBE4", // Warm tan card bg  ~hsl(40, 14%, 93%)
  white: "#FFFFFF",
  border: "#D4D0C8",
  checkboxBorder: "#999999",
};

/* ── Brand Font Families ──────────────────────────────── */
export const heading = "SpaceGrotesk";
export const bodyFont = "Syne";

/* ── Common Styles ────────────────────────────────────── */
export const common = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: bodyFont,
    backgroundColor: colors.white,
  },

  /* Header Card */
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 24,
    paddingBottom: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
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
  headerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
    opacity: 0.6,
  },

  /* Title */
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
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.6,
  },

  /* Section Headers */
  section: {
    marginBottom: 14,
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

  /* Notes Page */
  notesPage: {
    padding: 50,
    fontFamily: bodyFont,
    backgroundColor: colors.white,
  },
  notesHeaderCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notesTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 16,
    color: colors.dark,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  notesSubtitle: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 9,
    color: colors.muted,
  },
  notesLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
    opacity: 0.4,
  },

  /* Footer */
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
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7,
    color: colors.accent,
  },

  /* Writable lines (for worksheets) */
  writeLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 20,
    opacity: 0.5,
  },

  /* Prompt / question text */
  promptText: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 10,
    color: colors.dark,
    marginBottom: 6,
  },
  promptHint: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    marginBottom: 10,
  },
});
