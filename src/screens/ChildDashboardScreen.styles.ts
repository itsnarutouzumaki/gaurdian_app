import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1 },
  meta: { marginTop: 3 },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "48.4%",
    minHeight: 124,
    borderRadius: 18,
    padding: 14,
    justifyContent: "space-between",
  },
  tileSubtitle: { marginTop: 3 },
  leaveIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  summaryCell: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: "center",
  },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
});
