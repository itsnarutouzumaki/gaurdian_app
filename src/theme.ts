import config from './data/school-config.json';
const fallback = {
  bg: '#F4F7FC', primary: '#075DCE', primaryDark: '#073C88', accent: '#20A4F3',
  surface: '#FFFFFF', text: '#16233A', muted: '#687892', border: '#E3EAF3',
  success: '#18A66A', successSoft: '#E7F8EF', danger: '#E34D59', dangerSoft: '#FFF0F0',
  warning: '#E99B25', warningSoft: '#FFF6E8', blueSoft: '#EAF3FF', purple: '#7456D8',
  purpleSoft: '#F1ECFF', orange: '#E98A34', orangeSoft: '#FFF0E5', teal: '#169DAB', shadow: '#19375A',
};
const theme: Partial<typeof fallback> & { background?: string } =
  config.school.theme;
export const C: typeof fallback = {
  bg: theme.background || theme.bg || fallback.bg,
  primary: theme.primary || fallback.primary,
  primaryDark: theme.primaryDark || fallback.primaryDark,
  accent: theme.accent || fallback.accent,
  surface: theme.surface || fallback.surface,
  text: theme.text || fallback.text,
  muted: theme.muted || fallback.muted,
  border: theme.border || fallback.border,
  success: theme.success || fallback.success,
  successSoft: theme.successSoft || fallback.successSoft,
  danger: theme.danger || fallback.danger,
  dangerSoft: theme.dangerSoft || fallback.dangerSoft,
  warning: theme.warning || fallback.warning,
  warningSoft: theme.warningSoft || fallback.warningSoft,
  blueSoft: theme.blueSoft || fallback.blueSoft,
  purple: theme.purple || fallback.purple,
  purpleSoft: theme.purpleSoft || fallback.purpleSoft,
  orange: theme.orange || fallback.orange,
  orangeSoft: theme.orangeSoft || fallback.orangeSoft,
  teal: theme.teal || fallback.teal,
  shadow: theme.shadow || fallback.shadow,
};
export const R = { sm: 10, md: 16, lg: 22, pill: 999 };
export const S = { sm: 8, md: 12, lg: 16 };
