"use client";

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  border: {
    border: "2px solid hsl(204, 25%, 47%)",
    padding: 40,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "hsl(204, 25%, 47%)",
    letterSpacing: 4,
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 11,
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
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 32,
  },
  studentName: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "hsl(204, 25%, 47%)",
    marginBottom: 20,
  },
  body: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 32,
  },
  courseName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 32,
  },
  date: {
    fontSize: 11,
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
