import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
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
import { getAcademicYear, getChild } from "../lib/selectors";
import { dateLabel } from "../lib/format";
import { C } from "../theme";
import { styles } from "./RaiseComplaintScreen.styles";

export function RaiseComplaintScreen() {
  const {
    children,
    selectedChildId,
    selectedYear,
    setSelectedChildId,
    navigate,
    goBack,
    setComplaints,
    complaints,
    setNotifications,
    showToast,
  } = useApp();
  const selectedChild = getChild(children, selectedChildId);
  const year = getAcademicYear(selectedChild, selectedYear);
  const [childPicker, setChildPicker] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<{
    name: string;
    uri?: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const subjects = year.subjects.map((s) => s.name);
  const pickAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0])
        setAttachment({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
        });
    } catch {
      Alert.alert(
        "Attachment picker",
        "The document picker could not be opened. You can still submit the complaint without an attachment.",
      );
    }
  };
  return (
    <Page
      title="Raise Complaint"
      subtitle="Send a concern directly to the principal"
      onBack={goBack}
    >
      <InfoBanner
        title="We are here to help"
        message="Include a clear description. Attachment is optional and can be a PDF or image."
      />
      <Card padding={15}>
        <SelectField
          label="Select child *"
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
        <AppText size={12} weight="semibold" style={styles.attachLabel}>
          Attachment (optional)
        </AppText>
        <Pressable onPress={pickAttachment} style={styles.attachment}>
          <AppText size={24} color={C.primary}>
            ⇧
          </AppText>
          <AppText size={12} weight="semibold" style={styles.attachTitle}>
            {attachment ? attachment.name : "Tap to upload a file"}
          </AppText>
          <AppText size={10} color={C.muted} style={styles.attachHint}>
            {attachment
              ? "Tap to replace the selected file"
              : "PDF, JPG or PNG · Optional"}
          </AppText>
        </Pressable>
        {attachment ? (
          <ActionButton
            title="Remove attachment"
            variant="plain"
            onPress={() => setAttachment(null)}
            style={styles.removeAttachment}
          />
        ) : null}
        <ActionButton
          title="Submit complaint"
          loading={submitting}
          onPress={() => {
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
            const item = {
              id: `cmp-${Date.now()}`,
              childId: selectedChild.id,
              subject: subject || "General",
              message: message.trim(),
              attachmentName: attachment?.name || null,
              status: "Submitted",
              createdAt: new Date().toISOString().slice(0, 10),
            };
            setComplaints([item, ...complaints]);
            setNotifications((prev) => [
              {
                id: `n-${Date.now()}`,
                type: "complaint",
                title: "Complaint submitted",
                message: `Your ${item.subject.toLowerCase()} complaint for ${selectedChild.fullName} was submitted.`,
                dateLabel: "Just now",
                read: false,
                childId: selectedChild.id,
              },
              ...prev,
            ]);
            setSubmitting(false);
            showToast({
              title: "Complaint submitted",
              message: "The principal has been notified in this demo.",
              tone: "success",
            });
            Alert.alert(
              "Complaint submitted",
              "Your complaint has been added to the demo records and a notification has been created.",
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
      <SectionTitle
        title="Recent complaints"
        subtitle="Demo records linked to this account"
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
