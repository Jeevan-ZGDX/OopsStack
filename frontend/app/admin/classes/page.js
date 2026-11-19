'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  Layers, 
  ArrowLeft, 
  Users, 
  BookOpen, 
  KeyRound, 
  Award,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminClasses()
      .then((res) => setClasses(res.classes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-3 transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Command Center
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
              Institutional Governance
            </span>
            <span className="text-xs font-medium text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Cohort Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Institutional Cohort Architecture
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            School-wide overview of all student classes, active departments, instructors, and enrollment codes.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Active Classes ({classes.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
              <p className="text-xs font-medium">Loading institutional classes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Class / Cohort Name</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Academic Batch</th>
                    <th className="px-6 py-3">Faculty In-Charge</th>
                    <th className="px-6 py-3 text-center">Enrollment Code</th>
                    <th className="px-6 py-3 text-center">Students</th>
                    <th className="px-6 py-3 text-right">Assigned Exams</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900 text-sm">
                        {cls.name}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {cls.department}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                          {cls.batch}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {cls.created_by}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {cls.enrollment_code ? (
                          <span className="font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                            {cls.enrollment_code}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Direct Only</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center font-semibold text-slate-700">
                        {cls.student_count}
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
                        {cls.assigned_exam_count}
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
