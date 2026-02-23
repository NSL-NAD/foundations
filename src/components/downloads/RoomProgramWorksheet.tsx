import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  instructionText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8,
    color: colors.body,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  roomBlock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 6,
    marginBottom: 6,
  },
  roomBlockRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 3,
  },
  roomFieldGroup: {
    flex: 1,
  },
  roomFieldFull: {
    marginBottom: 2,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.dark,
    marginBottom: 3,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 3,
  },
  zoneLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.dark,
    marginRight: 2,
  },
  zoneOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  miniCheckbox: {
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: colors.checkboxBorder,
    borderRadius: 1,
  },
  miniLabel: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7,
    color: colors.body,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 3,
  },
  reqLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginBottom: 6,
  },
  totalsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  totalField: {
    flex: 1,
  },
  totalLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
    marginBottom: 5,
  },
  totalLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
});

/* -- Room Block Component -------------------------------- */

function RoomEntryBlock({ index }: { index: number }) {
  return (
    <View style={s.roomBlock}>
      {/* Room Name + Square Footage */}
      <View style={s.roomBlockRow}>
        <View style={s.roomFieldGroup}>
          <Text style={s.fieldLabel}>Room {index} - Name</Text>
          <View style={s.fieldLine} />
        </View>
        <View style={s.roomFieldGroup}>
          <Text style={s.fieldLabel}>Square Footage</Text>
          <View style={s.fieldLine} />
        </View>
      </View>

      {/* Zone + Priority on same row */}
      <View style={{ flexDirection: "row", gap: 20, marginBottom: 3 }}>
        <View style={s.zoneRow}>
          <Text style={s.zoneLabel}>Zone:</Text>
          <View style={s.zoneOption}>
            <View style={s.miniCheckbox} />
            <Text style={s.miniLabel}>Public</Text>
          </View>
          <View style={s.zoneOption}>
            <View style={s.miniCheckbox} />
            <Text style={s.miniLabel}>Private</Text>
          </View>
          <View style={s.zoneOption}>
            <View style={s.miniCheckbox} />
            <Text style={s.miniLabel}>Service</Text>
          </View>
        </View>
        <View style={s.priorityRow}>
          <Text style={s.zoneLabel}>Priority:</Text>
          <View style={s.zoneOption}>
            <View style={s.miniCheckbox} />
            <Text style={s.miniLabel}>Must Have</Text>
          </View>
          <View style={s.zoneOption}>
            <View style={s.miniCheckbox} />
            <Text style={s.miniLabel}>Want</Text>
          </View>
          <View style={s.zoneOption}>
            <View style={s.miniCheckbox} />
            <Text style={s.miniLabel}>Nice to Have</Text>
          </View>
        </View>
      </View>

      {/* Dimensions + Adjacent To */}
      <View style={s.roomBlockRow}>
        <View style={s.roomFieldGroup}>
          <Text style={s.fieldLabel}>Dimensions</Text>
          <View style={s.fieldLine} />
        </View>
        <View style={s.roomFieldGroup}>
          <Text style={s.fieldLabel}>Adjacent To</Text>
          <View style={s.fieldLine} />
        </View>
      </View>

      {/* Special Requirements — single line */}
      <View style={s.roomFieldFull}>
        <Text style={s.fieldLabel}>Special Requirements</Text>
        <View style={s.reqLine} />
      </View>
    </View>
  );
}

/* -- Component ------------------------------------------- */

export function RoomProgramWorksheet() {
  return (
    <Document>
      {/* -- Page 1: Rooms 1-4 -- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerCard}>
          <View style={s.header}>
            <Text style={s.logo}>FA</Text>
            <Text style={s.schoolName}>Foundations of Architecture</Text>
          </View>
          <View style={s.headerDivider} />
          <Text style={s.title}>Room Program Worksheet</Text>
          <Text style={s.subtitle}>
            Define every room in your home - name, size, adjacencies, and
            priority.
          </Text>
        </View>

        <Text style={s.instructionText}>
          List each room you need in your home. Assign a zone (Public spaces
          like living rooms, Private spaces like bedrooms, or Service spaces
          like laundry). Note which rooms should be adjacent to each other and
          rank each room by priority to help make trade-offs during design.
        </Text>

        {[1, 2, 3, 4].map((i) => (
          <RoomEntryBlock key={i} index={i} />
        ))}

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ROOM PROGRAM WORKSHEET
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2: Rooms 5-8 + Totals -- */}
      <Page size="LETTER" style={s.page}>
        {[5, 6, 7, 8].map((i) => (
          <RoomEntryBlock key={i} index={i} />
        ))}

        {/* Totals */}
        <View style={{ ...s.section, marginTop: 4 }}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Totals</Text>
          </View>

          <View style={s.totalsRow}>
            <View style={s.totalField}>
              <Text style={s.totalLabel}>Room Total (sf)</Text>
              <View style={s.totalLine} />
            </View>
            <View style={s.totalField}>
              <Text style={s.totalLabel}>Circulation (15-20%)</Text>
              <View style={s.totalLine} />
            </View>
            <View style={s.totalField}>
              <Text style={s.totalLabel}>Grand Total (sf)</Text>
              <View style={s.totalLine} />
            </View>
            <View style={s.totalField}>
              <Text style={s.totalLabel}>Budget Target (sf)</Text>
              <View style={s.totalLine} />
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ROOM PROGRAM WORKSHEET
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
