import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Calendar,
  Timer,
  Flame,
  Clock,
  BookOpen,
  ArrowUpRight,
  Plus,
  AlertTriangle,
  Award,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Check
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    assignments,
    courses,
    events,
    pomodoros,
    setCurrentView,
    setIsQuickAddOpen,
    updateAssignment,
    syncSchoologyNow,
    isSyncingSchoology
  } = useApp();

  const [isFocusing, setIsFocusing] = useState(true);

  // Greeting date
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateFormatted = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Today's Date String YYYY-MM-DD
  const todayStr = now.toISOString().split('T')[0];

  // Today's assignments & Overdue
  const todayAssignments = assignments.filter(a => a.dueDate === todayStr && a.status !== 'completed');
  const overdueAssignments = assignments.filter(a => a.dueDate < todayStr && a.status !== 'completed');
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Today's Events
  const todayEvents = events.filter(e => e.startDate.startsWith(todayStr));

  // Study hours calculation
  const totalStudyMinutesThisWeek = pomodoros.reduce((acc, p) => acc + p.durationMinutes, 0);
  const studyHoursThisWeek = (totalStudyMinutesThisWeek / 60).toFixed(1);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            {greeting}, {currentUser.name.split(' ')[0]}
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            It's {dateFormatted} — {todayAssignments.length} tasks due today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Overdue Warning Alert if any */}
      {overdueAssignments.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong>{overdueAssignments.length} Overdue Task{overdueAssignments.length > 1 ? 's' : ''}!</strong> Action required to maintain course velocity.
            </span>
          </div>
          <button
            onClick={() => setCurrentView('assignments')}
            className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold text-[11px] transition-colors shrink-0"
          >
            Resolve Now →
          </button>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Focus Session Widget (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Focus Session</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Data Structures & Algorithms</h3>
              <p className="text-zinc-400 text-sm mt-0.5">CS 106B • Unit 4: Heap Trees & Queues</p>
            </div>
            <div className="text-4xl font-mono text-white tracking-tight font-semibold">23:45</div>
          </div>

          <div className="flex gap-4 items-center mt-6">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
            </div>
            <button
              onClick={() => setIsFocusing(!isFocusing)}
              className="p-3 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
              title={isFocusing ? 'Pause Session' : 'Start Session'}
            >
              {isFocusing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Weekly Overview Bar Chart Widget (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3">Weekly Overview</div>
          
          <div className="flex items-end justify-between h-20 gap-2 px-1">
            <div className="w-full bg-indigo-500/30 rounded-t-lg h-[40%]" />
            <div className="w-full bg-indigo-500/40 rounded-t-lg h-[60%]" />
            <div className="w-full bg-indigo-500/20 rounded-t-lg h-[30%]" />
            <div className="w-full bg-indigo-500/60 rounded-t-lg h-[85%]" />
            <div className="w-full bg-indigo-500 rounded-t-lg h-[95%]" />
            <div className="w-full bg-white/10 rounded-t-lg h-[15%]" />
            <div className="w-full bg-white/10 rounded-t-lg h-[10%]" />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <div className="text-2xl font-semibold text-white">{studyHoursThisWeek}h</div>
              <div className="text-[10px] text-zinc-500">Study Time This Week</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-orange-400">7</div>
              <div className="text-[10px] text-zinc-500">Day Streak 🔥</div>
            </div>
          </div>
        </div>

        {/* Upcoming Assignments List (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <span>Upcoming Assignments</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('assignments')}
                className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingAssignments.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No pending assignments!</p>
            ) : (
              upcomingAssignments.map(asg => {
                const course = courses.find(c => c.id === asg.courseId);
                const priorityBadgeClass =
                  asg.priority === 'urgent' || asg.priority === 'high'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold'
                    : asg.priority === 'medium'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-green-500/10 text-green-400 border border-green-500/20';

                return (
                  <div
                    key={asg.id}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/15 transition-all group"
                  >
                    <button
                      onClick={() => updateAssignment(asg.id, { status: 'completed' })}
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: course?.color || '#6366f1' }}
                      title="Mark as completed"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{asg.title}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {course?.code || 'Course'} • Due {asg.dueDate} at {asg.dueTime || '23:59'}
                      </div>
                    </div>

                    <div className={`px-3 py-1 text-[10px] rounded-full capitalize ${priorityBadgeClass}`}>
                      {asg.priority}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Today's Schedule Timeline (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Today's Schedule</span>
              </h3>
              <button
                onClick={syncSchoologyNow}
                disabled={isSyncingSchoology}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Sync Schoology"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSchoology ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <div className="text-xs text-zinc-500 w-12 pt-1 font-mono">09:30</div>
                <div className="flex-1 pl-4 border-l-2 border-indigo-500/30">
                  <div className="text-sm font-medium text-white">Lecture: Advanced Calculus</div>
                  <div className="text-[11px] text-zinc-500">Room 402 • Prof. Higgins</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-xs text-indigo-400 w-12 pt-1 font-mono font-semibold">11:15</div>
                <div className="flex-1 pl-4 border-l-2 border-indigo-500 bg-indigo-500/10 rounded-r-xl py-2.5 pr-3">
                  <div className="text-sm font-semibold text-white">Focus: CS 106B Study Group</div>
                  <div className="text-[11px] text-zinc-300">Green Library Floor 2 • Table 9</div>
                  <div className="text-[10px] text-indigo-400 mt-1 uppercase font-bold tracking-tighter flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Happening Now
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-xs text-zinc-500 w-12 pt-1 font-mono">14:00</div>
                <div className="flex-1 pl-4 border-l-2 border-zinc-700">
                  <div className="text-sm font-medium text-white">Seminar: Political Theory</div>
                  <div className="text-[11px] text-zinc-500">Bldg 160 • Room 112</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-xs text-zinc-500 w-12 pt-1 font-mono">16:30</div>
                <div className="flex-1 pl-4 border-l-2 border-zinc-700">
                  <div className="text-sm font-medium text-white">Physics 41 Lab Analysis</div>
                  <div className="text-[11px] text-zinc-500">Hewlett 200 Lab</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
              <span>Day Completion Progress</span>
              <span className="font-mono font-semibold text-zinc-300">75%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-500 w-3/4 shadow-[0_0_12px_rgba(99,102,241,0.5)] rounded-full" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
