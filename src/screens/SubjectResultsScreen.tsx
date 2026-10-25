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
import { shareDemoPdf } from "../lib/pdf";
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
        message="Tap the download icon to create a sample PDF and open the phone share sheet. The PDF does not render inside this app. In production, this will use the school-uploaded scan."
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
              <Pressable
                disabled={!test.copyAvailable}
                onPress={() =>
                  shareDemoPdf(
                    `${child.fullName}-${subject.name}-${test.name}`,
                    [
                      `Student: ${child.fullName}`,
                      `Class: ${year.className} · Section ${year.section}`,
                      `Subject: ${subject.name}`,
                      `Assessment: ${test.name}`,
                      `Date: ${dateLabel(test.date)}`,
                      "",
                      "SAMPLE SCANNED ANSWER COPY",
                      "This locally generated PDF is a placeholder for the original scanned copy uploaded by the school.",
                      "It intentionally does not include any question-wise marks in the app interface.",
                      "",
                      "Replace this mock document with the approved school document when backend storage is connected.",
                    ],
                  )
                }
                style={[
                  styles.download,
                  test.copyAvailable ? styles.downloadOn : styles.downloadOff,
                ]}
              >
                <AppText
                  size={20}
                  color={test.copyAvailable ? C.primary : "#A6AFBC"}
                >
                  ⇩
                </AppText>
              </Pressable>
            </View>
            {!test.copyAvailable ? (
              <AppText size={10} color={C.muted} style={styles.copyNote}>
                Scanned copy not uploaded by school yet.
              </AppText>
            ) : null}
          </Card>
        ))}
    </Page>
  );
}
