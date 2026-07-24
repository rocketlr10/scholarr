import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCompletionChime, playTickSound, startAmbientSound, stopAmbientSound } from '../../utils/sound';

export const StudyTimerView: React.FC = () => {
  const { pomodoros, courses, addPomodoroSession, preferences } = useApp();

  const [timerMode, setTimerMode] = useState<'pomodoro' | 'short_break' | 'long_break' | 'custom'>('pomodoro');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  
  // Seconds remaining
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundChoice, setSoundChoice] = useState<'none' | 'rain' | 'white_noise'>('none');
  const [sessionNotes, setSessionNotes] = useState('');

  // Mode Duration Maps
  useEffect(() => {
    if (!isActive) {
      if (timerMode === 'pomodoro') setSecondsLeft(preferences.pomodoroWorkMinutes * 60);
      else if (timerMode === 'short_break') setSecondsLeft(preferences.pomodoroShortBreakMinutes * 60);
      else if (timerMode === 'long_break') setSecondsLeft(preferences.pomodoroLongBreakMinutes * 60);
      else if (timerMode === 'custom') setSecondsLeft(45 * 60);
    }
  }, [timerMode, preferences, isActive]);

  // Main Timer Countdown Loop
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Completed!
      setIsActive(false);
      stopAmbientSound();
      playCompletionChime();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      const durationMins =
        timerMode === 'pomodoro' ? preferences.pomodoroWorkMinutes :
        timerMode === 'short_break' ? preferences.pomodoroShortBreakMinutes :
        timerMode === 'long_break' ? preferences.pomodoroLongBreakMinutes : 45;

      addPomodoroSession({
        durationMinutes: durationMins,
        sessionType: timerMode,
        courseId: selectedCourseId,
        notes: sessionNotes || 'Focused study session.',
      });
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, timerMode, preferences, selectedCourseId, sessionNotes, addPomodoroSession]);

  const toggleTimer = () => {
    if (!isActive) {
      if (soundChoice !== 'none') {
        startAmbientSound(soundChoice);
      }
      setIsActive(true);
    } else {
      stopAmbientSound();
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    stopAmbientSound();
    if (timerMode === 'pomodoro') setSecondsLeft(preferences.pomodoroWorkMinutes * 60);
    else if (timerMode === 'short_break') setSecondsLeft(preferences.pomodoroShortBreakMinutes * 60);
    else if (timerMode === 'long_break') setSecondsLeft(preferences.pomodoroLongBreakMinutes * 60);
    else setSecondsLeft(45 * 60);
  };

  const handleSoundChange = (val: 'none' | 'rain' | 'white_noise') => {
    setSoundChoice(val);
    if (isActive) {
      if (val === 'none') stopAmbientSound();
      else startAmbientSound(val);
    }
  };

  // Format Time Display
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Total Focus Calculation
  const totalMinutes = pomodoros.reduce((acc, p) => acc + p.durationMinutes, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Timer className="w-6 h-6 text-accent" style={{ color: 'var(--accent-color)' }} />
            <span>Pomodoro Focus Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Boost retention with interval focus blocks, relaxing white noise synth, and streak analytics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
          <Flame className="w-4 h-4 animate-pulse" />
          <span>7 Day Study Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Timer Dial Area (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
          
          <div
            className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
            style={{ backgroundColor: 'var(--accent-color)' }}
          />

          {/* Mode Selector Tabs */}
          <div className="flex items-center space-x-1 p-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold mb-8 relative z-10">
            <button
              onClick={() => { setTimerMode('pomodoro'); setIsActive(false); }}
              className={`px-4 py-2 rounded-xl transition-all ${
                timerMode === 'pomodoro' ? 'bg-white/15 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => { setTimerMode('short_break'); setIsActive(false); }}
              className={`px-4 py-2 rounded-xl transition-all ${
                timerMode === 'short_break' ? 'bg-white/15 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => { setTimerMode('long_break'); setIsActive(false); }}
              className={`px-4 py-2 rounded-xl transition-all ${
                timerMode === 'long_break' ? 'bg-white/15 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Giant Timer Ring */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-white/10 flex flex-col items-center justify-center relative shadow-2xl bg-slate-950/40 backdrop-blur-xl">
              <span className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tighter leading-none">
                {timeDisplay}
              </span>
              <p className="text-xs uppercase font-semibold tracking-widest text-slate-400 mt-2">
                {isActive ? 'Session in progress...' : 'Ready to Focus'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 my-6 relative z-10">
            <button
              onClick={toggleTimer}
              className="px-8 py-3.5 rounded-2xl text-white font-bold text-base flex items-center space-x-2 shadow-xl active:scale-95 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isActive ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/15 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Options: Course Selector & Ambient Sound */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-4 text-xs">
            
            {/* Course Selector */}
            <div className="text-left">
              <label className="block text-slate-400 font-medium mb-1">Tag Course</label>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ambient Sound Selector */}
            <div className="text-left">
              <label className="block text-slate-400 font-medium mb-1">Focus Ambient Sound</label>
              <select
                value={soundChoice}
                onChange={e => handleSoundChange(e.target.value as any)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
              >
                <option value="none">Off (Silent)</option>
                <option value="rain">Soft Rain Noise Synth</option>
                <option value="white_noise">Pink/White Focus Noise</option>
              </select>
            </div>

          </div>

        </div>

        {/* Right Stats & History Column */}
        <div className="space-y-6">
          
          {/* Total Focus Summary Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" style={{ color: 'var(--accent-color)' }} />
              <span>Study Hours Summary</span>
            </h3>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Logged Time</p>
                <p className="text-2xl font-extrabold text-white">{(totalMinutes / 60).toFixed(1)} hrs</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                {pomodoros.length} Sessions
              </div>
            </div>
          </div>

          {/* History Feed */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <h3 className="font-bold text-sm text-white">Recent Focus Logs</h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {pomodoros.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No focus sessions logged yet.</p>
              ) : (
                pomodoros.map(pomo => {
                  const course = courses.find(c => c.id === pomo.courseId);
                  return (
                    <div key={pomo.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{pomo.durationMinutes} mins Focus</span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: `${course?.color || '#3b82f6'}20`, color: course?.color || '#3b82f6' }}
                        >
                          {course?.code || 'General'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        {new Date(pomo.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
