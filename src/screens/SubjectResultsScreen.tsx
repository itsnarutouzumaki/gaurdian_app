import React from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  AppText,
  Avatar,
  Card,
  InfoBanner,
  Page,
} from "../components/UI";
import { getAcademicYear, getChild, getTeacher } from "../lib/selectors";
import { dateLabel, scoreLabel } from "../lib/format";
import { C } from "../theme";
import { styles } from "./SubjectResultsScreen.styles";

export function SubjectResultsScreen() {
  const {
    children,
    selectedChildId,
    selectedYear,
    selectedSubjectId,
    setSelectedTeacherId,
    navigate,
    goBack,
    teachers,
  } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  const subject =
    year.subjects.find((item) => item.id === selectedSubjectId) ||
    year.subjects.find((item) => item.name === selectedSubjectId) ||
    year.subjects[0];
  const teacher = getTeacher(teachers, subject.teacherId);
  return (
    <Page
      title={subject.name}
      subtitle={`Test history · ${year.label}`}
      onBack={goBack}
    >
      <Card
        padding={12}
        onPress={() => {
          setSelectedTeacherId(teacher.id);
          navigate("TeacherProfile");
        }}
      >
        <View style={styles.teacherRow}>
          <Avatar name={teacher.name} uri={teacher.photoUrl} size={50} />
          <View style={styles.flex}>
            <AppText size={13} weight="bold">
              {teacher.name}
            </AppText>
            <AppText size={11} color={C.muted} style={styles.meta}>
              {teacher.highestDegree}
            </AppText>
            <AppText size={10} color={C.muted} style={styles.meta}>
              {teacher.designation}
            </AppText>
          </View>
          <View style={styles.profileLink}>
            <AppText size={10} color={C.primary} weight="semibold">
              View profile
            </AppText>
            <AppText size={18} color={C.primary}>
              ›
            </AppText>
          </View>
        </View>
      </Card>
      <InfoBanner
        title="Scanned answer copies"
        message="Scanned answer copies aren't available right now."
      />
      {subject.tests
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((test) => (
          <Card key={test.id} padding={13}>
            <View style={styles.testRow}>
              <View style={styles.flex}>
                <AppText size={13} weight="bold">
                  {test.name}
                </AppText>
                <AppText size={11} color={C.muted} style={styles.testMeta}>
                  {dateLabel(test.date)}
                </AppText>
              </View>
              <View style={styles.score}>
                <AppText
                  size={16}
                  weight="bold"
                  color={
                    test.score / test.maxScore >= 0.75 ? C.success : C.text
                  }
                >
                  {scoreLabel(test.score, test.maxScore)}
                </AppText>
                <AppText size={9} color={C.muted}>
                  Marks
                </AppText>
              </View>
            </View>
          </Card>
        ))}
    </Page>
  );
}
