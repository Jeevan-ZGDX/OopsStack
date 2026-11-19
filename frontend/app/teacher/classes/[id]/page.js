'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  Users, 
  ArrowLeft, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Award,
  AlertCircle
} from 'lucide-react';

export default function TeacherClassDetailPage({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const loadDetail = () => {
    api.teacherClassDetail(classId)
      .then((res) => setData(res.class))
      .catch((err) => setError(err.message || 'Failed to load class.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDetail();
  }, [classId]);

  const handleToggleEnrollment = async () => {
    setToggling(true);
    try {
      const res = await api.teacherToggleEnrollment(classId);
      setData((prev) => ({
        ...prev,
        allow_self_enrollment: res.allow_self_enrollment,
        enrollment_code: res.enrollment_code,
      }));
    } catch (err) {
      alert('Error updating enrollment: ' + err.message);
    } finally {
      setToggling(false);
    }
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Regenerate a new enrollment code? The old code will expire.')) return;
    setRegenerating(true);
    try {
      const res = await api.teacherRegenerateCode(classId);
      setData((prev) => ({ ...prev, enrollment_code: res.enrollment_code }));
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
          <p className="font-semibold text-sm">Loading cohort details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Class Not Found</h2>
          <p className="text-sm text-slate-600 mt-2">{error}</p>
          <Link
            href="/teacher/classes"
            className="mt-6 inline-block px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    department,
    batch,
    description,
    enrollment_code,
    allow_self_enrollment,
    created_by,
    students = [],
    assigned_exams = []
  } = data;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-slate-900 pt-10 pb-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/teacher/classes"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Classes
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded border border-purple-500/30">
                  Batch {batch}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {department}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                {name}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Instructor: <span className="text-white font-medium">{created_by}</span> &bull; {students.length} Enrolled Students
              </p>
            </div>

            <Link
              href={`/leaderboard/class/${classId}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Award className="w-4 h-4" />
              Class Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-8">
        
        {/* Enrollment Settings Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Self-Enrollment Settings</span>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-indigo-700 tracking-wider">
                {enrollment_code || 'CODE_PENDING'}
              </span>
              <button
                onClick={handleRegenerateCode}
                disabled={regenerating}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Regenerate Code"
              >
                <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Students join by entering this 8-character code in their enrollment tab.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">
              {allow_self_enrollment ? 'Enrollment Active' : 'Enrollment Locked'}
            </span>
            <button
              onClick={handleToggleEnrollment}
              disabled={toggling}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                allow_self_enrollment
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {allow_self_enrollment ? 'Disable Code' : 'Enable Code'}
            </button>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Student Roster ({students.length})
            </h3>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No students enrolled in this cohort yet. Share the code above to onboard students.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Username</th>
                    <th className="px-6 py-3.5 text-center">Batch</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{s.username}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {s.batch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                          s.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {s.is_active ? 'Active' : 'Inactive'}
                        </span>
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
