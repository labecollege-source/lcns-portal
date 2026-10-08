import React, { useState, useEffect, useRef } from 'react';
import { CBTExam, CBTAttempt, Student } from '../../types/college';
import { OfficialCrest } from '../common/OfficialCrest';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Flag,
  Maximize2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CBTExamInterfaceProps {
  exam: CBTExam;
  student: Student;
  onFinish: (attempt: CBTAttempt) => void;
  onExit: () => void;
}

export const CBTExamInterface: React.FC<CBTExamInterfaceProps> = ({
  exam,
  student,
  onFinish,
  onExit,
}) => {
  // Timer: Duration in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(exam.durationMinutes * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Security violations monitoring
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [violationLogs, setViolationLogs] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam('auto_submitted', 'Time expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Tab switching and visibility monitoring
  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Tab switched or browser minimized');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('Focus lost from examination window');
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        recordViolation('Exited fullscreen examination mode');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isSubmitted, violationsCount]);

  const recordViolation = (reason: string) => {
    if (isSubmitted) return;
    const newCount = violationsCount + 1;
    const log = `[${new Date().toLocaleTimeString()}] ${reason} (Violation #${newCount})`;
    setViolationsCount(newCount);
    setViolationLogs((prev) => [...prev, log]);
    setWarningMessage(reason);
    setShowWarningModal(true);

    if (newCount >= exam.maxViolationsAllowed) {
      setTimeout(() => {
        handleSubmitExam('auto_submitted', 'Exceeded maximum permitted academic violations');
      }, 1500);
    }
  };

  const requestFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitExam = (
    status: 'submitted' | 'auto_submitted' = 'submitted',
    reason?: string
  ) => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    // Compute actual score based on questions
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionIndex) {
        score += q.marks;
      }
    });

    setFinalScore(score);

    const attempt: CBTAttempt = {
      id: `att-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      courseCode: exam.courseCode,
      studentId: student.id,
      admissionNumber: student.admissionNumber,
      studentName: student.fullName,
      answers,
      score,
      totalMarks: exam.totalMarks,
      violationsCount,
      violationLogs,
      status,
      startedAt: new Date(Date.now() - (exam.durationMinutes * 60 - secondsRemaining) * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
    };

    if (score >= exam.totalMarks * 0.5) {
      confetti({ particleCount: 70, spread: 60 });
    }

    onFinish(attempt);
  };

  // Format MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgentTime = secondsRemaining <= 180; // 3 mins left

  const currentQ = exam.questions[currentQuestionIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col overflow-hidden font-sans select-none"
    >
      {/* Top Header Bar */}
      <header className="bg-emerald-950 border-b border-emerald-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OfficialCrest size="sm" light={true} />
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {exam.courseCode} — Computer Based Test
            </div>
            <div className="text-sm font-semibold truncate max-w-sm sm:max-w-md text-white">
              {exam.title}
            </div>
          </div>
        </div>

        {/* Timer & Violations Badge */}
        <div className="flex items-center gap-4">
          {/* Violations Count */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
              violationsCount > 0
                ? 'bg-rose-900/80 text-rose-300 border border-rose-700 animate-pulse'
                : 'bg-emerald-900/60 text-emerald-300 border border-emerald-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              Violations: {violationsCount} / {exam.maxViolationsAllowed}
            </span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-base font-bold shadow ${
              isUrgentTime
                ? 'bg-rose-600 text-white animate-bounce'
                : 'bg-emerald-800 text-amber-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeString}</span>
          </div>

          {!isFullscreen && (
            <button
              onClick={requestFullscreen}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg cursor-pointer"
              title="Enter Fullscreen"
            >
              <Maximize2 className="w-4 h-4" /> Fullscreen
            </button>
          )}
        </div>
      </header>

      {/* Main Examination Workspace */}
      {isSubmitted ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-900">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Examination Submitted</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your responses have been recorded and scored in the college examination registry.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Student:</span>
                <span className="font-bold text-white">{student.fullName}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Admission No:</span>
                <span className="font-mono text-emerald-400">{student.admissionNumber}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Security Violations:</span>
                <span className="font-mono text-rose-400">{violationsCount} recorded</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-300">Continuous Assessment Score:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {finalScore} / {exam.totalMarks}
                </span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Return to Student Portal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left / Center: Question Panel */}
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto bg-slate-900">
            <div className="max-w-3xl mx-auto w-full space-y-6">
              {/* Question Index Pill & Flag Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-900 text-amber-300 font-mono font-bold text-xs rounded-lg">
                    Question {currentQuestionIndex + 1} of {exam.questions.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({currentQ.marks} Marks)
                  </span>
                </div>

                <button
                  onClick={() => handleToggleFlag(currentQ.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    flagged[currentQ.id]
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}
                </button>
              </div>

              {/* Question Stem */}
              <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
                {currentQ.questionText}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQ.id] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D', 'E'];
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-start gap-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950 border-emerald-500 text-white font-semibold shadow-lg'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {optionLetters[optIdx] || optIdx + 1}
                      </span>
                      <span className="mt-1 flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Controls */}
            <div className="max-w-3xl mx-auto w-full pt-6 border-t border-slate-800 flex items-center justify-between gap-4 mt-8">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <div className="text-xs text-slate-400 hidden sm:block">
                Answered: <strong className="text-white">{Object.keys(answers).length}</strong> / {exam.questions.length}
              </div>

              {currentQuestionIndex < exam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleSubmitExam('submitted')}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" /> Submit Exam
                </button>
              )}
            </div>
          </div>

          {/* Right: Question Navigation Palette */}
          <div className="w-full lg:w-72 bg-slate-800/90 border-t lg:border-t-0 lg:border-l border-slate-700 p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700 pb-2">
                Question Palette
              </h4>

              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-4 gap-2">
                {exam.questions.map((q, qIndex) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlag = flagged[q.id];
                  const isCurrent = currentQuestionIndex === qIndex;

                  let btnStyle = 'bg-slate-700 text-slate-300';
                  if (isAnswered) btnStyle = 'bg-emerald-600 text-white font-bold';
                  if (isFlag) btnStyle = 'bg-amber-500 text-slate-950 font-black';
                  if (isCurrent) btnStyle += ' ring-2 ring-white';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(qIndex)}
                      className={`h-9 rounded-lg text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${btnStyle}`}
                    >
                      {qIndex + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-1.5 pt-4 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                  <span>Flagged for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-700 inline-block" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to finish and submit your CBT examination now?')) {
                    handleSubmitExam('submitted');
                  }
                }}
                className="w-full py-3 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Finish & Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Violation Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-rose-950 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-shake">
            <div className="w-14 h-14 bg-rose-600/30 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Security Violation Warning</h3>
              <p className="text-xs text-rose-200 mt-1">{warningMessage}</p>
            </div>
            <div className="p-3 bg-rose-900/60 rounded-xl border border-rose-800 text-xs font-mono text-rose-300">
              Violation Count: {violationsCount} of {exam.maxViolationsAllowed} allowed
            </div>
            <p className="text-[11px] text-slate-300">
              Note: Repeated tab switching, minimizing, or exiting full-screen triggers automated exam termination.
            </p>
            <button
              onClick={() => {
                setShowWarningModal(false);
                requestFullscreen();
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              I Understand & Resume Examination
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
