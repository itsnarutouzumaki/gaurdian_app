import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  meta: { marginTop: 3 },
  tabRow: { gap: 8, paddingVertical: 5, paddingBottom: 13 },
  examHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  totalPill: {
    minWidth: 55,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: C.blueSoft,
    alignItems: "center",
  },
  examSubjectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 7,
  },
  subjectName: { flex: 1 },
  download: { marginTop: 10 },
});
