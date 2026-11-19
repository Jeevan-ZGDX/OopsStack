'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight,
  PlusCircle,
  Award,
  GraduationCap
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.studentDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
        <p className="font-medium text-xs">Loading learner portal...</p>
      </div>
    );
  }

  const metrics = data?.metrics || { exams_taken: 0, available_exams: 0, classes_count: 0, avg_score: 0 };
  const classes = data?.enrolled_classes || [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Learner Portal
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  Batch {user?.batch || '2024-2028'} • {user?.school?.name || 'Coimbatore Institute of Technology'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                Welcome back, {user?.first_name || user?.username}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Track your active cohorts, complete examinations, and review performance analytics.
              </p>
            </div>
            <Link
              href="/student/enroll"
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Enroll in Class
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
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed Tests</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.exams_taken}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-emerald-700">
              Evaluated & Graded
            </span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Available Exams</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.available_exams}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/student/exams"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Take Exams <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enrolled Cohorts</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.classes_count}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-purple-700">
              Active Courses
            </span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Score</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.avg_score}%</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/student/history"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Scorecard History <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Actions & Enrolled Classes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h2>
            
            <Link
              href="/student/exams"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                    Take Available Exams
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Attempt assigned tests & practice exams</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            <Link
              href="/student/history"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm">
                    Attempt History
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Review scores and question explanations</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link
              href="/student/enroll"
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-sm">
                    Self-Enroll in Class
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Enter 8-character instructor code</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>

          {/* Enrolled Classes List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">My Cohorts & Classes</h2>
            
            {classes.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200/90 text-center shadow-xs">
                <Users className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800 text-sm">Not enrolled in any classes yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Ask your instructor for your 8-character class enrollment code to get started.
                </p>
                <Link
                  href="/student/enroll"
                  className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Join a Class
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {classes.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {c.department}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">Batch {c.batch}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{c.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Faculty Lead: {c.teacher}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/leaderboard/class/${c.id}`}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        Leaderboard
                      </Link>
                      <Link
                        href="/student/exams"
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                      >
                        View Exams
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
