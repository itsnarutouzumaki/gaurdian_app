import React, { useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Card,
  Field,
  InfoBanner,
  Page,
} from "../components/UI";
import { isProfileComplete } from "../lib/format";
import { C } from "../theme";
import { styles } from "./AddChildScreen.styles";

export function AddChildScreen() {
  const {
    navigate,
    goBack,
    children,
    guardian,
    setLinkRequests,
    linkRequests,
    setNotifications,
    showToast,
  } = useApp();
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <Page
      title="Add a Child"
      subtitle="Request access to an existing student profile"
      onBack={goBack}
    >
      <InfoBanner
        title="You are requesting access"
        message="The principal will verify the student details. You cannot create a student profile from the guardian app."
      />
      <Card padding={17}>
        <Field
          label="Student ID"
          value={studentId}
          onChangeText={setStudentId}
          placeholder="e.g. 2026-A-05-A-012"
          required
          autoCapitalize="characters"
        />
        <Field
          label="Student full name"
          value={studentName}
          onChangeText={setStudentName}
          placeholder="Enter name exactly as school records"
          required
        />
        <AppText size={11} color={C.muted} style={styles.idHint}>
          The student ID includes academic year, class, section and roll number.
        </AppText>
        <ActionButton
          title="Submit access request"
          loading={submitting}
          onPress={() => {
            if (!isProfileComplete(guardian)) {
              const missing = [
                !guardian.fullName.trim() ? "Full name" : null,
                !guardian.mobileNumber.trim() ? "Mobile number" : null,
                !guardian.email.trim() ? "Email address" : null,
                !guardian.profilePhotoUrl ? "Profile photo" : null,
              ].filter(Boolean) as string[];
              showToast({
                title: "Please complete your profile first",
                message: `Missing: ${missing.join(", ")}.`,
                tone: "error",
              });
              navigate("EditProfile", {
                notice:
                  "Complete the required profile fields before linking a child.",
                missingFields: missing,
              });
              return;
            }
            if (!studentId.trim() || !studentName.trim())
              return Alert.alert(
                "Required fields",
                "Enter the student ID and full name.",
              );
            if (
              !/^\d{4}-[A-Z]-\d{2}-[A-Z]-\d{3}$/.test(
                studentId.trim().toUpperCase(),
              )
            )
              return Alert.alert(
                "Check student ID",
                "Demo ID format: 2026-A-05-A-012. You can change this format in the mock validation if your school uses a different pattern.",
              );
            const existing = children.find(
              (child) =>
                child.studentId.toLowerCase() ===
                studentId.trim().toLowerCase(),
            );
            if (existing)
              return Alert.alert(
                "Already linked",
                `${existing.fullName} is already visible in My Children.`,
              );
            setSubmitting(true);
            const item = {
              id: `link-${Date.now()}`,
              studentId: studentId.trim().toUpperCase(),
              studentName: studentName.trim(),
              status: "Pending",
              createdAt: new Date().toISOString().slice(0, 10),
            };
            setLinkRequests([item, ...linkRequests]);
            setNotifications((prev) => [
              {
                id: `n-${Date.now()}`,
                type: "request",
                title: "Child access request submitted",
                message: `Your request for ${item.studentName} is waiting for principal approval.`,
                dateLabel: "Just now",
                read: false,
              },
              ...prev,
            ]);
            setSubmitting(false);
            showToast({
              title: "Request submitted",
              message: "The principal will review the student details.",
              tone: "success",
            });
            Alert.alert(
              "Request submitted",
              "Your request was sent to the principal. The child will appear in My Children only after approval.",
              [{ text: "Done", onPress: () => navigate("Home") }],
            );
          }}
        />
      </Card>
      <Card padding={13}>
        <AppText size={13} weight="semibold">
          Where can I find the student ID?
        </AppText>
        <AppText size={12} color={C.muted} style={styles.helpCopy}>
          Check the student identity card or the latest school record. If the
          format is unclear, contact the school office before submitting.
        </AppText>
      </Card>
    </Page>
  );
}
