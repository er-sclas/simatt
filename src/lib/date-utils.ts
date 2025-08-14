import { eachDayOfInterval, getDay, getWeekOfMonth, subDays, startOfDay, sub } from 'date-fns';

const publicHolidays = [
  '2025-10-01', // Oct 1
  '2025-10-02', // Oct 2
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
    if (!isHoliday(day)) {
      workingDays++;
    }
  }
  return workingDays;
}

export function getStartDate(daysPassed: number, todayAttendanceTaken: boolean): Date {
    if (daysPassed <= 0) {
      return new Date();
    }
    
    let currentDate = startOfDay(new Date());
    let effectiveCurrentDate = todayAttendanceTaken ? currentDate : subDays(currentDate, 1);
    
    let daysToCount = daysPassed;
    // If today is a working day and attendance is not taken, don't count today in daysPassed
    if (!isHoliday(currentDate) && !todayAttendanceTaken) {
       // The 'daysPassed' already excludes today, so no change needed.
    }

    // If today is a working day and attendance has been taken, it's one of the 'daysPassed'.
    if (!isHoliday(currentDate) && todayAttendanceTaken) {
        daysToCount--;
    }

    let dateCursor = subDays(currentDate, 1);
    while (daysToCount > 0) {
        if (!isHoliday(dateCursor)) {
            daysToCount--;
        }
        if (daysToCount > 0) {
            dateCursor = subDays(dateCursor, 1);
        }
    }

    return dateCursor;
}
