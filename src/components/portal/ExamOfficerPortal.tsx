import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Course, Result } from '../../types/college';
import { CourseRegistrationApprovalQueue } from './CourseRegistrationApprovalQueue';
import { DistributedMasterScoreSheetsSection } from './DistributedMasterScoreSheetsSection';
import { CourseManagement } from './CourseManagement';
import {
  FileSpreadsheet,
  CheckCircle,
  Edit3,
  Search,
  Printer,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const ExamOfficerPortal: React.FC = () => {
  const { results, updateResultStage, updateStudentScore, courses, logAction } = useCollege();
  const [selectedResult, setSelectedResult] = useState<Result | null>(results[0] || null);
  const [editingCourseCode, setEditingCourseCode] = useState<string | null>(null);
  const [editCa, setEditCa] = useState<number>(30);
  const [editExam, setEditExam] = useState<number>(50);
  const [correctionReason, setCorrectionReason] = useState<string>('Official marking guide adjustment');

  const handleVerifyResult = async (resultId: string) => {
    await updateResultStage(resultId, 'exam_checked');
    alert('Examination Board verification complete! Forwarded to Registrar.');
  };

  const handleApplyScoreCorrection = async () => {
    if (!selectedResult || !editingCourseCode) return;
    if (!correctionReason.trim()) {
      alert('A valid reason is required for score corrections to maintain the academic audit trail.');
      return;
    }
    await updateStudentScore(
      selectedResult.id,
      editingCourseCode,
      Number(editCa),
      Number(editExam),
      correctionReason
    );
    setEditingCourseCode(null);
    alert('Score corrected and logged in official audit logs.');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
            Academic Board • Examinations Office
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Examination Officer Master Portal
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Master Score Sheets, Grade Computation, Score Auditing, and Verification
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print Master Score Sheet
        </button>
      </div>

      <CourseRegistrationApprovalQueue stage="exam" title="Examination Officer" />

      {/* Master Results Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-emerald-950 uppercase">
              Master Semester Score Sheets
            </h2>
            <p className="text-xs text-slate-500">
              Verify accuracy of CA and Examination marks before forwarding to the Registrar.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-3">Matric No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Session</th>
                <th className="py-3 px-2 text-center">CU</th>
                <th className="py-3 px-2 text-center">QP</th>
                <th className="py-3 px-2 text-center">GPA</th>
                <th className="py-3 px-3 text-center">Approval Stage</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 font-sans">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                    {r.admissionNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-3 text-slate-600">{r.session}</td>
                  <td className="py-3 px-2 text-center font-mono">{r.totalCreditUnits}</td>
                  <td className="py-3 px-2 text-center font-mono">{r.totalQualityPoints}</td>
                  <td className="py-3 px-2 text-center font-mono font-black text-emerald-800">
                    {r.gpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      {r.approvalStage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedResult(r)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs cursor-pointer"
                      >
                        Inspect Sheet
                      </button>
                      <button
                        onClick={() => handleVerifyResult(r.id)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer"
                      >
                        Verify & Forward
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Student Score Inspector & Correction Area */}
      {selectedResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                Detailed Inspection
              </span>
              <h3 className="text-base font-black text-slate-900">
                {selectedResult.studentName} ({selectedResult.admissionNumber})
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full">
                Computed GPA: {selectedResult.gpa.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-2 text-center">CU</th>
                  <th className="py-2.5 px-2 text-center">CA</th>
                  <th className="py-2.5 px-2 text-center">Exam</th>
                  <th className="py-2.5 px-2 text-center">Total</th>
                  <th className="py-2.5 px-2 text-center">Grade</th>
                  <th className="py-2.5 px-2 text-center">GP</th>
                  <th className="py-2.5 px-3 text-right">Correction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {selectedResult.scores.map((sc) => (
                  <tr key={sc.courseCode} className="hover:bg-slate-50 font-sans">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-950">{sc.courseCode}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{sc.courseTitle}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{sc.creditUnits}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{sc.caScore}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{sc.examScore}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900">{sc.totalScore}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-black text-emerald-700">{sc.grade}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{sc.gradePoint}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setEditingCourseCode(sc.courseCode);
                          setEditCa(sc.caScore);
                          setEditExam(sc.examScore);
                        }}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[11px] cursor-pointer"
                      >
                        Adjust Score
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Score Correction Drawer */}
          {editingCourseCode && (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-300 space-y-4">
              <h4 className="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" /> Score Correction & Audit Trail: {editingCourseCode}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    New CA Score (Max 40)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={editCa}
                    onChange={(e) => setEditCa(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    New Exam Score (Max 70)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={70}
                    value={editExam}
                    onChange={(e) => setEditExam(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mandatory Audit Reason *
                  </label>
                  <input
                    type="text"
                    required
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="e.g. Script recount verification"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingCourseCode(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyScoreCorrection}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Apply & Log Correction
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Master Score Sheets Distributed to Examination Officer */}
      <DistributedMasterScoreSheetsSection
        currentOfficerRole="exam_officer"
        title="Examination Board Broadsheets & Audit"
        subtitle="Verify CA & Examination percentage allocations and endorse broadsheets for the Central Registry."
      />
      <CourseManagement officerLabel="Examination Officer" />
    </div>
  );
};
