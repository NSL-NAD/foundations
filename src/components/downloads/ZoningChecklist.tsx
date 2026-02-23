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
  termCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  termName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  termDef: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 9,
    color: colors.dark,
    marginBottom: 6,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginBottom: 2,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  writeLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
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
  checkContent: {
    flex: 1,
  },
  checkLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8.5,
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
  notesLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.4,
    marginBottom: 20,
  },
});

/* -- Data ------------------------------------------------ */

const termsLeft = [
  {
    name: "Setbacks",
    def: "The required minimum distance between your building and each property line. Usually different for front, side, and rear.",
  },
  {
    name: "Lot Coverage",
    def: "The maximum percentage of your lot that can be covered by structures, including the house, garage, and covered patios.",
  },
  {
    name: "FAR (Floor Area Ratio)",
    def: "The total building floor area divided by the lot area. A FAR of 0.5 on a 10,000 sf lot allows 5,000 sf of building.",
  },
];

const termsRight = [
  {
    name: "Height Limit",
    def: "The maximum allowed building height, measured from grade to the highest point. May be defined differently by jurisdiction.",
  },
  {
    name: "Use Restrictions",
    def: "Rules about what activities are permitted on the property - residential, commercial, mixed-use, home office, ADU, etc.",
  },
];

const propertyFields = [
  { label: "Front Setback" },
  { label: "Side Setback (Left)" },
  { label: "Side Setback (Right)" },
  { label: "Rear Setback" },
  { label: "Height Limit" },
  { label: "Max Lot Coverage %" },
  { label: "FAR" },
  { label: "Zoning Designation" },
];

const permitChecklist = [
  {
    label: "Submit Plans",
    desc: "Complete construction documents submitted to the building department for review.",
  },
  {
    label: "Plan Review",
    desc: "Department reviews plans for code compliance. Typically takes 2-8 weeks depending on jurisdiction.",
  },
  {
    label: "Revisions",
    desc: "Address any comments or corrections from the plan reviewer and resubmit.",
  },
  {
    label: "Permit Issued",
    desc: "Approved plans are stamped and the building permit is issued. Construction may begin.",
  },
  {
    label: "Inspections",
    desc: "Scheduled at key milestones: foundation, framing, rough-in, insulation, and final.",
  },
  {
    label: "Certificate of Occupancy",
    desc: "Final approval confirming the building meets all codes and is safe to occupy.",
  },
];

/* -- Component ------------------------------------------- */

export function ZoningChecklist() {
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
          <Text style={s.title}>Zoning & Code Checklist</Text>
          <Text style={s.subtitle}>
            Research and record the zoning requirements for your property.
          </Text>
        </View>

        {/* Key Terms */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Key Terms</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {termsLeft.map((t) => (
                <View key={t.name} style={s.termCard}>
                  <Text style={s.termName}>{t.name}</Text>
                  <Text style={s.termDef}>{t.def}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {termsRight.map((t) => (
                <View key={t.name} style={s.termCard}>
                  <Text style={s.termName}>{t.name}</Text>
                  <Text style={s.termDef}>{t.def}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Your Property Requirements */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Your Property Requirements</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              {propertyFields.slice(0, 4).map((field) => (
                <View key={field.label} style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>{field.label}</Text>
                  <View style={s.fieldLine} />
                </View>
              ))}
            </View>
            <View style={s.col}>
              {propertyFields.slice(4).map((field) => (
                <View key={field.label} style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>{field.label}</Text>
                  <View style={s.fieldLine} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Buildable Envelope */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Buildable Envelope</Text>
          </View>
          <View style={s.writeLine} />
          <View style={s.writeLine} />
          <View style={s.writeLine} />
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ZONING & CODE CHECKLIST
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Permit Process & HOA -- */}
      <Page size="LETTER" style={s.page}>
        {/* Permit Process Checklist */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Permit Process Checklist</Text>
          </View>
          {permitChecklist.map((item) => (
            <View key={item.label} style={s.checkRow}>
              <View style={s.checkbox} />
              <View style={s.checkContent}>
                <Text style={s.checkLabel}>{item.label}</Text>
                <Text style={s.checkDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* HOA / Deed Restrictions */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>HOA / Deed Restrictions</Text>
          </View>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ZONING & CODE CHECKLIST
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
