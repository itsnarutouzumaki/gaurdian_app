import type {
  AttendanceMonthRecord,
  ChildRecord,
  ExaminationRecord,
  ExaminationType,
} from "../../types";
import type { GuardianBootstrapChild } from "./guardian-bootstrap.types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const COLORS = ["#2374AB", "#168F58", "#805AD5", "#D86B20", "#C23B53"];

function getMonths(
  year: GuardianBootstrapChild["academicYears"][number],
  attendance: GuardianBootstrapChild["attendance"],
): AttendanceMonthRecord[] {
  const start = new Date(`${year.startsOn}T00:00:00Z`);
  const end = new Date(`${year.endsOn}T00:00:00Z`);
  const months: AttendanceMonthRecord[] = [];
  for (
    let cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    cursor <= end;
    cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  ) {
    const monthNumber = cursor.getUTCMonth() + 1;
    const calendarYear = cursor.getUTCFullYear();
    const prefix = `${calendarYear}-${String(monthNumber).padStart(2, "0")}-`;
    months.push({
      month: MONTH_NAMES[monthNumber - 1],
      monthNumber,
      year: calendarYear,
      records: attendance
        .filter((record) => record.date.startsWith(prefix))
        .map((record) => ({
          day: Number(record.date.slice(8, 10)),
          date: record.date,
          status: record.status,
        })),
    });
  }
  return months;
}

export function mapGuardianChild(
  child: GuardianBootstrapChild,
  academicYears: GuardianBootstrapChild["academicYears"],
  currentAcademicYearId?: string,
): { child: ChildRecord; examinations: ExaminationRecord[] } {
  const usableYears = academicYears;
  const years: ChildRecord["academicYears"] = [];
  const examinations: ExaminationRecord[] = [];

  for (const academicYear of usableYears) {
    const attendance = child.attendance.filter(
      (record) => record.date >= academicYear.startsOn && record.date <= academicYear.endsOn,
    );
    const present = attendance.filter((record) => record.status === "present").length;
    const absent = attendance.filter((record) => record.status === "absent").length;
    const holidays = attendance.filter((record) => record.status === "holiday").length;
    const totalClasses = present + absent;
    const assignments = child.subjectAssignments.filter(
      (item) => item.academicYearId === academicYear._id,
    );
    const subjects = assignments.flatMap((assignment, index) => {
      const subject = child.subjects.find((item) => item._id === assignment.subjectId);
      if (!subject) return [];
      const assessments = child.publishedAssessments.filter(
        (item) => item.subjectId === subject._id && item.academicYearId === academicYear._id,
      );
      const tests = assessments.flatMap((assessment) => {
        const result = child.results.find(
          (item) => item.assessmentId === assessment._id && item.studentId === child.id,
        );
        if (!result || ["halfYearly", "yearly", "preBoard"].includes(assessment.type)) return [];
        return [{
          id: assessment._id,
          name: assessment.title,
          date: assessment.date,
          score: result.obtainedMarks,
          maxScore: result.maxMarks,
          teacherId: assignment.teacherId,
          teacherRemarks: result.remarks ?? "",
        }];
      });
      for (const assessment of assessments) {
        if (!["halfYearly", "yearly", "preBoard"].includes(assessment.type)) continue;
        const result = child.results.find(
          (item) => item.assessmentId === assessment._id && item.studentId === child.id,
        );
        if (!result) continue;
        const type: ExaminationType | undefined = assessment.type === "preBoard"
          ? "preboard"
          : assessment.type === "halfYearly" || assessment.type === "yearly"
            ? assessment.type
            : undefined;
        if (!type) continue;
        const existingExam = examinations.find((item) => item.id === assessment._id);
        const subjectResult = {
          subjectId: subject._id,
          score: result.obtainedMarks,
          maxScore: result.maxMarks,
        };
        if (existingExam) {
          existingExam.subjects.push(subjectResult);
        } else {
          examinations.push({
            id: assessment._id,
            childId: child.id,
            academicYear: academicYear.label,
            type,
            title: assessment.title,
            date: assessment.date,
            subjects: [subjectResult],
          });
        }
      }
      return [{
        id: subject._id,
        name: subject.name,
        teacherId: assignment.teacherId,
        icon: subject.name.trim().slice(0, 1).toUpperCase(),
        color: COLORS[index % COLORS.length],
        tests,
      }];
    });
    const feeReceipts = child.feeReceipts
      .filter((receipt) => receipt.academicYearId === academicYear._id)
      .map((receipt) => ({
        id: receipt._id,
        label: receipt.period,
        academicYear: academicYear.label,
        breakdown: Object.fromEntries(receipt.breakdown.map((item) => [item.label, item.amountMinor / 100])) as Record<string, number>,
        total: receipt.totalMinor / 100,
        paid: receipt.status === "paid",
        paymentDate: receipt.paidAt ?? "",
        paymentMode: receipt.paymentMethod ?? "",
        transactionId: receipt.status === "paid" ? receipt.receiptNumber : "",
      }));
    years.push({
      label: academicYear.label,
      startYear: Number(academicYear.startsOn.slice(0, 4)),
      className: child.classSection?.className ?? "",
      section: child.classSection?.section ?? "",
      attendance: {
        totalClasses,
        present,
        absent,
        holidays,
        percentage: totalClasses ? Math.round((present / totalClasses) * 100) : 0,
        months: getMonths(academicYear, attendance),
      },
      subjects,
      feeReceipts,
      classTeacherId: child.classSection?.classTeacherId ?? "",
    });
  }

  const currentYear = usableYears.find((year) => year._id === currentAcademicYearId)
    ?? usableYears.find((year) => year.status === "current")
    ?? usableYears[0];
  if (!currentYear) {
    throw new Error(
      "Some school information is unavailable. Please try again.",
    );
  }
  return {
    child: {
      id: child.id,
      fullName: child.fullName,
      photoUrl: child.photoUrl ?? "",
      studentId: child.studentNumber,
      className: child.classSection?.className ?? "",
      section: child.classSection?.section ?? "",
      ...(child.rollNumber && Number.isFinite(Number(child.rollNumber))
        ? { rollNumber: Number(child.rollNumber) }
        : {}),
      relationship: child.relationship,
      gender: child.gender ?? "",
      dateOfBirth: "",
      bloodGroup: "",
      admissionNumber: child.admissionNumber ?? "",
      currentAcademicYear: currentYear.label,
      academicYears: years,
    },
    examinations,
  };
}
