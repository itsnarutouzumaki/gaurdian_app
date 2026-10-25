import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  contactRow: { flexDirection: "row", gap: 8 },
  contactButton: { flex: 1 },
  topicRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  topicIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: C.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  answer: { marginTop: 11, lineHeight: 19 },
  helpCopy: { marginTop: 5 },
  complaintButton: { marginTop: 12 },
});
