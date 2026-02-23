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
  tableHeader: {
    flexDirection: "row",
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7,
    color: colors.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  materialName: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.dark,
    flex: 1,
  },
  costRange: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    width: 80,
    textAlign: "right",
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
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
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  systemRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  systemName: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.dark,
    flex: 1,
  },
  systemCost: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    width: 140,
    textAlign: "right",
  },
});

/* -- Data ------------------------------------------------ */

const flooring = [
  { name: "Carpet", cost: "$3–$8" },
  { name: "Laminate", cost: "$4–$10" },
  { name: "Engineered hardwood", cost: "$8–$15" },
  { name: "Solid hardwood", cost: "$12–$25" },
  { name: "Tile (porcelain)", cost: "$10–$20" },
  { name: "Natural stone", cost: "$20–$50+" },
];

const countertops = [
  { name: "Laminate", cost: "$20–$50" },
  { name: "Butcher block", cost: "$40–$100" },
  { name: "Quartz", cost: "$75–$150" },
  { name: "Granite", cost: "$80–$175" },
  { name: "Marble", cost: "$125–$250+" },
];

const siding = [
  { name: "Vinyl", cost: "$3–$8" },
  { name: "Fiber cement", cost: "$6–$12" },
  { name: "Wood", cost: "$8–$20" },
  { name: "Brick / stone veneer", cost: "$15–$35" },
  { name: "Natural stone", cost: "$35–$75+" },
];

const systems = [
  { name: "Radiant floor heating", cost: "Add $10–$20/sf over forced air" },
  { name: "Geothermal HVAC", cost: "$20k–$50k+ premium" },
  { name: "Whole-house generator", cost: "$10k–$30k installed" },
  { name: "Solar PV system", cost: "$15k–$40k (before incentives)" },
];

const tips = [
  {
    title: "Splurge Where It Counts",
    text: "Invest in high-impact areas you see and touch every day — kitchen, master bath, entry. Economize on background spaces like secondary bedrooms and utility areas.",
  },
  {
    title: "Material Grades Matter",
    text: "Within any category, there are budget, mid-range, and premium options. A mid-range quartz countertop can look as good as marble at half the cost.",
  },
  {
    title: "Installation Adds Up",
    text: "Material cost is only part of the picture. Complex patterns, specialty cuts, and difficult substrates can double installation labor.",
  },
];

/* -- Component ------------------------------------------- */

export function MaterialCostGuide() {
  const renderTable = (
    data: { name: string; cost: string }[],
    unit: string
  ) => (
    <>
      <View style={s.tableHeader}>
        <Text style={{ ...s.tableHeaderText, flex: 1 }}>Material</Text>
        <Text style={{ ...s.tableHeaderText, width: 80, textAlign: "right" }}>
          {unit}
        </Text>
      </View>
      {data.map((item, i) => (
        <View key={item.name} style={i % 2 === 1 ? s.tableRowAlt : s.tableRow}>
          <Text style={s.materialName}>{item.name}</Text>
          <Text style={s.costRange}>{item.cost}</Text>
        </View>
      ))}
    </>
  );

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Material Cost Guide</Text>
          <Text style={s.subtitle}>
            Typical installed cost ranges for common residential materials and
            systems. Use these as a planning reference — actual costs vary by
            region, supplier, and project scope.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Flooring */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Flooring (per sf installed)</Text>
              </View>
              {renderTable(flooring, "Cost / sf")}
            </View>

            {/* Countertops */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>
                  Countertops (per sf installed)
                </Text>
              </View>
              {renderTable(countertops, "Cost / sf")}
            </View>

            {/* Exterior Siding */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>
                  Exterior Siding (per sf installed)
                </Text>
              </View>
              {renderTable(siding, "Cost / sf")}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Systems Upgrades */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Systems Upgrades</Text>
              </View>
              <View style={s.tableHeader}>
                <Text style={{ ...s.tableHeaderText, flex: 1 }}>System</Text>
                <Text
                  style={{
                    ...s.tableHeaderText,
                    width: 140,
                    textAlign: "right",
                  }}
                >
                  Premium
                </Text>
              </View>
              {systems.map((item, i) => (
                <View
                  key={item.name}
                  style={i % 2 === 1 ? s.tableRowAlt : s.systemRow}
                >
                  <Text style={s.systemName}>{item.name}</Text>
                  <Text style={s.systemCost}>{item.cost}</Text>
                </View>
              ))}
            </View>

            {/* Budget Tips */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Budget Tips</Text>
              </View>
              {tips.map((tip) => (
                <View key={tip.title} style={s.tipCard}>
                  <Text style={s.tipTitle}>{tip.title}</Text>
                  <Text style={s.tipText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MATERIAL COST GUIDE
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
