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
  vocabCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  vocabTerm: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  vocabDef: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  spanRow: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 4,
  },
  spanRange: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8.5,
    color: colors.accent,
    width: 65,
    flexShrink: 0,
  },
  spanDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.5,
    flex: 1,
  },
  foundationCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  foundationName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 2,
  },
  foundationRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  foundationLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.dark,
    width: 65,
  },
  foundationValue: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    flex: 1,
    lineHeight: 1.5,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 1.2,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 1,
    flexShrink: 0,
  },
  checkLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8.5,
    color: colors.dark,
    flex: 1,
    lineHeight: 1.5,
  },
  issueCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  issueName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  issueDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
});

/* -- Data ------------------------------------------------ */

const vocabLeft = [
  {
    term: "Load-Bearing Wall",
    def: "A wall that supports weight from the structure above it - roof, floors, or other walls. Cannot be removed without adding a beam or header.",
  },
  {
    term: "Header / Lintel",
    def: "A horizontal structural member that spans an opening (door, window, or pass-through) and transfers the load above to the sides.",
  },
  {
    term: "Span",
    def: "The distance a beam, joist, or rafter can cover without intermediate support. Longer spans require deeper or stronger members.",
  },
];

const vocabRight = [
  {
    term: "Point Load",
    def: "A concentrated force applied at a single location, such as where a beam rests on a column. Requires adequate support below.",
  },
  {
    term: "Foundation",
    def: "The structural base that transfers the building weight to the ground. Type depends on soil conditions, climate, and building loads.",
  },
  {
    term: "Shear Wall",
    def: "A wall designed to resist lateral forces from wind or seismic activity. Typically uses plywood or structural sheathing.",
  },
];

const spanGuidelines = [
  { range: "Up to 12 ft", desc: "Standard wood joists and rafters. No special engineering typically required." },
  { range: "12 - 20 ft", desc: "Engineered lumber (LVL, TJI), doubled-up members, or steel beams may be needed." },
  { range: "20 - 30 ft", desc: "Steel beams, engineered trusses, or glulam beams required. Engineer involvement recommended." },
  { range: "30 ft +", desc: "Steel frame, heavy timber trusses, or specialized structural systems. Engineer required." },
];

const foundations = [
  {
    name: "Slab-on-Grade",
    bestFor: "Warm climates, flat lots, cost-effective builds",
    limitations: "No crawl space access, harder to modify plumbing later",
  },
  {
    name: "Crawl Space",
    bestFor: "Sloped sites, access to plumbing and HVAC, moisture-prone areas",
    limitations: "Requires ventilation and moisture control, limited headroom",
  },
  {
    name: "Full Basement",
    bestFor: "Cold climates (frost depth), bonus living or storage space",
    limitations: "Higher cost, waterproofing critical, not ideal for high water tables",
  },
  {
    name: "Pier and Post",
    bestFor: "Steep terrain, flood zones, decks, and light structures",
    limitations: "Limited insulation options, exposed underside, pier spacing matters",
  },
];

const engineerChecklist = [
  "Spans over 20 feet in any direction",
  "Removing or modifying a load-bearing wall",
  "Large window walls or openings over 8 feet wide",
  "Cantilevered sections (overhangs beyond the foundation)",
  "Multi-story construction or unusual roof loads",
  "Uncertain soil conditions or steep building sites",
  "Rooftop decks, green roofs, or heavy mechanical equipment",
];

const commonIssues = [
  {
    name: "Wall of Windows",
    desc: "Large expanses of glass eliminate shear wall capacity. Requires steel moment frames or engineered solutions to resist lateral loads.",
  },
  {
    name: "Cantilevers",
    desc: "Overhanging floors or balconies require back-span support at least 2x the cantilever distance. Material and connection design is critical.",
  },
  {
    name: "Open Floor Plans",
    desc: "Removing interior walls shifts loads to fewer points. Hidden beams, steel columns, or engineered headers must replace the removed support.",
  },
  {
    name: "Rooftop Decks",
    desc: "Additional dead load and live load on the roof structure. Requires waterproofing, drainage, and structural capacity verification.",
  },
];

/* -- Component ------------------------------------------- */

export function StructuralBasicsGuide() {
  return (
    <Document>
      {/* -- Page 1 -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Structural Basics Guide</Text>
          <Text style={s.subtitle}>
            Key structural concepts every homeowner should understand before
            designing.
          </Text>
        </View>

        {/* Key Vocabulary */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Key Vocabulary</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {vocabLeft.map((v) => (
                <View key={v.term} style={s.vocabCard}>
                  <Text style={s.vocabTerm}>{v.term}</Text>
                  <Text style={s.vocabDef}>{v.def}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {vocabRight.map((v) => (
                <View key={v.term} style={s.vocabCard}>
                  <Text style={s.vocabTerm}>{v.term}</Text>
                  <Text style={s.vocabDef}>{v.def}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Span Guidelines */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Span Guidelines</Text>
          </View>
          {spanGuidelines.map((sg) => (
            <View key={sg.range} style={s.spanRow}>
              <Text style={s.spanRange}>{sg.range}</Text>
              <Text style={s.spanDesc}>{sg.desc}</Text>
            </View>
          ))}
        </View>

        {/* Foundation Types */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Foundation Types</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {foundations.slice(0, 2).map((f) => (
                <View key={f.name} style={s.foundationCard}>
                  <Text style={s.foundationName}>{f.name}</Text>
                  <View style={s.foundationRow}>
                    <Text style={s.foundationLabel}>Best for:</Text>
                    <Text style={s.foundationValue}>{f.bestFor}</Text>
                  </View>
                  <View style={s.foundationRow}>
                    <Text style={s.foundationLabel}>Limitations:</Text>
                    <Text style={s.foundationValue}>{f.limitations}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {foundations.slice(2).map((f) => (
                <View key={f.name} style={s.foundationCard}>
                  <Text style={s.foundationName}>{f.name}</Text>
                  <View style={s.foundationRow}>
                    <Text style={s.foundationLabel}>Best for:</Text>
                    <Text style={s.foundationValue}>{f.bestFor}</Text>
                  </View>
                  <View style={s.foundationRow}>
                    <Text style={s.foundationLabel}>Limitations:</Text>
                    <Text style={s.foundationValue}>{f.limitations}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - STRUCTURAL BASICS GUIDE
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Engineer checklist & Common Issues -- */}
      <Page size="LETTER" style={s.page}>
        {/* When to Consult an Engineer */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>When to Consult an Engineer</Text>
          </View>
          {engineerChecklist.map((item) => (
            <View key={item} style={s.checkRow}>
              <View style={s.checkbox} />
              <Text style={s.checkLabel}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Common Structural Issues */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Common Structural Issues</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {commonIssues.slice(0, 2).map((issue) => (
                <View key={issue.name} style={s.issueCard}>
                  <Text style={s.issueName}>{issue.name}</Text>
                  <Text style={s.issueDesc}>{issue.desc}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {commonIssues.slice(2).map((issue) => (
                <View key={issue.name} style={s.issueCard}>
                  <Text style={s.issueName}>{issue.name}</Text>
                  <Text style={s.issueDesc}>{issue.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - STRUCTURAL BASICS GUIDE
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
