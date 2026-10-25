import { StyleSheet } from "react-native";
import { C, R } from "../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: C.blueSoft,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 7,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    borderRadius: R.pill,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  dotButton: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { height: 6, borderRadius: R.pill },
  activeDot: { width: 14, backgroundColor: C.primary },
  inactiveDot: { width: 6, backgroundColor: C.muted },
});
