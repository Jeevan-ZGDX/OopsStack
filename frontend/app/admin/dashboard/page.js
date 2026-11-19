'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  ArrowRight,
  Building2,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
        <p className="font-medium text-xs">Loading institutional command center...</p>
      </div>
    );
  }

  const metrics = data?.metrics || { teachers_count: 0, students_count: 0, classes_count: 0, exams_count: 0 };
  const recentClasses = data?.recent_classes || [];
  const schoolName = data?.school?.name || user?.school?.name || 'Coimbatore Institute of Technology';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Institutional Governance
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  {schoolName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                Administrative Command Center
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                System governance, user lifecycle provisioning, and institutional cohort metrics.
              </p>
            </div>
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
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Faculty Count</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.teachers_count}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/admin/teachers"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage Teachers <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.students_count}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/admin/students"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage Students <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Cohorts</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.classes_count}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <Link
              href="/admin/classes"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Classes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Examinations</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.exams_count}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
              Institution Bank
            </div>
          </div>

        </div>

        {/* Quick Nav Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/admin/teachers"
            className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Faculty Management
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Provision teachers with sequential IDs, manage departmental assignments, and toggle access states.
            </p>
          </Link>

          <Link
            href="/admin/students"
            className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Student Directory & Batches
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Filter student rosters by academic year batches (e.g. 2024–2028), audit accounts, and verify roll numbers.
            </p>
          </Link>

          <Link
            href="/admin/classes"
            className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group block"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Cohort Architecture
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Audit all classes created by faculty, monitor enrollment codes, and track cross-departmental cohorts.
            </p>
          </Link>
        </div>

        {/* Recent Classes / Activity Table */}
        {recentClasses.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recently Created Academic Cohorts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Faculty-managed classes across departments</p>
              </div>
              <Link href="/admin/classes" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Class / Cohort Name</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Created By</th>
                    <th className="px-6 py-3 text-right">Enrollments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{cls.name}</td>
                      <td className="px-6 py-3.5 text-slate-600">{cls.department}</td>
                      <td className="px-6 py-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                          {cls.batch}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{cls.created_by}</td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-900">{cls.student_count} students</td>
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
