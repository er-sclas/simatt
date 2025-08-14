"use client";

import { useState, useMemo, type ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InfoCard } from './InfoCard';
import { PieChart, TrendingUp, Bed, Calculator, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getTotalWorkingDays, getStartDate } from '@/lib/date-utils';

const MIN_ATTENDANCE_PERCENT = 80;

type AttendanceCalculatorProps = {
    onAttendanceChange: (attendance: number | null) => void;
};

export default function AttendanceCalculator({ onAttendanceChange }: AttendanceCalculatorProps) {
  const [daysPassed, setDaysPassed] = useState<string>('');
  const [daysAttended, setDaysAttended] = useState<string>('');
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 9, 4));
  const [todayAttendanceTaken, setTodayAttendanceTaken] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (setter: (val: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
    setShowResults(false);
    onAttendanceChange(null);
  };
  
  const parsedDaysPassed = parseInt(daysPassed, 10);
  const parsedDaysAttended = parseInt(daysAttended, 10);
  
  const canCalculate = !isNaN(parsedDaysPassed) && !isNaN(parsedDaysAttended) && parsedDaysPassed > 0 && parsedDaysAttended <= parsedDaysPassed;

  const totalWorkingDays = useMemo(() => {
    if (!endDate || !canCalculate) return 0;
    const startDate = getStartDate(parsedDaysPassed, todayAttendanceTaken);
    return getTotalWorkingDays(startDate, endDate);
  }, [endDate, parsedDaysPassed, canCalculate, todayAttendanceTaken]);


  const calculations = useMemo(() => {
    if (!canCalculate || totalWorkingDays <= 0) {
      return {
        currentAttendance: null,
        projectedAttendance: null,
        bunksAllowed: null,
      };
    }

    const current = (parsedDaysAttended / parsedDaysPassed) * 100;

    const daysRemaining = totalWorkingDays - parsedDaysPassed;
    const projected = ((parsedDaysAttended + (daysRemaining > 0 ? daysRemaining : 0)) / totalWorkingDays) * 100;
    
    // 79.5 is rounded to 80, so a student needs to achieve at least 79.5
    const minDaysToAttend = Math.ceil(totalWorkingDays * (MIN_ATTENDANCE_PERCENT / 100) - 0.5);
    const maxAbsencesAllowed = totalWorkingDays - minDaysToAttend;
    const absencesSoFar = parsedDaysPassed - parsedDaysAttended;
    const bunks = Math.max(0, maxAbsencesAllowed - absencesSoFar);
    
    return {
      currentAttendance: current,
      projectedAttendance: projected,
      bunksAllowed: bunks,
    };
  }, [parsedDaysPassed, parsedDaysAttended, canCalculate, totalWorkingDays]);

  const handleCalculate = () => {
    if (canCalculate) {
      setShowResults(true);
      onAttendanceChange(calculations.currentAttendance);
    }
  };

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 rounded-md bg-primary p-2">
                <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Attendance Calculator</CardTitle>
                <CardDescription>Enter your attendance details to see where you stand.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="days-passed">Class Days Passed</Label>
            <Input id="days-passed" type="text" placeholder="e.g., 20" value={daysPassed} onChange={handleInputChange(setDaysPassed)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days-attended">Days You Attended</Label>
            <Input id="days-attended" type="text" placeholder="e.g., 18" value={daysAttended} onChange={handleInputChange(setDaysAttended)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="end-date">Projected End of Semester</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date || undefined);
                    setShowResults(false);
                    onAttendanceChange(null);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
             <p className="text-xs text-muted-foreground pt-1">The expected end of semester is October 4th. Adjust if needed.</p>
          </div>
          <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
            <Checkbox 
                id="today-attendance" 
                checked={todayAttendanceTaken}
                onCheckedChange={(checked) => {
                    setTodayAttendanceTaken(checked as boolean);
                    setShowResults(false);
                    onAttendanceChange(null);
                }}
            />
            <Label htmlFor="today-attendance" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Has attendance for today been taken?
            </Label>
           </div>
        </div>
        <div className="mt-4 text-center text-sm font-medium">
            Total Working Days: <span className="text-primary font-bold">{totalWorkingDays > 0 ? totalWorkingDays : 'N/A'}</span>
        </div>
        <Button onClick={handleCalculate} disabled={!canCalculate} className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
          Calculate
        </Button>
        
        {showResults && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InfoCard 
                    title="Current Attendance" 
                    value={calculations.currentAttendance !== null ? `${calculations.currentAttendance.toFixed(1)}%` : 'N/A'}
                    icon={<PieChart className="h-5 w-5" />}
                    description={calculations.currentAttendance !== null && calculations.currentAttendance >= MIN_ATTENDANCE_PERCENT - 0.5 ? "You're on track!" : "Need to catch up!"}
                />
                <InfoCard 
                    title="Projected Attendance" 
                    value={calculations.projectedAttendance !== null ? `${calculations.projectedAttendance.toFixed(1)}%` : 'N/A'}
                    icon={<TrendingUp className="h-5 w-5" />}
                    description="If you attend all future classes."
                />
                <InfoCard 
                    title="Bunks You Can Take" 
                    value={calculations.bunksAllowed !== null ? calculations.bunksAllowed : 'N/A'}
                    icon={<Bed className="h-5 w-5" />}
                    description="And still meet the 80% mark."
                />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
