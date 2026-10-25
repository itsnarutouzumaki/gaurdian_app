import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  childField: { marginBottom: 16 },
  label: { marginBottom: 7 },
  spacer: { height: 15 },
  rangeError: { marginTop: 5 },
  submit: { marginTop: 17 },
  historyHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyReason: { marginTop: 5 },
  dateField: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    minHeight: 47,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
