'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  FileText, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Eye,
  ArrowLeft
} from 'lucide-react';

export default function TeacherExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.teacherExams()
      .then((res) => setExams(res.exams || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Content Repository
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">Authoring Suite</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                My Authored Examinations
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Manage and review your custom assessments, questions, and scoring parameters.
              </p>
            </div>

            <Link
              href="/teacher/exams/create"
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
            <p className="text-xs font-medium">Loading authored exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800">No authored exams yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first test or practice examination to begin evaluating your cohorts.
            </p>
            <Link
              href="/teacher/exams/create"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Create Exam Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {exam.subject}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {exam.exam_type === 'practice_test' ? 'Practice & Test' : 'Test Only'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    Topic: {exam.chapter} • Dept: {exam.department}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Questions</p>
                      <p className="font-bold text-slate-800 mt-0.5">{exam.questions_count}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Marks</p>
                      <p className="font-bold text-slate-800 mt-0.5">{exam.total_marks}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Duration</p>
                      <p className="font-bold text-slate-800 mt-0.5">{exam.duration_minutes}m</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Pass: {exam.pass_percentage}%
                  </span>

                  <Link
                    href={`/teacher/exams/${exam.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 transition-all"
                  >
                    View & Edit <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
