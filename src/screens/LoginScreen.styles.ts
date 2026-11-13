import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: 10, marginBottom: 8 },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: C.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginTop: 14 },
  subtitle: { marginTop: 5 },
  forgotButton: { alignSelf: "flex-end", marginTop: -3, marginBottom: 16 },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
});
