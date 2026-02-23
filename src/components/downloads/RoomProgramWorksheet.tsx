import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, bodyFont, common } from "./pdf-styles";

const s = StyleSheet.create({
  ...common,
  instructionText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 8.5,
    color: colors.body,
    lineHeight: 1.6,
    marginBottom: 14,
  },
  roomBlock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  roomBlockRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  roomFieldGroup: {
    flex: 1,
  },
  roomFieldFull: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
    marginBottom: 4,
  },
  fieldLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  zoneLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
    marginRight: 4,
  },
  zoneOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  miniCheckbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: colors.checkboxBorder,
    borderRadius: 1,
  },
  miniLabel: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  reqLine: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginBottom: 8,
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
    fontSize: 9,
    color: colors.dark,
    marginBottom: 6,
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
      {/* Room Name row */}
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

      {/* Zone */}
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

      {/* Priority */}
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

      {/* Special Requirements */}
      <View style={s.roomFieldFull}>
        <Text style={s.fieldLabel}>Special Requirements</Text>
        <View style={s.reqLine} />
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
