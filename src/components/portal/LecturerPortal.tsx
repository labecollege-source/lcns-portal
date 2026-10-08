import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Course, CBTExam, CBTQuestion } from '../../types/college';
import {
  BookOpen,
  Users,
  CheckCircle,
  Plus,
  Send,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export const LecturerPortal: React.FC = () => {
  const {
    courses,
    students,
    results,
    updateStudentScore,
    cbtExams,
    saveCBTExam,
    currentUser,
    logAction,
    courseRegistrations,
  } = useCollege();

  const [activeTab, setActiveTab] = useState<'grading' | 'cbt'>('grading');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('NUR 101');

  // CBT Exam Builder Form State
  const [showCbtBuilder, setShowCbtBuilder] = useState<boolean>(false);
  const [cbtTitle, setCbtTitle] = useState('');
  const [cbtDuration, setCbtDuration] = useState<number>(20);
  const [cbtInstructions, setCbtInstructions] = useState(
    'Answer all questions. Fullscreen mode is enforced. Tab switching is logged as a violation.'
  );
  const [questions, setQuestions] = useState<CBTQuestion[]>([
    {
      id: 'q-new-1',
      questionText: 'What is the primary indicator of adequate renal perfusion in an adult patient?',
      type: 'mcq',
      options: ['Urine output > 30mL/hr', 'Heart rate 60-100 bpm', 'Serum potassium 4.0 mEq/L', 'Respiratory rate 16/min'],
      correctOptionIndex: 0,
      marks: 5,
    },
  ]);

  // Score editing for a student
  const [editScoreStudentId, setEditScoreStudentId] = useState<string | null>(null);
  const [tempCa, setTempCa] = useState<number>(30);
  const [tempExam, setTempExam] = useState<number>(50);
  const [scoreCorrectionReason, setScoreCorrectionReason] = useState<string>('Continuous assessment score entry');

  const lecturerCourses = courses.filter((c) => !c.assignedLecturerId || c.assignedLecturerId === currentUser.uid || c.assignedLecturerName === currentUser.displayName);
  const selectedCourse = lecturerCourses.find((c) => c.code === selectedCourseCode) || lecturerCourses[0] || courses[0];
  const registeredStudentIds = new Set(courseRegistrations.filter((r) => r.status === 'registrar_approved' && r.courses.some((c) => c.courseId === selectedCourse?.id)).map((r) => r.studentId));

  const handleSaveScore = async (resultId: string) => {
    if (tempCa < 0 || tempCa > 40) {
      alert('CA score must be between 0 and 40');
      return;
    }
    if (tempExam < 0 || tempExam > 70) {
      alert('Exam score must be between 0 and 70');
      return;
    }
    await updateStudentScore(
      resultId,
      selectedCourse.code,
      Number(tempCa),
      Number(tempExam),
      scoreCorrectionReason
    );
    setEditScoreStudentId(null);
    alert('Student scores saved and grade point recomputed!');
  };

  const printScoreSheet = () => {
    if (!selectedCourse) return;
    const rows = results.filter((r) => registeredStudentIds.has(r.studentId)).map((r, i) => {
      const sc = r.scores.find((x) => x.courseCode === selectedCourse.code);
      return `<tr><td>${i+1}</td><td>${r.admissionNumber}</td><td>${r.studentName}</td><td>${sc?.caScore ?? 0}</td><td>${sc?.examScore ?? 0}</td><td>${sc?.totalScore ?? 0}</td><td>${sc?.grade ?? 'F'}</td><td>${sc?.gradePoint ?? 0}</td></tr>`;
    }).join('');
    const w = window.open('', '_blank', 'width=1000,height=700');
    if (!w) return;
    w.document.write(`<html><head><title>${selectedCourse.code} Score Sheet</title><style>body{font-family:Arial;padding:30px}h1,h2{text-align:center;color:#064e3b}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #94a3b8;padding:7px;font-size:12px}th{background:#ecfdf5}</style></head><body><h1>LABE COLLEGE OF NURSING SCIENCES, GBOKO</h1><h2>LECTURER COURSE SCORE SHEET</h2><p><b>Course:</b> ${selectedCourse.code} - ${selectedCourse.title}<br><b>Lecturer:</b> ${currentUser.displayName}<br><b>Session:</b> 2026/2027 &nbsp; <b>Semester:</b> ${selectedCourse.semester}<br><b>Level:</b> ${selectedCourse.level === 100 ? 'ND 1' : 'ND 2'}</p><table><thead><tr><th>S/N</th><th>Admission No</th><th>Student</th><th>CA</th><th>Exam</th><th>Total</th><th>Grade</th><th>GP</th></tr></thead><tbody>${rows}</tbody></table><script>window.print()</script></body></html>`); w.document.close();
  };

  const handleAddQuestion = () => {
    const newQ: CBTQuestion = {
      id: `q-new-${Date.now()}`,
      questionText: 'Enter question text here...',
      type: 'mcq',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 0,
      marks: 5,
    };
    setQuestions([...questions, newQ]);
  };

  const handleSaveExam = async () => {
    if (!cbtTitle.trim()) {
      alert('Please enter a CBT examination title');
      return;
    }
    if (questions.some((q) => q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length)) {
      alert('Every CBT question must have a valid correct answer selected.');
      return;
    }
    const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);
    const newExam: CBTExam = {
      id: `cbt-${Date.now()}`,
      title: cbtTitle,
      courseId: selectedCourse.id,
      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
      lecturerId: currentUser.uid,
      lecturerName: currentUser.displayName,
      durationMinutes: Number(cbtDuration),
      totalMarks,
      instructions: cbtInstructions,
      scheduledDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      status: 'published',
      allowCalculator: false,
      maxViolationsAllowed: 3,
      questions,
    };

    await saveCBTExam(newExam);
    setShowCbtBuilder(false);
    alert(`CBT Examination "${newExam.title}" has been published for students!`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
            Academic Faculty Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Lecturer Grade & CBT Center
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Instructor: <strong>{currentUser.displayName}</strong> • Dept of Nursing Sciences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('grading')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grading'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Course Score Sheets
          </button>
          <button
            onClick={() => setActiveTab('cbt')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cbt'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            CBT Exam Creator
          </button>
        </div>
      </div>

      {/* TAB 1: GRADING & SCORE SHEETS */}
      {activeTab === 'grading' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-emerald-950 uppercase">
                Score Sheet Entry (CA: max 40 | Exam: max 70)
              </h2>
              <p className="text-xs text-slate-500">
                Grades and Grade Points (GP) automatically recompute and log audit trails on edit.
              </p>
            </div>

            {/* Course Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Course:</span>
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:border-emerald-600"
              >
                {lecturerCourses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Matric No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-2 text-center">CA (Max 40)</th>
                  <th className="py-3 px-2 text-center">Exam (Max 70)</th>
                  <th className="py-3 px-2 text-center">Total (100)</th>
                  <th className="py-3 px-2 text-center">Grade</th>
                  <th className="py-3 px-2 text-center">GP</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.filter((r) => registeredStudentIds.has(r.studentId)).map((r) => {
                  const scoreRecord = r.scores.find((s) => s.courseCode === selectedCourseCode);
                  const isEditing = editScoreStudentId === r.id;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                        {r.admissionNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {r.studentName}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={40}
                            value={tempCa}
                            onChange={(e) => setTempCa(Number(e.target.value))}
                            className="w-16 p-1 border rounded text-center text-xs font-bold"
                          />
                        ) : (
                          scoreRecord?.caScore ?? 0
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={tempExam}
                            onChange={(e) => setTempExam(Number(e.target.value))}
                            className="w-16 p-1 border rounded text-center text-xs font-bold"
                          />
                        ) : (
                          scoreRecord?.examScore ?? 0
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-black text-slate-900 font-mono">
                        {isEditing ? tempCa + tempExam : scoreRecord?.totalScore ?? 0}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-emerald-700 font-mono">
                        {scoreRecord?.grade ?? 'F'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {scoreRecord?.gradePoint ?? 0}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveScore(r.id)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-[11px] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditScoreStudentId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditScoreStudentId(r.id);
                              setTempCa(scoreRecord?.caScore ?? 30);
                              setTempExam(scoreRecord?.examScore ?? 50);
                            }}
                            className="px-3 py-1 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold rounded-lg border border-emerald-200 text-[11px] cursor-pointer"
                          >
                            Enter / Edit Scores
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Department of Nursing Sciences • Continuous Assessment Roster
            </span>
            <button
              onClick={() => {
                logAction('Submit Score Sheet to HOD', selectedCourseCode, undefined, 'Awaiting HOD Review');
                alert(`Course score sheet for ${selectedCourseCode} has been officially forwarded to HOD Nursing for approval!`);
              }}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-300" />
              Submit Sheet to HOD Nursing
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CBT EXAM CREATOR */}
      {activeTab === 'cbt' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-emerald-950 uppercase">
                Continuous Assessment CBT Management
              </h2>
              <p className="text-xs text-slate-500">
                Design timed online tests with randomized multiple choice and True/False options.
              </p>
            </div>
            <button
              onClick={() => {
                setCbtTitle(`${selectedCourse.code} CA Test`);
                setShowCbtBuilder(!showCbtBuilder);
              }}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showCbtBuilder ? 'Close Builder' : 'Create New CBT Exam'}
            </button>
          </div>

          {/* Builder Form */}
          {showCbtBuilder && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <h3 className="font-black text-sm text-emerald-950 uppercase">
                CBT Exam Settings & Question Authoring
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    value={cbtTitle}
                    onChange={(e) => setCbtTitle(e.target.value)}
                    placeholder="e.g. NUR 101 Mid-Semester CBT"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={cbtDuration}
                    onChange={(e) => setCbtDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Course
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedCourse.code}: ${selectedCourse.title}`}
                    className="w-full px-3 py-2 bg-slate-200 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Questions Authoring */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-800">
                    Questions ({questions.length})
                  </h4>
                  <button
                    onClick={handleAddQuestion}
                    className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Question
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-800">
                        Question #{idx + 1}
                      </span>
                      <span className="text-xs text-slate-500">Marks: {q.marks}</span>
                    </div>

                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].questionText = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />

                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                      Select the radio button beside the correct answer. Students will never see the correct-answer marking during the test.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optI) => (
                        <div key={optI} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctOptionIndex === optI}
                            onChange={() => {
                              const updated = [...questions];
                              updated[idx].correctOptionIndex = optI;
                              setQuestions(updated);
                            }}
                            className="cursor-pointer"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].options[optI] = e.target.value;
                              setQuestions(updated);
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveExam}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer"
                >
                  Publish CBT Examination
                </button>
              </div>
            </div>
          )}

          {/* Published Exams Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-800">Published CBT Tests</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cbtExams.map((ex) => (
                <div key={ex.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-900">{ex.courseCode}</span>
                    <span className="font-semibold text-slate-600">{ex.durationMinutes} mins</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{ex.title}</h4>
                  <p className="text-xs text-slate-500">Total Questions: {ex.questions.length} • Max Marks: {ex.totalMarks}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
