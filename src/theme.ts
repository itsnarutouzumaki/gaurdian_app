import config from './data/school-config.json';
const theme = (config as any).school.theme || {};
if (theme.background && !theme.bg) theme.bg = theme.background;
const fallback = {
  bg: '#F4F7FC', primary: '#075DCE', primaryDark: '#073C88', accent: '#20A4F3',
  surface: '#FFFFFF', text: '#16233A', muted: '#687892', border: '#E3EAF3',
  success: '#18A66A', successSoft: '#E7F8EF', danger: '#E34D59', dangerSoft: '#FFF0F0',
  warning: '#E99B25', warningSoft: '#FFF6E8', blueSoft: '#EAF3FF', purple: '#7456D8',
  purpleSoft: '#F1ECFF', orange: '#E98A34', orangeSoft: '#FFF0E5', teal: '#169DAB', shadow: '#19375A',
};
export const C = Object.fromEntries(Object.keys(fallback).map(key => [key, theme[key] || (fallback as any)[key]])) as typeof fallback;
export const R = { sm: 10, md: 16, lg: 22, pill: 999 };
