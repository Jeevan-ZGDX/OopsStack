'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Layers, 
  Award, 
  BarChart3, 
  FileText,
  Users,
  BookOpen,
  CheckCircle2,
  Building2,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const navLinkClass = (path) => `
    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
    ${isActive(path) 
      ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & School Branding */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-blue-600 transition-colors">
                <span>C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  Cogn<span className="text-blue-600">IQ</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
                  Assessment OS
                </span>
              </div>
            </Link>

            {/* Institutional Tag */}
            {user?.school && (
              <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-slate-200 text-xs font-medium text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[240px]" title={user.school.name}>
                  {user.school.name}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {/* Admin Links */}
                {(user.is_superuser || user.role === 'admin') && (
                  <>
                    <Link href="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                      <BarChart3 className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </Link>
                    <Link href="/admin/teachers" className={navLinkClass('/admin/teachers')}>
                      <Users className="w-4 h-4 text-slate-500" />
                      Faculty
                    </Link>
                    <Link href="/admin/students" className={navLinkClass('/admin/students')}>
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                      Students
                    </Link>
                    <Link href="/admin/classes" className={navLinkClass('/admin/classes')}>
                      <Layers className="w-4 h-4 text-slate-500" />
                      Cohorts
                    </Link>
                  </>
                )}

                {/* Teacher Links */}
                {user.role === 'teacher' && (
                  <>
                    <Link href="/teacher/dashboard" className={navLinkClass('/teacher/dashboard')}>
                      <BarChart3 className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </Link>
                    <Link href="/teacher/classes" className={navLinkClass('/teacher/classes')}>
                      <Users className="w-4 h-4 text-slate-500" />
                      Cohorts
                    </Link>
                    <Link href="/teacher/exams" className={navLinkClass('/teacher/exams')}>
                      <FileText className="w-4 h-4 text-slate-500" />
                      Exams
                    </Link>
                    <Link href="/teacher/exam-bank" className={navLinkClass('/teacher/exam-bank')}>
                      <Layers className="w-4 h-4 text-slate-500" />
                      Question Bank
                    </Link>
                    <Link href="/teacher/responses" className={navLinkClass('/teacher/responses')}>
                      <CheckCircle2 className="w-4 h-4 text-slate-500" />
                      Submissions
                    </Link>
                  </>
                )}

                {/* Student Links */}
                {user.role === 'student' && (
                  <>
                    <Link href="/student/dashboard" className={navLinkClass('/student/dashboard')}>
                      <BarChart3 className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </Link>
                    <Link href="/student/exams" className={navLinkClass('/student/exams')}>
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      Exams
                    </Link>
                    <Link href="/student/history" className={navLinkClass('/student/history')}>
                      <FileText className="w-4 h-4 text-slate-500" />
                      History
                    </Link>
                    <Link href="/student/enroll" className={navLinkClass('/student/enroll')}>
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Enroll
                    </Link>
                  </>
                )}

                {/* User Dropdown */}
                <div className="relative ml-4 pl-4 border-l border-slate-200" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                      {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 leading-tight">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider
                            ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                              user.role === 'teacher' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                            {user.role}
                          </span>
                          {user.batch && (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Batch {user.batch}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs hover:shadow-sm transition-all"
                >
                  Portal Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {user ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-lg mb-2">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900">{user.username} ({user.role})</p>
                </div>

                {(user.is_superuser || user.role === 'admin') && (
                  <>
                    <Link href="/admin/dashboard" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Admin Dashboard</Link>
                    <Link href="/admin/teachers" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Teachers</Link>
                    <Link href="/admin/students" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Students</Link>
                    <Link href="/admin/classes" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Classes</Link>
                  </>
                )}

                {user.role === 'teacher' && (
                  <>
                    <Link href="/teacher/dashboard" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Dashboard</Link>
                    <Link href="/teacher/classes" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Classes</Link>
                    <Link href="/teacher/exams" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Exams</Link>
                    <Link href="/teacher/exam-bank" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Question Bank</Link>
                    <Link href="/teacher/responses" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Responses</Link>
                  </>
                )}

                {user.role === 'student' && (
                  <>
                    <Link href="/student/dashboard" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Dashboard</Link>
                    <Link href="/student/exams" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Exams</Link>
                    <Link href="/student/history" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">History</Link>
                    <Link href="/student/enroll" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">Enroll</Link>
                  </>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-md mt-2 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
