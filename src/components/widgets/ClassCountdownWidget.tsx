import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, BookOpen, MapPin, CheckCircle2, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DAYS_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ClassCountdownWidget: React.FC = () => {
  const { courses, setCurrentView, setIsQuickAddOpen } = useApp();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDayName = DAYS_MAP[now.getDay()]; // e.g. "Mon"
  const currentTotalSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Parse time "HH:mm" to seconds from midnight
  const parseTimeToSec = (timeStr?: string): number | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 3600 + m * 60;
  };

  // Find classes scheduled for today
  const todaysCourses = courses.filter(course => {
    if (!course.scheduleDays || course.scheduleDays.length === 0) return true; // if not specified, assume daily
    return course.scheduleDays.includes(currentDayName);
  });

  // Check for active class right now
  let activeCourse: { course: typeof courses[0]; endSec: number; startSec: number; remainingSec: number } | null = null;
  let nextCourse: { course: typeof courses[0]; startSec: number; startsInSec: number } | null = null;

  for (const c of todaysCourses) {
    const startSec = parseTimeToSec(c.startTime);
    const endSec = parseTimeToSec(c.endTime);

    if (startSec !== null && endSec !== null) {
      if (currentTotalSec >= startSec && currentTotalSec < endSec) {
        activeCourse = {
          course: c,
          startSec,
          endSec,
          remainingSec: endSec - currentTotalSec,
        };
        break; // Only one active class at a time
      } else if (currentTotalSec < startSec) {
        const startsInSec = startSec - currentTotalSec;
        if (!nextCourse || startsInSec < nextCourse.startsInSec) {
          nextCourse = {
            course: c,
            startSec,
            startsInSec,
          };
        }
      }
    }
  }

  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Class Countdown</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">No classes added yet to track schedule.</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('subjects')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Class
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
      <AnimatePresence mode="wait">
        {activeCourse ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Class In Session
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-lg text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {formatCountdown(activeCourse.remainingSec)}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: activeCourse.course.color || '#6366f1' }}
                  />
                  {activeCourse.course.code} • {activeCourse.course.name}
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
                <span>Teacher: {activeCourse.course.teacher || 'N/A'}</span>
                {activeCourse.course.room && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {activeCourse.course.room}
                  </span>
                )}
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((currentTotalSec - activeCourse.startSec) /
                          (activeCourse.endSec - activeCourse.startSec)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Start: {activeCourse.course.startTime}</span>
                <span>End: {activeCourse.course.endTime}</span>
              </div>
            </div>
          </motion.div>
        ) : nextCourse ? (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Next Class Today
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: nextCourse.course.color || '#6366f1' }}
                  />
                  {nextCourse.course.code} — {nextCourse.course.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {nextCourse.course.startTime} – {nextCourse.course.endTime}
                  {nextCourse.course.room && ` • Room ${nextCourse.course.room}`}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 text-right sm:min-w-[150px]">
              <span className="text-xs text-slate-400 block">Starts In</span>
              <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                {formatCountdown(nextCourse.startsInSec)}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  No More Classes Today
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You are all done with lectures for {currentDayName}. Great job!
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('subjects')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Manage Classes ({courses.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
