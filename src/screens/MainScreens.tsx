import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from "react-native";
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
  Photo,
  SchoolMark,
  SectionTitle,
  Spacer,
} from "../components/UI";
import { YearRibbon, ChoiceModal } from "../components/Selectors";
import {
  getAcademicYear,
  getChild,
  getTeacher,
  availableYears,
} from "../lib/selectors";
import { isProfileComplete, dateLabel, scoreLabel } from "../lib/format";
import { shareDemoPdf } from "../lib/pdf";
import { C } from "../theme";

export function HomeScreen() {
  const {
    school,
    guardian,
    children,
    navigate,
    setSelectedChildId,
    setSelectedYear,
    showToast,
    linkRequests,
  } = useApp();
  const onAddChild = () => {
    const missing: string[] = [];
    if (!guardian.fullName.trim()) missing.push("Full name");
    if (!guardian.mobileNumber.trim()) missing.push("Mobile number");
    if (!guardian.email.trim()) missing.push("Email address");
    if (!guardian.profilePhotoUrl) missing.push("Profile photo");
    if (missing.length) {
      showToast({
        title: "Please complete your profile first",
        message: `Missing: ${missing.join(", ")}.`,
        tone: "error",
      });
      navigate("EditProfile", {
        notice: "Complete the required profile fields before linking a child.",
        missingFields: missing,
      });
      return;
    }
    navigate("AddChild");
  };
  return (
    <Page title={school.name} subtitle="Your family’s school companion" scroll>
      <Photo uri={school.heroPhotoUrl} height={190} radius={20} />
      <Card padding={13} style={{ marginTop: -2 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <SchoolMark emoji={school.logoEmoji} size={46} />
          <View style={{ flex: 1 }}>
            <AppText size={15} weight="bold">
              {school.name}
            </AppText>
            <AppText size={11} color={C.muted} style={{ marginTop: 2 }}>
              {school.tagline}
            </AppText>
            <AppText size={10} color={C.muted} style={{ marginTop: 2 }}>
              {school.shortLocation}
            </AppText>
          </View>
        </View>
        <ActionButton
          title="View School Details"
          icon="▧"
          variant="secondary"
          onPress={() => navigate("SchoolDetails")}
          style={{ marginTop: 12 }}
        />
      </Card>

      <SectionTitle
        title="My Children"
        subtitle={`${children.length} linked student profiles`}
        action="+ Add Child"
        onAction={onAddChild}
      />
      {children.map((child) => {
        const year =
          child.academicYears.find(
            (item) => item.label === child.currentAcademicYear,
          ) || child.academicYears[0];
        return (
          <Card
            key={child.id}
            padding={13}
            onPress={() => {
              setSelectedChildId(child.id);
              setSelectedYear(child.currentAcademicYear);
              navigate("ChildDashboard", { childId: child.id });
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Avatar name={child.fullName} uri={child.photoUrl} size={55} />
              <View style={{ flex: 1 }}>
                <AppText size={14} weight="bold">
                  {child.fullName}
                </AppText>
                <AppText size={12} color={C.muted} style={{ marginTop: 2 }}>
                  {year.className} · Section {year.section}
                </AppText>
                <AppText size={10} color={C.muted} style={{ marginTop: 3 }}>
                  Student ID: {child.studentId}
                </AppText>
              </View>
              <AppText size={24} color={C.muted}>
                ›
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 11,
                paddingTop: 10,
                borderTopColor: C.border,
                borderTopWidth: 1,
              }}
            >
              <AppText size={11} color={C.muted}>
                Attendance this year
              </AppText>
              <AppText size={12} color={C.success} weight="bold">
                {year.attendance.percentage}%
              </AppText>
            </View>
          </Card>
        );
      })}
      {linkRequests
        .filter((item: any) => item.status === "Pending")
        .map((req: any) => (
          <Card key={req.id} padding={12}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <AppText size={23} color={C.warning}>
                ◷
              </AppText>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold">Access request pending</AppText>
                <AppText size={11} color={C.muted}>
                  {req.studentName} · {req.studentId}
                </AppText>
              </View>
              <Badge label="Pending" tone="orange" />
            </View>
          </Card>
        ))}
      <InfoBanner
        title="Family access, safely managed"
        message="Only students approved by the school appear as linked children. New access requests are sent to the principal for review."
      />
      <Card padding={13}>
        <SectionTitle title="Quick school links" />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <QuickLink
            icon="▦"
            title="Gallery"
            onPress={() => navigate("SchoolDetails", { tab: "Photos" })}
          />
          <QuickLink
            icon="▶"
            title="Videos"
            onPress={() => navigate("SchoolDetails", { tab: "Videos" })}
          />
          <QuickLink
            icon="♙"
            title="Teachers"
            onPress={() => navigate("TeachersDirectory")}
          />
        </View>
      </Card>
    </Page>
  );
}
function QuickLink({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: C.bg,
        borderRadius: 12,
        paddingVertical: 13,
        gap: 5,
      }}
    >
      <AppText size={21} color={C.primary}>
        {icon}
      </AppText>
      <AppText size={11} weight="semibold">
        {title}
      </AppText>
    </Pressable>
  );
}

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
        <AppText
          size={11}
          color={C.muted}
          style={{ marginTop: -3, marginBottom: 15 }}
        >
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
        <AppText size={12} color={C.muted} style={{ marginTop: 5 }}>
          Check the student identity card or the latest school record. If the
          format is unclear, contact the school office before submitting.
        </AppText>
      </Card>
    </Page>
  );
}

export function ChildDashboardScreen() {
  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedYear,
    setSelectedYear,
    navigate,
    goBack,
  } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  return (
    <Page
      title="Student overview"
      subtitle={`${child.fullName} · ${year.className} ${year.section}`}
      onBack={goBack}
    >
      <Card padding={14}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Avatar name={child.fullName} uri={child.photoUrl} size={64} />
          <View style={{ flex: 1 }}>
            <AppText size={17} weight="bold">
              {child.fullName}
            </AppText>
            <AppText size={12} color={C.muted} style={{ marginTop: 3 }}>
              {year.className} · Section {year.section}
            </AppText>
            <AppText size={10} color={C.muted} style={{ marginTop: 3 }}>
              Student ID: {child.studentId}
            </AppText>
          </View>
          <Badge label="Linked" tone="green" />
        </View>
      </Card>
      <YearRibbon
        years={availableYears(child)}
        value={year.label}
        onChange={setSelectedYear}
      />
      <InfoBanner
        title={`Showing records for ${year.label}`}
        message="The academic year is shared across attendance, results, teacher details and fee receipts. Current year is selected by default."
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <ActionTile
          icon="▦"
          title="Attendance"
          subtitle={`${year.attendance.percentage}% this year`}
          color="#168F58"
          bg="#E8F8EF"
          onPress={() => navigate("Attendance")}
        />
        <ActionTile
          icon="▥"
          title="View Results"
          subtitle="Tests and exams"
          color={C.primary}
          bg={C.blueSoft}
          onPress={() => navigate("Results")}
        />
        <ActionTile
          icon="▤"
          title="Fees Receipt"
          subtitle="Admission and monthly"
          color={C.purple}
          bg={C.purpleSoft}
          onPress={() => navigate("FeesReceipt")}
        />
        <ActionTile
          icon="◉"
          title="Raise Complaint"
          subtitle="Contact the principal"
          color="#D86B20"
          bg={C.orangeSoft}
          onPress={() => navigate("RaiseComplaint")}
        />
      </View>
      <Card padding={13} onPress={() => navigate("LeaveRequest")}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 15,
              backgroundColor: C.blueSoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText size={25} color={C.primary}>
              ▦
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bold">Leave Request</AppText>
            <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
              Request leave for selected dates
            </AppText>
          </View>
          <AppText size={22} color={C.muted}>
            ›
          </AppText>
        </View>
      </Card>
      <Card padding={13}>
        <SectionTitle title="Current-year summary" />
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          {[
            {
              label: "Present",
              value: year.attendance.present,
              color: C.success,
            },
            { label: "Absent", value: year.attendance.absent, color: C.danger },
            {
              label: "Subjects",
              value: year.subjects.length,
              color: C.primary,
            },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                backgroundColor: C.bg,
                alignItems: "center",
              }}
            >
              <AppText size={20} color={item.color} weight="bold">
                {item.value}
              </AppText>
              <AppText size={10} color={C.muted}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
      <SectionTitle
        title="Switch child"
        subtitle="You can access another linked child without logging out."
      />
      {children
        .filter((item) => item.id !== child.id)
        .map((item) => (
          <Card
            key={item.id}
            padding={11}
            onPress={() => {
              setSelectedChildId(item.id);
              setSelectedYear(item.currentAcademicYear);
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Avatar name={item.fullName} uri={item.photoUrl} size={42} />
              <View style={{ flex: 1 }}>
                <AppText weight="semibold">{item.fullName}</AppText>
                <AppText size={11} color={C.muted}>
                  {item.className} · {item.section}
                </AppText>
              </View>
              <AppText size={21} color={C.muted}>
                ›
              </AppText>
            </View>
          </Card>
        ))}
    </Page>
  );
}
function ActionTile({
  icon,
  title,
  subtitle,
  color,
  bg,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "48.4%",
        minHeight: 124,
        borderRadius: 18,
        backgroundColor: bg,
        padding: 14,
        justifyContent: "space-between",
      }}
    >
      <AppText size={24} color={color} weight="bold">
        {icon}
      </AppText>
      <View>
        <AppText size={14} color={C.text} weight="bold">
          {title}
        </AppText>
        <AppText size={10} color={C.muted} style={{ marginTop: 3 }}>
          {subtitle}
        </AppText>
      </View>
    </Pressable>
  );
}

export function AttendanceScreen() {
  const { children, selectedChildId, selectedYear, setSelectedYear, goBack } =
    useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  const months = year.attendance.months;
  const currentMonth = new Date().getMonth() + 1;
  const initialIndex = Math.max(
    0,
    months.findIndex((item) => item.monthNumber === currentMonth),
  );
  const [monthIndex, setMonthIndex] = useState(initialIndex);
  useEffect(() => {
    const currentIndex = months.findIndex(
      (item) => item.monthNumber === currentMonth,
    );
    setMonthIndex(currentIndex >= 0 ? currentIndex : 0);
  }, [selectedChildId, year.label, months, currentMonth]);
  const month = months[Math.min(monthIndex, months.length - 1)] || months[0];
  const records = month?.records || [];
  const totalPresent = year.attendance.present;
  const totalAbsent = year.attendance.absent;
  const holidays = months.reduce(
    (count, entry) =>
      count + entry.records.filter((r) => r.status === "holiday").length,
    0,
  );
  const cells: Array<any> = useMemo(() => {
    const first = new Date(month.year, month.monthNumber - 1, 1).getDay();
    const count = new Date(month.year, month.monthNumber, 0).getDate();
    const out: Array<any> = Array.from({ length: first }, () => null);
    const byDay = new Map(records.map((r) => [r.day, r]));
    for (let day = 1; day <= count; day++)
      out.push(byDay.get(day) || { day, status: "unmarked" });
    while (out.length % 7) out.push(null);
    return out;
  }, [month, records]);
  const statusStyle = (status: string) =>
    status === "present"
      ? { backgroundColor: "#DDF6E7", color: C.success }
      : status === "absent"
        ? { backgroundColor: "#FFE1E3", color: C.danger }
        : status === "holiday"
          ? { backgroundColor: "#DCEAFF", color: C.primary }
          : status === "noClass"
            ? { backgroundColor: "#F0F3F7", color: "#93A0B2" }
            : { backgroundColor: "#FFFFFF", color: C.text };
  return (
    <Page
      title="Attendance"
      subtitle={`${child.fullName} · ${year.label}`}
      onBack={goBack}
    >
      <YearRibbon
        years={availableYears(child)}
        value={year.label}
        onChange={setSelectedYear}
      />
      <Card padding={14}>
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <View
            style={{
              width: 152,
              height: 152,
              borderRadius: 76,
              borderWidth: 12,
              borderColor: "#DCEFE5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 128,
                height: 128,
                borderRadius: 64,
                borderWidth: 9,
                borderColor: C.success,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -3,
              }}
            >
              <AppText size={30} weight="bold">
                {year.attendance.percentage}%
              </AppText>
              <AppText size={11} color={C.muted}>
                Attendance
              </AppText>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 7, marginTop: 9 }}>
          {[
            {
              label: "Classes",
              value: year.attendance.totalClasses,
              color: C.text,
            },
            { label: "Present", value: totalPresent, color: C.success },
            { label: "Absent", value: totalAbsent, color: C.danger },
            { label: "Holidays", value: holidays, color: C.primary },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: C.bg,
                borderRadius: 11,
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <AppText size={17} color={item.color} weight="bold">
                {item.value}
              </AppText>
              <AppText size={9} color={C.muted}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
      <Card padding={13}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            disabled={monthIndex === 0}
            onPress={() => setMonthIndex((n) => Math.max(0, n - 1))}
          >
            <AppText size={25} color={monthIndex === 0 ? "#C8D0DB" : C.primary}>
              ‹
            </AppText>
          </Pressable>
          <AppText size={14} weight="bold">
            {monthTitleSafe(month.month, month.year)}
          </AppText>
          <Pressable
            disabled={monthIndex >= months.length - 1}
            onPress={() =>
              setMonthIndex((n) => Math.min(months.length - 1, n + 1))
            }
          >
            <AppText
              size={25}
              color={monthIndex >= months.length - 1 ? "#C8D0DB" : C.primary}
            >
              ›
            </AppText>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 14 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <View
              key={day}
              style={{
                width: `${100 / 7}%`,
                alignItems: "center",
                paddingBottom: 8,
              }}
            >
              <AppText size={10} color={C.muted} weight="semibold">
                {day}
              </AppText>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {cells.map((day, index) => {
            if (!day)
              return (
                <View
                  key={`empty-${index}`}
                  style={{ width: `${100 / 7}%`, height: 36 }}
                />
              );
            const style = statusStyle(day.status);
            return (
              <View
                key={day.day}
                style={{
                  width: `${100 / 7}%`,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 29,
                    width: 31,
                    borderRadius: 9,
                    backgroundColor: style.backgroundColor,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText
                    size={11}
                    color={style.color}
                    weight={
                      day.status === "present" || day.status === "absent"
                        ? "bold"
                        : "medium"
                    }
                  >
                    {day.day}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
        <Divider space={11} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {[
            { label: "Present", color: C.success, bg: "#DDF6E7" },
            { label: "Absent", color: C.danger, bg: "#FFE1E3" },
            { label: "Holiday", color: C.primary, bg: "#DCEAFF" },
            { label: "No class / not marked", color: C.muted, bg: "#F0F3F7" },
          ].map((item) => (
            <View
              key={item.label}
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  backgroundColor: item.bg,
                  borderWidth: 1,
                  borderColor: item.color,
                }}
              />
              <AppText size={10} color={C.muted}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
      <InfoBanner
        title="Attendance legend"
        message="Holidays and non-school days are not counted as absences. Grey dates indicate weekends, no-class days or records not yet marked."
      />
    </Page>
  );
}
function monthTitleSafe(month: string, year: number) {
  return `${month} ${year}`;
}

export function ResultsScreen() {
  const {
    children,
    selectedChildId,
    selectedYear,
    setSelectedYear,
    setSelectedSubjectId,
    navigate,
    goBack,
  } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  return (
    <Page
      title="Results"
      subtitle={`${child.fullName} · ${year.label}`}
      onBack={goBack}
    >
      <YearRibbon
        years={availableYears(child)}
        value={year.label}
        onChange={setSelectedYear}
      />
      <InfoBanner
        title="Subject-wise results"
        message="Marks are shown only inside each test list. This subject overview intentionally does not display marks or question-wise scores."
      />
      {year.subjects.map((subject) => {
        return (
          <Card
            key={subject.id}
            padding={13}
            onPress={() => {
              /* subject teacher and tests belong to the selected academic year */ setSelectedSubjectId(
                subject.id,
              );
              navigate("SubjectResults", { subjectId: subject.id });
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 14,
                  backgroundColor: `${subject.color}18`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText size={21} color={subject.color} weight="bold">
                  {subject.icon}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText size={14} weight="bold">
                  {subject.name}
                </AppText>
                <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
                  {subject.tests.length} tests/exams · View records
                </AppText>
              </View>
              <AppText size={22} color={C.muted}>
                ›
              </AppText>
            </View>
          </Card>
        );
      })}
    </Page>
  );
}

export function SubjectResultsScreen() {
  const {
    children,
    selectedChildId,
    selectedYear,
    selectedSubjectId,
    setSelectedTeacherId,
    navigate,
    goBack,
    teachers,
  } = useApp();
  const child = getChild(children, selectedChildId);
  const year = getAcademicYear(child, selectedYear);
  const subject =
    year.subjects.find((item) => item.id === selectedSubjectId) ||
    year.subjects.find((item) => item.name === (selectedSubjectId as any)) ||
    year.subjects[0];
  const teacher = getTeacher(teachers, subject.teacherId);
  return (
    <Page
      title={subject.name}
      subtitle={`Test history · ${year.label}`}
      onBack={goBack}
    >
      <Card
        padding={12}
        onPress={() => {
          setSelectedTeacherId(teacher.id);
          navigate("TeacherProfile");
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Avatar name={teacher.name} uri={teacher.photoUrl} size={50} />
          <View style={{ flex: 1 }}>
            <AppText size={13} weight="bold">
              {teacher.name}
            </AppText>
            <AppText size={11} color={C.muted} style={{ marginTop: 2 }}>
              {teacher.highestDegree}
            </AppText>
            <AppText size={10} color={C.muted} style={{ marginTop: 2 }}>
              {teacher.designation}
            </AppText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <AppText size={10} color={C.primary} weight="semibold">
              View profile
            </AppText>
            <AppText size={18} color={C.primary}>
              ›
            </AppText>
          </View>
        </View>
      </Card>
      <InfoBanner
        title="Scanned answer copies"
        message="Tap the download icon to create a sample PDF and open the phone share sheet. The PDF does not render inside this app. In production, this will use the school-uploaded scan."
      />
      {subject.tests
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((test) => (
          <Card key={test.id} padding={13}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={{ flex: 1 }}>
                <AppText size={13} weight="bold">
                  {test.name}
                </AppText>
                <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
                  {dateLabel(test.date)}
                </AppText>
              </View>
              <View style={{ alignItems: "flex-end", marginRight: 2 }}>
                <AppText
                  size={16}
                  weight="bold"
                  color={
                    test.score / test.maxScore >= 0.75 ? C.success : C.text
                  }
                >
                  {scoreLabel(test.score, test.maxScore)}
                </AppText>
                <AppText size={9} color={C.muted}>
                  Marks
                </AppText>
              </View>
              <Pressable
                disabled={!test.copyAvailable}
                onPress={() =>
                  shareDemoPdf(
                    `${child.fullName}-${subject.name}-${test.name}`,
                    [
                      `Student: ${child.fullName}`,
                      `Class: ${year.className} · Section ${year.section}`,
                      `Subject: ${subject.name}`,
                      `Assessment: ${test.name}`,
                      `Date: ${dateLabel(test.date)}`,
                      "",
                      "SAMPLE SCANNED ANSWER COPY",
                      "This locally generated PDF is a placeholder for the original scanned copy uploaded by the school.",
                      "It intentionally does not include any question-wise marks in the app interface.",
                      "",
                      "Replace this mock document with the approved school document when backend storage is connected.",
                    ],
                  )
                }
                style={{
                  width: 41,
                  height: 41,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: test.copyAvailable ? C.blueSoft : "#F0F2F6",
                }}
              >
                <AppText
                  size={20}
                  color={test.copyAvailable ? C.primary : "#A6AFBC"}
                >
                  ⇩
                </AppText>
              </Pressable>
            </View>
            {!test.copyAvailable ? (
              <AppText size={10} color={C.muted} style={{ marginTop: 8 }}>
                Scanned copy not uploaded by school yet.
              </AppText>
            ) : null}
          </Card>
        ))}
    </Page>
  );
}
