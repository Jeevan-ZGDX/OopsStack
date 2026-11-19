'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  Award,
  Layers
} from 'lucide-react';

export default function StudentHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.studentHistory()
      .then((res) => setHistory(res.history || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Performance Records
            </span>
            <span className="text-xs font-medium text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Certified Submissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Attempt History & Scorecards
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Review your past scores, evaluated submissions, and conceptual explanations.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
            <p className="text-xs font-medium">Retrieving attempt history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800">No attempts found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You have not submitted any test or practice attempts yet.
            </p>
            <Link
              href="/student/exams"
              className="mt-5 inline-block px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs"
            >
              Browse Available Exams
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Examination Title</th>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Submitted At</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Scorecard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 text-sm">
                        {att.exam_title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          att.attempt_mode === 'practice'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {att.attempt_mode.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {att.submitted_at ? new Date(att.submitted_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{att.score}</span>
                        <span className="text-slate-400 text-xs"> / {att.total_marks} ({att.percentage}%)</span>
                      </td>
                      <td className="px-6 py-4">
                        {att.passed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" /> Needs Review
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/student/attempts/${att.id}/results`}
                          className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                          Review <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
