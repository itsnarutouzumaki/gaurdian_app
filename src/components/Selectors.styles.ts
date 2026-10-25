import { StyleSheet } from "react-native";
import { C } from "../theme";

export const selectorStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(13,26,47,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 26,
    maxHeight: "80%",
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#DCE2EB",
    alignSelf: "center",
    marginBottom: 14,
  },
  choice: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  radio: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: "#B9C4D3",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
