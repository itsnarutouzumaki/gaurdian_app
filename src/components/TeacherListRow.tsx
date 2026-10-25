import React from "react";
import { View } from "react-native";
import { AppText, Avatar, Card } from "./UI";
import type { TeacherRecord } from "../types";
import { C } from "../theme";
import { styles } from "./TeacherListRow.styles";

export function TeacherListRow({
  teacher,
  onPress,
}: {
  teacher: TeacherRecord;
  onPress: () => void;
}) {
  return (
    <Card padding={12} onPress={onPress}>
      <View style={styles.row}>
        <Avatar name={teacher.name} uri={teacher.photoUrl} size={54} />
        <View style={styles.content}>
          <AppText size={13} weight="bold">
            {teacher.name}
          </AppText>
          <AppText size={11} color={C.muted} style={styles.subjects}>
            {teacher.subjects.join(", ")} Teacher
          </AppText>
          <AppText size={10} color={C.primary} style={styles.degree}>
            {teacher.highestDegree}
          </AppText>
          <AppText size={10} color={C.muted} style={styles.experience}>
            {teacher.experienceYears}+ years experience
          </AppText>
        </View>
        <AppText size={22} color={C.muted}>
          ›
        </AppText>
      </View>
    </Card>
  );
}
