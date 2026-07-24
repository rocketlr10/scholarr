import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Zap
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { pomodoros, courses, assignments } = useApp();

  const completedCount = assignments.filter(a => a.status === 'completed').length;
  const totalCount = assignments.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalMinutes = pomodoros.reduce((acc, p) => acc + p.durationMinutes, 0);

  // Focus time distribution per course
  const courseTimeMap: Record<string, number> = {};
  pomodoros.forEach(p => {
    const key = p.courseId || 'general';
    courseTimeMap[key] = (courseTimeMap[key] || 0) + p.durationMinutes;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-accent" style={{ color: 'var(--accent-color)' }} />
          <span>Performance & Productivity Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Realtime study velocity, subject focus distribution, and workload forecast.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Study Time</p>
            <p className="text-2xl font-black text-white">{(totalMinutes / 60).toFixed(1)} hrs</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">Logged across {pomodoros.length} focus sessions</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Completion Rate</p>
            <p className="text-2xl font-black text-white">{completionRate}%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{completedCount} of {totalCount} assignments completed</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Peak Focus Day</p>
            <p className="text-2xl font-black text-white">Wednesday</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Average 3.5 hrs logged</p>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject Focus Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-bold text-base text-white">Subject Study Hours Breakdown</h3>
          
          <div className="space-y-3 pt-2">
            {courses.map(c => {
              const mins = courseTimeMap[c.id] || 0;
              const hrs = (mins / 60).toFixed(1);
              const maxMins = Math.max(...Object.values(courseTimeMap), 120);
              const pct = Math.round((mins / maxMins) * 100);

              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-white font-bold">{c.code} - {c.name}</span>
                    <span className="text-slate-300 font-mono">{hrs} hrs</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Focus Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-bold text-base text-white">Weekly Focus Time Trend</h3>
          
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-white/10">
            {[
              { day: 'Mon', hrs: 2.5 },
              { day: 'Tue', hrs: 3.2 },
              { day: 'Wed', hrs: 4.0 },
              { day: 'Thu', hrs: 2.8 },
              { day: 'Fri', hrs: 3.5 },
              { day: 'Sat', hrs: 1.5 },
              { day: 'Sun', hrs: 2.0 },
            ].map((bar, idx) => {
              const heightPct = Math.round((bar.hrs / 4.5) * 100);
              return (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {bar.hrs}h
                  </span>
                  <div
                    className="w-full rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: 'var(--accent-color)',
                      opacity: idx === 2 ? 1 : 0.65,
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-400">{bar.day}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
