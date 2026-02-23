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
  roomCard: {
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  roomName: {
    fontFamily: heading,
    fontWeight: 700,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ruleLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 8,
    color: colors.dark,
    marginBottom: 2,
  },
  ruleText: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  clearanceRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  clearanceItem: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    lineHeight: 1.5,
  },
  clearanceDim: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.accent,
    width: 55,
    flexShrink: 0,
  },
  clearanceDesc: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    flex: 1,
    lineHeight: 1.5,
  },
  dimRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  dimLabel: {
    fontFamily: bodyFont,
    fontWeight: 500,
    fontSize: 7.5,
    color: colors.dark,
    width: 80,
    flexShrink: 0,
  },
  dimValue: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    flex: 1,
  },
  proConRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  proConLabel: {
    fontFamily: bodyFont,
    fontWeight: 600,
    fontSize: 7.5,
    color: colors.dark,
    width: 60,
    flexShrink: 0,
  },
  proConValue: {
    fontFamily: bodyFont,
    fontWeight: 400,
    fontSize: 7.5,
    color: colors.body,
    flex: 1,
    lineHeight: 1.5,
  },
});

/* -- Component ------------------------------------------- */

export function RoomPlanningGuide() {
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
          <Text style={s.title}>Room Planning Guide</Text>
          <Text style={s.subtitle}>
            Standard dimensions, clearances, and planning guidelines for every
            room.
          </Text>
        </View>

        {/* Kitchen */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Kitchen</Text>
          </View>
          <View style={s.roomCard}>
            <Text style={s.ruleLabel}>Work Triangle</Text>
            <Text style={s.ruleText}>
              The distance between sink, stove, and refrigerator should total
              12-26 feet. Each leg should be 4-9 feet. No leg should cross a
              major traffic path.
            </Text>
            <Text style={s.ruleLabel}>Clearances</Text>
            <View style={s.clearanceRow}>
              <Text style={s.clearanceDim}>{"42\" min"}</Text>
              <Text style={s.clearanceDesc}>Between opposing counters (one cook)</Text>
            </View>
            <View style={s.clearanceRow}>
              <Text style={s.clearanceDim}>{"48\" ideal"}</Text>
              <Text style={s.clearanceDesc}>Between opposing counters (two cooks)</Text>
            </View>
            <View style={s.clearanceRow}>
              <Text style={s.clearanceDim}>{"36\" depth"}</Text>
              <Text style={s.clearanceDesc}>Standard counter depth including backsplash</Text>
            </View>
            <View style={s.clearanceRow}>
              <Text style={s.clearanceDim}>{"36\" height"}</Text>
              <Text style={s.clearanceDesc}>Standard counter height from floor</Text>
            </View>
            <View style={s.clearanceRow}>
              <Text style={s.clearanceDim}>{"18\" min"}</Text>
              <Text style={s.clearanceDesc}>Counter space on each side of the stove</Text>
            </View>
            <View style={s.clearanceRow}>
              <Text style={s.clearanceDim}>{"24\" min"}</Text>
              <Text style={s.clearanceDesc}>Counter space on one side of the sink</Text>
            </View>
          </View>
        </View>

        {/* Bathroom */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Bathroom</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              <View style={s.roomCard}>
                <Text style={s.ruleLabel}>Fixture Clearances</Text>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"15\" min"}</Text>
                  <Text style={s.clearanceDesc}>Toilet center to side wall</Text>
                </View>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"21\" min"}</Text>
                  <Text style={s.clearanceDesc}>Clear space in front of toilet</Text>
                </View>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"30\" min"}</Text>
                  <Text style={s.clearanceDesc}>Between toilet center and tub</Text>
                </View>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"24\" min"}</Text>
                  <Text style={s.clearanceDesc}>Clear space in front of sink</Text>
                </View>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.roomCard}>
                <Text style={s.ruleLabel}>Standard Sizes</Text>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"5' x 8'"}</Text>
                  <Text style={s.clearanceDesc}>Minimum full bath</Text>
                </View>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"3' x 6'"}</Text>
                  <Text style={s.clearanceDesc}>Minimum half bath</Text>
                </View>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"36\" x 36\""}</Text>
                  <Text style={s.clearanceDesc}>Minimum shower stall</Text>
                </View>
                <View style={s.clearanceRow}>
                  <Text style={s.clearanceDim}>{"60\" x 30\""}</Text>
                  <Text style={s.clearanceDesc}>Standard bathtub</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bedrooms */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Bedrooms</Text>
          </View>
          <View style={s.twoCol}>
            <View style={s.col}>
              <View style={s.roomCard}>
                <Text style={s.ruleLabel}>Minimum Sizes</Text>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Master bedroom</Text>
                  <Text style={s.dimValue}>{"14' x 16' (comfortable)"}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Secondary bedroom</Text>
                  <Text style={s.dimValue}>{"10' x 12' (comfortable)"}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Code minimum</Text>
                  <Text style={s.dimValue}>{"7' x 10' (70 sf)"}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Ceiling height</Text>
                  <Text style={s.dimValue}>{"7'-6\" min (8'+ ideal)"}</Text>
                </View>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.roomCard}>
                <Text style={s.ruleLabel}>Furniture Dimensions</Text>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>King bed</Text>
                  <Text style={s.dimValue}>{"76\" x 80\""}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Queen bed</Text>
                  <Text style={s.dimValue}>{"60\" x 80\""}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Twin bed</Text>
                  <Text style={s.dimValue}>{"38\" x 75\""}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Nightstand</Text>
                  <Text style={s.dimValue}>{"24\" x 24\" typical"}</Text>
                </View>
                <View style={s.dimRow}>
                  <Text style={s.dimLabel}>Dresser</Text>
                  <Text style={s.dimValue}>{"60\" x 18\" typical"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ROOM PLANNING GUIDE
          </Text>
          <Text style={s.footerAccent}>foacourse.com</Text>
        </View>
      </Page>

      {/* -- Page 2 -- */}
      <Page size="LETTER" style={s.page}>
        {/* Laundry */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Laundry</Text>
          </View>
          <View style={s.roomCard}>
            <Text style={s.ruleLabel}>Space Requirements</Text>
            <View style={s.dimRow}>
              <Text style={s.dimLabel}>Minimum area</Text>
              <Text style={s.dimValue}>{"5' x 6' (side-by-side washer/dryer)"}</Text>
            </View>
            <View style={s.dimRow}>
              <Text style={s.dimLabel}>Ideal area</Text>
              <Text style={s.dimValue}>{"6' x 9' (with folding counter and storage)"}</Text>
            </View>
            <View style={s.dimRow}>
              <Text style={s.dimLabel}>Stacked option</Text>
              <Text style={s.dimValue}>{"3' x 4' minimum (closet configuration)"}</Text>
            </View>
            <Text style={s.ruleText} />
            <Text style={s.ruleLabel}>Location Pros & Cons</Text>
            <View style={s.proConRow}>
              <Text style={s.proConLabel}>Near bedrooms:</Text>
              <Text style={s.proConValue}>Convenient for sorting and putting away; noise may be an issue</Text>
            </View>
            <View style={s.proConRow}>
              <Text style={s.proConLabel}>Near kitchen:</Text>
              <Text style={s.proConValue}>Efficient multitasking; shares plumbing runs; can feel crowded</Text>
            </View>
            <View style={s.proConRow}>
              <Text style={s.proConLabel}>In garage:</Text>
              <Text style={s.proConValue}>Out of living space; temperature extremes; less convenient</Text>
            </View>
            <View style={s.proConRow}>
              <Text style={s.proConLabel}>Basement:</Text>
              <Text style={s.proConValue}>Isolated from living areas; requires carrying loads up and down stairs</Text>
            </View>
          </View>
        </View>

        {/* Home Office */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionAccent} />
            <Text style={s.sectionTitle}>Home Office</Text>
          </View>
          <View style={s.roomCard}>
            <Text style={s.ruleLabel}>Space Requirements</Text>
            <View style={s.dimRow}>
              <Text style={s.dimLabel}>Minimum size</Text>
              <Text style={s.dimValue}>{"8' x 10' (80 sf) for one person"}</Text>
            </View>
            <View style={s.dimRow}>
              <Text style={s.dimLabel}>Comfortable</Text>
              <Text style={s.dimValue}>{"10' x 12' (120 sf) with bookshelves and guest seating"}</Text>
            </View>
            <Text style={s.ruleText} />
            <Text style={s.ruleLabel}>Considerations</Text>
            <Text style={s.ruleText}>
              Natural light from the side (not behind the screen) reduces glare. A
              door that closes is essential for video calls and focused work. Plan
              for adequate power outlets and data connections. Consider acoustic
              separation from high-traffic areas. A window with a view reduces
              eye strain and improves productivity.
            </Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>
            FOUNDATIONS OF ARCHITECTURE - ROOM PLANNING GUIDE
          </Text>
          <Text style={s.footerAccent}>Page 2</Text>
        </View>
      </Page>
    </Document>
  );
}
