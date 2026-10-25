import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 7 },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  iconBox: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: { flex: 1 },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  message: { marginTop: 4, lineHeight: 17 },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  emptyHint: { marginTop: 4 },
});
