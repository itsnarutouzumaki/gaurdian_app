import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  schoolCard: { marginTop: -2 },
  schoolRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  flex: { flex: 1 },
  mutedLine: { marginTop: 2 },
  schoolButton: { marginTop: 12 },
  childRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  childMeta: { marginTop: 2 },
  childId: { marginTop: 3 },
  attendanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
    paddingTop: 10,
    borderTopColor: C.border,
    borderTopWidth: 1,
  },
  pendingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  quickLinks: { flexDirection: "row", gap: 8 },
  quickLink: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingVertical: 13,
    gap: 5,
  },
});
