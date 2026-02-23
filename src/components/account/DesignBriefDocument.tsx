import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ============================================
// Brand Constants (matches pdf-styles.ts)
// ============================================
const brand = {
  primary: "#5F7F96",   // Slate blue
  accent: "#B8593B",    // Terracotta
  brass: "#C4A44E",     // Brass/gold
  dark: "#1a1a1a",
  body: "#333333",
  muted: "#666666",
  light: "#F5F3EE",     // Warm cream
  card: "#EDEBE4",      // Warm tan card bg
  white: "#FFFFFF",
  border: "#D4D0C8",
};

const heading = "SpaceGrotesk";
const bodyFont = "Syne";

// ============================================
// Color Palette Accents (user-selected)
// ============================================
const PALETTES = {
  classic: {
    primary: brand.primary,
    accent: brand.accent,
    sectionBg: "#EFF2F5",   // Light slate
  },
  warm: {
    primary: brand.accent,
    accent: brand.brass,
    sectionBg: "#FBF5EE",   // Warm cream
  },
  modern: {
    primary: brand.dark,
    accent: brand.primary,
    sectionBg: "#F3F3F3",   // Cool grey
  },
};

// ============================================
// Font Style Definitions (user-selected)
// The heading font always uses SpaceGrotesk (brand)
// The body font varies based on selection
// ============================================
const FONTS = {
  serif: {
    body: "Times-Roman",
    bodyBold: "Times-Bold",
    bodyItalic: "Times-Italic",
  },
  clean: {
    body: bodyFont,
    bodyBold: bodyFont,
    bodyItalic: bodyFont,
  },
  minimal: {
    body: "Courier",
    bodyBold: "Courier-Bold",
    bodyItalic: "Courier-Oblique",
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
  const pal = PALETTES[palette] || PALETTES.classic;
  const fonts = FONTS[fontStyle] || FONTS.clean;

  return StyleSheet.create({
    // ── Cover Page ──────────────────────────────
    coverPage: {
      padding: 60,
      fontFamily: fonts.body,
      backgroundColor: brand.white,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    coverHeaderCard: {
      backgroundColor: brand.card,
      borderRadius: 8,
      padding: 24,
      paddingBottom: 20,
      marginBottom: 40,
      width: "100%",
      alignItems: "center",
    },
    coverLogo: {
      fontFamily: heading,
      fontWeight: 700,
      fontSize: 32,
      letterSpacing: 4,
      color: pal.primary,
      marginBottom: 6,
    },
    coverSchool: {
      fontFamily: heading,
      fontWeight: 400,
      fontSize: 8,
      letterSpacing: 5,
      textTransform: "uppercase",
      color: brand.muted,
      marginBottom: 16,
    },
    coverDivider: {
      width: 80,
      height: 2,
      backgroundColor: pal.accent,
      marginBottom: 16,
    },
    coverLabel: {
      fontFamily: heading,
      fontWeight: 600,
      fontSize: 7,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: brand.muted,
      marginBottom: 8,
    },
    coverTitle: {
      fontSize: 26,
      fontFamily: heading,
      fontWeight: 700,
      color: brand.dark,
      textAlign: "center",
      marginBottom: 20,
      maxWidth: 380,
    },
    coverMetaCard: {
      backgroundColor: pal.sectionBg,
      borderRadius: 6,
      paddingVertical: 12,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "center",
      gap: 32,
    },
    coverMetaGroup: {
      alignItems: "center",
    },
    coverMetaLabel: {
      fontFamily: heading,
      fontWeight: 600,
      fontSize: 6,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: brand.muted,
      marginBottom: 3,
    },
    coverMetaValue: {
      fontFamily: fonts.body,
      fontSize: 10,
      color: brand.body,
    },
    coverFooter: {
      position: "absolute",
      bottom: 40,
      left: 60,
      right: 60,
      alignItems: "center",
    },
    coverFooterText: {
      fontFamily: heading,
      fontWeight: 400,
      fontSize: 7,
      letterSpacing: 2,
      color: brand.muted,
    },

    // ── Content Pages ───────────────────────────
    contentPage: {
      padding: 50,
      paddingBottom: 70,
      fontFamily: fonts.body,
      backgroundColor: brand.white,
    },

    // Page header bar
    pageHeaderBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: brand.border,
      marginBottom: 28,
    },
    pageHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    pageHeaderLogo: {
      fontFamily: heading,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: 2,
      color: pal.primary,
    },
    pageHeaderDivider: {
      width: 1,
      height: 12,
      backgroundColor: brand.border,
    },
    pageHeaderTitle: {
      fontFamily: heading,
      fontWeight: 400,
      fontSize: 7,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: brand.muted,
    },
    pageHeaderRight: {
      fontFamily: heading,
      fontWeight: 400,
      fontSize: 7,
      letterSpacing: 1,
      color: brand.muted,
    },

    // Section card
    sectionCard: {
      backgroundColor: pal.sectionBg,
      borderRadius: 8,
      padding: 24,
      paddingTop: 20,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionAccent: {
      width: 3,
      height: 16,
      backgroundColor: pal.accent,
      marginRight: 10,
      borderRadius: 2,
    },
    sectionNumber: {
      fontFamily: heading,
      fontWeight: 400,
      fontSize: 7,
      letterSpacing: 2,
      color: brand.muted,
      textTransform: "uppercase",
      marginRight: 8,
    },
    sectionTitle: {
      fontFamily: heading,
      fontWeight: 700,
      fontSize: 14,
      color: pal.primary,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    sectionDivider: {
      height: 1,
      backgroundColor: brand.border,
      opacity: 0.5,
      marginBottom: 14,
    },
    sectionContent: {
      fontFamily: fonts.body,
      fontWeight: 400,
      fontSize: 10,
      color: brand.body,
      lineHeight: 1.8,
    },
    paragraph: {
      marginBottom: 8,
    },

    // Footer
    footer: {
      position: "absolute",
      bottom: 28,
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
      color: brand.muted,
      letterSpacing: 1,
    },
    footerAccent: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: 7,
      color: pal.accent,
    },

    // Table of Contents
    tocPage: {
      padding: 50,
      paddingBottom: 70,
      fontFamily: fonts.body,
      backgroundColor: brand.white,
    },
    tocHeaderCard: {
      backgroundColor: brand.card,
      borderRadius: 8,
      padding: 20,
      marginBottom: 28,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tocTitle: {
      fontFamily: heading,
      fontWeight: 700,
      fontSize: 16,
      color: brand.dark,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    tocSubtitle: {
      fontFamily: bodyFont,
      fontWeight: 400,
      fontSize: 9,
      color: brand.muted,
    },
    tocItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: brand.border,
      borderBottomStyle: "dotted",
    },
    tocItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    tocItemNumber: {
      fontFamily: heading,
      fontWeight: 600,
      fontSize: 8,
      color: pal.accent,
      width: 18,
    },
    tocItemTitle: {
      fontFamily: heading,
      fontWeight: 500,
      fontSize: 10,
      color: brand.dark,
      letterSpacing: 0.5,
    },
    tocItemPage: {
      fontFamily: heading,
      fontWeight: 400,
      fontSize: 8,
      color: brand.muted,
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
  const s = createStyles(palette, font);

  // Group sections into pages — up to 2 short sections per page, or 1 long one
  // For now, keep it simple: one section per page for clarity
  return (
    <Document>
      {/* ── Cover Page ─────────────────────────────── */}
      <Page size="LETTER" style={s.coverPage}>
        <View style={s.coverHeaderCard}>
          <Text style={s.coverLogo}>FA</Text>
          <Text style={s.coverSchool}>Foundations of Architecture</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverLabel}>Design Brief</Text>
        </View>

        <Text style={s.coverTitle}>{briefTitle}</Text>

        <View style={s.coverMetaCard}>
          <View style={s.coverMetaGroup}>
            <Text style={s.coverMetaLabel}>Prepared By</Text>
            <Text style={s.coverMetaValue}>{studentName}</Text>
          </View>
          {firmName ? (
            <View style={s.coverMetaGroup}>
              <Text style={s.coverMetaLabel}>Prepared For</Text>
              <Text style={s.coverMetaValue}>{firmName}</Text>
            </View>
          ) : null}
          <View style={s.coverMetaGroup}>
            <Text style={s.coverMetaLabel}>Date</Text>
            <Text style={s.coverMetaValue}>{generatedDate}</Text>
          </View>
          <View style={s.coverMetaGroup}>
            <Text style={s.coverMetaLabel}>Sections</Text>
            <Text style={s.coverMetaValue}>{sections.length}</Text>
          </View>
        </View>

        <View style={s.coverFooter}>
          <Text style={s.coverFooterText}>foacourse.com</Text>
        </View>
      </Page>

      {/* ── Table of Contents ──────────────────────── */}
      <Page size="LETTER" style={s.tocPage}>
        <View style={s.tocHeaderCard}>
          <Text style={s.tocTitle}>Contents</Text>
          <Text style={s.tocSubtitle}>{sections.length} sections</Text>
        </View>

        {sections.map((section, i) => (
          <View key={i} style={s.tocItem}>
            <View style={s.tocItemLeft}>
              <Text style={s.tocItemNumber}>
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Text style={s.tocItemTitle}>{section.title}</Text>
            </View>
            <Text style={s.tocItemPage}>{i + 3}</Text>
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — DESIGN BRIEF
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>

      {/* ── Content Pages ──────────────────────────── */}
      {sections.map((section, i) => (
        <Page key={i} size="LETTER" style={s.contentPage}>
          {/* Page header bar */}
          <View style={s.pageHeaderBar}>
            <View style={s.pageHeaderLeft}>
              <Text style={s.pageHeaderLogo}>FA</Text>
              <View style={s.pageHeaderDivider} />
              <Text style={s.pageHeaderTitle}>{briefTitle}</Text>
            </View>
            <Text style={s.pageHeaderRight}>
              Section {i + 1} of {sections.length}
            </Text>
          </View>

          {/* Section content in a card */}
          <View style={s.sectionCard}>
            <View style={s.sectionHeader}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionNumber}>
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Text style={s.sectionTitle}>{section.title}</Text>
            </View>
            <View style={s.sectionDivider} />

            {section.content.split("\n\n").map((paragraph, pi) => {
              const trimmed = paragraph.replace(/\n/g, " ").trim();
              if (!trimmed) return null;
              return (
                <View key={pi} style={s.paragraph}>
                  <Text style={s.sectionContent}>{trimmed}</Text>
                </View>
              );
            })}
          </View>

          {/* Footer */}
          <View style={s.footer} fixed>
            <Text style={s.footerText}>
              FOUNDATIONS OF ARCHITECTURE — DESIGN BRIEF
            </Text>
            <Text style={s.footerAccent}>Page {i + 3}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
