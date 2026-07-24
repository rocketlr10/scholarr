import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Command,
  User,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsCommandPaletteOpen,
    setIsQuickAddOpen,
    setIsNotificationDrawerOpen,
    setIsAuthModalOpen,
    notifications,
    preferences,
    isSyncingSchoology,
    syncSchoologyNow,
    currentUser
  } = useApp();

  const [timeString, setTimeString] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    assignments: 'Assignment Manager',
    calendar: 'Planner & Calendar',
    study: 'Pomodoro & Focus Timer',
    subjects: 'Subjects & Courses',
    notes: 'Rich Study Notes',
    analytics: 'Performance Analytics',
    settings: 'Scholar Settings',
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'study', label: 'Study Timer' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'notes', label: 'Notes' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 pb-2">
      <div className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10 shadow-xl shadow-black/40">
        
        {/* Left: View Title & Mobile Menu Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {viewTitles[currentView] || 'Scholar'}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {currentUser.school} • {timeString}
            </p>
          </div>
        </div>

        {/* Center: Raycast Search Bar Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-slate-400 transition-all hover:border-white/20 group"
          >
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
              <span>Search assignments, notes, courses or type ⌘K...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-white/10 font-mono shadow-inner">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Schoology Pill, Quick Add, Notifications, User */}
        <div className="flex items-center space-x-2.5">
          
          {/* Schoology Live Sync Pill */}
          <button
            onClick={syncSchoologyNow}
            disabled={isSyncingSchoology}
            title="Sync Schoology LMS Feed"
            className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-all active:scale-95"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncingSchoology ? 'animate-spin text-accent' : 'text-emerald-400'}`}
              style={{ color: isSyncingSchoology ? 'var(--accent-color)' : undefined }}
            />
            <span>{isSyncingSchoology ? 'Syncing...' : 'Schoology Synced'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5 transition-all active:scale-95 shadow-md"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 glass-panel rounded-2xl border border-white/10 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentView === item.id ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setIsCommandPaletteOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-400 flex items-center justify-between"
          >
            <span>Search Command Palette</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded">⌘K</kbd>
          </button>
        </div>
      )}
    </header>
  );
};
