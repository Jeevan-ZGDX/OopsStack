import Link from 'next/link';
import { ShieldCheck, GraduationCap, Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80 text-slate-500 py-10 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            <span>C</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-none">
              CognIQ Assessment OS
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Coimbatore Institute of Technology • Multi-Tenant Examination Architecture
            </p>
          </div>
        </div>

        {/* Security & Standards */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Hardware-Agnostic Proctoring Guard
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            Strict Institutional Isolation
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>
            &copy; {new Date().getFullYear()} CognIQ. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
