import { getActiveSchoolConfig } from "./data/schools/registry";

const fallback = {
  bg: '#F4F7FC', primary: '#075DCE', primaryDark: '#073C88', accent: '#20A4F3',
  surface: '#FFFFFF', text: '#16233A', muted: '#687892', border: '#E3EAF3',
  success: '#18A66A', successSoft: '#E7F8EF', danger: '#E34D59', dangerSoft: '#FFF0F0',
  warning: '#E99B25', warningSoft: '#FFF6E8', blueSoft: '#EAF3FF', purple: '#7456D8',
  purpleSoft: '#F1ECFF', orange: '#E98A34', orangeSoft: '#FFF0E5', teal: '#169DAB', shadow: '#19375A',
};
const theme = getActiveSchoolConfig().theme.light;
export const C: typeof fallback = {
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
