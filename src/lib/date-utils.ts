import { addDays, eachDayOfInterval, getDay, getWeekOfMonth } from 'date-fns';

const publicHolidays = [
  '2024-10-01', // Oct 1
  '2024-10-02', // Oct 2
];

function isThirdSaturday(date: Date): boolean {
  return getDay(date) === 6 && getWeekOfMonth(date) === 3;
}

function isSunday(date: Date): boolean {
  return getDay(date) === 0;
}

function isPublicHoliday(date: Date): boolean {
  const dateString = date.toISOString().split('T')[0];
  return publicHolidays.includes(dateString);
}

export function getTotalWorkingDays(startDate: Date, endDate: Date): number {
  if (startDate > endDate) return 0;

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  let workingDays = 0;
  for (const day of allDays) {
    if (!isSunday(day) && !isThirdSaturday(day) && !isPublicHoliday(day)) {
      workingDays++;
    }
  }
  return workingDays;
}
