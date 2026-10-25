import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  childField: { marginBottom: 15 },
  subjectLabel: { marginBottom: 7 },
  spacer: { height: 15 },
  counter: { alignItems: "flex-end", marginTop: -8, marginBottom: 12 },
  attachLabel: { marginBottom: 7 },
  attachment: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: C.border,
    borderRadius: 13,
    minHeight: 103,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFCFE",
    padding: 12,
  },
  attachTitle: { marginTop: 5 },
  attachHint: { marginTop: 3 },
  removeAttachment: { alignSelf: "flex-start", marginTop: 4 },
  submit: { marginTop: 16 },
  complaintHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  complaintMessage: { marginTop: 6 },
  complaintMeta: { marginTop: 7 },
  choiceField: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    minHeight: 45,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
