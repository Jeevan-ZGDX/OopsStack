'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  Layers, 
  Search, 
  User, 
  Clock, 
  FileText, 
  ArrowRight,
  Filter,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export default function ExamBankPage() {
  const [exams, setExams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSubj, setSelectedSubj] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.examBank({ department: selectedDept, subject: selectedSubj, search })
      .then((res) => {
        setExams(res.exams || []);
        if (res.departments) setDepartments(res.departments);
        if (res.subjects) setSubjects(res.subjects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedDept, selectedSubj, search]);

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

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Institutional Library
              </span>
              <span className="text-xs font-medium text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">Question Banking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              Shared Examination Bank
            </h1>
            <p className="text-slate-500 mt-1 text-sm max-w-2xl">
              Browse and assign examinations curated by faculty members across departments in your institution.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search repository..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedSubj}
                onChange={(e) => setSelectedSubj(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
            <p className="text-xs font-medium">Browsing institutional repository...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800">No exams match criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your filter selection or search keywords.
            </p>
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
                  <p className="text-xs text-slate-400 mt-1">Author: {exam.created_by}</p>

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
                    Inspect Bank <ArrowRight className="w-3 h-3" />
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
