import React from "react";
import { View } from "react-native";
import { useApp } from "../app-context";
import { AppText, Card, InfoBanner, Page } from "../components/UI";
import { YearRibbon } from "../components/Selectors";
import { getAcademicYear, getChild, availableYears } from "../lib/selectors";
import { C } from "../theme";
import { styles } from "./ResultsScreen.styles";

export function ResultsScreen() {
  const {
    children,
    selectedChildId,
    selectedYear,
    setSelectedYear,
    setSelectedSubjectId,
    navigate,
    goBack,
  } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  return (
    <Page
      title="Results"
      subtitle={`${child.fullName} · ${year.label}`}
      onBack={goBack}
    >
      <YearRibbon
        years={availableYears(child)}
        value={year.label}
        onChange={setSelectedYear}
      />
      <InfoBanner
        title="Subject-wise results"
        message="Marks are shown only inside each test list. This subject overview intentionally does not display marks or question-wise scores."
      />
      {year.subjects.map((subject) => {
        return (
          <Card
            key={subject.id}
            padding={13}
            onPress={() => {
              /* subject teacher and tests belong to the selected academic year */ setSelectedSubjectId(
                subject.id,
              );
              navigate("SubjectResults", { subjectId: subject.id });
            }}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.icon,
                  { backgroundColor: `${subject.color}18` },
                ]}
              >
                <AppText size={21} color={subject.color} weight="bold">
                  {subject.icon}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText size={14} weight="bold">
                  {subject.name}
                </AppText>
                <AppText size={11} color={C.muted} style={styles.meta}>
                  {subject.tests.length} tests/exams · View records
                </AppText>
              </View>
              <AppText size={22} color={C.muted}>
                ›
              </AppText>
            </View>
          </Card>
        );
      })}
    </Page>
  );
}
