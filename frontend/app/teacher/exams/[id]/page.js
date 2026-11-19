'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  FileText, 
  ArrowLeft, 
  Clock, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  Users,
  AlertCircle
} from 'lucide-react';

export default function TeacherExamDetailPage({ params }) {
  const unwrappedParams = use(params);
  const examId = unwrappedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.teacherExamDetail(examId)
      .then((res) => setData(res.exam))
      .catch((err) => setError(err.message || 'Failed to load exam.'))
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
          <p className="font-semibold text-sm">Loading exam specification...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Exam Not Found</h2>
          <p className="text-sm text-slate-600 mt-2">{error}</p>
          <Link
            href="/teacher/exams"
            className="mt-6 inline-block px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    subject,
    department,
    chapter,
    exam_type,
    duration_minutes,
    pass_percentage,
    total_marks,
    description,
    assigned_classes = [],
    questions = []
  } = data;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-slate-900 pt-10 pb-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/teacher/exams"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to My Exams
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
              {subject}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {department}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            {title}
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Category: <span className="text-slate-200 font-semibold">{chapter}</span> &bull; {questions.length} Questions &bull; {total_marks} Total Marks
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-8">
        
        {/* Specifications Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Duration</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{duration_minutes}m</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Pass Threshold</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{pass_percentage}%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Exam Type</p>
            <p className="text-base font-black text-slate-900 mt-2 capitalize">{exam_type.replace('_', ' ')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Assigned Cohorts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{assigned_classes.length}</p>
          </div>
        </div>

        {/* Assigned Classes Pill List */}
        {assigned_classes.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> Assigned To:
            </span>
            {assigned_classes.map((c) => (
              <span key={c.id} className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200">
                {c.name} ({c.batch})
              </span>
            ))}
          </div>
        )}

        {/* Question Inspection List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">
              Exam Questions ({questions.length})
            </h3>
          </div>

          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-100">
                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs">
                  Question {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {q.marks} mark{q.marks > 1 ? 's' : ''}
                </span>
              </div>

              <p className="text-base font-bold text-slate-900 mb-5">
                {q.text}
              </p>

              {/* Choices with Correct Answer Marked */}
              <div className="space-y-2 mb-5">
                {q.choices.map((c, cIdx) => {
                  const letter = ['A', 'B', 'C', 'D'][cIdx] || `${cIdx + 1}`;
                  return (
                    <div
                      key={c.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${
                        c.is_correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-white border border-black/5 font-bold text-xs flex items-center justify-center">
                          {letter}
                        </span>
                        <span>{c.text}</span>
                      </div>
                      {c.is_correct && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {q.explanation && (
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-800 uppercase tracking-wider mb-1">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    Explanation
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-950 font-normal leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
