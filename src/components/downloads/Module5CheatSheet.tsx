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
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  entryName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8.5,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  entryDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1.2,
    borderColor: colors.checkboxBorder,
    borderRadius: 2,
    marginRight: 8,
    flexShrink: 0,
  },
  checkLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 8,
    color: colors.dark,
    flex: 1,
  },
  directionRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  directionLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
    width: 40,
    flexShrink: 0,
  },
  directionDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    flex: 1,
    lineHeight: 1.4,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  tipTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 8,
    color: colors.accent,
    marginBottom: 1,
  },
  tipText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
});

/* -- Data ------------------------------------------------ */

const passiveSolar = [
  { name: "Orient South", desc: "Longest walls face south for maximum winter sun exposure." },
  { name: "Thermal Mass", desc: "Dense materials (concrete, stone) absorb day heat, release it at night." },
  { name: "Overhangs", desc: "Shade south windows in summer (high sun), admit winter sun (low angle)." },
  { name: "Minimize West", desc: "West glass causes overheating — use small windows or shading." },
];

const glazing = [
  { dir: "South", desc: "Largest windows — consistent sun, easy to shade." },
  { dir: "North", desc: "Soft even light, no direct sun. Studios, offices." },
  { dir: "East", desc: "Morning light — welcome and manageable." },
  { dir: "West", desc: "Caution — low, hot afternoon sun. Shade needed." },
];

const ventilation = [
  { name: "Cross Ventilation", desc: "Openings on opposite walls pull breeze through the room." },
  { name: "Stack Effect", desc: "Warm air rises and exits high; cool air enters low." },
  { name: "Night Flushing", desc: "Open windows at night to cool thermal mass for the next day." },
];

const thermalConcepts = [
  { name: "Thermal Mass", desc: "Stone, concrete, brick store heat and smooth temperature swings." },
  { name: "Earth-Sheltering", desc: "Building into slopes uses soil as insulation on 3 sides." },
  { name: "Foundation Insulation", desc: "Rigid foam under slab and along perimeter cuts energy loss." },
  { name: "Geothermal", desc: "Ground-source heat pumps use stable earth temperature (50–60°F)." },
];

const textureEffects = [
  "Rough surfaces absorb sound; smooth surfaces reflect it",
  "Polished surfaces create glare; textured surfaces diffuse light",
  "Stone and tile feel cold underfoot; wood and cork feel warm",
  "Acoustic, luminous, and thermal effects are as important as looks",
];

const exerciseChecklist = [
  "Window sketch with sun angles marked",
  "Earth-sheltered cross-section drawn",
  "Site map: wind, sun, shade, sound",
  "Room A vs Room B texture comparison",
  "Environmental Response Diagram completed",
];

/* -- Component ------------------------------------------- */

export function Module5CheatSheet() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Module 5 Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Key concepts and quick references from Environmental Design.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Passive Solar */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Passive Solar Design</Text>
              </View>
              {passiveSolar.map((p) => (
                <View key={p.name} style={s.entryCard}>
                  <Text style={s.entryName}>{p.name}</Text>
                  <Text style={s.entryDesc}>{p.desc}</Text>
                </View>
              ))}
            </View>

            {/* Glazing by Facade */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Glazing by Facade</Text>
              </View>
              {glazing.map((g) => (
                <View key={g.dir} style={s.directionRow}>
                  <Text style={s.directionLabel}>{g.dir}</Text>
                  <Text style={s.directionDesc}>{g.desc}</Text>
                </View>
              ))}
            </View>

            {/* Ventilation */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Natural Ventilation</Text>
              </View>
              {ventilation.map((v) => (
                <View key={v.name} style={s.entryCard}>
                  <Text style={s.entryName}>{v.name}</Text>
                  <Text style={s.entryDesc}>{v.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Thermal Concepts */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Earth & Insulation</Text>
              </View>
              {thermalConcepts.map((t) => (
                <View key={t.name} style={s.entryCard}>
                  <Text style={s.entryName}>{t.name}</Text>
                  <Text style={s.entryDesc}>{t.desc}</Text>
                </View>
              ))}
            </View>

            {/* Texture Effects */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Texture Effects</Text>
              </View>
              {textureEffects.map((item) => (
                <View key={item} style={s.checkRow}>
                  <View style={s.checkbox} />
                  <Text style={s.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Exercise Checklist */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Exercise Checklist</Text>
              </View>
              {exerciseChecklist.map((item) => (
                <View key={item} style={s.checkRow}>
                  <View style={s.checkbox} />
                  <Text style={s.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - MODULE 5 CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
