'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  AlertTriangle, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export default function ExamResultsPage({ params }) {
  const unwrappedParams = use(params);
  const attemptId = unwrappedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.studentExamResults(attemptId)
      .then((res) => setData(res.results))
      .catch((err) => setError(err.message || 'Failed to load results.'))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
          <p className="font-semibold text-sm">Evaluating your submission and computing analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Result Not Found</h2>
          <p className="text-sm text-slate-600 mt-2">{error || 'Unable to retrieve attempt details.'}</p>
          <Link
            href="/student/exams"
            className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
          >
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const {
    exam_title,
    student_name,
    score,
    total_marks,
    percentage,
    passed,
    attempt_mode,
    time_taken_mins,
    has_violation,
    violation_reason,
    submitted_at,
    questions = []
  } = data;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 pt-10 pb-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Evaluation Summary
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                {exam_title}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Completed by <span className="text-white font-semibold">{student_name}</span> &bull; {submitted_at}
              </p>
            </div>

            <Link
              href="/student/exams"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              All Exams
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20 space-y-8">
        
        {/* Violation Warning Alert if flagged */}
        {has_violation && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex items-start gap-4 shadow-sm text-rose-800">
            <ShieldAlert className="w-6 h-6 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-base text-rose-900">
                Proctoring Violation Flagged on this Attempt
              </h4>
              <p className="text-xs sm:text-sm text-rose-700 mt-1 leading-relaxed">
                {violation_reason || 'Focus loss or tab switching was detected during the test session.'}
              </p>
            </div>
          </div>
        )}

        {/* Score Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</span>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">{score}</span>
              <span className="text-sm font-semibold text-slate-400">/ {total_marks}</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 mt-3">{percentage}% Marks</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-black uppercase tracking-wider ${
                  passed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-3 font-medium">Evaluation Verdict</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Taken</span>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">{time_taken_mins}</span>
              <span className="text-sm font-semibold text-slate-400">mins</span>
            </div>
            <span className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Total Duration
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attempt Mode</span>
            <div className="mt-3">
              <span className="text-xl font-black text-slate-900 capitalize">
                {attempt_mode}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-3 font-medium">Session Type</span>
          </div>
        </div>

        {/* Questions Detailed Pedagogical Review */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Detailed Question Analysis & Explanations
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {questions.length} Questions Reviewed
            </span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border-2 p-6 shadow-sm ${
                  q.is_correct ? 'border-emerald-100' : 'border-rose-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg font-black text-xs bg-slate-100 text-slate-700">
                      Q{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                        q.is_correct
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {q.is_correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {q.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {q.marks} mark{q.marks > 1 ? 's' : ''}
                  </span>
                </div>

                <p className="text-base font-bold text-slate-900 mb-5">
                  {q.text}
                </p>

                {/* Choices Breakdown */}
                <div className="space-y-2.5 mb-5">
                  {q.choices.map((c, cIdx) => {
                    const letter = ['A', 'B', 'C', 'D'][cIdx] || `${cIdx + 1}`;
                    let style = 'bg-slate-50 border-slate-100 text-slate-700';
                    
                    if (c.is_correct) {
                      style = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                    } else if (c.is_selected && !c.is_correct) {
                      style = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                    }

                    return (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-white/80 border border-black/5 font-bold text-xs flex items-center justify-center">
                            {letter}
                          </span>
                          <span>{c.text}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {c.is_selected && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded shadow-xs">
                              Your Selection
                            </span>
                          )}
                          {c.is_correct && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                              ✓ Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {q.explanation && (
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-800 uppercase tracking-wider mb-1">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      Pedagogical Concept Explanation
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
    </div>
  );
}
