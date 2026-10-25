import { StyleSheet } from "react-native";
import { C } from "../theme";

export const datePickerStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "rgba(13,26,47,0.48)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.blueSoft,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  day: {
    width: `${100 / 7}%`,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },
});
