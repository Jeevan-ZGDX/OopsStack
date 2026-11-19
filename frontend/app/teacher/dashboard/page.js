'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { 
  FileText, 
  Users, 
  Layers, 
  CheckSquare, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.teacherDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
        <p className="font-medium text-xs">Loading faculty workspace...</p>
      </div>
    );
  }

  const metrics = data?.metrics || { assigned_exams: 0, unassigned_exams: 0, classes_count: 0, total_exams: 0 };
  const recentExams = data?.recent_exams || [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Faculty Workspace
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  {user?.school?.name || 'Coimbatore Institute of Technology'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                Welcome back, {user?.first_name || user?.username}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Author examinations, manage cohorts, and inspect real-time student evaluation responses.
              </p>
            </div>
            <Link
              href="/teacher/exams/create"
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Exams</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.assigned_exams}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-emerald-700">
              Assigned to Cohorts
            </span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Draft Exams</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.unassigned_exams}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-amber-700">
              Unassigned Drafts
            </span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">My Classes</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.classes_count}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/teacher/classes"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage Classes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Authored</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.total_exams}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/teacher/exams"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Repository <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Workspace Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              href="/teacher/classes"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                Academic Cohorts
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Manage classes, view student rosters, and generate enrollment codes</p>
            </Link>

            <Link
              href="/teacher/exams"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-sm">
                Authored Exams
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Review questions, assign marks, and configure exam duration</p>
            </Link>

            <Link
              href="/teacher/exam-bank"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm">
                Shared Question Bank
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Browse institutional repository and clone assessments across batches</p>
            </Link>

            <Link
              href="/teacher/responses"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">
                Student Responses
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Real-time spreadsheet-grade scorecards and item difficulty analysis</p>
            </Link>

          </div>
        </div>

        {/* Recent Exams Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recently Authored Examinations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Directly managed by your account</p>
            </div>
            <Link href="/teacher/exams" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentExams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Exam Title</th>
                    <th className="px-6 py-3">Subject / Dept</th>
                    <th className="px-6 py-3">Format</th>
                    <th className="px-6 py-3">Questions</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{exam.title}</td>
                      <td className="px-6 py-3.5 text-slate-600">{exam.subject} • {exam.department}</td>
                      <td className="px-6 py-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {exam.exam_type === 'practice_test' ? 'Practice & Test' : 'Test Only'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{exam.questions_count} Questions ({exam.total_marks} marks)</td>
                      <td className="px-6 py-3.5 text-slate-600">{exam.duration_minutes} mins</td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/teacher/exams/${exam.id}`}
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Details &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No exams authored yet. Click "Create New Exam" above to start.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
