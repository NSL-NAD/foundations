import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  ruleBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  ruleLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  ruleDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  ruleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  ruleSize: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.dark,
  },
  ruleTarget: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.primary,
  },
  twoCol: {
    flexDirection: "row",
    gap: 14,
  },
  col: {
    flex: 1,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
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
    marginBottom: 2,
  },
  locationLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginTop: 2,
  },
  locationLabel: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.muted,
    marginTop: 3,
  },
  calcGroup: {
    marginBottom: 14,
  },
  calcLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 9,
    color: colors.dark,
    marginBottom: 6,
  },
  calcLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginBottom: 16,
  },
  calcHint: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.muted,
    marginBottom: 4,
  },
  notesLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.4,
    marginBottom: 20,
  },
});

/* -- Data ------------------------------------------------ */

interface CheckItem {
  label: string;
}

interface RoomSection {
  title: string;
  items: CheckItem[];
}

const roomSections: RoomSection[] = [
  {
    title: "Entryway / Mudroom",
    items: [
      { label: "Coat closet or hooks" },
      { label: "Shoe storage or bench" },
      { label: "Bag and key drop zone" },
      { label: "Seasonal gear storage" },
    ],
  },
  {
    title: "Kitchen / Pantry",
    items: [
      { label: "Walk-in or reach-in pantry" },
      { label: "Small appliance storage" },
      { label: "Baking and cooking supplies" },
      { label: "Bulk food and beverage storage" },
    ],
  },
  {
    title: "Bedrooms",
    items: [
      { label: "Walk-in or reach-in closet" },
      { label: "Dresser or built-in drawers" },
      { label: "Nightstand storage" },
      { label: "Under-bed or seasonal storage" },
    ],
  },
  {
    title: "Bathrooms",
    items: [
      { label: "Vanity cabinet or drawers" },
      { label: "Linen closet" },
      { label: "Medicine cabinet" },
      { label: "Cleaning supply storage" },
    ],
  },
  {
    title: "Utility / Mechanical",
    items: [
      { label: "Laundry storage and folding area" },
      { label: "Cleaning supply closet" },
      { label: "Water heater and HVAC access" },
      { label: "Tool and hardware storage" },
    ],
  },
  {
    title: "Garage / Outdoor",
    items: [
      { label: "Vehicle and bike storage" },
      { label: "Lawn and garden tools" },
      { label: "Sports and recreation gear" },
      { label: "Holiday and seasonal items" },
    ],
  },
];

/* -- Component ------------------------------------------- */

function CheckItemRow({ item }: { item: CheckItem }) {
  return (
    <View style={s.checkRow}>
      <View style={s.checkbox} />
      <View style={s.checkContent}>
        <Text style={s.checkLabel}>{item.label}</Text>
        <Text style={s.locationLabel}>Location & Size:</Text>
        <View style={s.locationLine} />
      </View>
    </View>
  );
}

export function StorageInventoryChecklist() {
  const firstPageSections = roomSections.slice(0, 3);
  const secondPageSections = roomSections.slice(3);

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
          <Text style={s.title}>Storage Inventory Checklist</Text>
          <Text style={s.subtitle}>
            Plan your storage needs room by room. Target: 10-15% of total floor
            area.
          </Text>
        </View>

        {/* 10% Rule */}
        <View style={s.ruleBox}>
          <Text style={s.ruleLabel}>The 10% Rule</Text>
          <Text style={s.ruleDesc}>
            A well-designed home dedicates 10-15% of its total floor area to
            storage. Use these quick references to set your storage targets:
          </Text>
          <View style={s.ruleRow}>
            <Text style={s.ruleSize}>1,500 sf home</Text>
            <Text style={s.ruleTarget}>150 - 225 sf storage</Text>
          </View>
          <View style={s.ruleRow}>
            <Text style={s.ruleSize}>2,500 sf home</Text>
            <Text style={s.ruleTarget}>250 - 375 sf storage</Text>
          </View>
          <View style={s.ruleRow}>
            <Text style={s.ruleSize}>4,000 sf home</Text>
            <Text style={s.ruleTarget}>400 - 600 sf storage</Text>
          </View>
        </View>

        {/* First 3 room sections */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>
                  {firstPageSections[0].title}
                </Text>
              </View>
              {firstPageSections[0].items.map((item) => (
                <CheckItemRow key={item.label} item={item} />
              ))}
            </View>
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>
                  {firstPageSections[2].title}
                </Text>
              </View>
              {firstPageSections[2].items.map((item) => (
                <CheckItemRow key={item.label} item={item} />
              ))}
            </View>
          </View>
          <View style={s.col}>
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>
                  {firstPageSections[1].title}
                </Text>
              </View>
              {firstPageSections[1].items.map((item) => (
                <CheckItemRow key={item.label} item={item} />
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - STORAGE INVENTORY CHECKLIST
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Remaining rooms + Calculation -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.twoCol}>
          <View style={s.col}>
            {secondPageSections.slice(0, 2).map((sec) => (
              <View key={sec.title} style={s.section}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionAccent} />
                  <Text style={s.sectionTitle}>{sec.title}</Text>
                </View>
                {sec.items.map((item) => (
                  <CheckItemRow key={item.label} item={item} />
                ))}
              </View>
            ))}
          </View>
          <View style={s.col}>
            {secondPageSections.slice(2).map((sec) => (
              <View key={sec.title} style={s.section}>
                <View style={s.sectionHeader}>
                  <View style={s.sectionAccent} />
                  <Text style={s.sectionTitle}>{sec.title}</Text>
                </View>
                {sec.items.map((item) => (
                  <CheckItemRow key={item.label} item={item} />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Storage Calculation */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Storage Calculation</Text>
          </View>

          <View style={s.calcGroup}>
            <Text style={s.calcLabel}>Total Storage Square Footage</Text>
            <Text style={s.calcHint}>
              Add up all storage areas from the checklist above.
            </Text>
            <View style={s.calcLine} />
          </View>

          <View style={s.calcGroup}>
            <Text style={s.calcLabel}>Total Home Square Footage</Text>
            <Text style={s.calcHint}>
              The total conditioned living area of your home.
            </Text>
            <View style={s.calcLine} />
          </View>

          <View style={s.calcGroup}>
            <Text style={s.calcLabel}>Storage Percentage</Text>
            <Text style={s.calcHint}>
              Divide storage sf by total sf and multiply by 100. Target: 10-15%.
            </Text>
            <View style={s.calcLine} />
          </View>
        </View>

        {/* Notes */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Notes</Text>
          </View>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - STORAGE INVENTORY CHECKLIST
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
