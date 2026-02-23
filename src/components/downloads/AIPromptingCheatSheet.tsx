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
  formulaBox: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  formulaLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 6,
  },
  formulaText: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 10,
    color: "#FFFFFF",
    lineHeight: 1.6,
    letterSpacing: 0.3,
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
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
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
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
  exampleBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.brass,
  },
  exampleLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.brass,
    marginBottom: 4,
  },
  exampleText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.6,
  },
  vsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  vsCard: {
    flex: 1,
    borderRadius: 6,
    padding: 6,
  },
  vsLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 6.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  vsText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    lineHeight: 1.4,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 2,
  },
  bullet: {
    fontFamily: bodyFont,
    fontSize: 7,
    color: colors.accent,
    marginRight: 6,
    width: 6,
  },
  listText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
    flex: 1,
  },
  listLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.dark,
  },
});

/* -- Data ------------------------------------------------ */

const materials = [
  { bad: '"wood floor"', good: '"Warm oak wide-plank flooring"' },
  { bad: '"marble"', good: '"Honed Carrara marble countertops"' },
  { bad: '"black windows"', good: '"Blackened steel window frames"' },
  { bad: '"concrete"', good: '"Board-formed concrete walls"' },
  { bad: '"wood siding"', good: '"Natural cedar cladding with silver-grey patina"' },
];

const styles = [
  "Contemporary / Modern",
  "Mid-Century Modern",
  "Scandinavian Minimalist",
  "Mediterranean",
  "Craftsman",
  "Industrial",
  "Farmhouse",
  "Japanese / Zen",
];

const lighting = [
  { name: "Golden hour", desc: "Warm, directional, long shadows" },
  { name: "Overcast", desc: "Even, gentle, no harsh shadows" },
  { name: "Direct sunlight", desc: "High contrast, strong shadows" },
  { name: "Twilight / Blue hour", desc: "Cool ambient, interior glow" },
  { name: "Warm ambient", desc: "Cozy interior atmosphere" },
];

const cameras = [
  { name: "Eye-level", desc: "How a person sees the space" },
  { name: "Bird's eye / Aerial", desc: "Site context, landscape" },
  { name: "Worm's eye", desc: "Emphasizes verticality, drama" },
  { name: "Front elevation", desc: "Clean, architectural style" },
  { name: "3/4 perspective", desc: "Classic rendering angle" },
  { name: "Interior looking out", desc: "Frames views, inside/outside" },
];

const moods = [
  "Warm and inviting",
  "Clean and minimal",
  "Moody and dramatic",
  "Light and airy",
  "Cozy and intimate",
];

const mistakes = [
  { title: "Too vague", fix: 'Be specific about type, style, materials, and context' },
  { title: "Contradictory", fix: "Choose one direction — you can generate variations after" },
  { title: "No context", fix: "Include site, landscaping, sky, and time of day" },
  { title: "No scale", fix: 'Add people, furniture, or objects for proportion' },
  { title: "Over-prompting", fix: "Start with big moves, refine with follow-up prompts" },
];

/* -- Component ------------------------------------------- */

export function AIPromptingCheatSheet() {
  return (
    <Document>
      {/* ── Page 1: Formula + Vocabulary ──────────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>AI Prompting Cheat Sheet</Text>
          <Text style={s.subtitle}>
            Quick reference for writing effective architectural prompts.
          </Text>
        </View>

        {/* Prompt Formula */}
        <View style={s.formulaBox}>
          <Text style={s.formulaLabel}>The Architecture Prompt Formula</Text>
          <Text style={s.formulaText}>
            Subject / Building Type + Style + Materials + Lighting + Camera / View + Atmosphere / Mood + Technical Specs
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column */}
          <View style={s.col}>
            {/* Architectural Styles */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Architectural Styles</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryDesc}>{styles.join("  ·  ")}</Text>
              </View>
            </View>

            {/* Lighting */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Lighting Conditions</Text>
              </View>
              {lighting.map((l) => (
                <View key={l.name} style={s.listItem}>
                  <Text style={s.bullet}>·</Text>
                  <Text style={s.listText}>
                    <Text style={s.listLabel}>{l.name}</Text> — {l.desc}
                  </Text>
                </View>
              ))}
            </View>

            {/* Mood */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Atmosphere / Mood</Text>
              </View>
              <View style={s.entryCard}>
                <Text style={s.entryDesc}>{moods.join("  ·  ")}</Text>
              </View>
            </View>
          </View>

          {/* Right column */}
          <View style={s.col}>
            {/* Camera Angles */}
            <View style={{ marginBottom: 10 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Camera Angles</Text>
              </View>
              {cameras.map((c) => (
                <View key={c.name} style={s.listItem}>
                  <Text style={s.bullet}>·</Text>
                  <Text style={s.listText}>
                    <Text style={s.listLabel}>{c.name}</Text> — {c.desc}
                  </Text>
                </View>
              ))}
            </View>

            {/* Materials — Be Specific */}
            <View style={{ marginBottom: 0 }}>
              <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
                <View style={s.sectionAccent} />
                <Text style={s.sectionTitle}>Materials — Be Specific</Text>
              </View>
              {materials.map((m) => (
                <View key={m.bad} style={s.vsRow}>
                  <View style={{ ...s.vsCard, backgroundColor: "#FDF2F2" }}>
                    <Text style={{ ...s.vsLabel, color: colors.accent }}>Instead of</Text>
                    <Text style={s.vsText}>{m.bad}</Text>
                  </View>
                  <View style={{ ...s.vsCard, backgroundColor: "#F0F7F4" }}>
                    <Text style={{ ...s.vsLabel, color: "#3D7A5F" }}>Use</Text>
                    <Text style={s.vsText}>{m.good}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — AI PROMPTING CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>Page 1 · foacourse.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Example + Mistakes + Tips ────────── */}
      <Page size="LETTER" style={s.page}>
        {/* Example Prompt */}
        <View style={{ ...s.sectionHeader, marginBottom: 6 }}>
          <View style={s.sectionAccent} />
          <Text style={s.sectionTitle}>Example Prompt</Text>
        </View>
        <View style={{ ...s.exampleBox, padding: 8, marginBottom: 8 }}>
          <Text style={s.exampleLabel}>Complete Prompt</Text>
          <Text style={s.exampleText}>
            &quot;A two-story contemporary beach house with floor-to-ceiling glazing and white stucco exterior. Natural oak decking wraps around the front facade. Shot at golden hour with warm side lighting. Eye-level perspective from the garden looking at the main entrance. Lush coastal landscaping with ornamental grasses. Photorealistic render, 16:9 aspect ratio.&quot;
          </Text>
        </View>

        {/* Prompt Anatomy */}
        <View style={{ ...s.sectionHeader, marginBottom: 6 }}>
          <View style={s.sectionAccent} />
          <Text style={s.sectionTitle}>Prompt Anatomy</Text>
        </View>
        <View style={s.twoCol}>
          <View style={s.col}>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Subject</Text>
              <Text style={s.entryDesc}>Two-story contemporary beach house</Text>
            </View>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Style</Text>
              <Text style={s.entryDesc}>Contemporary, floor-to-ceiling glazing</Text>
            </View>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Materials</Text>
              <Text style={s.entryDesc}>White stucco, natural oak decking</Text>
            </View>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Lighting</Text>
              <Text style={s.entryDesc}>Golden hour, warm side lighting</Text>
            </View>
          </View>
          <View style={s.col}>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Camera</Text>
              <Text style={s.entryDesc}>Eye-level from garden, looking at entrance</Text>
            </View>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Atmosphere</Text>
              <Text style={s.entryDesc}>Lush coastal landscaping, ornamental grasses</Text>
            </View>
            <View style={{ ...s.entryCard, padding: 5, marginBottom: 3 }}>
              <Text style={s.entryName}>Technical</Text>
              <Text style={s.entryDesc}>Photorealistic render, 16:9 aspect ratio</Text>
            </View>
          </View>
        </View>

        {/* Common Mistakes + Pro Tips — side by side */}
        <View style={{ ...s.twoCol, marginTop: 8 }}>
          <View style={s.col}>
            <View style={{ ...s.sectionHeader, marginBottom: 6 }}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Common Mistakes</Text>
            </View>
            {mistakes.map((m) => (
              <View key={m.title} style={{ ...s.tipCard, padding: 6, marginBottom: 3 }}>
                <Text style={s.tipTitle}>{m.title}</Text>
                <Text style={s.tipText}>{m.fix}</Text>
              </View>
            ))}
          </View>
          <View style={s.col}>
            <View style={{ ...s.sectionHeader, marginBottom: 6 }}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Pro Tips</Text>
            </View>
            <View style={{ ...s.tipCard, padding: 6, marginBottom: 3 }}>
              <Text style={s.tipTitle}>Iterate, Don&apos;t Overload</Text>
              <Text style={s.tipText}>
                Start with big moves (form, style, mood) and refine in follow-up prompts. Multiple rounds beat one massive prompt.
              </Text>
            </View>
            <View style={{ ...s.tipCard, padding: 6, marginBottom: 3 }}>
              <Text style={s.tipTitle}>Use Your Course Vocabulary</Text>
              <Text style={s.tipText}>
                Material names, lighting terms, and spatial concepts from Modules 2-5 are exactly the language AI tools respond to best.
              </Text>
            </View>
            <View style={{ ...s.tipCard, padding: 6, marginBottom: 3 }}>
              <Text style={s.tipTitle}>Save What Works</Text>
              <Text style={s.tipText}>
                When you get a good result, save the exact prompt. Small variations on proven prompts beat starting from scratch.
              </Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — AI PROMPTING CHEAT SHEET
          </Text>
          <Text style={s.footerAccent}>Page 2 · foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
