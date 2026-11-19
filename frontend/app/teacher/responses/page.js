'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  CheckSquare, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  Filter,
  ArrowLeft
} from 'lucide-react';

export default function TeacherResponsesPage() {
  const [responses, setResponses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.teacherResponses()
      .then((res) => setResponses(res.responses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = responses.filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      r.student_name.toLowerCase().includes(term) ||
      r.student_username.toLowerCase().includes(term) ||
      r.exam_title.toLowerCase().includes(term) ||
      r.class_name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/teacher/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-3 transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Faculty Workspace
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  Real-Time Audit
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">Response Evaluation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                Student Examination Submissions
              </h1>
              <p className="text-slate-500 mt-1 text-sm max-w-2xl">
                Spreadsheet-grade audit sheet. Inspect student answers, percentage scores, durations, and proctoring logs.
              </p>
            </div>

            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or cohort..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              Certified Submissions ({filtered.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
              <p className="text-xs font-medium">Loading evaluation responses...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800">No responses match criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No students have submitted matching examinations yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Identifier</th>
                    <th className="px-6 py-3">Examination</th>
                    <th className="px-6 py-3">Cohort</th>
                    <th className="px-6 py-3 text-center">Score</th>
                    <th className="px-6 py-3 text-center">Duration</th>
                    <th className="px-6 py-3 text-center">Proctoring Status</th>
                    <th className="px-6 py-3 text-right">Scorecard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((resp) => (
                    <tr key={resp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900 text-sm">
                        {resp.student_name}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-600">
                        {resp.student_username}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {resp.exam_title}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {resp.class_name}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className="font-bold text-slate-900">{resp.score}</span>
                        <span className="text-slate-400 text-xs"> / {resp.total_marks} ({resp.percentage}%)</span>
                      </td>
                      <td className="px-6 py-3.5 text-center text-slate-600">
                        {resp.time_taken_minutes} mins
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {resp.has_violation ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <ShieldAlert className="w-3 h-3 text-rose-600" /> Violation Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clean Audit
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/student/attempts/${resp.id}/results`}
                          className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                          Audit <Eye className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
