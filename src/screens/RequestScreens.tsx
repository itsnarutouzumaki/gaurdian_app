import React, { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Badge,
  Card,
  Divider,
  Field,
  InfoBanner,
  Page,
  SchoolMark,
  SelectField,
  SectionTitle,
  Spacer,
} from "../components/UI";
import { ChoiceModal } from "../components/Selectors";
import DatePickerModal from "../components/DatePickerModal";
import { getAcademicYear, getChild } from "../lib/selectors";
import { money, dateLabel } from "../lib/format";
import { shareDemoPdf } from "../lib/pdf";
import { validateDateRange } from "../lib/calendar";
import { C } from "../theme";

export function FeesReceiptScreen() {
  const { school, children, selectedChildId, selectedYear, goBack } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  const receipts = year.feeReceipts;
  const [selectedReceiptId, setSelectedReceiptId] = useState(
    receipts.find((r) => r.label.startsWith("October"))?.id ||
      receipts[receipts.length - 1]?.id ||
      "",
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const receipt =
    receipts.find((item) => item.id === selectedReceiptId) || receipts[0];
  if (!receipt)
    return (
      <Page title="Fees Receipt" onBack={goBack}>
        <InfoBanner
          title="No receipts found"
          message="No fee receipt data is available in this academic-year mock record."
          tone="orange"
        />
      </Page>
    );
  const paid = receipt.paid;
  return (
    <Page
      title="Fees Receipt"
      subtitle={`${child.fullName} · ${year.label}`}
      onBack={goBack}
    >
      <Card padding={14}>
        <AppText size={12} color={C.muted} weight="semibold">
          SELECT FEE PERIOD
        </AppText>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={{
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            minHeight: 47,
            paddingHorizontal: 12,
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AppText size={13} weight="semibold">
            {receipt.label}
          </AppText>
          <AppText size={18} color={C.primary}>
            ⌄
          </AppText>
        </Pressable>
      </Card>
      <Card padding={16}>
        <View
          style={{
            alignItems: "center",
            paddingBottom: 13,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <SchoolMark emoji={school.logoEmoji} size={48} />
          <AppText
            size={15}
            weight="bold"
            align="center"
            style={{ marginTop: 8 }}
          >
            {school.name}
          </AppText>
          <AppText size={10} color={C.muted} align="center">
            {year.label} · Official format preview
          </AppText>
          <AppText size={18} weight="bold" style={{ marginTop: 13 }}>
            Fee Receipt
          </AppText>
          <Badge
            label={paid ? "PAID" : "PAYMENT DUE"}
            tone={paid ? "green" : "orange"}
          />
        </View>
        <View style={{ paddingVertical: 13, gap: 6 }}>
          <InfoRow label="Student name" value={child.fullName} />
          <InfoRow label="Student ID" value={child.studentId} />
          <InfoRow
            label="Class / Section"
            value={`${year.className} · ${year.section}`}
          />
          <InfoRow label="Fee period" value={receipt.label} />
          <InfoRow
            label="Payment date"
            value={paid ? dateLabel(receipt.paymentDate) : "Not paid"}
          />
        </View>
        <Divider space={4} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 9,
          }}
        >
          <AppText size={12} weight="bold">
            Fee breakdown
          </AppText>
          <AppText size={11} color={C.muted}>
            Amount (INR)
          </AppText>
        </View>
        {Object.entries(receipt.breakdown).map(([label, amount]) => (
          <InfoRow key={label} label={label} value={money(amount)} />
        ))}
        <Divider space={9} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText size={14} weight="bold">
            Total amount
          </AppText>
          <AppText size={22} color={C.primary} weight="bold">
            {money(receipt.total)}
          </AppText>
        </View>
        <View style={{ marginTop: 14, gap: 6 }}>
          <InfoRow
            label="Payment mode"
            value={paid ? receipt.paymentMode : "—"}
          />
          <InfoRow
            label="Transaction ID"
            value={paid ? receipt.transactionId : "Not generated"}
          />
        </View>
        <ActionButton
          title={
            paid ? "Download Receipt (PDF)" : "Download Fee Statement (PDF)"
          }
          icon="⇩"
          onPress={() =>
            shareDemoPdf(`Fee-Receipt-${child.fullName}-${receipt.label}`, [
              school.name,
              `Academic Year: ${year.label}`,
              "FEE RECEIPT",
              `Student: ${child.fullName}`,
              `Student ID: ${child.studentId}`,
              `Class: ${year.className} ${year.section}`,
              `Period: ${receipt.label}`,
              "",
              "FEE BREAKDOWN",
              ...Object.entries(receipt.breakdown).map(
                ([label, amount]) => `${label}: ${money(amount)}`,
              ),
              `TOTAL: ${money(receipt.total)}`,
              `Status: ${paid ? "PAID" : "PAYMENT DUE"}`,
              `Payment date: ${paid ? receipt.paymentDate : "Not paid"}`,
              `Payment mode: ${paid ? receipt.paymentMode : "—"}`,
              `Transaction ID: ${paid ? receipt.transactionId : "Not generated"}`,
              "",
              "DEMO DOCUMENT — Replace with the official receipt service before release.",
            ])
          }
          style={{ marginTop: 17 }}
        />
      </Card>
      <InfoBanner
        title="About this preview"
        message="This receipt is rendered from the local JSON fee data. Download creates a sample PDF on the device; no payment is collected by this UI-only build."
        tone="blue"
      />
      <ChoiceModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Choose fee period"
        selected={selectedReceiptId}
        options={receipts.map((item) => ({
          value: item.id,
          label: item.label,
          detail: `${item.paid ? "Paid" : "Due"} · ${money(item.total)}`,
        }))}
        onSelect={setSelectedReceiptId}
        helper="Admission and available months for the selected academic year."
      />
    </Page>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 7,
      }}
    >
      <AppText size={11} color={C.muted} style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText size={11} weight="semibold" align="right" style={{ flex: 1.25 }}>
        {value}
      </AppText>
    </View>
  );
}

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
          style={{ marginBottom: 15 }}
        />
        <AppText size={12} weight="semibold" style={{ marginBottom: 7 }}>
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
        <View style={{ height: 15 }} />
        <Field
          label="Complaint message"
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your concern in a few clear sentences..."
          multiline
          required
          maxLength={1000}
        />
        <View
          style={{ alignItems: "flex-end", marginTop: -8, marginBottom: 12 }}
        >
          <AppText size={10} color={C.muted}>
            {message.length}/1000
          </AppText>
        </View>
        <AppText size={12} weight="semibold" style={{ marginBottom: 7 }}>
          Attachment (optional)
        </AppText>
        <Pressable
          onPress={pickAttachment}
          style={{
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: C.border,
            borderRadius: 13,
            minHeight: 103,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FBFCFE",
            padding: 12,
          }}
        >
          <AppText size={24} color={C.primary}>
            ⇧
          </AppText>
          <AppText size={12} weight="semibold" style={{ marginTop: 5 }}>
            {attachment ? attachment.name : "Tap to upload a file"}
          </AppText>
          <AppText size={10} color={C.muted} style={{ marginTop: 3 }}>
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
            style={{ alignSelf: "flex-start", marginTop: 4 }}
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
          style={{ marginTop: 16 }}
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AppText size={13} weight="bold">
                {item.subject}
              </AppText>
              <Badge
                label={item.status}
                tone={item.status === "Resolved" ? "green" : "orange"}
              />
            </View>
            <AppText size={12} color={C.muted} style={{ marginTop: 6 }}>
              {item.message}
            </AppText>
            <AppText size={10} color={C.muted} style={{ marginTop: 7 }}>
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
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 11,
          minHeight: 45,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
          style={{ marginBottom: 16 }}
        />
        <AppText size={12} weight="semibold" style={{ marginBottom: 7 }}>
          Start date *
        </AppText>
        <Pressable onPress={() => setDateTarget("start")} style={dateField}>
          <AppText size={13} color={startDate ? C.text : C.muted}>
            {startDate ? dateLabel(startDate) : "Select start date"}
          </AppText>
          <AppText size={18} color={C.primary}>
            ▦
          </AppText>
        </Pressable>
        <View style={{ height: 15 }} />
        <AppText size={12} weight="semibold" style={{ marginBottom: 7 }}>
          End date *
        </AppText>
        <Pressable onPress={() => setDateTarget("end")} style={dateField}>
          <AppText size={13} color={endDate ? C.text : C.muted}>
            {endDate ? dateLabel(endDate) : "Select end date"}
          </AppText>
          <AppText size={18} color={C.primary}>
            ▦
          </AppText>
        </Pressable>
        {rangeError ? (
          <AppText size={11} color={C.danger} style={{ marginTop: 5 }}>
            {rangeError}
          </AppText>
        ) : null}
        <View style={{ height: 15 }} />
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
          style={{ marginTop: 17 }}
        />
      </Card>
      <SectionTitle title="Previous requests" />
      {leaveRequests
        .filter((item) => item.childId === selectedChild.id)
        .map((item) => (
          <Card key={item.id} padding={13}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText weight="bold">
                {dateLabel(item.startDate)} – {dateLabel(item.endDate)}
              </AppText>
              <Badge
                label={item.status}
                tone={item.status === "Approved" ? "green" : "orange"}
              />
            </View>
            <AppText size={11} color={C.muted} style={{ marginTop: 5 }}>
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
const dateField = {
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 11,
  minHeight: 47,
  paddingHorizontal: 12,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
};
