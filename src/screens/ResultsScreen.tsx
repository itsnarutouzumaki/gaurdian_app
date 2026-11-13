import React from "react";
import { ScrollView, View } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Card,
  Chip,
  Divider,
  InfoBanner,
  Page,
} from "../components/UI";
import { YearRibbon } from "../components/Selectors";
import { getAcademicYear, getChild, availableYears } from "../lib/selectors";
import { dateLabel, scoreLabel } from "../lib/format";
import { buildExaminationReport } from "../lib/examination-results";
import { buildExaminationHtml, type DocumentBrand } from "../lib/document-rendering";
import { sharePdfDocument } from "../lib/pdf";
import {
  getSchoolConfiguration,
  getSchoolDocumentConfiguration,
} from "../config/schoolConfig";
import type { ExaminationType } from "../types";
import { C } from "../theme";
import { styles } from "./ResultsScreen.styles";

type ResultTab = "subjectWise" | ExaminationType;

const EXAMINATION_TABS: Array<{ value: ExaminationType; label: string }> = [
  { value: "halfYearly", label: "Half Yearly" },
  { value: "yearly", label: "Yearly" },
  { value: "preboard", label: "Preboard" },
];

export function ResultsScreen() {
  const {
    children,
    examinations: allExaminations,
    selectedChildId,
    selectedYear,
    setSelectedYear,
    setSelectedSubjectId,
    navigate,
    goBack,
    showToast,
  } = useApp();
  const [selectedTab, setSelectedTab] = React.useState<ResultTab>("subjectWise");
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  const examinations = allExaminations.filter(
    (item) => item.childId === child.id && item.academicYear === year.label,
  );
  const availableTabs: Array<{ value: ResultTab; label: string }> = [
    { value: "subjectWise", label: "Subject-wise" },
    ...EXAMINATION_TABS.filter((tab) =>
      examinations.some((exam) => exam.type === tab.value),
    ),
  ];
  const activeTab = availableTabs.some((tab) => tab.value === selectedTab)
    ? selectedTab
    : "subjectWise";
  const selectedExaminations =
    activeTab === "subjectWise"
      ? []
      : examinations.filter((item) => item.type === activeTab);
  const configuration = getSchoolConfiguration();
  const documentConfiguration = getSchoolDocumentConfiguration();
  const documentBrand: DocumentBrand = {
    schoolName: configuration.school.name,
    address: configuration.school.address,
    phone: configuration.school.phone,
    email: configuration.school.email,
    accentColor: configuration.theme.light.primary,
    footerNote: documentConfiguration.footerNote,
  };
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {availableTabs.map((tab) => (
          <Chip
            key={tab.value}
            label={tab.label}
            selected={activeTab === tab.value}
            onPress={() => setSelectedTab(tab.value)}
          />
        ))}
      </ScrollView>
      {activeTab === "subjectWise" ? (
        <>
          <InfoBanner
            title="Subject-wise results"
            message="Open a subject to view its published tests and marks. Question-wise scores are not shown."
          />
          {year.subjects.map((subject) => (
            <Card
              key={subject.id}
              padding={13}
              onPress={() => {
                setSelectedSubjectId(subject.id);
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
          ))}
          {examinations.length === 0 ? (
            <InfoBanner
              title="No school examination results yet"
              message="Subject test history is available, but no Half Yearly, Yearly, or Preboard result has been published for this student and academic year."
              tone="orange"
            />
          ) : null}
        </>
      ) : (
        selectedExaminations.map((examination) => {
          const report = buildExaminationReport(examination, year.subjects);
          return (
            <Card key={examination.id} padding={14}>
              <View style={styles.examHeader}>
                <View style={styles.flex}>
                  <AppText size={15} weight="bold">
                    {examination.title}
                  </AppText>
                  <AppText size={11} color={C.muted} style={styles.meta}>
                    {dateLabel(examination.date)} · {report.subjects.length}{" "}
                    subjects
                  </AppText>
                </View>
                <View style={styles.totalPill}>
                  <AppText size={11} color={C.primary} weight="bold">
                    {report.percentage.toFixed(1)}%
                  </AppText>
                </View>
              </View>
              <Divider space={9} />
              {report.subjects.map((subject) => (
                <View key={subject.id} style={styles.examSubjectRow}>
                  <AppText size={12} weight="medium" style={styles.subjectName}>
                    {subject.name}
                  </AppText>
                  <AppText size={11} color={C.muted}>
                    {scoreLabel(subject.score, subject.maxScore)}
                  </AppText>
                </View>
              ))}
              <Divider space={8} />
              <View style={styles.examSubjectRow}>
                <AppText size={12} weight="bold" style={styles.subjectName}>
                  Total marks
                </AppText>
                <AppText size={12} color={C.primary} weight="bold">
                  {scoreLabel(report.totalScore, report.maxScore)}
                </AppText>
              </View>
              <ActionButton
                title="Download Result (PDF)"
                icon="⇩"
                onPress={() =>
                  void sharePdfDocument(
                    `${child.fullName}-${examination.title}-${year.label}`,
                    buildExaminationHtml(
                      documentBrand,
                      documentConfiguration.examResultTemplate,
                      child,
                      year,
                      examination,
                      year.subjects,
                    ),
                    showToast,
                  )
                }
                style={styles.download}
              />
            </Card>
          );
        })
      )}
    </Page>
  );
}
