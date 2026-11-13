import type {
  AcademicYearRecord,
  ChildRecord,
  ExaminationRecord,
  FeeReceiptRecord,
  SubjectRecord,
} from "../types";
import { buildExaminationReport } from "./examination-results";
import { documentTemplates } from "../templates/document-templates";

export type DocumentTemplateId = keyof typeof documentTemplates;
export type DocumentBrand = {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  accentColor: string;
  footerNote: string;
};

function isDocumentTemplateId(value: string): value is DocumentTemplateId {
  return value === "school-classic" || value === "compact";
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function dateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function renderHtml(
  templateId: string,
  documentType: "fee" | "exam",
  brand: DocumentBrand,
  values: Record<string, string>,
) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(brand.accentColor)) {
    throw new Error("School document accent color must be a six-digit hex color.");
  }
  if (!isDocumentTemplateId(templateId)) {
    throw new Error(`Unknown school document template: ${templateId}.`);
  }
  const selectedTemplate = documentTemplates[templateId][documentType];
  const fields: Record<string, string> = {
    accentColor: brand.accentColor,
    schoolInitials: initials(brand.schoolName),
    schoolName: brand.schoolName,
    schoolAddress: brand.address,
    schoolContact: [brand.phone, brand.email].filter(Boolean).join(" · "),
    footerNote: brand.footerNote,
    ...values,
  };
  return selectedTemplate.replace(
    /{{{(\w+)}}}|{{(\w+)}}/g,
    (_match, rawKey: string | undefined, escapedKey: string | undefined) => {
      const key = rawKey ?? escapedKey;
      if (!key) {
        throw new Error("The document could not be created.");
      }
      const value = fields[key];
      if (value === undefined) {
        throw new Error(`Missing value for document template field "${key}".`);
      }
      return rawKey ? value : escapeHtml(value);
    },
  );
}

function studentDetails(
  child: ChildRecord,
  year: AcademicYearRecord,
  extras: Array<[string, string]>,
) {
  const rows = [
    ["Student", child.fullName],
    ["Student number", child.studentId],
    ["Class / Section", `${year.className} / ${year.section}`],
    ["Academic year", year.label],
    ...extras,
  ];
  return `<table class="details"><tbody>${rows
    .map(
      ([label, value]) =>
        `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</tbody></table>`;
}

function summary(items: Array<[string, string]>) {
  return `<section class="summary">${items
    .map(
      ([label, value]) =>
        `<div class="summary-item"><span class="summary-label">${escapeHtml(label)}</span><span class="summary-value">${escapeHtml(value)}</span></div>`,
    )
    .join("")}</section>`;
}

function money(amount: number) {
  return currency.format(Math.round(amount));
}

export function buildFeeReceiptHtml(
  brand: DocumentBrand,
  templateId: string,
  child: ChildRecord,
  year: AcademicYearRecord,
  receipt: FeeReceiptRecord,
) {
  const content = `
    <h3 class="section-title">Fee breakdown</h3>
    <table class="items">
      <thead><tr><th>Fee item</th><th class="amount">Amount</th></tr></thead>
      <tbody>${Object.entries(receipt.breakdown)
        .map(
          ([label, amount]) =>
            `<tr><td>${escapeHtml(label)}</td><td class="amount">${escapeHtml(money(amount))}</td></tr>`,
        )
        .join("")}
        <tr><td><strong>Total amount</strong></td><td class="amount"><strong>${escapeHtml(money(receipt.total))}</strong></td></tr>
      </tbody>
    </table>`;
  const paid = receipt.paid;
  return renderHtml(templateId, "fee", brand, {
    documentTitle: paid ? "Fee Receipt" : "Fee Payment Due",
    documentSubtitle: `${receipt.label} · ${year.label}`,
    studentDetails: studentDetails(child, year, [
      ["Fee period", receipt.label],
      ["Payment status", paid ? "PAID" : "DUE"],
      ["Payment date", paid ? dateLabel(receipt.paymentDate) : "Not paid"],
      ["Payment mode", paid ? receipt.paymentMode : "Not recorded"],
      ["Transaction ID", paid ? receipt.transactionId : "Not generated"],
    ]),
    content,
    summary: summary([
      ["Total amount", money(receipt.total)],
      ["Amount paid", money(paid ? receipt.total : 0)],
      ["Balance due", money(paid ? 0 : receipt.total)],
    ]),
  });
}

export function buildFeeStatementHtml(
  brand: DocumentBrand,
  templateId: string,
  child: ChildRecord,
  year: AcademicYearRecord,
  receipts: FeeReceiptRecord[],
) {
  const totalBilled = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
  const totalPaid = receipts.reduce(
    (sum, receipt) => sum + (receipt.paid ? receipt.total : 0),
    0,
  );
  const content = `
    <h3 class="section-title">Fee periods</h3>
    <table class="items">
      <thead><tr><th>Period</th><th>Status</th><th>Payment date</th><th class="amount">Amount</th></tr></thead>
      <tbody>${receipts
        .map(
          (receipt) =>
            `<tr><td>${escapeHtml(receipt.label)}</td><td>${receipt.paid ? "Paid" : "Due"}</td><td>${receipt.paid ? escapeHtml(dateLabel(receipt.paymentDate)) : "—"}</td><td class="amount">${escapeHtml(money(receipt.total))}</td></tr>`,
        )
        .join("")}
      </tbody>
    </table>`;
  return renderHtml(templateId, "fee", brand, {
    documentTitle: "Academic Year Fee Statement",
    documentSubtitle: `Fee summary · ${year.label}`,
    studentDetails: studentDetails(child, year, [
      ["Statement period", year.label],
      ["Fee periods", String(receipts.length)],
    ]),
    content,
    summary: summary([
      ["Total billed", money(totalBilled)],
      ["Amount paid", money(totalPaid)],
      ["Balance due", money(totalBilled - totalPaid)],
    ]),
  });
}

export function buildExaminationHtml(
  brand: DocumentBrand,
  templateId: string,
  child: ChildRecord,
  year: AcademicYearRecord,
  examination: ExaminationRecord,
  subjects: SubjectRecord[],
) {
  const report = buildExaminationReport(examination, subjects);
  const content = `
    <h3 class="section-title">Subject results</h3>
    <table class="items">
      <thead><tr><th>Subject</th><th class="number">Marks</th><th class="number">Maximum</th><th class="number">Percentage</th></tr></thead>
      <tbody>${report.subjects
        .map(
          (subject) =>
            `<tr><td>${escapeHtml(subject.name)}</td><td class="number">${subject.score}</td><td class="number">${subject.maxScore}</td><td class="number">${subject.percentage.toFixed(1)}%</td></tr>`,
        )
        .join("")}
        <tr><td><strong>Total</strong></td><td class="number"><strong>${report.totalScore}</strong></td><td class="number"><strong>${report.maxScore}</strong></td><td class="number"><strong>${report.percentage.toFixed(1)}%</strong></td></tr>
      </tbody>
    </table>`;
  return renderHtml(templateId, "exam", brand, {
    documentTitle: examination.title,
    documentSubtitle: `${dateLabel(examination.date)} · ${year.label}`,
    studentDetails: studentDetails(child, year, [
      ["Examination", examination.title],
      ["Examination date", dateLabel(examination.date)],
    ]),
    content,
    summary: summary([
      ["Marks obtained", `${report.totalScore} / ${report.maxScore}`],
      ["Overall percentage", `${report.percentage.toFixed(1)}%`],
      ["Subjects", String(report.subjects.length)],
    ]),
  });
}
