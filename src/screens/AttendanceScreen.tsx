import React, { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  AppText,
  Card,
  Divider,
  InfoBanner,
  Page,
} from "../components/UI";
import { YearRibbon } from "../components/Selectors";
import { getAcademicYear, getChild, availableYears } from "../lib/selectors";
import { createCalendarGrid } from "../lib/calendar";
import { monthTitle } from "../lib/format";
import { C } from "../theme";
import { styles } from "./AttendanceScreen.styles";

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
  const cells = useMemo(
    () => createCalendarGrid(month.year, month.monthNumber - 1, records),
    [month, records],
  );
  const statusStyle = (status: string) =>
    status === "present"
      ? { background: styles.present, color: C.success }
      : status === "absent"
        ? { background: styles.absent, color: C.danger }
        : status === "holiday"
          ? { background: styles.holiday, color: C.primary }
          : status === "noClass"
            ? { background: styles.noClass, color: "#93A0B2" }
            : { background: styles.unmarked, color: C.text };
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
        <View style={styles.ringWrap}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <AppText size={30} weight="bold">
                {year.attendance.percentage}%
              </AppText>
              <AppText size={11} color={C.muted}>
                Attendance
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.statRow}>
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
            <View key={item.label} style={styles.statCell}>
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
        <View style={styles.monthNav}>
          <Pressable
            disabled={monthIndex === 0}
            onPress={() => setMonthIndex((n) => Math.max(0, n - 1))}
          >
            <AppText size={25} color={monthIndex === 0 ? "#C8D0DB" : C.primary}>
              ‹
            </AppText>
          </Pressable>
          <AppText size={14} weight="bold">
            {monthTitle(month.month, month.year)}
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
        <View style={styles.weekdayRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <View key={day} style={styles.weekday}>
              <AppText size={10} color={C.muted} weight="semibold">
                {day}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.calendarRow}>
          {cells.map((day, index) => {
            if (!day)
              return <View key={`empty-${index}`} style={styles.emptyDay} />;
            const style = statusStyle(day.status);
            return (
              <View key={day.day} style={styles.dayCell}>
                <View style={[styles.dayInner, style.background]}>
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
        <View style={styles.legendRow}>
          {[
            { label: "Present", color: C.success, bg: "#DDF6E7" },
            { label: "Absent", color: C.danger, bg: "#FFE1E3" },
            { label: "Holiday", color: C.primary, bg: "#DCEAFF" },
            { label: "No class / not marked", color: C.muted, bg: "#F0F3F7" },
          ].map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  { backgroundColor: item.bg, borderColor: item.color },
                ]}
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
