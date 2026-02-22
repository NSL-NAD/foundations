import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 1,
    flexShrink: 0,
  },
  checkContent: {
    flex: 1,
  },
  checkLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 9,
    color: colors.dark,
    marginBottom: 1,
  },
  checkDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  checkMeasure: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7.5,
    color: colors.primary,
  },
});

/* -- Data ------------------------------------------------ */

const sections: { title: string; items: { label: string; desc: string; measure?: string }[] }[] = [
  {
    title: "Entryways & Thresholds",
    items: [
      { label: "Zero-step entrance", desc: "At least one entry with no steps or thresholds", measure: "0\" rise" },
      { label: "Flush thresholds", desc: "No raised transitions at doorways", measure: "Max 1/2\" height" },
      { label: "Covered entry approach", desc: "Weather protection at main entrance", measure: "Min 5' depth" },
      { label: "Adequate exterior lighting", desc: "Clear visibility for safe approach", measure: "Entry illuminated" },
    ],
  },
  {
    title: "Doorways & Hallways",
    items: [
      { label: "Wide doorways", desc: "Comfortable passage for wheelchairs and walkers", measure: "Min 36\" clear" },
      { label: "Wide hallways", desc: "Room for two people or a wheelchair to pass", measure: "Min 42-48\" wide" },
      { label: "Lever handles", desc: "Operable with a closed fist - easier for all abilities", measure: "All doors" },
      { label: "Clear floor space at doors", desc: "Adequate maneuvering room on both sides", measure: "18\" pull side" },
    ],
  },
  {
    title: "Bathrooms",
    items: [
      { label: "Curbless shower option", desc: "Roll-in accessible, feels luxurious for all users", measure: "0\" curb" },
      { label: "Blocking for grab bars", desc: "Reinforced walls for future installation", measure: "All wet walls" },
      { label: "Accessible main floor bath", desc: "Half-bath usable by someone in a wheelchair", measure: "32\"+ door" },
      { label: "Non-slip flooring", desc: "Textured tile or slip-resistant material", measure: "All bath floors" },
      { label: "Comfort-height toilet", desc: "Easier to sit and stand", measure: "17-19\" seat height" },
    ],
  },
  {
    title: "Kitchen & Living Areas",
    items: [
      { label: "Varied counter heights", desc: "Work surfaces at different levels for seated and standing use", measure: "30-36\" range" },
      { label: "Pull-out shelves", desc: "Accessible storage without deep reaching", measure: "Lower cabinets" },
      { label: "Accessible controls", desc: "Front-mounted appliance controls", measure: "No rear reach" },
      { label: "Adequate aisle width", desc: "Room to move between counters and appliances", measure: "Min 42\" clear" },
    ],
  },
  {
    title: "Vertical Circulation",
    items: [
      { label: "Main floor living option", desc: "Master suite or convertible room on entry level", measure: "Bedroom + bath" },
      { label: "Elevator prep", desc: "Stacked closets or shaft space for future elevator", measure: "Min 5'x5' shaft" },
      { label: "Stair handrails", desc: "Continuous rails on both sides, graspable profile", measure: "34-38\" height" },
      { label: "Stair lighting", desc: "Illuminated treads for visibility", measure: "Each tread visible" },
    ],
  },
  {
    title: "Lighting & Controls",
    items: [
      { label: "Lowered switches", desc: "Reachable from a seated position", measure: "42-44\" height" },
      { label: "Raised outlets", desc: "Less bending required", measure: "18-24\" from floor" },
      { label: "Rocker or touch switches", desc: "Operable without pinching or twisting", measure: "All switches" },
      { label: "High-contrast switches", desc: "Visible against wall color for low vision", measure: "Contrasting plates" },
    ],
  },
  {
    title: "Outdoor Spaces",
    items: [
      { label: "Accessible pathways", desc: "Firm, level surfaces connecting outdoor areas", measure: "Min 36\" wide" },
      { label: "Ramp or grade access", desc: "No-step connection between levels", measure: "Max 1:12 slope" },
      { label: "Accessible garage entry", desc: "Wide door for wheelchair van access", measure: "Min 9' wide door" },
    ],
  },
];

/* -- Component ------------------------------------------- */

export function AccessibilityChecklist() {
  const allItems = sections.flatMap((sec) => sec.items);
  const midpoint = Math.ceil(sections.length / 2);
  const firstPageSections = sections.slice(0, midpoint);
  const secondPageSections = sections.slice(midpoint);

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
          <Text style={s.title}>Accessibility Checklist</Text>
          <Text style={s.subtitle}>
            Universal Design standards for residential spaces - {allItems.length}{" "}
            items to review for inclusive, future-proof design.
          </Text>
        </View>

        {firstPageSections.map((sec) => (
          <View key={sec.title} style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>{sec.title}</Text>
            </View>
            {sec.items.map((item) => (
              <View key={item.label} style={s.checkRow}>
                <View style={s.checkbox} />
                <View style={s.checkContent}>
                  <Text style={s.checkLabel}>
                    {item.label}
                    {item.measure ? (
                      <Text style={s.checkMeasure}> ({item.measure})</Text>
                    ) : null}
                  </Text>
                  <Text style={s.checkDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ACCESSIBILITY CHECKLIST
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2 -- */}
      <Page size="LETTER" style={s.page}>
        {secondPageSections.map((sec) => (
          <View key={sec.title} style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>{sec.title}</Text>
            </View>
            {sec.items.map((item) => (
              <View key={item.label} style={s.checkRow}>
                <View style={s.checkbox} />
                <View style={s.checkContent}>
                  <Text style={s.checkLabel}>
                    {item.label}
                    {item.measure ? (
                      <Text style={s.checkMeasure}> ({item.measure})</Text>
                    ) : null}
                  </Text>
                  <Text style={s.checkDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Visitability minimum */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>The {'"'}Visitability{'"'} Minimum</Text>
          </View>
          <View style={s.checkRow}>
            <View style={s.checkbox} />
            <View style={s.checkContent}>
              <Text style={s.checkLabel}>At least one zero-step entrance</Text>
            </View>
          </View>
          <View style={s.checkRow}>
            <View style={s.checkbox} />
            <View style={s.checkContent}>
              <Text style={s.checkLabel}>32{'"'}+ clear passage through main floor doors</Text>
            </View>
          </View>
          <View style={s.checkRow}>
            <View style={s.checkbox} />
            <View style={s.checkContent}>
              <Text style={s.checkLabel}>One wheelchair-accessible half-bath on main floor</Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ACCESSIBILITY CHECKLIST
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
