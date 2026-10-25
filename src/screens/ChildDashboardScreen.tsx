import React from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  AppText,
  Avatar,
  Badge,
  Card,
  InfoBanner,
  Page,
  SectionTitle,
} from "../components/UI";
import { YearRibbon } from "../components/Selectors";
import { getAcademicYear, getChild, availableYears } from "../lib/selectors";
import { C } from "../theme";
import { styles } from "./ChildDashboardScreen.styles";

export function ChildDashboardScreen() {
  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedYear,
    setSelectedYear,
    navigate,
    goBack,
  } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  return (
    <Page
      title="Student overview"
      subtitle={`${child.fullName} · ${year.className} ${year.section}`}
      onBack={goBack}
    >
      <Card padding={14}>
        <View style={styles.profileRow}>
          <Avatar name={child.fullName} uri={child.photoUrl} size={64} />
          <View style={styles.flex}>
            <AppText size={17} weight="bold">
              {child.fullName}
            </AppText>
            <AppText size={12} color={C.muted} style={styles.meta}>
              {year.className} · Section {year.section}
            </AppText>
            <AppText size={10} color={C.muted} style={styles.meta}>
              Student ID: {child.studentId}
            </AppText>
          </View>
          <Badge label="Linked" tone="green" />
        </View>
      </Card>
      <YearRibbon
        years={availableYears(child)}
        value={year.label}
        onChange={setSelectedYear}
      />
      <InfoBanner
        title={`Showing records for ${year.label}`}
        message="The academic year is shared across attendance, results, teacher details and fee receipts. Current year is selected by default."
      />
      <View style={styles.tiles}>
        <ActionTile
          icon="▦"
          title="Attendance"
          subtitle={`${year.attendance.percentage}% this year`}
          color="#168F58"
          bg="#E8F8EF"
          onPress={() => navigate("Attendance")}
        />
        <ActionTile
          icon="▥"
          title="View Results"
          subtitle="Tests and exams"
          color={C.primary}
          bg={C.blueSoft}
          onPress={() => navigate("Results")}
        />
        <ActionTile
          icon="▤"
          title="Fees Receipt"
          subtitle="Admission and monthly"
          color={C.purple}
          bg={C.purpleSoft}
          onPress={() => navigate("FeesReceipt")}
        />
        <ActionTile
          icon="◉"
          title="Raise Complaint"
          subtitle="Contact the principal"
          color="#D86B20"
          bg={C.orangeSoft}
          onPress={() => navigate("RaiseComplaint")}
        />
      </View>
      <Card padding={13} onPress={() => navigate("LeaveRequest")}>
        <View style={styles.profileRow}>
          <View style={styles.leaveIcon}>
            <AppText size={25} color={C.primary}>
              ▦
            </AppText>
          </View>
          <View style={styles.flex}>
            <AppText weight="bold">Leave Request</AppText>
            <AppText size={11} color={C.muted} style={styles.meta}>
              Request leave for selected dates
            </AppText>
          </View>
          <AppText size={22} color={C.muted}>
            ›
          </AppText>
        </View>
      </Card>
      <Card padding={13}>
        <SectionTitle title="Current-year summary" />
        <View style={styles.summaryRow}>
          {[
            {
              label: "Present",
              value: year.attendance.present,
              color: C.success,
            },
            { label: "Absent", value: year.attendance.absent, color: C.danger },
            {
              label: "Subjects",
              value: year.subjects.length,
              color: C.primary,
            },
          ].map((item) => (
            <View key={item.label} style={styles.summaryCell}>
              <AppText size={20} color={item.color} weight="bold">
                {item.value}
              </AppText>
              <AppText size={10} color={C.muted}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
      <SectionTitle
        title="Switch child"
        subtitle="You can access another linked child without logging out."
      />
      {children
        .filter((item) => item.id !== child.id)
        .map((item) => (
          <Card
            key={item.id}
            padding={11}
            onPress={() => {
              setSelectedChildId(item.id);
              setSelectedYear(item.currentAcademicYear);
            }}
          >
            <View style={styles.switchRow}>
              <Avatar name={item.fullName} uri={item.photoUrl} size={42} />
              <View style={styles.flex}>
                <AppText weight="semibold">{item.fullName}</AppText>
                <AppText size={11} color={C.muted}>
                  {item.className} · {item.section}
                </AppText>
              </View>
              <AppText size={21} color={C.muted}>
                ›
              </AppText>
            </View>
          </Card>
        ))}
    </Page>
  );
}

function ActionTile({
  icon,
  title,
  subtitle,
  color,
  bg,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, { backgroundColor: bg }]}
    >
      <AppText size={24} color={color} weight="bold">
        {icon}
      </AppText>
      <View>
        <AppText size={14} color={C.text} weight="bold">
          {title}
        </AppText>
        <AppText size={10} color={C.muted} style={styles.tileSubtitle}>
          {subtitle}
        </AppText>
      </View>
    </Pressable>
  );
}
