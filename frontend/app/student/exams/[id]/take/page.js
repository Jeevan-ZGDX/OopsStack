'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  ChevronRight, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export default function ExamTakePage({ params }) {
  const unwrappedParams = use(params);
  const examId = unwrappedParams.id;
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'test';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Proctoring Violation Tracking
  const [violations, setViolations] = useState(0);
  const [warningMessage, setWarningMessage] = useState(null);
  const lastViolationTime = useRef(0);
  const isSubmittedRef = useRef(false);

  // Load Exam Session
  useEffect(() => {
    api.studentExamTake(examId, mode)
      .then((res) => {
        setData(res);
        // Pre-fill answers
        const initialAnswers = {};
        res.questions.forEach((q) => {
          if (q.selected_choice_id) {
            initialAnswers[q.id] = q.selected_choice_id;
          }
        });
        setAnswers(initialAnswers);

        // Compute remaining seconds from started_at
        const started = new Date(res.attempt.started_at).getTime();
        const durationMs = res.attempt.duration_minutes * 60 * 1000;
        const elapsedMs = Date.now() - started;
        const rem = Math.max(0, Math.floor((durationMs - elapsedMs) / 1000));
        setSecondsRemaining(rem);
      })
      .catch((err) => setError(err.message || 'Failed to initialize exam session.'))
      .finally(() => setLoading(false));
  }, [examId, mode]);

  // Countdown Timer
  useEffect(() => {
    if (secondsRemaining === null || isSubmittedRef.current) return;

    if (secondsRemaining <= 0) {
      handleAutoSubmit('Time is up! Your exam is being submitted automatically.');
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit('Time has expired! Exam auto-submitted.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  // Anti-Cheating & Proctoring Event Listeners
  useEffect(() => {
    const recordViolation = (reason) => {
      if (isSubmittedRef.current) return;
      
      const now = Date.now();
      // 3 second debounce to avoid dual blur/visibilitychange trigger
      if (now - lastViolationTime.current < 3000) return;
      lastViolationTime.current = now;

      setViolations((prev) => {
        const nextCount = prev + 1;
        if (data?.attempt?.id) {
          api.studentLogViolation(data.attempt.id, `${reason} (Violation #${nextCount})`).catch(console.error);
        }

        if (nextCount > 1) {
          handleAutoSubmit('Multiple proctoring violations detected. Exam terminated.');
        } else {
          setWarningMessage(reason);
          setTimeout(() => setWarningMessage(null), 6000);
        }
        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Browser tab switch or window minimized');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('Exam window lost focus');
    };

    const preventCopy = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('contextmenu', preventCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('contextmenu', preventCopy);
    };
  }, [data]);

  const handleSelectChoice = (questionId, choiceId) => {
    if (isSubmittedRef.current) return;

    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));

    if (data?.attempt?.id) {
      api.studentSaveAnswer(data.attempt.id, questionId, choiceId).catch(console.error);
    }
  };

  const handleAutoSubmit = async (reason) => {
    if (isSubmittedRef.current || submitting) return;
    isSubmittedRef.current = true;
    setSubmitting(true);

    try {
      if (data?.attempt?.id) {
        await api.studentSubmitExam(data.attempt.id);
        router.push(`/student/attempts/${data.attempt.id}/results`);
      }
    } catch (err) {
      console.error(err);
      alert('Error finalizing exam: ' + err.message);
    }
  };

  const handleSubmitConfirm = async () => {
    const total = data?.questions?.length || 0;
    const answered = Object.keys(answers).length;

    let msg = 'Are you sure you want to submit your examination? This action cannot be undone.';
    if (answered < total) {
      msg = `You have ${total - answered} unanswered question(s). Submit exam anyway?`;
    }

    if (!confirm(msg)) return;

    isSubmittedRef.current = true;
    setSubmitting(true);

    try {
      await api.studentSubmitExam(data.attempt.id);
      router.push(`/student/attempts/${data.attempt.id}/results`);
    } catch (err) {
      setSubmitting(false);
      isSubmittedRef.current = false;
      alert('Error submitting exam: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4" />
          <p className="font-semibold text-slate-300">Initializing Secure Examination Environment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-lg">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Unable to Start Exam</h2>
          <p className="text-sm text-slate-600 mt-2">{error}</p>
          <button
            onClick={() => router.push('/student/exams')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
          >
            Return to Available Exams
          </button>
        </div>
      </div>
    );
  }

  const questions = data.questions || [];
  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const minutes = Math.floor((secondsRemaining || 0) / 60);
  const seconds = (secondsRemaining || 0) % 60;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Sticky Proctoring / Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              {data.exam.subject} &bull; {data.attempt.mode === 'test' ? 'Official Test' : 'Practice Attempt'}
            </span>
            <h1 className="text-base sm:text-lg font-black text-white truncate max-w-[280px] sm:max-w-md">
              {data.exam.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Progress */}
            <div className="hidden sm:block text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Progress</span>
              <p className="text-xs font-black text-indigo-300">
                {answeredCount}/{questions.length} Answered
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-base sm:text-lg font-black tracking-mono text-white">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleSubmitConfirm}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-indigo-500 h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Proctoring Warning Banner Modal */}
      {warningMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 max-w-lg w-[calc(100%-2rem)] text-center animate-bounce">
          <div className="flex items-center justify-center gap-2 font-black text-base uppercase tracking-wide mb-1">
            <ShieldAlert className="w-5 h-5" />
            ⚠️ EXAM VIOLATION DETECTED
          </div>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            {warningMessage}
          </p>
          <div className="mt-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-lg inline-block">
            WARNING {violations}/1 &bull; Next violation will terminate your examination immediately!
          </div>
        </div>
      )}

      {/* Main Question Flow */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {questions.map((q, idx) => {
          const selectedChoiceId = answers[q.id];

          return (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Question Header */}
              <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="flex items-center justify-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-200">
                  Question {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {q.marks} mark{q.marks > 1 ? 's' : ''}
                </span>
              </div>

              {/* Question Text */}
              <div className="p-6">
                <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  {q.text}
                </p>

                {/* Choices */}
                <div className="mt-6 space-y-3">
                  {q.choices.map((choice, cIdx) => {
                    const isSelected = selectedChoiceId === choice.id;
                    const letter = ['A', 'B', 'C', 'D'][cIdx] || `${cIdx + 1}`;

                    return (
                      <label
                        key={choice.id}
                        onClick={() => handleSelectChoice(q.id, choice.id)}
                        className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center h-5 mt-0.5">
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectChoice(q.id, choice.id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>

                        <div className="ml-3 flex-1 flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className={`text-sm sm:text-base font-medium ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                            {choice.text}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Submit Action */}
        <div className="pt-6 pb-12 flex justify-between items-center">
          <button
            onClick={() => {
              if (confirm('Cancel this attempt and return to exams?')) {
                router.push('/student/exams');
              }
            }}
            className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-sm transition-colors"
          >
            Cancel Attempt
          </button>

          <button
            onClick={handleSubmitConfirm}
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{submitting ? 'Submitting...' : 'Submit Examination'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </main>

    </div>
  );
}
