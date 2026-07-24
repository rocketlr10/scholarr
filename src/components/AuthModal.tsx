import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UserCheck,
  Mail,
  Lock,
  UserPlus,
  LogOut,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    allUsers,
    switchUser,
    loginUser,
    registerUser,
    logoutUser,
    loginWithGoogle,
    isFirebaseSignedIn
  } = useApp();

  const [mode, setMode] = useState<'account' | 'login' | 'register'>('account');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginUser(email, name);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    registerUser(email, name, school);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-accent" style={{ color: 'var(--accent-color)' }} />
            <h3 className="font-bold text-base text-white">
              {mode === 'account' ? 'User Accounts & Cloud Sync' : mode === 'login' ? 'Sign In to Scholar' : 'Create Scholar Account'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-xs">
          {mode === 'account' && (
            <div className="space-y-4">
              {/* Active Profile Banner */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {currentUser?.name || 'Guest User'}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{currentUser?.email || 'Not logged in'}</p>
                    <p className="text-[10px] text-slate-400">{currentUser?.school || 'My School'}</p>
                  </div>
                </div>
              </div>

              {/* Multi-Account Switcher */}
              <div>
                <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-2">
                  Switch Active Account
                </p>
                <div className="space-y-1.5">
                  {allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => switchUser(user.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        user.id === currentUser?.id
                          ? 'bg-white/15 border-white/25 text-white shadow-inner'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-xs text-white">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      {user.id === currentUser?.id && (
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setMode('login')}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Add Account</span>
                </button>
                <button
                  onClick={() => setMode('register')}
                  className="py-2.5 px-3 rounded-xl text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Account</span>
                </button>
              </div>

              <button
                onClick={logoutUser}
                className="w-full py-2 text-slate-400 hover:text-red-400 text-xs flex items-center justify-center space-x-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to Guest Profile</span>
              </button>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-slate-900 font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google Sign-In</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-white/10" />
                <span className="px-2 text-[10px] text-slate-500 uppercase">Or email</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  defaultValue="password123"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <button type="button" onClick={() => setMode('account')} className="hover:text-white">
                  ← Back to Accounts
                </button>
                <button type="button" onClick={() => setMode('register')} className="hover:text-white">
                  Create account
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-xs transition-all shadow-lg"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Sign In
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Student Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jordan@university.edu"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">University / High School</label>
                <input
                  type="text"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <button type="button" onClick={() => setMode('account')} className="hover:text-white">
                  ← Back to Accounts
                </button>
                <button type="button" onClick={() => setMode('login')} className="hover:text-white">
                  Already have account?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-xs transition-all shadow-lg"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Register Account & Sync
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
