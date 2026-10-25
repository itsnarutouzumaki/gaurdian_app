import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ActionButton, AppText, Card, Chip } from "./UI";
import { C } from "../theme";
import { selectorStyles as s } from "./Selectors.styles";

export function YearRibbon({
  years,
  value,
  onChange,
}: {
  years: string[];
  value: string;
  onChange: (year: string) => void;
}) {
  return (
    <View style={s.yearContainer}>
      <AppText size={11} color={C.muted} weight="semibold">
        ACADEMIC YEAR
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.yearContent}
      >
        {years.map((year) => (
          <Chip
            key={year}
            label={year}
            selected={year === value}
            onPress={() => onChange(year)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export function ChoiceModal({
  visible,
  title,
  options,
  selected,
  onClose,
  onSelect,
  helper,
}: {
  visible: boolean;
  title: string;
  options: Array<{ label: string; value: string; detail?: string }>;
  selected?: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  helper?: string;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={s.sheet}>
          <View style={s.handle} />
          <AppText size={17} weight="bold">
            {title}
          </AppText>
          {helper ? (
            <AppText
              size={12}
              color={C.muted}
              style={s.helperText}
            >
              {helper}
            </AppText>
          ) : (
            <View style={s.helperSpacer} />
          )}
          <ScrollView
            style={s.options}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                style={[
                  s.choice,
                  selected === option.value && {
                    backgroundColor: C.blueSoft,
                    borderColor: "#C2D9FB",
                  },
                ]}
              >
                <View style={s.choiceContent}>
                  <AppText size={13} weight="semibold">
                    {option.label}
                  </AppText>
                  {option.detail ? (
                    <AppText size={11} color={C.muted} style={s.optionDetail}>
                      {option.detail}
                    </AppText>
                  ) : null}
                </View>
                <View
                  style={[
                    s.radio,
                    selected === option.value && {
                      borderColor: C.primary,
                      backgroundColor: C.primary,
                    },
                  ]}
                >
                  {selected === option.value ? (
                    <AppText size={10} color="#fff">
                      ✓
                    </AppText>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <ActionButton
            title="Close"
            variant="outline"
            onPress={onClose}
            style={s.closeButton}
          />
        </View>
      </View>
    </Modal>
  );
}
