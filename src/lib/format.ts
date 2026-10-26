let currentLanguage: "en" | "hi" = "en";

export const setFormatLanguage = (language: "en" | "hi") => {
  currentLanguage = language;
};

const currentLocale = () => (currentLanguage === "hi" ? "hi-IN" : "en-IN");

export const money = (amount: number) =>
  new Intl.NumberFormat(currentLocale(), {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
export const dateLabel = (raw: string) => {
  const d = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(currentLocale(), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
export const isProfileComplete = (profile: { fullName: string; mobileNumber: string; email: string; profilePhotoUrl: string | null }) =>
  Boolean(profile.fullName.trim() && profile.mobileNumber.trim() && profile.email.trim() && profile.profilePhotoUrl);
export const initials = (value: string) => value.split(' ').filter(Boolean).slice(0, 2).map(x => x[0]?.toUpperCase()).join('') || 'GS';
export const scoreLabel = (score: number, maxScore: number) => {
  const format = new Intl.NumberFormat(currentLocale());
  return `${format.format(score)} / ${format.format(maxScore)}`;
};
export const monthTitle = (month: string, year: number) => {
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  if (Number.isNaN(monthIndex)) return `${month} ${year}`;
  return new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString(
    currentLocale(),
    { month: "long", year: "numeric", timeZone: "UTC" },
  );
};
