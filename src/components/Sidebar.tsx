import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  Timer,
  GraduationCap,
  FileText,
  BarChart2,
  Bell,
  Settings,
  Plus,
  Command,
  User,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    notifications,
    setIsNotificationDrawerOpen,
    setIsQuickAddOpen,
    setIsCommandPaletteOpen,
    setIsAuthModalOpen,
    currentUser,
    accentColor
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'study', label: 'Study Timer', icon: Timer },
    { id: 'subjects', label: 'Subjects', icon: GraduationCap },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 h-screen p-4 flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 z-30 select-none">
      <div className="glass-panel rounded-2xl p-4 flex flex-col h-full shadow-2xl shadow-black/50 border border-white/10 relative overflow-hidden">
        
        {/* Subtle glowing accent gradient in background */}
        <div 
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent-color)' }}
        />

        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-black/30 transition-all duration-300"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
                Scholar
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                  PRO
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Student Dashboard</p>
            </div>
          </div>
        </div>

        {/* Quick Add Button & Command trigger */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm text-white transition-all shadow-md active:scale-98"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Add</span>
          </button>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-slate-400 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5" />
              <span>Search & Commands</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto pr-1">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Workspace
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'text-white bg-white/10 border border-white/15 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                    style={{ color: isActive ? 'var(--accent-color)' : undefined }}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  />
                )}
              </button>
            );
          })}

          <div className="pt-4 text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            System
          </div>

          {/* Notifications button */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 ? (
              <span 
                className="px-2 py-0.5 text-xs font-bold rounded-full text-white"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {unreadCount}
              </span>
            ) : null}
          </button>

          {/* Settings button */}
          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              currentView === 'settings'
                ? 'text-white bg-white/10 border border-white/15'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Settings
                className={`w-4 h-4 ${
                  currentView === 'settings' ? 'text-accent' : 'text-slate-400 group-hover:text-slate-300'
                }`}
                style={{ color: currentView === 'settings' ? 'var(--accent-color)' : undefined }}
              />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Sync Status Box from Design Theme */}
        <div className="my-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Sync Status</div>
          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-300">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Schoology Connected</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Google Calendar Synced</span>
          </div>
        </div>

        {/* User Account Profile Card */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all text-left group"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </button>
        </div>

      </div>
    </aside>
  );
};
