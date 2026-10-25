import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Badge,
  Card,
  Divider,
  InfoBanner,
  Page,
  SchoolMark,
} from "../components/UI";
import { ChoiceModal } from "../components/Selectors";
import { getAcademicYear, getChild } from "../lib/selectors";
import { money, dateLabel } from "../lib/format";
import { shareDemoPdf } from "../lib/pdf";
import { C } from "../theme";
import { styles } from "./FeesReceiptScreen.styles";

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
        <Pressable onPress={() => setPickerOpen(true)} style={styles.picker}>
          <AppText size={13} weight="semibold">
            {receipt.label}
          </AppText>
          <AppText size={18} color={C.primary}>
            ⌄
          </AppText>
        </Pressable>
      </Card>
      <Card padding={16}>
        <View style={styles.header}>
          <SchoolMark size={48} />
          <AppText
            size={15}
            weight="bold"
            align="center"
            style={styles.schoolName}
          >
            {school.name}
          </AppText>
          <AppText size={10} color={C.muted} align="center">
            {year.label} · Official format preview
          </AppText>
          <AppText size={18} weight="bold" style={styles.receiptTitle}>
            Fee Receipt
          </AppText>
          <Badge
            label={paid ? "PAID" : "PAYMENT DUE"}
            tone={paid ? "green" : "orange"}
          />
        </View>
        <View style={styles.details}>
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
        <View style={styles.breakdownHead}>
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
        <View style={styles.totalRow}>
          <AppText size={14} weight="bold">
            Total amount
          </AppText>
          <AppText size={22} color={C.primary} weight="bold">
            {money(receipt.total)}
          </AppText>
        </View>
        <View style={styles.paymentMeta}>
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
          style={styles.download}
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
    <View style={styles.infoRow}>
      <AppText size={11} color={C.muted} style={styles.infoLabel}>
        {label}
      </AppText>
      <AppText size={11} weight="semibold" align="right" style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );
}
