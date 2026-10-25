import React from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Badge,
  Card,
  InfoBanner,
  Page,
  Photo,
  SchoolMark,
  SectionTitle,
} from "../components/UI";
import { C } from "../theme";
import { styles } from "./HomeScreen.styles";

export function HomeScreen() {
  const {
    school,
    guardian,
    children,
    navigate,
    setSelectedChildId,
    setSelectedYear,
    showToast,
    linkRequests,
  } = useApp();
  const onAddChild = () => {
    const missing: string[] = [];
    if (!guardian.fullName.trim()) missing.push("Full name");
    if (!guardian.mobileNumber.trim()) missing.push("Mobile number");
    if (!guardian.email.trim()) missing.push("Email address");
    if (!guardian.profilePhotoUrl) missing.push("Profile photo");
    if (missing.length) {
      showToast({
        title: "Please complete your profile first",
        message: `Missing: ${missing.join(", ")}.`,
        tone: "error",
      });
      navigate("EditProfile", {
        notice: "Complete the required profile fields before linking a child.",
        missingFields: missing,
      });
      return;
    }
    navigate("AddChild");
  };
  return (
    <Page title={school.name} subtitle="Your family’s school companion" scroll>
      <Photo uri={school.heroPhotoUrl} height={190} radius={20} />
      <Card padding={13} style={styles.schoolCard}>
        <View style={styles.schoolRow}>
          <SchoolMark emoji={school.logoEmoji} size={46} />
          <View style={styles.flex}>
            <AppText size={15} weight="bold">
              {school.name}
            </AppText>
            <AppText size={11} color={C.muted} style={styles.mutedLine}>
              {school.tagline}
            </AppText>
            <AppText size={10} color={C.muted} style={styles.mutedLine}>
              {school.shortLocation}
            </AppText>
          </View>
        </View>
        <ActionButton
          title="View School Details"
          icon="▧"
          variant="secondary"
          onPress={() => navigate("SchoolDetails")}
          style={styles.schoolButton}
        />
      </Card>

      <SectionTitle
        title="My Children"
        subtitle={`${children.length} linked student profiles`}
        action="+ Add Child"
        onAction={onAddChild}
      />
      {children.map((child) => {
        const year =
          child.academicYears.find(
            (item) => item.label === child.currentAcademicYear,
          ) || child.academicYears[0];
        return (
          <Card
            key={child.id}
            padding={13}
            onPress={() => {
              setSelectedChildId(child.id);
              setSelectedYear(child.currentAcademicYear);
              navigate("ChildDashboard", { childId: child.id });
            }}
          >
            <View style={styles.childRow}>
              <Avatar name={child.fullName} uri={child.photoUrl} size={55} />
              <View style={styles.flex}>
                <AppText size={14} weight="bold">
                  {child.fullName}
                </AppText>
                <AppText size={12} color={C.muted} style={styles.childMeta}>
                  {year.className} · Section {year.section}
                </AppText>
                <AppText size={10} color={C.muted} style={styles.childId}>
                  Student ID: {child.studentId}
                </AppText>
              </View>
              <AppText size={24} color={C.muted}>
                ›
              </AppText>
            </View>
            <View style={styles.attendanceRow}>
              <AppText size={11} color={C.muted}>
                Attendance this year
              </AppText>
              <AppText size={12} color={C.success} weight="bold">
                {year.attendance.percentage}%
              </AppText>
            </View>
          </Card>
        );
      })}
      {linkRequests
        .filter((item) => item.status === "Pending")
        .map((req) => (
          <Card key={req.id} padding={12}>
            <View style={styles.pendingRow}>
              <AppText size={23} color={C.warning}>
                ◷
              </AppText>
              <View style={styles.flex}>
                <AppText weight="semibold">Access request pending</AppText>
                <AppText size={11} color={C.muted}>
                  {req.studentName} · {req.studentId}
                </AppText>
              </View>
              <Badge label="Pending" tone="orange" />
            </View>
          </Card>
        ))}
      <InfoBanner
        title="Family access, safely managed"
        message="Only students approved by the school appear as linked children. New access requests are sent to the principal for review."
      />
      <Card padding={13}>
        <SectionTitle title="Quick school links" />
        <View style={styles.quickLinks}>
          <QuickLink
            icon="▦"
            title="Gallery"
            onPress={() => navigate("SchoolDetails", { tab: "Photos" })}
          />
          <QuickLink
            icon="▶"
            title="Videos"
            onPress={() => navigate("SchoolDetails", { tab: "Videos" })}
          />
          <QuickLink
            icon="♙"
            title="Teachers"
            onPress={() => navigate("TeachersDirectory")}
          />
        </View>
      </Card>
    </Page>
  );
}

function QuickLink({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quickLink}>
      <AppText size={21} color={C.primary}>
        {icon}
      </AppText>
      <AppText size={11} weight="semibold">
        {title}
      </AppText>
    </Pressable>
  );
}
