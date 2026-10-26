import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Badge,
  Card,
  Field,
  InfoBanner,
  ModalFrame,
  Page,
  RequiredIndicator,
  SelectField,
  SectionTitle,
} from "../components/UI";
import { ChoiceModal } from "../components/Selectors";
import DatePickerModal from "../components/DatePickerModal";
import { getAcademicYear, getChild } from "../lib/selectors";
import { dateLabel } from "../lib/format";
import { validateDateRange } from "../lib/calendar";
import { submitLeaveRequest } from "../services/leave-requests";
import { C } from "../theme";
import { styles } from "./LeaveRequestScreen.styles";

export function LeaveRequestScreen() {
  const Alert = useAppAlert();
  const {
    children,
    selectedChildId,
    selectedYear,
    setSelectedChildId,
    navigate,
    goBack,
    leaveRequests,
    setLeaveRequests,
    setNotifications,
    showToast,
  } = useApp();
  const selectedChild = getChild(children, selectedChildId);
  const year = getAcademicYear(selectedChild, selectedYear);
  const [childPicker, setChildPicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dateTarget, setDateTarget] = useState<"start" | "end" | null>(null);
  const rangeError = useMemo(
    () => (startDate && endDate ? validateDateRange(startDate, endDate) : null),
    [startDate, endDate],
  );
  return (
    <Page
      title="Leave Request"
      subtitle="Request leave for your child"
      onBack={goBack}
    >
      <InfoBanner
        title="Request approval from school"
        message="Your request will be sent to the principal. Submitting a request does not automatically mark attendance as excused."
      />
      <Card padding={15}>
        <SelectField
          label="Select child"
          required
          value={`${selectedChild.fullName} (${year.className} ${year.section})`}
          placeholder="Choose a child"
          onPress={() => setChildPicker(true)}
          style={styles.childField}
        />
        <AppText size={12} weight="semibold" style={styles.label}>
          Start date
          <RequiredIndicator />
        </AppText>
        <Pressable onPress={() => setDateTarget("start")} style={styles.dateField}>
          <AppText size={13} color={startDate ? C.text : C.muted}>
            {startDate ? dateLabel(startDate) : "Select start date"}
          </AppText>
          <AppText size={18} color={C.primary}>
            ▦
          </AppText>
        </Pressable>
        <View style={styles.spacer} />
        <AppText size={12} weight="semibold" style={styles.label}>
          End date
          <RequiredIndicator />
        </AppText>
        <Pressable onPress={() => setDateTarget("end")} style={styles.dateField}>
          <AppText size={13} color={endDate ? C.text : C.muted}>
            {endDate ? dateLabel(endDate) : "Select end date"}
          </AppText>
          <AppText size={18} color={C.primary}>
            ▦
          </AppText>
        </Pressable>
        {rangeError ? (
          <AppText size={11} color={C.danger} style={styles.rangeError}>
            {rangeError}
          </AppText>
        ) : null}
        <View style={styles.spacer} />
        <Field
          label="Reason"
          required
          value={reason}
          onChangeText={setReason}
          placeholder="Family commitment, medical appointment..."
          multiline
          maxLength={300}
        />
        <ActionButton
          title="Submit leave request"
          onPress={() => {
            if (!selectedChild.id)
              return Alert.alert(
                "Select a child",
                "Choose a child for this request.",
              );
            if (!startDate || !endDate)
              return Alert.alert(
                "Dates required",
                "Please select both a start date and an end date.",
              );
            const error = validateDateRange(startDate, endDate);
            if (error) return Alert.alert("Check dates", error);
            if (!reason.trim())
              return Alert.alert(
                "Reason required",
                "Enter a reason for the leave request.",
              );
            setPassword("");
            setPasswordConfirmationVisible(true);
          }}
          style={styles.submit}
          disabled={submitting}
        />
      </Card>
      <SectionTitle title="Previous requests" />
      {leaveRequests
        .filter((item) => item.childId === selectedChild.id)
        .map((item) => (
          <Card key={item.id} padding={13}>
            <View style={styles.historyHead}>
              <AppText weight="bold">
                {dateLabel(item.startDate)} – {dateLabel(item.endDate)}
              </AppText>
              <Badge
                label={item.status}
                tone={item.status === "Approved" ? "green" : "orange"}
              />
            </View>
            <AppText size={11} color={C.muted} style={styles.historyReason}>
              {item.reason || "No reason provided"}
            </AppText>
          </Card>
        ))}
      <ChoiceModal
        visible={childPicker}
        title="Choose child"
        options={children.map((item) => ({
          value: item.id,
          label: item.fullName,
          detail: `${item.className} · ${item.section}`,
        }))}
        selected={selectedChild.id}
        onClose={() => setChildPicker(false)}
        onSelect={setSelectedChildId}
      />
      <DatePickerModal
        visible={dateTarget !== null}
        value={dateTarget === "start" ? startDate : endDate}
        title={dateTarget === "start" ? "Select start date" : "Select end date"}
        onClose={() => setDateTarget(null)}
        onSelect={(value) => {
          if (dateTarget === "start") {
            setStartDate(value);
            if (
              endDate &&
              new Date(`${endDate}T00:00:00`) < new Date(`${value}T00:00:00`)
            )
              setEndDate("");
          } else setEndDate(value);
        }}
      />
      <ModalFrame
        visible={passwordConfirmationVisible}
        onClose={() => {
          if (submitting) return;
          setPasswordConfirmationVisible(false);
          setPassword("");
        }}
        title="Confirm your password"
      >
        <AppText size={12} color={C.muted}>
          Enter your guardian account password to authorize this leave request.
        </AppText>
        <Field
          label="Current password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter current password"
          required
          secureTextEntry
          autoCapitalize="none"
        />
        <InfoBanner
          title="Password handling"
          message="Your password is held in memory for the submission payload only. This service is not connected to a backend and does not verify or submit requests yet."
          tone="orange"
        />
        <ActionButton
          title="Confirm and submit"
          loading={submitting}
          disabled={submitting}
          onPress={async () => {
            if (!password) {
              showToast({
                title: "Password required",
                message: "Enter your password to continue.",
                tone: "error",
              });
              return;
            }
            const submission = {
              childId: selectedChild.id,
              startDate,
              endDate,
              reason: reason.trim(),
              password,
            };
            setSubmitting(true);
            try {
              const request = await submitLeaveRequest(submission);
              setLeaveRequests((previous) => [request, ...previous]);
              setNotifications((previous) => [
                {
                  id: `n-${Date.now()}`,
                  type: "request",
                  title: "Leave request submitted",
                  message: `Your leave request for ${selectedChild.fullName} (${dateLabel(startDate)} – ${dateLabel(endDate)}) is waiting for principal review.`,
                  dateLabel: "Just now",
                  read: false,
                  childId: selectedChild.id,
                },
                ...previous,
              ]);
              showToast({
                title: "Leave request sent",
                message:
                  "The principal has been notified. Your request is pending review.",
                tone: "success",
                action: {
                  label: "View notifications",
                  onPress: () => navigate("Notifications"),
                },
              });
            } catch (error) {
              console.error("Leave request submission failed.", error);
              showToast({
                title: "Request not submitted",
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to submit the leave request.",
                tone: "error",
              });
            } finally {
              setSubmitting(false);
              setPassword("");
              setPasswordConfirmationVisible(false);
            }
          }}
          style={styles.submit}
        />
      </ModalFrame>
    </Page>
  );
}
