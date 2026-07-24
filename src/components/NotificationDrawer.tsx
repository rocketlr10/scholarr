import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Calendar,
  CheckSquare,
  RefreshCw,
  Clock
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setCurrentView
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <CheckSquare className="w-4 h-4 text-blue-400" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'schoology':
        return <RefreshCw className="w-4 h-4 text-emerald-400" />;
      case 'google_cal':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-md h-full glass-panel border-l border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: 'rgba(11, 15, 23, 0.92)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-accent" style={{ color: 'var(--accent-color)' }} />
            <h3 className="font-bold text-lg text-white">Notifications</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {notifications.length}
            </span>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-white/5 text-xs">
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={clearNotifications}
              className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-12 h-12 stroke-1 opacity-40 mb-3" />
              <p className="font-medium text-sm text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No pending notifications or system updates.</p>
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.linkView) {
                    setCurrentView(item.linkView);
                    setIsNotificationDrawerOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  item.read
                    ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    : 'bg-white/10 border-white/15 text-white hover:border-white/25 shadow-md'
                }`}
              >
                {!item.read && (
                  <span
                    className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  />
                )}

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-white/10 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 pr-3">
                    <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{item.message}</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500">
            Scholar Sync Engine • Schoology & Google Calendar Alerts
          </p>
        </div>
      </div>
    </div>
  );
};
