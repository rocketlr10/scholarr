import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Tag
} from 'lucide-react';
import { EventType } from '../../types';

export const CalendarView: React.FC = () => {
  const { events, courses, addEvent, setIsQuickAddOpen, preferences } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'day'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  const getEventsForDateStr = (dateStr: string) => {
    return events.filter(e => e.startDate.startsWith(dateStr));
  };

  const getEventBadgeColor = (type: EventType) => {
    switch (type) {
      case 'exam':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'assignment':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'lecture':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'study':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Calendar Navigation & Mode Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <span>{monthNames[month]} {year}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive planner with synchronized Schoology deadlines & Google Calendar export.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          
          {/* Mode Selector */}
          <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-1 text-xs">
            <button
              onClick={() => setCalendarMode('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                calendarMode === 'month' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarMode('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                calendarMode === 'week' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarMode('day')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                calendarMode === 'day' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Day
            </button>
          </div>

          {/* Navigation Month Arrows */}
          <div className="flex items-center space-x-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={todayMonth}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/10"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="px-4 py-2 rounded-xl text-white font-semibold text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>

        </div>
      </div>

      {/* Google Calendar Sync Status Pill */}
      {preferences.googleCal.connected && (
        <div className="glass-panel p-3 px-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>
              Google Calendar connected as <strong>{preferences.googleCal.email}</strong>. Auto-export is active.
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Synced Realtime</span>
        </div>
      )}

      {/* Calendar Grid View */}
      {calendarMode === 'month' && (
        <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
          
          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase py-2 border-b border-white/10">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank_${i}`} className="h-28 rounded-2xl bg-slate-950/20 border border-white/5" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const monthStr = (month + 1).toString().padStart(2, '0');
              const dayStr = dayNum.toString().padStart(2, '0');
              const dateStr = `${year}-${monthStr}-${dayStr}`;

              const dayEvents = getEventsForDateStr(dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dayNum}
                  onClick={() => setIsQuickAddOpen(true)}
                  className={`h-28 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isToday
                      ? 'bg-white/10 border-accent shadow-md'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                  }`}
                  style={{ borderColor: isToday ? 'var(--accent-color)' : undefined }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-accent' : 'text-slate-300'}`} style={{ color: isToday ? 'var(--accent-color)' : undefined }}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-18 pr-0.5">
                    {dayEvents.slice(0, 3).map(evt => (
                      <div
                        key={evt.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border truncate ${getEventBadgeColor(evt.type)}`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-mono block">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Week / Day Agenda Fallback View */}
      {(calendarMode === 'week' || calendarMode === 'day') && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-bold text-lg text-white">Agenda & Upcoming Deadlines</h3>
          <div className="space-y-3">
            {events.map(evt => (
              <div key={evt.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{evt.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getEventBadgeColor(evt.type)}`}>
                      {evt.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    📅 {evt.startDate.replace('T', ' at ')} • 📍 {evt.location || 'Campus'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
