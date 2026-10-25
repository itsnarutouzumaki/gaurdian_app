import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  profile: { alignItems: "center" },
  name: { marginTop: 11 },
  email: { marginTop: 4 },
  mobile: { marginTop: 3 },
  badge: { marginTop: 10 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 7,
  },
  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  detail: { marginTop: 3 },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 7,
  },
  logoutIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: C.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
