import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { wipeAllScholarData } from '../utils/storage';
import {
  Sparkles,
  ShieldCheck,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  UserPlus,
  Compass,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  LogIn
} from 'lucide-react';

export const AuthLandingScreen: React.FC = () => {
  const {
    loginWithGoogle,
    loginUserWithEmail,
    registerUserWithEmail,
    loginAsGuest
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleIframeNotice, setGoogleIframeNotice] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setGoogleIframeNotice(false);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setGoogleIframeNotice(true);
      setErrorMessage(
        "Google Sign-In popup was closed or restricted by browser iframe security. You can sign in via email/password below or open the app in a new browser tab."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAppInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'login') {
        const success = await loginUserWithEmail(email, password);
        if (!success) setErrorMessage('Failed to sign in. Please check your credentials.');
      } else {
        if (!name) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        const success = await registerUserWithEmail(email, password, name, school);
        if (!success) setErrorMessage('Failed to register account.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Ambient Radial Glows */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/20 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Scholar <span className="text-indigo-400 font-mono text-sm px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your personal student workspace. Sign in to sync courses, assignments, focus timer stats, and calendar events.
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-xl space-y-5">
          
          {/* Tabs for Login & Create Account directly on the SAME page */}
          <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center grid grid-cols-2 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'login'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'register'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs space-y-2">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              {googleIframeNotice && (
                <button
                  onClick={openAppInNewTab}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open App in New Tab for Google Sign-In</span>
                </button>
              )}
            </div>
          )}

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google Sign-In</span>
          </button>

          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Or with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {activeTab === 'register' && (
              <div>
                <label className="block text-slate-300 font-semibold text-[11px] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold text-[11px] mb-1">Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-[11px] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-slate-300 font-semibold text-[11px] mb-1">University / High School (Optional)</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                    placeholder="Stanford University"
                    className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 mt-2"
            >
              <span>{activeTab === 'login' ? 'Sign In to Workspace' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer Actions: Guest Mode + Reset Data */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          <button
            onClick={loginAsGuest}
            className="text-xs text-slate-300 hover:text-white transition-colors inline-flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl hover:bg-white/5 bg-white/5 border border-white/5"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Continue as Guest (Blank Canvas)</span>
          </button>

          <button
            onClick={wipeAllScholarData}
            className="text-[11px] text-red-400/80 hover:text-red-300 transition-colors inline-flex items-center space-x-1.5 py-1 px-2 rounded-lg hover:bg-red-500/10"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset & Clear All Local Workspace Data</span>
          </button>
        </div>

      </div>
    </div>
  );
};
