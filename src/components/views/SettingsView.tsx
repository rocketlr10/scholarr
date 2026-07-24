import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Palette,
  RefreshCw,
  Calendar,
  Download,
  Upload,
  User,
  Shield,
  CheckCircle2,
  Sparkles,
  Save
} from 'lucide-react';
import { AccentTheme } from '../../types';
import { ACCENT_COLORS } from '../../utils/storage';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    accentColor,
    setAccentColor,
    preferences,
    updatePreferences,
    setIsSchoologyTutorialOpen,
    syncSchoologyNow,
    syncGoogleCalendarNow,
    isSyncingSchoology,
    exportUserDataJSON,
    importUserDataJSON
  } = useApp();

  const [importJson, setImportJson] = useState('');
  const [importMsg, setImportMsg] = useState('');

  const handleExport = () => {
    const json = exportUserDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholar_backup_${currentUser.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = importUserDataJSON(importJson);
    if (success) {
      setImportMsg('Backup data imported successfully!');
      setImportJson('');
    } else {
      setImportMsg('Failed to parse backup JSON.');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" style={{ color: 'var(--accent-color)' }} />
          <span>Scholar Preferences & Integration Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize accent color themes, Schoology API credentials, Google Calendar sync, and backup data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Customization & Connected Services */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Accent Color Customizer */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <Palette className="w-5 h-5 text-accent" style={{ color: 'var(--accent-color)' }} />
              <h3 className="font-bold text-base text-white">Accent Theme Selection</h3>
            </div>

            <p className="text-xs text-slate-300">
              Select an accent theme inspired by macOS HIG. Updates all active buttons, progress indicators, highlights, and charts dynamically.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {(Object.keys(ACCENT_COLORS) as AccentTheme[]).map(key => {
                const info = ACCENT_COLORS[key];
                const isSelected = accentColor === key;

                return (
                  <button
                    key={key}
                    onClick={() => setAccentColor(key)}
                    className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                      isSelected
                        ? 'bg-white/15 border-white/30 text-white shadow-lg ring-2 ring-white/20'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full ring-2 ring-white/20 shrink-0"
                      style={{ backgroundColor: info.hex }}
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">{info.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{info.hex}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schoology LMS Feed Config */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Schoology LMS Integration</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                {preferences.schoology.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Schoology School Domain</label>
                <input
                  type="text"
                  value={preferences.schoology.domain || ''}
                  onChange={e =>
                    updatePreferences({
                      schoology: { ...preferences.schoology, domain: e.target.value },
                    })
                  }
                  className="w-full glass-input px-3 py-2 rounded-xl"
                  placeholder="schoology.stanford.edu"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">API Key / Access Token</label>
                <input
                  type="password"
                  value={preferences.schoology.apiKey || ''}
                  onChange={e =>
                    updatePreferences({
                      schoology: { ...preferences.schoology, apiKey: e.target.value },
                    })
                  }
                  className="w-full glass-input px-3 py-2 rounded-xl font-mono"
                  placeholder="sch_live_xxxxxxxx"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                onClick={() => setIsSchoologyTutorialOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open Setup Tutorial Guide</span>
              </button>

              <button
                onClick={syncSchoologyNow}
                disabled={isSyncingSchoology}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSchoology ? 'animate-spin' : ''}`} />
                <span>Test & Sync Schoology Feed</span>
              </button>
            </div>
          </div>

          {/* Google Calendar Config */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white">Google Calendar Sync</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                {preferences.googleCal.connected ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Google Account Email</label>
                <input
                  type="email"
                  value={preferences.googleCal.email || ''}
                  onChange={e =>
                    updatePreferences({
                      googleCal: { ...preferences.googleCal, email: e.target.value },
                    })
                  }
                  className="w-full glass-input px-3 py-2 rounded-xl"
                  placeholder="student@gmail.com"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={preferences.googleCal.autoExportAssignments}
                  onChange={e =>
                    updatePreferences({
                      googleCal: { ...preferences.googleCal, autoExportAssignments: e.target.checked },
                    })
                  }
                  className="rounded text-accent focus:ring-accent"
                />
                <span className="text-slate-300">Automatically create Google Calendar events when new assignments are created</span>
              </label>
            </div>

            <button
              onClick={syncGoogleCalendarNow}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sync Google Calendar Now</span>
            </button>
          </div>

        </div>

        {/* Right 1 Col: Data Backup & User Profile */}
        <div className="space-y-6">
          
          {/* Active User Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-accent" style={{ color: 'var(--accent-color)' }} />
              <span>Account Profile</span>
            </h3>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <p className="font-bold text-white text-sm">{currentUser.name}</p>
              <p className="text-slate-300">{currentUser.email}</p>
              <p className="text-slate-400 font-mono text-[10px]">{currentUser.school}</p>
            </div>
          </div>

          {/* Export & Import Data */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white">Data Export & Backup</h3>
            <p className="text-xs text-slate-300">
              Download your complete Scholar database backup including assignments, courses, notes, and study logs.
            </p>

            <button
              onClick={handleExport}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Download className="w-4 h-4" />
              <span>Export Complete JSON Backup</span>
            </button>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Restore from Backup JSON</label>
              <textarea
                rows={3}
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
                placeholder="Paste backup JSON string here..."
                className="w-full glass-input p-2.5 rounded-xl text-xs font-mono"
              />
              <button
                onClick={handleImport}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup Data</span>
              </button>
              {importMsg && (
                <p className="text-[11px] text-emerald-400 text-center">{importMsg}</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
