export const money = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;
export const dateLabel = (raw: string) => {
  const d = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
export const isProfileComplete = (profile: { fullName: string; mobileNumber: string; email: string; profilePhotoUrl: string | null }) =>
  Boolean(profile.fullName.trim() && profile.mobileNumber.trim() && profile.email.trim() && profile.profilePhotoUrl);
export const initials = (value: string) => value.split(' ').filter(Boolean).slice(0, 2).map(x => x[0]?.toUpperCase()).join('') || 'GS';
export const scoreLabel = (score: number, maxScore: number) => `${score} / ${maxScore}`;
export const monthTitle = (month: string, year: number) => `${month} ${year}`;
