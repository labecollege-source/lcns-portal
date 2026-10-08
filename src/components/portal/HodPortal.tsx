import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { CourseRegistrationApprovalQueue } from './CourseRegistrationApprovalQueue';
import { DistributedMasterScoreSheetsSection } from './DistributedMasterScoreSheetsSection';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Users,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const HodPortal: React.FC = () => {
  const { results, updateResultStage, courses, students, logAction } = useCollege();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const handleApproveResult = async (resultId: string) => {
    await updateResultStage(resultId, 'hod_approved');
    alert('Departmental examination result vetted and approved! Forwarded to Examination Office.');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
            Academic Leadership • Department of Nursing Sciences
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Head of Department (HOD) Portal
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Departmental Result Vetting, Course Supervision, and Clinical Compliance
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-xs">
          <Award className="w-5 h-5 text-amber-300" />
          <span>Active Department: <strong>Nursing Sciences</strong></span>
        </div>
      </div>

      <CourseRegistrationApprovalQueue stage="hon" title="HON. / Academic Officer" />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold block">Enrolled Nursing Students</span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{students.length}</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">ND 1 - ND 2 Cohorts</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold block">Accredited Courses</span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{courses.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Active This Semester</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold block">Results Awaiting HOD Vetting</span>
          <span className="text-2xl font-black text-amber-700 mt-2 block">
            {results.filter((r) => r.approvalStage === 'lecturer_submitted').length}
          </span>
          <span className="text-[11px] text-amber-800 mt-1 block">Submitted by Course Lecturers</span>
        </div>
      </div>

      {/* Departmental Results Vetting Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-emerald-950 uppercase">
            Departmental Result Approval Workflow
          </h2>
          <p className="text-xs text-slate-500">
            Review submitted scores before transmitting to the Examination Board.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-3">Matric No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Session</th>
                <th className="py-3 px-2 text-center">GPA</th>
                <th className="py-3 px-3 text-center">Workflow Stage</th>
                <th className="py-3 px-3 text-right">HOD Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                    {r.admissionNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-3">{r.level}L</td>
                  <td className="py-3 px-3">{r.session}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-emerald-800">
                    {r.gpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      {r.approvalStage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {r.approvalStage === 'lecturer_submitted' ? (
                      <button
                        onClick={() => handleApproveResult(r.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Approve & Forward →
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Department Vetted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Master Score Sheets Distributed to HOD */}
      <DistributedMasterScoreSheetsSection
        currentOfficerRole="hod_nursing"
        title="Departmental Master Score Broadsheets"
        subtitle="Scrutinize and verify course score computations before transmitting to the Examination Board."
      />
    </div>
  );
};
