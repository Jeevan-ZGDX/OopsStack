'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Lock, User, AlertCircle, ArrowRight, Building2, ShieldCheck, Check } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [username, setUsername] = useState('admin_cit_01');
  const [password, setPassword] = useState('adminpassword123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState('admin');

  // React to query parameter
  useEffect(() => {
    if (roleParam === 'teacher') {
      selectRole('teacher');
    } else if (roleParam === 'student') {
      selectRole('student');
    } else if (roleParam === 'admin') {
      selectRole('admin');
    }
  }, [roleParam]);

  const selectRole = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'admin') {
      setUsername('admin_cit_01');
      setPassword('adminpassword123');
    } else if (role === 'teacher') {
      setUsername('tch_003');
      setPassword('teachpass123');
    } else if (role === 'student') {
      setUsername('stu_001');
      setPassword('studentpass123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-md w-full space-y-6">
        
        {/* Institutional Card */}
        <div className="bg-white p-8 sm:p-9 rounded-2xl shadow-sm border border-slate-200/90">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-xl mb-3 shadow-xs">
              C
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Institutional Sign In
            </h2>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Coimbatore Institute of Technology • CognIQ Portal
            </p>
          </div>

          {/* Quick Role Segmented Switcher */}
          <div className="mb-6 p-1 bg-slate-100 rounded-lg flex gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => selectRole('admin')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                activeRole === 'admin' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => selectRole('teacher')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                activeRole === 'teacher' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => selectRole('student')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                activeRole === 'student' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter institutional username"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper Note */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              Active Role: <span className="font-semibold text-slate-700 capitalize">{activeRole}</span> • Autofilled with demo credentials
            </p>
          </div>

        </div>

        {/* Security Footer Notice */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Encrypted Session • Session-Based Institutional Authentication</span>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center text-slate-400">
        Loading authentication portal...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
