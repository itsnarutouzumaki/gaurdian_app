import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  teacherRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  flex: { flex: 1 },
  meta: { marginTop: 2 },
  profileLink: { alignItems: "flex-end" },
  testRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  testMeta: { marginTop: 3 },
  score: { alignItems: "flex-end", marginRight: 2 },
  download: {
    width: 41,
    height: 41,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadOn: { backgroundColor: C.blueSoft },
  downloadOff: { backgroundColor: "#F0F2F6" },
  copyNote: { marginTop: 8 },
});
