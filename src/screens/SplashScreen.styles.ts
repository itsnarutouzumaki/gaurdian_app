import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  pageContent: { padding: 0, flex: 1, gap: 0 },
  root: { flex: 1, backgroundColor: C.primaryDark },
  hero: { flex: 1, justifyContent: "space-between" },
  heroImage: { opacity: 0.72 },
  brandBlock: {
    alignItems: "center",
    paddingTop: 72,
    paddingHorizontal: 24,
  },
  logoMark: {
    width: 78,
    height: 78,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#EBCB75",
    backgroundColor: "rgba(3,38,87,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
  schoolName: { marginTop: 18 },
  tagline: { marginTop: 7 },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 32,
  },
  sheetCopy: { marginTop: 9 },
  demoNote: { marginTop: 14 },
});
