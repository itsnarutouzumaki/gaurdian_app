import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText, ActionButton, Card } from "./UI";
import { C } from "../theme";
import { datePickerStyles as s } from "./DatePickerModal.styles";

export default function DatePickerModal({
  visible,
  value,
  onClose,
  onSelect,
  title = "Select date",
}: {
  visible: boolean;
  value?: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  title?: string;
}) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date();
  const [display, setDisplay] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });
  useEffect(() => {
    if (!visible) return;
    const next = value ? new Date(`${value}T00:00:00`) : new Date();
    setDisplay({ year: next.getFullYear(), month: next.getMonth() });
  }, [visible, value]);
  const cells = useMemo(() => {
    const offset = new Date(display.year, display.month, 1).getDay();
    const count = new Date(display.year, display.month + 1, 0).getDate();
    const out: Array<number | null> = Array.from(
      { length: offset },
      () => null,
    );
    for (let d = 1; d <= count; d++) out.push(d);
    while (out.length % 7) out.push(null);
    return out;
  }, [display]);
  const moveMonth = (step: number) => {
    const d = new Date(display.year, display.month + step, 1);
    setDisplay({ year: d.getFullYear(), month: d.getMonth() });
  };
  const monthName = new Date(display.year, display.month, 1).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" },
  );
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Card padding={16} style={s.calendarCard}>
          <View style={s.row}>
            <AppText size={16} weight="bold">
              {title}
            </AppText>
            <Pressable onPress={onClose}>
              <AppText size={22} color={C.muted}>
                ×
              </AppText>
            </Pressable>
          </View>
          <View style={[s.row, s.monthNavigation]}>
            <Pressable onPress={() => moveMonth(-1)} style={s.arrow}>
              <AppText size={22} color={C.primary}>
                ‹
              </AppText>
            </Pressable>
            <AppText size={13} weight="bold">
              {monthName}
            </AppText>
            <Pressable onPress={() => moveMonth(1)} style={s.arrow}>
              <AppText size={22} color={C.primary}>
                ›
              </AppText>
            </Pressable>
          </View>
          <View style={s.grid}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <View key={`${day}-${i}`} style={s.day}>
                <AppText size={11} color={C.muted} weight="semibold">
                  {day}
                </AppText>
              </View>
            ))}
          </View>
          <View style={s.grid}>
            {cells.map((day, index) => {
              const date = day
                ? `${display.year}-${String(display.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : "";
              const selected = Boolean(date && date === value);
              return (
                <Pressable
                  key={`${index}-${day}`}
                  disabled={!day}
                  onPress={() => {
                    if (date) {
                      onSelect(date);
                      onClose();
                    }
                  }}
                  style={[
                    s.day,
                    selected && {
                      backgroundColor: C.primary,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <AppText
                    size={12}
                    color={selected ? "#FFFFFF" : day ? C.text : "transparent"}
                    weight={selected ? "bold" : "normal"}
                  >
                    {day || " "}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          <ActionButton
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={s.cancelButton}
          />
        </Card>
      </View>
    </Modal>
  );
}
