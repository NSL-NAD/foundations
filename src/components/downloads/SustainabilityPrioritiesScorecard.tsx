import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  categoryNumber: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 16,
    color: colors.accent,
    opacity: 0.4,
  },
  strategyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingLeft: 4,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1.2,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 1,
    flexShrink: 0,
  },
  strategyText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.dark,
    flex: 1,
    lineHeight: 1.5,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingLeft: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    flexShrink: 0,
  },
  priorityLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.dark,
    flex: 1,
  },
  priorityLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    flex: 2,
    marginLeft: 8,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.muted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 10,
    opacity: 0.5,
  },
  roiCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 7,
    marginBottom: 4,
  },
  roiTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8,
    color: colors.accent,
    marginBottom: 1,
  },
  roiText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
});

/* -- Data ------------------------------------------------ */

const categories = [
  {
    name: "Sunlight & Orientation",
    strategies: [
      "Long walls oriented south for winter sun",
      "Overhangs sized for summer shade",
      "Largest windows on south face",
      "West glass minimized or well-shaded",
    ],
  },
  {
    name: "Airflow & Ventilation",
    strategies: [
      "Cross-ventilation paths through main rooms",
      "Operable windows on opposite walls",
      "Stack ventilation for multi-story spaces",
      "ERV/HRV for airtight envelope",
    ],
  },
  {
    name: "Thermal Mass & Insulation",
    strategies: [
      "Thermal mass on south-facing floors/walls",
      "Continuous insulation on building envelope",
      "Foundation insulation under slab and perimeter",
      "Thermal bridge-free detailing",
    ],
  },
  {
    name: "Energy & Water Systems",
    strategies: [
      "Solar PV panels oriented south",
      "Heat pump (air-source or geothermal)",
      "Energy-efficient windows (low-E, appropriate SHGC)",
      "Rainwater harvesting or greywater reuse",
    ],
  },
];

const roiTiers = [
  {
    title: "High ROI (Usually Worth It)",
    items: "Extra insulation, air sealing, proper orientation (free!), ceiling fans, energy-efficient windows in extreme climates.",
  },
  {
    title: "Medium ROI (Evaluate Carefully)",
    items: "Triple-pane windows, heat pump water heaters, ERV/HRV systems, rainwater harvesting.",
  },
  {
    title: "Long ROI (If Budget Allows)",
    items: "Geothermal HVAC (15-25 yr payback), green roofs, extensive solar thermal.",
  },
];

/* -- Component ------------------------------------------- */

export function SustainabilityPrioritiesScorecard() {
  return (
    <Document>
      {/* -- Page 1: Checklist -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Sustainability Priorities</Text>
          <Text style={s.subtitle}>
            Check the environmental strategies you plan to incorporate into your
            dream home. Use this scorecard to prioritize passive design decisions
            and active systems.
          </Text>
        </View>

        {categories.map((cat, ci) => (
          <View key={cat.name} style={s.categoryCard}>
            <View style={s.categoryHeader}>
              <Text style={s.categoryTitle}>{cat.name}</Text>
              <Text style={s.categoryNumber}>0{ci + 1}</Text>
            </View>
            {cat.strategies.map((strategy) => (
              <View key={strategy} style={s.strategyRow}>
                <View style={s.checkbox} />
                <Text style={s.strategyText}>{strategy}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - SUSTAINABILITY PRIORITIES
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: ROI + Narrative -- */}
      <Page size="LETTER" style={s.page}>
        {/* ROI Reference */}
        <View style={{ marginBottom: 12 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Cost-Benefit Reference</Text>
          </View>
          {roiTiers.map((tier) => (
            <View key={tier.title} style={s.roiCard}>
              <Text style={s.roiTitle}>{tier.title}</Text>
              <Text style={s.roiText}>{tier.items}</Text>
            </View>
          ))}
        </View>

        {/* Priority Ranking */}
        <View style={{ marginBottom: 12 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Your Top 5 Priorities</Text>
          </View>
          <Text style={{ ...s.subtitle, marginBottom: 8 }}>
            Rank your five most important environmental strategies.
          </Text>
          {[1, 2, 3, 4, 5].map((num) => (
            <View key={num} style={s.priorityRow}>
              <View
                style={{
                  ...s.priorityDot,
                  backgroundColor: num <= 2 ? colors.accent : colors.primary,
                }}
              />
              <Text style={s.priorityLabel}>{num}.</Text>
              <View style={s.priorityLine} />
            </View>
          ))}
        </View>

        {/* Environmental Narrative */}
        <View style={{ marginBottom: 0 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Environmental Response Narrative</Text>
          </View>
          <Text style={s.promptText}>
            Describe how your building design responds to sunlight, wind,
            thermal mass, and energy systems on your site.
          </Text>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={s.writeLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - SUSTAINABILITY PRIORITIES
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
