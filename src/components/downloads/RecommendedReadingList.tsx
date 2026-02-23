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
  bookCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 8,
    marginBottom: 5,
  },
  bookTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 9,
    color: colors.dark,
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  bookAuthor: {
    fontFamily: heading,
    fontWeight: 500,
    fontSize: 7.5,
    color: colors.primary,
    marginBottom: 3,
  },
  bookDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
    lineHeight: 1.5,
  },
  categoryLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 6.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.brass,
    marginBottom: 4,
    paddingLeft: 2,
  },
});

/* -- Data ------------------------------------------------ */

const coreBooks = [
  {
    title: "101 Things I Learned in Architecture School",
    author: "Matthew Frederick",
    desc: "Compact, illustrated lessons on design principles, spatial relationships, and the mindset of an architect. The single best reinforcement of this course.",
  },
  {
    title: "The Timeless Way of Building",
    author: "Christopher Alexander",
    desc: "Architecture as a living art connected to human life. Explores the quality of wholeness that meaningful buildings share.",
  },
  {
    title: "Thinking Architecture",
    author: "Peter Zumthor",
    desc: "Essays on atmosphere, memory, and the sensory qualities of materials. Deepens your appreciation for why architecture matters beyond function.",
  },
  {
    title: "Sustainable Home",
    author: "Christine Liu",
    desc: "Practical guide to energy efficiency, material choices, and everyday decisions that make homes healthier and more environmentally responsible.",
  },
];

const additionalBooks = [
  {
    title: "A Pattern Language",
    author: "Christopher Alexander et al.",
    desc: "253 design patterns from town planning to window seats — a concrete vocabulary for describing what makes spaces feel right.",
  },
  {
    title: "The Not So Big House",
    author: "Sarah Susanka",
    desc: "Building smaller with greater craft and intention. Essential reading for anyone designing or renovating a home.",
  },
  {
    title: "How Buildings Learn",
    author: "Stewart Brand",
    desc: "How buildings change over time through the \"shearing layers\" framework — site, structure, skin, services, space plan, and stuff.",
  },
  {
    title: "The Architecture of Happiness",
    author: "Alain de Botton",
    desc: "How built environments affect mood, identity, and well-being. The cultural and emotional context that technical books often skip.",
  },
  {
    title: "Measure and Construction of the Japanese House",
    author: "Heino Engel",
    desc: "Traditional Japanese residential architecture covering proportion, modular coordination, and material honesty. A non-Western perspective on core course elements.",
  },
];

/* -- Component ------------------------------------------- */

export function RecommendedReadingList() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Recommended Reading List</Text>
          <Text style={s.subtitle}>
            Books for deeper exploration of architecture, design thinking, and the built environment.
          </Text>
        </View>

        <View style={s.twoCol}>
          {/* Left column — Core */}
          <View style={s.col}>
            <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Core Recommendations</Text>
            </View>
            <Text style={s.categoryLabel}>Start Here</Text>
            {coreBooks.map((b) => (
              <View key={b.title} style={s.bookCard}>
                <Text style={s.bookTitle}>{b.title}</Text>
                <Text style={s.bookAuthor}>{b.author}</Text>
                <Text style={s.bookDesc}>{b.desc}</Text>
              </View>
            ))}
          </View>

          {/* Right column — Additional */}
          <View style={s.col}>
            <View style={{ ...s.sectionHeader, marginBottom: 5 }}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Additional Reading</Text>
            </View>
            <Text style={s.categoryLabel}>Go Deeper</Text>
            {additionalBooks.map((b) => (
              <View key={b.title} style={s.bookCard}>
                <Text style={s.bookTitle}>{b.title}</Text>
                <Text style={s.bookAuthor}>{b.author}</Text>
                <Text style={s.bookDesc}>{b.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Closing note */}
        <View style={{
          backgroundColor: colors.primary,
          borderRadius: 6,
          padding: 10,
          marginTop: 10,
        }}>
          <Text style={{
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 7.5,
            color: "#FFFFFF",
            lineHeight: 1.5,
            textAlign: "center",
          }}>
            Architecture is a lifelong conversation — these books are an invitation to join it.
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE — RECOMMENDED READING LIST
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
