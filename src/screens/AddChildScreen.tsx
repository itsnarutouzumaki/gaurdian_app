import React, { useState } from "react";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Card,
  Field,
  InfoBanner,
  Page,
} from "../components/UI";
import { C } from "../theme";
import { createGuardianChildLinkRequest } from "../services/guardian-actions";
import { styles } from "./AddChildScreen.styles";

export function AddChildScreen() {
  const Alert = useAppAlert();
  const { goBack, guardian, refreshData, showToast } = useApp();
  const [studentNumber, setStudentNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitRequest = async () => {
    const normalized = studentNumber.trim().toUpperCase();
    const digits = /\d+$/.exec(normalized)?.[0];
    if (
      !/^[A-Z]{0,5}\d{1,2}$/.test(normalized) ||
      !digits ||
      Number(digits) === 0
    ) {
      Alert.alert(
        "Check student number",
        "Enter up to five letters followed by a number from 1 to 99, such as A1 or AAAAB01.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await createGuardianChildLinkRequest({
        studentNumber: normalized,
        relationship: guardian.relationship,
      });
    } catch (error) {
      console.error("Child access request failed.", error);
      showToast({
        title: "Request not submitted",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit the access request.",
        tone: "error",
      });
      setSubmitting(false);
      return;
    }

    setStudentNumber("");
    showToast({
      title: "Request submitted",
      message:
        "The school received your access request. The student will appear after approval.",
      tone: "success",
    });
    try {
      await refreshData();
    } catch (error) {
      console.error("Unable to refresh data after a child access request.", error);
      showToast({
        title: "Request submitted",
        message:
          "The school received your request. Check again later for an update.",
        tone: "info",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page
      title="Add a Child"
      subtitle="Request access to an existing student profile"
      onBack={goBack}
    >
      <InfoBanner
        title="Request to add a child"
        message="The school will check the student number before adding the child to your account."
      />
      <Card padding={17}>
        <Field
          label="Student number"
          value={studentNumber}
          onChangeText={setStudentNumber}
          placeholder="e.g. A1 or AAAAB01"
          required
          autoCapitalize="characters"
          maxLength={7}
        />
        <AppText size={11} color={C.muted} style={styles.idHint}>
          Enter the student number provided by the school.
        </AppText>
        <ActionButton
          title="Submit access request"
          loading={submitting}
          disabled={submitting}
          onPress={submitRequest}
        />
      </Card>
      <Card padding={13}>
        <AppText size={13} weight="semibold">
          Where can I find the student number?
        </AppText>
        <AppText size={12} color={C.muted} style={styles.helpCopy}>
          Check the student identity card or a school record. If the number is
          unclear, contact the school before submitting.
        </AppText>
      </Card>
    </Page>
  );
}
