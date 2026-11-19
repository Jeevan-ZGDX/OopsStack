'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { KeyRound, Users, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudentEnrollPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.studentEnroll(code);
      setSuccess(`Successfully joined "${res.class_name}"! Redirecting...`);
      setTimeout(() => router.push('/student/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to join class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50/70">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <Link
            href="/student/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-4 w-fit transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Join an Academic Cohort</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter the 8-character enrollment code provided by your course instructor (e.g. <span className="font-mono font-semibold text-slate-700">CSEOS024</span>).
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleEnroll} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              8-Character Enrollment Code
            </label>
            <input
              type="text"
              required
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., CSEOS024"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-base tracking-widest uppercase font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? 'Validating Code...' : 'Enroll in Cohort'}
          </button>
        </form>
      </div>
    </div>
  );
}
