'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { 
  ShieldCheck, 
  BarChart3, 
  BrainCircuit, 
  School, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Users,
  Layers,
  Lock,
  ChevronRight,
  Building2,
  FileText
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          
          {/* Institutional Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Coimbatore Institute of Technology • Academic Assessment Portal
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            The Learning-Centric <br className="hidden sm:inline" />
            <span className="text-blue-600">
              Examination & Evaluation System
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Enterprise assessment governance engineered for accredited universities. Featuring hardware-agnostic proctoring, dynamic question banking, and instantaneous pedagogical feedback.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                href={
                  user.role === 'admin'
                    ? '/admin/dashboard'
                    : user.role === 'teacher'
                    ? '/teacher/dashboard'
                    : '/student/dashboard'
                }
                className="px-6 py-3 rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-2 text-sm transition-all"
              >
                Go to {user.role === 'admin' ? 'Command Center' : user.role === 'teacher' ? 'Faculty Workspace' : 'Student Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-2 text-sm transition-all"
              >
                Sign In with Institutional ID
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Metrics Ticker */}
          <div className="mt-14 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">12</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Academic Cohorts</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">13</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Evaluated Exams</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">35</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Certified Attempts</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600">100%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Tenant Isolated</p>
            </div>
          </div>

        </div>
      </section>

      {/* Role Demonstration Portals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Role-Based Institutional Portals
          </h2>
          <p className="text-slate-600 mt-2 text-sm max-w-xl mx-auto">
            Experience the system from the perspective of each stakeholder with pre-configured institutional credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Admin Role Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4 border border-purple-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Institutional Admin
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">
                Executive Command Center
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Oversee university-wide examination governance, manage faculty credentials, review cohort performance analytics, and enforce integrity protocols.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-700 space-y-1">
                <div><span className="text-slate-400">User:</span> admin_cit_01</div>
                <div><span className="text-slate-400">Pass:</span> adminpassword123</div>
              </div>
            </div>
            <Link
              href="/login?role=admin"
              className="mt-6 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Sign In as Admin <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Teacher Role Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Faculty Evaluator
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">
                Teacher Workspace
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Author multi-format MCQ exams, curate reusable institutional question banks with detailed explanations, and review student question-by-question response metrics.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-700 space-y-1">
                <div><span className="text-slate-400">User:</span> tch_003</div>
                <div><span className="text-slate-400">Pass:</span> teachpass123</div>
              </div>
            </div>
            <Link
              href="/login?role=teacher"
              className="mt-6 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Sign In as Faculty <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Student Role Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Undergraduate Learner
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">
                Student Learning Portal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Participate in timed assessment sessions with tab-blur proctoring guards, inspect question-level scorecards with explanations, and view real-time class leaderboards.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-700 space-y-1">
                <div><span className="text-slate-400">User:</span> stu_001</div>
                <div><span className="text-slate-400">Pass:</span> studentpass123</div>
              </div>
            </div>
            <Link
              href="/login?role=student"
              className="mt-6 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Sign In as Student <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Enterprise Capabilities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Key Architectural Pillars
          </h2>
          <p className="text-slate-600 mt-2 text-sm max-w-xl mx-auto">
            Built from first principles for performance, data sovereignty, and educational integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Smart Proctoring</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time window blur and tab-switching surveillance with warning thresholds and audit logs.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Strict Multi-Tenancy</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Foreign key data isolation ensures institutions maintain sovereign ownership of questions and student records.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Pedagogical Explanations</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transform assessments into learning experiences with immediate correct answer rationale and references.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Live Cohort Leaderboards</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Competitive ranking calculated in real-time, motivating learners while offering deep analytics to faculty.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
