import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: 10, marginBottom: 8 },
  logoMark: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: C.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginTop: 14 },
  subtitle: { marginTop: 5 },
  forgotButton: { alignSelf: "flex-end", marginTop: -3, marginBottom: 16 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
  demoBanner: {
    marginTop: 3,
    padding: 12,
    borderRadius: 12,
    backgroundColor: C.blueSoft,
  },
  demoCopy: { marginTop: 3 },
});
