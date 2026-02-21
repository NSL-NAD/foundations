"use client";

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ============================================
// Color Palette Definitions
// ============================================
const PALETTES = {
  classic: {
    primary: "hsl(204, 25%, 47%)",   // Slate blue
    accent: "hsl(16, 55%, 48%)",     // Terracotta
    heading: "#1a1a1a",
    body: "#333333",
    muted: "#666666",
    bg: "#FFFFFF",
    sectionBg: "#f8f9fa",
  },
  warm: {
    primary: "hsl(16, 55%, 48%)",    // Terracotta
    accent: "hsl(42, 60%, 55%)",     // Warm gold/brass
    heading: "#2c1810",
    body: "#3d2b1f",
    muted: "#7a6a5e",
    bg: "#FFFDF9",
    sectionBg: "#fef7f0",
  },
  modern: {
    primary: "#1a1a1a",              // Near black
    accent: "hsl(204, 25%, 47%)",    // Slate blue
    heading: "#000000",
    body: "#2d2d2d",
    muted: "#666666",
    bg: "#FFFFFF",
    sectionBg: "#f5f5f5",
  },
};

// ============================================
// Font Style Definitions
// ============================================
const FONTS = {
  serif: {
    heading: "Times-Bold",
    body: "Times-Roman",
    accent: "Times-Italic",
  },
  clean: {
    heading: "Helvetica-Bold",
    body: "Helvetica",
    accent: "Helvetica-Oblique",
  },
  minimal: {
    heading: "Courier-Bold",
    body: "Courier",
    accent: "Courier-Oblique",
  },
};

type ColorPalette = keyof typeof PALETTES;
type FontStyle = keyof typeof FONTS;

export interface BriefSection {
  title: string;
  content: string;
}

export interface DesignBriefDocumentProps {
  briefTitle: string;
  firmName?: string;
  colorPalette: ColorPalette;
  fontStyle: FontStyle;
  sections: BriefSection[];
  studentName: string;
  generatedDate: string;
}

function createStyles(palette: ColorPalette, fontStyle: FontStyle) {
  const colors = PALETTES[palette] || PALETTES.classic;
  const fonts = FONTS[fontStyle] || FONTS.clean;

  return StyleSheet.create({
    // Cover page
    coverPage: {
      padding: 60,
      fontFamily: fonts.body,
      backgroundColor: colors.bg,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    coverLogo: {
      fontSize: 36,
      fontFamily: fonts.heading,
      color: colors.primary,
      letterSpacing: 6,
      marginBottom: 8,
    },
    coverSchool: {
      fontSize: 11,
      color: colors.primary,
      letterSpacing: 6,
      textTransform: "uppercase",
      marginBottom: 48,
    },
    coverDivider: {
      width: 100,
      height: 2,
      backgroundColor: colors.accent,
      marginBottom: 40,
    },
    coverTitle: {
      fontSize: 28,
      fontFamily: fonts.heading,
      color: colors.heading,
      textAlign: "center",
      marginBottom: 16,
      maxWidth: 400,
    },
    coverSubtitle: {
      fontSize: 13,
      fontFamily: fonts.accent,
      color: colors.muted,
      textAlign: "center",
      marginBottom: 40,
    },
    coverMeta: {
      fontSize: 10,
      color: colors.muted,
      letterSpacing: 1,
    },

    // Content pages
    contentPage: {
      padding: 60,
      paddingTop: 50,
      paddingBottom: 60,
      fontFamily: fonts.body,
      backgroundColor: colors.bg,
    },
    pageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.accent,
      paddingBottom: 10,
      marginBottom: 30,
    },
    pageHeaderText: {
      fontSize: 8,
      color: colors.muted,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: fonts.heading,
      color: colors.primary,
      marginBottom: 16,
      letterSpacing: 1,
    },
    sectionContent: {
      fontSize: 11,
      color: colors.body,
      lineHeight: 1.7,
      textAlign: "justify",
    },
    paragraph: {
      marginBottom: 10,
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 60,
      right: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerText: {
      fontSize: 8,
      color: colors.muted,
    },
  });
}

export function DesignBriefDocument({
  briefTitle,
  firmName,
  colorPalette,
  fontStyle,
  sections,
  studentName,
  generatedDate,
}: DesignBriefDocumentProps) {
  const palette = (colorPalette in PALETTES ? colorPalette : "classic") as ColorPalette;
  const font = (fontStyle in FONTS ? fontStyle : "clean") as FontStyle;
  const styles = createStyles(palette, font);

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverLogo}>FA</Text>
        <Text style={styles.coverSchool}>Foundations of Architecture</Text>
        <View style={styles.coverDivider} />
        <Text style={styles.coverTitle}>{briefTitle}</Text>
        {firmName && (
          <Text style={styles.coverSubtitle}>Prepared for {firmName}</Text>
        )}
        <Text style={styles.coverSubtitle}>
          {studentName}
        </Text>
        <Text style={styles.coverMeta}>{generatedDate}</Text>
      </Page>

      {/* Content Pages — one section per page */}
      {sections.map((section, i) => (
        <Page key={i} size="A4" style={styles.contentPage}>
          {/* Page header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderText}>{briefTitle}</Text>
            <Text style={styles.pageHeaderText}>
              Section {i + 1} of {sections.length}
            </Text>
          </View>

          {/* Section content */}
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.content.split("\n\n").map((paragraph, pi) => (
            <View key={pi} style={styles.paragraph}>
              <Text style={styles.sectionContent}>
                {paragraph.replace(/\n/g, " ").trim()}
              </Text>
            </View>
          ))}

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              Foundations of Architecture — Design Brief
            </Text>
            <Text style={styles.footerText}>Page {i + 2}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
