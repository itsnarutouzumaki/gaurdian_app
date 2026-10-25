import { StyleSheet } from "react-native";
import { C } from "../theme";

export const styles = StyleSheet.create({
  photoSection: { alignItems: "center", marginBottom: 18 },
  photoLabel: { marginBottom: 9 },
  editIcon: {
    position: "absolute",
    right: -1,
    bottom: 1,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  changePhoto: { marginTop: 9 },
  requiredNote: { marginTop: 6 },
  sampleHeading: { marginTop: 12, marginBottom: 8 },
  samplePhotos: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  samplePhoto: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 40,
    padding: 3,
  },
  samplePhotoSelected: { borderWidth: 2, borderColor: C.primary },
  save: { marginTop: 18 },
  schoolNote: { marginTop: 9 },
});
