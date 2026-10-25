import React, { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Badge,
  Card,
  Field,
  InfoBanner,
  Page,
  SelectField,
  SectionTitle,
} from "../components/UI";
import { ChoiceModal } from "../components/Selectors";
import DatePickerModal from "../components/DatePickerModal";
import { getAcademicYear, getChild } from "../lib/selectors";
import { dateLabel } from "../lib/format";
import { validateDateRange } from "../lib/calendar";
import { C } from "../theme";
import { styles } from "./LeaveRequestScreen.styles";

export function LeaveRequestScreen() {
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
          label="Select child *"
          value={`${selectedChild.fullName} (${year.className} ${year.section})`}
          placeholder="Choose a child"
          onPress={() => setChildPicker(true)}
          style={styles.childField}
        />
        <AppText size={12} weight="semibold" style={styles.label}>
          Start date *
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
          End date *
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
          label="Reason (optional)"
          value={reason}
          onChangeText={setReason}
          placeholder="Family commitment, medical appointment..."
          multiline
          maxLength={300}
        />
        <ActionButton
          title="Submit leave request"
          onPress={() => {
            if (!startDate || !endDate)
              return Alert.alert(
                "Dates required",
                "Please select both a start date and an end date.",
              );
            const error = validateDateRange(startDate, endDate);
            if (error) return Alert.alert("Check dates", error);
            const item = {
              id: `leave-${Date.now()}`,
              childId: selectedChild.id,
              startDate,
              endDate,
              reason: reason.trim(),
              status: "Pending",
              createdAt: new Date().toISOString().slice(0, 10),
            };
            setLeaveRequests([item, ...leaveRequests]);
            setNotifications((prev) => [
              {
                id: `n-${Date.now()}`,
                type: "request",
                title: "Leave request submitted",
                message: `Your leave request for ${selectedChild.fullName} (${dateLabel(startDate)} – ${dateLabel(endDate)}) is waiting for principal review.`,
                dateLabel: "Just now",
                read: false,
                childId: selectedChild.id,
              },
              ...prev,
            ]);
            showToast({
              title: "Leave request sent",
              message: "The principal has been notified.",
              tone: "success",
            });
            Alert.alert(
              "Request submitted",
              "The principal has been notified. Your request is pending review.",
              [
                {
                  text: "View notifications",
                  onPress: () => navigate("Notifications"),
                },
              ],
            );
          }}
          style={styles.submit}
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
    </Page>
  );
}
