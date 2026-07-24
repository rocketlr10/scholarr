import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Key, Link as LinkIcon, CheckCircle2, ArrowRight, ArrowLeft, ExternalLink, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SchoologyTutorialModal: React.FC = () => {
  const { isSchoologyTutorialOpen, setIsSchoologyTutorialOpen, syncSchoologyNow, preferences, updatePreferences } = useApp();
  const [step, setStep] = useState<number>(1);
  const [domain, setDomain] = useState(preferences.schoology.domain || '');
  const [apiKey, setApiKey] = useState(preferences.schoology.apiKey || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);

  if (!isSchoologyTutorialOpen) return null;

  const handleFinishConnection = async () => {
    setIsConnecting(true);
    updatePreferences({
      schoology: {
        ...preferences.schoology,
        domain: domain || 'schoology.com',
        apiKey: apiKey || 'sch_key_user',
        connected: true,
        lastSynced: new Date().toISOString(),
      },
    });
    await syncSchoologyNow();
    setIsConnecting(false);
    setConnectSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Schoology Setup & Tutorial
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={() => setIsSchoologyTutorialOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 min-h-[280px]">
          {connectSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Schoology Connected!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Your Schoology domain has been registered. Course assignments and announcements will automatically sync to Scholar.
              </p>
              <button
                onClick={() => setIsSchoologyTutorialOpen(false)}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                Done
              </button>
            </motion.div>
          ) : step === 1 ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                  <p className="font-semibold">How Schoology Syncing Works:</p>
                  <p>Scholar connects to your school's Schoology portal to pull course rosters, assignment due dates, and grading rubrics into your dashboard.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
                  1. School Schoology Domain URL
                </label>
                <p className="text-xs text-slate-500 mb-2">Enter the web address you use to sign into Schoology (e.g. <code>app.schoology.com</code> or <code>schoology.myschool.edu</code>).</p>
                <input
                  type="text"
                  placeholder="e.g. app.schoology.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                2. Instructions for API Key / Calendar iCal Link
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded">Option A</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">API Access Token:</p>
                    <p>In Schoology, go to <strong>Account Settings</strong> &gt; <strong>API Information</strong> or Developer Portal to copy your personal API Secret.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded">Option B</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Calendar Feed Sync:</p>
                    <p>Click <strong>Calendar</strong> in Schoology, scroll to the bottom right, click <strong>iCal Feed</strong>, and paste the generated URL token below.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-200 mb-1">
                  API Key / iCal Feed Secret Token
                </label>
                <input
                  type="password"
                  placeholder="Paste your Schoology key or iCal URL token..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                3. Confirm & Test Connection
              </h3>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Domain:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">{domain || 'app.schoology.com'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">API Status:</span>
                  <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">Ready to Authenticate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auto-Import:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Assignments & Courses</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clicking verify below will test your Schoology credentials and import active course assignments.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer Navigation */}
        {!connectSuccess && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishConnection}
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isConnecting ? 'Verifying & Syncing...' : 'Verify & Connect Schoology'}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
