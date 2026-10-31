import { getActiveSchoolConfig } from "./data/schools/registry";

const theme = getActiveSchoolConfig().theme.light;
export const C = {
  bg: theme.pageBackground,
  primary: theme.primary,
  primaryDark: theme.primaryDark,
  accent: theme.accent,
  surface: theme.cardBackground,
  text: theme.text,
  muted: theme.mutedText,
  border: theme.border,
  success: theme.success,
  successSoft: theme.successSoft,
  danger: theme.danger,
  dangerSoft: theme.dangerSoft,
  warning: theme.warning,
  warningSoft: theme.warningSoft,
  blueSoft: theme.blueSoft,
  purple: theme.purple,
  purpleSoft: theme.purpleSoft,
  orange: theme.orange,
  orangeSoft: theme.orangeSoft,
  teal: theme.teal,
  shadow: theme.shadow,
};
export const R = { sm: 10, md: 16, lg: 22, pill: 999 };
export const S = { sm: 8, md: 12, lg: 16 };
