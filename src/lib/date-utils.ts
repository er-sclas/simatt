import { addDays, eachDayOfInterval, getDay, getWeekOfMonth, subDays } from 'date-fns';

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

function isHoliday(date: Date): boolean {
    return isSunday(date) || isThirdSaturday(date) || isPublicHoliday(date);
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

export function getStartDate(daysPassed: number): Date {
    let currentDate = new Date();
    let daysToSubtract = 0;
    let classDaysFound = 0;

    while(classDaysFound < daysPassed) {
        let tempDate = subDays(currentDate, daysToSubtract);
        if(!isHoliday(tempDate)) {
            classDaysFound++;
        }
        daysToSubtract++;
    }

    return subDays(currentDate, daysToSubtract - 1);
}
