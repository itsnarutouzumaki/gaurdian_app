import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardTypeOptions,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../app-context";
import { translate } from "../lib/i18n";
import { useTranslation } from "react-i18next";
import { C, R } from "../theme";
import { initials } from "../lib/format";
import { getActiveSchoolConfig } from "../data/schools/registry";
import { styles } from "./UI.styles";

const schoolLogo = getActiveSchoolConfig().media.logo;

export function Page({
  children,
  title,
  subtitle,
  onBack,
  right,
  scroll = true,
  contentStyle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const language = useLanguage();
  const { t } = useTranslation();
  const content = (
    <View style={[styles.pageContent, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.safe}>
      {title ? (
        <View style={styles.header}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              accessibilityLabel={translate("Go back", language)}
              style={styles.backButton}
            >
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
          ) : (
            <SchoolMark size={30} style={styles.brandMini} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {t(title, { defaultValue: translate(title, language) })}
            </Text>
            {subtitle ? (
              <Text style={styles.headerSubtitle}>
                {translate(subtitle, language)}
              </Text>
            ) : null}
          </View>
          {right || <View style={styles.rightPlaceholder} />}
        </View>
      ) : null}
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function AppText({
  children,
  size = 14,
  color = C.text,
  weight = "normal",
  style,
  numberOfLines,
  align,
  lineHeight,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: "normal" | "medium" | "semibold" | "bold";
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  align?: "left" | "center" | "right";
  lineHeight?: number;
}) {
  const language = useLanguage();
  const { t } = useTranslation();
  const fontWeight =
    weight === "medium"
      ? "500"
      : weight === "semibold"
        ? "600"
        : weight === "bold"
          ? "700"
          : "400";
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color,
          fontSize: size,
          fontWeight,
          textAlign: align,
          lineHeight: lineHeight || size * 1.42,
        },
        style,
      ]}
    >
      {typeof children === "string"
        ? t(children, { defaultValue: translate(children, language) })
        : children}
    </Text>
  );
}

export function Card({
  children,
  style,
  onPress,
  padding = 14,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: number;
}) {
  const base = (
    <View style={[styles.card, { padding }, style]}>{children}</View>
  );
  return onPress ? (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && { opacity: 0.91, transform: [{ scale: 0.996 }] },
      ]}
    >
      {base}
    </Pressable>
  ) : (
    base
  );
}

export function SchoolMark({
  size = 48,
  style,
}: {
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.schoolMark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.31,
        },
        style,
      ]}
    >
      <Image
        source={schoolLogo.source}
        resizeMode="contain"
        accessible
        accessibilityLabel={schoolLogo.altText}
        style={{ width: size, height: size }}
      />
    </View>
  );
}

export function SelectField({
  label,
  value,
  placeholder,
  onPress,
  icon = "⌄",
  valueColor,
  style,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  icon?: string;
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <AppText
        size={12}
        weight="semibold"
        style={styles.selectLabel}
      >
        {label}
      </AppText>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={styles.selectField}
      >
        <AppText size={13} color={valueColor || (value ? C.text : C.muted)}>
          {value || placeholder}
        </AppText>
        <AppText size={18} color={C.primary}>
          {icon}
        </AppText>
      </Pressable>
    </View>
  );
}

export function ActionButton({
  title,
  onPress,
  icon,
  variant = "primary",
  disabled,
  loading,
  compact,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "success"
    | "plain";
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    variant === "primary"
      ? C.primary
      : variant === "danger"
        ? C.danger
        : variant === "success"
          ? C.success
          : variant === "secondary"
            ? C.blueSoft
            : variant === "plain"
              ? "transparent"
              : C.surface;
  const fg =
    variant === "primary" || variant === "danger" || variant === "success"
      ? "#FFFFFF"
      : variant === "secondary"
        ? C.primary
        : C.text;
  const borderColor =
    variant === "outline"
      ? C.border
      : variant === "plain" || variant === "secondary"
        ? "transparent"
        : bg;
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor,
          paddingVertical: compact ? 9 : 13,
          opacity: disabled ? 0.48 : pressed ? 0.86 : 1,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={fg} /> : null}
      {icon ? (
        <AppText
          size={compact ? 15 : 17}
          color={fg}
          weight="bold"
          style={styles.buttonIcon}
        >
          {icon}
        </AppText>
      ) : null}
      <AppText
        size={compact ? 12 : 14}
        color={fg}
        weight="semibold"
        align="center"
      >
        {title}
      </AppText>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  editable = true,
  multiline,
  keyboardType,
  secureTextEntry,
  rightAction,
  error,
  maxLength,
  autoCapitalize = "sentences",
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  editable?: boolean;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  rightAction?: React.ReactNode;
  error?: string;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const language = useLanguage();
  return (
    <View style={styles.field}>
      <AppText
        size={12}
        color={C.text}
        weight="semibold"
        style={styles.fieldLabel}
      >
        {label}
        {required ? (
          <AppText size={12} color={C.danger}>
            {" "}
            *
          </AppText>
        ) : null}
      </AppText>
      <View
        style={[
          styles.fieldWrap,
          multiline && { minHeight: 104, alignItems: "flex-start" },
          error && { borderColor: C.danger },
          !editable && { backgroundColor: "#F2F5F9" },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          placeholder={translate(placeholder || "", language)}
          placeholderTextColor="#9AA7B8"
          editable={editable}
          multiline={multiline}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            multiline && { minHeight: 88, textAlignVertical: "top" },
            !editable && { color: C.muted },
          ]}
        />
        {rightAction}
      </View>
      {error ? (
        <AppText size={11} color={C.danger} style={styles.fieldMessage}>
          {error}
        </AppText>
      ) : !editable ? (
        <AppText size={10} color={C.muted} style={styles.fieldMessage}>
          This field cannot be changed in the guardian app.
        </AppText>
      ) : null}
    </View>
  );
}

export function Avatar({
  name,
  uri,
  size = 48,
  border = false,
  fallback = "initials",
  fallbackColor = C.primary,
}: {
  name: string;
  uri?: string | null;
  size?: number;
  border?: boolean;
  fallback?: "initials" | "person";
  fallbackColor?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [uri]);
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: border ? 2 : 0,
          borderColor: "#FFFFFF",
        },
      ]}
    >
      {uri && !failed ? (
        <Image
          source={{ uri }}
          onError={() => setFailed(true)}
          resizeMode="cover"
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        fallback === "person" ? (
          <PersonIcon color={fallbackColor} size={size} />
        ) : (
          <AppText size={size * 0.32} color={fallbackColor} weight="bold">
            {initials(name)}
          </AppText>
        )
      )}
    </View>
  );
}

function PersonIcon({ color, size }: { color: string; size: number }) {
  return (
    <View style={[styles.personIcon, { width: size, height: size }]}>
      <View style={[styles.personHead, { backgroundColor: color }]} />
      <View style={[styles.personBody, { backgroundColor: color }]} />
    </View>
  );
}

function BellIcon({ color }: { color: string }) {
  return (
    <View style={styles.bellIcon}>
      <View style={[styles.bellTop, { borderColor: color }]} />
      <View style={[styles.bellBody, { borderColor: color }]} />
      <View style={[styles.bellRim, { backgroundColor: color }]} />
      <View style={[styles.bellClapper, { backgroundColor: color }]} />
    </View>
  );
}

export function Photo({
  uri,
  height = 150,
  radius = R.lg,
  style,
}: {
  uri: string;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [uri]);
  return (
    <View
      style={[
        styles.photo,
        { height, borderRadius: radius },
        style,
      ]}
    >
      {!failed ? (
        <Image
          source={{ uri }}
          onError={() => setFailed(true)}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <AppText size={30} color={C.primary}>
          🏫
        </AppText>
      )}
      {failed ? <View style={StyleSheet.absoluteFill} /> : null}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
  subtitle,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  subtitle?: string;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.flex}>
        <AppText size={16} weight="bold">
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={12} color={C.muted} style={styles.subtleText}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {action && onAction ? (
        <Pressable onPress={onAction}>
          <AppText size={12} color={C.primary} weight="semibold">
            {action} ›
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && {
          backgroundColor: color || C.primary,
          borderColor: color || C.primary,
        },
      ]}
    >
      <AppText
        size={12}
        weight="semibold"
        color={selected ? "#FFFFFF" : C.muted}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export function Badge({
  label,
  tone = "blue",
}: {
  label: string;
  tone?: "blue" | "green" | "red" | "orange" | "purple" | "gray";
}) {
  const configs: Record<string, [string, string]> = {
    blue: [C.blueSoft, C.primary],
    green: [C.successSoft, C.success],
    red: [C.dangerSoft, C.danger],
    orange: [C.warningSoft, C.warning],
    purple: [C.purpleSoft, C.purple],
    gray: ["#EEF2F6", C.muted],
  };
  const [bg, fg] = configs[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <AppText size={10} weight="semibold" color={fg}>
        {label}
      </AppText>
    </View>
  );
}

export function Divider({ space = 12 }: { space?: number }) {
  return (
    <View
      style={[styles.divider, { marginVertical: space }]}
    />
  );
}
export function Spacer({ size = 10 }: { size?: number }) {
  return <View style={{ height: size }} />;
}
export function InfoBanner({
  title,
  message,
  tone = "blue",
  icon = "i",
}: {
  title: string;
  message: string;
  tone?: "blue" | "orange" | "green" | "red";
  icon?: string;
}) {
  const color =
    tone === "green"
      ? C.success
      : tone === "orange"
        ? C.warning
        : tone === "red"
          ? C.danger
          : C.primary;
  const bg =
    tone === "green"
      ? C.successSoft
      : tone === "orange"
        ? C.warningSoft
        : tone === "red"
          ? C.dangerSoft
          : C.blueSoft;
  return (
    <View style={[styles.infoBanner, { backgroundColor: bg }]}>
      <View style={[styles.infoIcon, { backgroundColor: color }]}>
        <AppText size={11} color="#fff" weight="bold">
          {icon}
        </AppText>
      </View>
      <View style={styles.flex}>
        <AppText size={12} weight="semibold" color={color}>
          {title}
        </AppText>
        <AppText size={11} color={C.text} style={styles.subtleText}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

export function BottomTabs({
  active,
  onPress,
  profileName,
  profilePhotoUrl,
}: {
  active: "Home" | "Notifications" | "Profile";
  onPress: (tab: "Home" | "Notifications" | "Profile") => void;
  profileName: string;
  profilePhotoUrl: string | null;
}) {
  const tabs: Array<{
    key: "Home" | "Notifications" | "Profile";
    label: string;
  }> = [
    { key: "Home", label: "Home" },
    { key: "Notifications", label: "Notifications" },
    { key: "Profile", label: "Profile" },
  ];
  return (
    <View style={styles.bottomTabs}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onPress(tab.key)}
          style={styles.tabButton}
        >
          {tab.key === "Home" ? (
            <AppText
              size={22}
              color={active === tab.key ? C.primary : C.muted}
              weight="semibold"
            >
              ⌂
            </AppText>
          ) : tab.key === "Notifications" ? (
            <BellIcon color={active === tab.key ? C.primary : C.muted} />
          ) : (
            <Avatar
              name={profileName}
              uri={profilePhotoUrl}
              size={22}
              fallback="person"
              fallbackColor={active === tab.key ? C.primary : C.muted}
            />
          )}
          <AppText
            size={10}
            color={active === tab.key ? C.primary : C.muted}
            weight={active === tab.key ? "bold" : "medium"}
          >
            {tab.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

export function ModalFrame({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalCard}>
          <AppText size={17} weight="bold">
            {title}
          </AppText>
          <View style={styles.modalContent}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}
