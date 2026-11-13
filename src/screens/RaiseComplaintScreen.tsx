import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Badge,
  Card,
  Field,
  InfoBanner,
  Page,
  RequiredIndicator,
  SelectField,
  SectionTitle,
} from "../components/UI";
import { ChoiceModal } from "../components/Selectors";
import { getAcademicYear, getChild } from "../lib/selectors";
import { dateLabel } from "../lib/format";
import { C } from "../theme";
import { createGuardianComplaint } from "../services/guardian-actions";
import { styles } from "./RaiseComplaintScreen.styles";

export function RaiseComplaintScreen() {
  const Alert = useAppAlert();
  const {
    children,
    selectedChildId,
    selectedYear,
    setSelectedChildId,
    navigate,
    goBack,
    complaints,
    refreshData,
    showToast,
  } = useApp();
  const selectedChild = getChild(children, selectedChildId);
  const year = getAcademicYear(selectedChild, selectedYear);
  const [childPicker, setChildPicker] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subjects = year.subjects.map((s) => s.name);
  return (
    <Page
      title="Raise Complaint"
      subtitle="Send a concern directly to the principal"
      onBack={goBack}
    >
      <InfoBanner
        title="We are here to help"
        message="Include a clear description. Submitted complaints are stored with the selected child's school records."
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
        <AppText size={12} weight="semibold" style={styles.subjectLabel}>
          Subject (optional)
        </AppText>
        <ChoiceInline
          value={subject}
          options={[
            "Transport",
            "Attendance",
            "Academics",
            "Fees",
            "Facilities",
            "Safety",
            "Other",
            ...subjects,
          ]}
          onChange={setSubject}
        />
        <View style={styles.spacer} />
        <Field
          label="Complaint message"
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your concern in a few clear sentences..."
          multiline
          required
          maxLength={1000}
        />
        <View style={styles.counter}>
          <AppText size={10} color={C.muted}>
            {message.length}/1000
          </AppText>
        </View>
        <InfoBanner
          title="Attachments are unavailable"
          message="File attachments are not available right now."
          tone="orange"
        />
        <ActionButton
          title="Submit complaint"
          loading={submitting}
          disabled={submitting}
          onPress={async () => {
            if (!message.trim())
              return Alert.alert(
                "Message required",
                "Please enter the complaint message before submitting.",
              );
            if (message.trim().length < 8)
              return Alert.alert(
                "Add more detail",
                "Please provide at least 8 characters so the school can understand the issue.",
              );
            setSubmitting(true);
            try {
              await createGuardianComplaint({
                childId: selectedChild.id,
                subject: subject || "General",
                message: message.trim(),
              });
            } catch (error) {
              console.error("Complaint submission failed.", error);
              showToast({
                title: "Complaint not submitted",
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to submit the complaint.",
                tone: "error",
              });
              setSubmitting(false);
              return;
            }
            setMessage("");
            setSubject("");
            showToast({
              title: "Complaint submitted",
              message: "Your complaint was sent to the school.",
              tone: "success",
              action: {
                label: "View notifications",
                onPress: () => navigate("Notifications"),
              },
            });
            try {
              await refreshData();
            } catch (error) {
              console.error("Unable to refresh data after a complaint.", error);
              showToast({
                title: "Complaint submitted",
                message:
                  "The school received your complaint. Check again later for an update.",
                tone: "info",
              });
            } finally {
              setSubmitting(false);
            }
          }}
          style={styles.submit}
        />
      </Card>
      <SectionTitle
        title="Recent complaints"
        subtitle="Complaints associated with this account"
      />
      {complaints
        .filter((item) => item.childId === selectedChild.id)
        .map((item) => (
          <Card key={item.id} padding={13}>
            <View style={styles.complaintHead}>
              <AppText size={13} weight="bold">
                {item.subject}
              </AppText>
              <Badge
                label={item.status}
                tone={item.status === "Resolved" ? "green" : "orange"}
              />
            </View>
            <AppText size={12} color={C.muted} style={styles.complaintMessage}>
              {item.message}
            </AppText>
            <AppText size={10} color={C.muted} style={styles.complaintMeta}>
              {dateLabel(item.createdAt)}
              {item.attachmentName ? ` · ${item.attachmentName}` : ""}
            </AppText>
          </Card>
        ))}
      <ChoiceModal
        visible={childPicker}
        title="Choose child"
        options={children.map((item) => ({
          value: item.id,
          label: item.fullName,
          detail: `${item.className} · ${item.section} · ${item.studentId}`,
        }))}
        selected={selectedChild.id}
        onClose={() => setChildPicker(false)}
        onSelect={(id) => setSelectedChildId(id)}
      />
    </Page>
  );
}

function ChoiceInline({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.choiceField}>
        <AppText size={13} color={value ? C.text : C.muted}>
          {value || "Select subject"}
        </AppText>
        <AppText size={18} color={C.primary}>
          ⌄
        </AppText>
      </Pressable>
      <ChoiceModal
        visible={open}
        title="Complaint subject"
        options={options.map((item) => ({ value: item, label: item }))}
        selected={value}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        helper="Choose the subject closest to your concern."
      />
    </>
  );
}
