import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  sectionBox: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sectionBoxTitle: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  sectionBoxPrompt: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7,
    color: colors.muted,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coverFieldLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 22,
    opacity: 0.5,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
    opacity: 0.5,
  },
  pageNumber: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.muted,
  },
});

/* -- Helpers ---------------------------------------------- */

const WriteLines = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={s.fieldLine} />
    ))}
  </>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={s.sectionHeader}>
    <View style={s.sectionAccent} />
    <Text style={s.sectionTitle}>{title}</Text>
  </View>
);

const Footer = ({ page }: { page: number }) => (
  <View style={s.footer}>
    <Text style={s.footerText}>
      FOUNDATIONS OF ARCHITECTURE - DESIGN BRIEF TEMPLATE
    </Text>
    <Text style={s.footerAccent}>Page {page}</Text>
  </View>
);

/* -- Component ------------------------------------------- */

export function DesignBriefTemplate() {
  return (
    <Document>
      {/* -- Page 1: Cover / Vision Statement -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Design Brief Template</Text>
          <Text style={s.subtitle}>
            Use this template to describe every section of your final design
            brief. Fill in each area with notes, decisions, and descriptions
            that capture your vision.
          </Text>
        </View>

        {/* Project Title / Student Name */}
        <View style={{ marginBottom: 6 }}>
          <Text style={s.fieldLabel}>Project Title</Text>
          <View style={s.coverFieldLine} />
          <Text style={s.fieldLabel}>Student Name</Text>
          <View style={s.coverFieldLine} />
        </View>

        {/* Vision Statement */}
        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Vision Statement</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe the feeling, purpose, and inspiration behind your dream
            home. What emotions should the space evoke? What values drive your
            choices? What images, places, or experiences inspired your vision?
          </Text>
          <WriteLines count={8} />
        </View>

        <Footer page={1} />
      </Page>

      {/* -- Page 2: Site Plan & Floor Plan -- */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Site Plan & Floor Plan" />

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Site Plan</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe how your building sits on its site. Consider orientation
            relative to the sun, outdoor spaces and landscape features, entry
            points and approach sequences, and the relationship between building
            and terrain.
          </Text>
          <WriteLines count={6} />
        </View>

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Floor Plan</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe how your interior spaces are organized. Consider room
            relationships and adjacencies, circulation paths and flow between
            spaces, furniture placement and spatial proportions, and wall
            openings that connect rooms or frame views.
          </Text>
          <WriteLines count={6} />
        </View>

        <Footer page={2} />
      </Page>

      {/* -- Page 3: Elevations & Section -- */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Elevations & Section" />

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Elevations</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe what your building looks like from the outside. Consider
            the materials and textures visible on each facade, the proportions
            and overall composition, and the rhythm and placement of windows and
            doors.
          </Text>
          <WriteLines count={6} />
        </View>

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Section (Optional but Encouraged)</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe the vertical experience of your building. Consider interior
            ceiling heights and volume changes, level changes or split-level
            conditions, and the relationship between structure, space, and light
            from above.
          </Text>
          <WriteLines count={6} />
        </View>

        <Footer page={3} />
      </Page>

      {/* -- Page 4: Environmental & Materials -- */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Environmental & Materials" />

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Environmental Diagram</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe how your design responds to its environment. Consider sun
            paths and how daylight enters your spaces, airflow patterns and
            natural ventilation strategies, shading devices and seasonal
            responses, and any passive or active energy systems you have
            selected.
          </Text>
          <WriteLines count={6} />
        </View>

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Materials Board</Text>
          <Text style={s.sectionBoxPrompt}>
            Describe the palette of materials, finishes, and systems that define
            your design. Consider the curated materials you selected and why,
            how finishes contribute to the tactile and visual character, and how
            your material choices support sustainability and performance.
          </Text>
          <WriteLines count={6} />
        </View>

        <Footer page={4} />
      </Page>

      {/* -- Page 5: Reflection & Notes -- */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Reflection & Notes" />

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Reflection</Text>
          <Text style={s.sectionBoxPrompt}>
            Reflect on your design journey. What part of the process inspired
            you most? What challenges did you encounter and overcome? How would
            you evolve your design with more time and learning?
          </Text>
          <WriteLines count={8} />
        </View>

        <View style={s.sectionBox}>
          <Text style={s.sectionBoxTitle}>Open Notes</Text>
          <Text style={s.sectionBoxPrompt}>
            Use this space for any additional thoughts, sketches, or ideas.
          </Text>
          <WriteLines count={10} />
        </View>

        <Footer page={5} />
      </Page>
    </Document>
  );
}
