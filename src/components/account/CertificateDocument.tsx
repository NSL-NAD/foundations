"use client";

import {
  Document,
  Font,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

/* ── Register brand fonts (client-side, from public dir) ── */
Font.register({
  family: "SpaceGrotesk",
  fonts: [
    { src: "/fonts/SpaceGrotesk-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/SpaceGrotesk-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/SpaceGrotesk-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/SpaceGrotesk-Bold.ttf", fontWeight: 700 },
  ],
});
Font.register({
  family: "Syne",
  fonts: [
    { src: "/fonts/Syne-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Syne-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Syne-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Syne-Bold.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Syne",
    backgroundColor: "#FFFFFF",
  },
  border: {
    border: "2px solid hsl(204, 25%, 47%)",
    borderRadius: 12,
    padding: 40,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    fontFamily: "SpaceGrotesk",
    fontWeight: 700,
    color: "hsl(204, 25%, 47%)",
    letterSpacing: 4,
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk",
    fontWeight: 400,
    color: "hsl(204, 25%, 47%)",
    letterSpacing: 6,
    textTransform: "uppercase",
    marginBottom: 40,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: "hsl(16, 55%, 48%)",
    marginBottom: 32,
  },
  certificateTitle: {
    fontSize: 26,
    fontFamily: "SpaceGrotesk",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 32,
  },
  studentName: {
    fontSize: 32,
    fontFamily: "SpaceGrotesk",
    fontWeight: 700,
    color: "hsl(204, 25%, 47%)",
    marginBottom: 20,
  },
  body: {
    fontSize: 12,
    fontFamily: "Syne",
    fontWeight: 400,
    color: "#444",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 32,
  },
  courseName: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: 32,
  },
  date: {
    fontSize: 11,
    fontFamily: "Syne",
    fontWeight: 400,
    color: "#666",
    letterSpacing: 1,
  },
  bottomDivider: {
    width: 80,
    height: 2,
    backgroundColor: "hsl(16, 55%, 48%)",
    marginTop: 40,
  },
});

interface CertificateDocumentProps {
  studentName: string;
  completionDate: string;
}

export function CertificateDocument({
  studentName,
  completionDate,
}: CertificateDocumentProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.logo}>FA</Text>
          <Text style={styles.schoolName}>Foundations of Architecture</Text>
          <View style={styles.divider} />
          <Text style={styles.certificateTitle}>Certificate of Completion</Text>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.body}>
            Has successfully completed all lessons of the Foundations of
            Architecture course, demonstrating understanding of architectural
            fundamentals, design principles, and spatial thinking.
          </Text>
          <Text style={styles.courseName}>
            Designing Your Dream Space
          </Text>
          <Text style={styles.date}>Completed {completionDate}</Text>
          <View style={styles.bottomDivider} />
        </View>
      </Page>
    </Document>
  );
}
