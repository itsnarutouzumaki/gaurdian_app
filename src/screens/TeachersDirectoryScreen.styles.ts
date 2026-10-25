import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  searchBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputWrap: { flex: 1 },
  searchInput: {
    fontSize: 13,
    color: C.text,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabsContent: { paddingRight: 8 },
  noResults: { marginTop: 5 },
});
