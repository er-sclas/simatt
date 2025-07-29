"use client";

import { useState } from 'react';
import AttendanceCalculator from '@/components/AttendanceCalculator';
import SuccessPredictor from '@/components/SuccessPredictor';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  const [currentAttendance, setCurrentAttendance] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl font-headline">
              AttendanceAce
            </h1>
          </div>
          <p className="mt-2 text-lg text-foreground/80">
            Track your attendance, project your future, and get insights to ace your semester.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AttendanceCalculator onAttendanceChange={setCurrentAttendance} />
          </div>
          <div className="lg:col-span-2">
            <SuccessPredictor currentAttendancePercentage={currentAttendance} />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AttendanceAce. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
