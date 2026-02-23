import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, heading, bodyFont, common } from "./pdf-styles";

const COLS = 32;
const ROWS = 24;
const CELL = 14;

const s = StyleSheet.create({
  ...common,
  reminderBox: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  reminderLabel: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 8,
    color: colors.accent,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  reminderText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.6,
  },
  gridContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
  },
  gridCell: {
    width: CELL,
    height: CELL,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
  },
  gridCellLeft: {
    width: CELL,
    height: CELL,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
  },
  gridCellTopLeft: {
    width: CELL,
    height: CELL,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
  },
  gridCellTop: {
    width: CELL,
    height: CELL,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  northArrow: {
    fontFamily: heading,
    fontWeight: 600,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  scaleText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.muted,
  },
});

/* -- Component ------------------------------------------- */

export function SitePlanGrid() {
  const rows = Array.from({ length: ROWS });
  const cols = Array.from({ length: COLS });

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Site Plan Grid</Text>
          <Text style={s.subtitle}>
            {"Use this grid to sketch your site plan at 1/8\" = 1'-0\" scale."}
          </Text>
        </View>

        {/* Reminder box */}
        <View style={s.reminderBox}>
          <Text style={s.reminderLabel}>Key Elements to Include</Text>
          <Text style={s.reminderText}>
            Property lines and boundaries, building footprint, north arrow,
            setback lines, driveway and access points, walkways and paths,
            trees and landscaping, utility connections, and any easements.
          </Text>
        </View>

        {/* Grid */}
        <View style={s.gridContainer}>
          {rows.map((_, r) => (
            <View key={r} style={s.gridRow}>
              {cols.map((_, c) => {
                const isTop = r === 0;
                const isLeft = c === 0;
                if (isTop && isLeft) {
                  return <View key={c} style={s.gridCellTopLeft} />;
                }
                if (isTop) {
                  return <View key={c} style={s.gridCellTop} />;
                }
                if (isLeft) {
                  return <View key={c} style={s.gridCellLeft} />;
                }
                return <View key={c} style={s.gridCell} />;
              })}
            </View>
          ))}
        </View>

        {/* Scale info */}
        <View style={s.scaleRow}>
          <Text style={s.northArrow}>{"N \u2192"}</Text>
          <Text style={s.scaleText}>
            {"Scale: 1/8\" = 1'-0\""}
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - SITE PLAN GRID
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>
    </Document>
  );
}
