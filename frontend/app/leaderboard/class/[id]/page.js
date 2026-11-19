'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  Award, 
  Trophy, 
  Medal, 
  ArrowLeft, 
  Users, 
  BarChart3,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function ClassLeaderboardPage({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.classLeaderboard(classId)
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load leaderboard.'))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-slate-300 border-t-slate-800 mb-3" />
          <p className="font-medium text-xs">Computing cohort performance rankings...</p>
        </div>
      </div>
    );
  }

  const cls = data?.class;
  const leaderboard = data?.leaderboard || [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/student/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Cohort Merit List
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">Batch {cls?.batch}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                {cls?.name}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Department of {cls?.department} • Faculty: {cls?.teacher}
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
              <Users className="w-4 h-4 text-slate-500" />
              <span>{cls?.student_count} Enrolled Candidates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {leaderboard.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-slate-500 shadow-xs">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800">No scored submissions yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Students who complete tests in this cohort will automatically appear on this certified leaderboard.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3 w-20">Rank</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Roll / ID</th>
                    <th className="px-6 py-3 text-right">Tests Taken</th>
                    <th className="px-6 py-3 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((student, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-slate-50/50 transition-colors ${
                          rank === 1 ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          {rank === 1 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shadow-xs border border-amber-300">
                              🥇
                            </span>
                          ) : rank === 2 ? (
                            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs shadow-xs border border-slate-300">
                              🥈
                            </span>
                          ) : rank === 3 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-900 font-bold flex items-center justify-center text-xs shadow-xs border border-amber-200">
                              🥉
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold flex items-center justify-center text-xs">
                              {rank}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{student.email || 'No institutional email'}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-600">
                          {student.username}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-700">
                          {student.tests_taken}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-slate-900 text-sm">{student.average_percentage}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
