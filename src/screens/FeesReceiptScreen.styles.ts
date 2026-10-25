import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    minHeight: 47,
    paddingHorizontal: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  schoolName: { marginTop: 8 },
  receiptTitle: { marginTop: 13 },
  details: { paddingVertical: 13, gap: 6 },
  breakdownHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentMeta: { marginTop: 14, gap: 6 },
  download: { marginTop: 17 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 7,
  },
  infoLabel: { flex: 1 },
  infoValue: { flex: 1.25 },
});
