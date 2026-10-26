import { StyleSheet } from "react-native";
import { C } from "./src/theme";

export const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  screen: { flex: 1 },
  toastPosition: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 20,
  },
  toast: {
    borderRadius: 14,
    padding: 13,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  toastMessage: { marginTop: 3 },
  toastAction: { alignSelf: "flex-start", marginTop: 8, paddingVertical: 2 },
  logoutActions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 20,
  },
  logoutAction: { flex: 1 },
});
