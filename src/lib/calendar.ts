export type CalendarDay = { day: number; date: string; status: string };
export function createCalendarGrid(year: number, monthIndex: number, records: CalendarDay[]) {
  const first = new Date(year, monthIndex, 1).getDay();
  const count = new Date(year, monthIndex + 1, 0).getDate();
  const byDay = new Map(records.map(record => [record.day, record]));
  const cells: Array<CalendarDay | null> = Array.from({ length: first }, () => null);
  for (let day = 1; day <= count; day++) {
    cells.push(byDay.get(day) || { day, date: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, status: 'unmarked' });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
export function validateDateRange(start: string, end: string) {
  if (!start || !end) return 'Please select both start and end dates.';
  if (new Date(`${end}T00:00:00`) < new Date(`${start}T00:00:00`)) return 'End date cannot be before the start date.';
  return null;
}
