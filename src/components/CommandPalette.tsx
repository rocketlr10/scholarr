import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  CheckSquare,
  Calendar,
  FileText,
  GraduationCap,
  Timer,
  Palette,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AccentTheme } from '../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    assignments,
    courses,
    events,
    notes,
    setCurrentView,
    setAccentColor,
    setIsQuickAddOpen,
    syncSchoologyNow
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.content.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase())
  );

  const accentOptions: { id: AccentTheme; label: string; colorHex: string }[] = [
    { id: 'blue', label: 'Set Accent: Ocean Blue', colorHex: '#3B82F6' },
    { id: 'purple', label: 'Set Accent: Electric Purple', colorHex: '#A855F7' },
    { id: 'pink', label: 'Set Accent: Sakura Pink', colorHex: '#EC4899' },
    { id: 'green', label: 'Set Accent: Emerald Green', colorHex: '#10B981' },
    { id: 'orange', label: 'Set Accent: Sunset Orange', colorHex: '#F97316' },
    { id: 'teal', label: 'Set Accent: Cyber Teal', colorHex: '#14B8A6' },
  ];

  const filteredAccents = accentOptions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-slate-900/80">
          <Search className="w-5 h-5 text-accent shrink-0" style={{ color: 'var(--accent-color)' }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search assignments, notes, courses..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Quick Actions */}
          {(!query || 'add quick new create'.includes(query.toLowerCase())) && (
            <div>
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                System Actions
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => handleSelect(() => setIsQuickAddOpen(true))}
                  className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Quick Add New Item...</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">Enter</kbd>
                </button>

                <button
                  onClick={() => handleSelect(() => setCurrentView('study'))}
                  className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Timer className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Start Pomodoro Focus Session</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleSelect(() => syncSchoologyNow())}
                  className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Trigger Schoology LMS Feed Sync</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Live API</span>
                </button>
              </div>
            </div>
          )}

          {/* Assignments */}
          {filteredAssignments.length > 0 && (
            <div>
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                Assignments ({filteredAssignments.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredAssignments.slice(0, 4).map(asg => (
                  <button
                    key={asg.id}
                    onClick={() => handleSelect(() => setCurrentView('assignments'))}
                    className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-left text-slate-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="w-4 h-4 text-accent" style={{ color: 'var(--accent-color)' }} />
                      <div>
                        <p className="font-medium text-sm text-white">{asg.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Due: {asg.dueDate} • Priority: {asg.priority}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {asg.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                Courses & Classes
              </div>
              <div className="space-y-1 mt-1">
                {filteredCourses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => handleSelect(() => setCurrentView('subjects'))}
                    className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-left text-slate-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="font-medium text-sm text-white">{course.name} ({course.code})</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{course.teacher} • {course.room}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/10">
                      Grade: {course.gradeAverage}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                Notes & Documents
              </div>
              <div className="space-y-1 mt-1">
                {filteredNotes.slice(0, 3).map(note => (
                  <button
                    key={note.id}
                    onClick={() => handleSelect(() => setCurrentView('notes'))}
                    className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-left text-slate-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-pink-400" />
                      <span className="font-medium text-sm text-white">{note.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Note</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Theme Accents */}
          {filteredAccents.length > 0 && (
            <div>
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                Accent Themes
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {filteredAccents.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => handleSelect(() => setAccentColor(acc.id))}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center space-x-2.5 text-left text-slate-200 transition-colors"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
                      style={{ backgroundColor: acc.colorHex }}
                    />
                    <span className="text-xs font-medium">{acc.label.replace('Set Accent: ', '')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1 bg-slate-800 rounded border border-white/10">↑↓</kbd> navigate
            <kbd className="px-1 bg-slate-800 rounded border border-white/10">ESC</kbd> close
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-accent" style={{ color: 'var(--accent-color)' }} />
            Scholar Command Engine
          </span>
        </div>

      </div>
    </div>
  );
};
