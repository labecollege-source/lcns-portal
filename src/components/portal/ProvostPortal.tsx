import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { DistributedMasterScoreSheetsSection } from './DistributedMasterScoreSheetsSection';
import { FirestoreMasterDashboard } from './FirestoreMasterDashboard';
import { ApplicantInspectionModal } from './ApplicantInspectionModal';
import { exportStudentsToExcel, exportStudentsToPDF } from '../../utils/excelExport';
import {
  ShieldCheck,
  CheckCircle,
  Eye,
  EyeOff,
  Users,
  Award,
  DollarSign,
  GraduationCap,
  Database,
  FileSpreadsheet,
  FileCheck,
  Download,
  UserCheck,
} from 'lucide-react';

export const ProvostPortal: React.FC = () => {
  const {
    results,
    updateResultStage,
    toggleResultPublish,
    students,
    applicants,
    payments,
    courses,
    logAction,
    updateApplicantStatus,
  } = useCollege();

  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

  const [activeProvostTab, setActiveProvostTab] = useState<
    'overview' | 'firestore_database' | 'master_sheets' | 'admissions'
  >('firestore_database');

  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleFinalPublish = async (resultId: string) => {
    await updateResultStage(resultId, 'provost_published');
    await logAction('Provost Published Semester Results', resultId);
    alert('Examination result officially approved and published! Now accessible to student on their portal.');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <OfficialCrest size="lg" light={true} />
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
              Chief Executive Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Office of the Provost
            </h1>
            <p className="text-xs text-emerald-200 mt-1">
              Mrs Terna Fiase Msc, Bnsc, Dip Nursing Education, RNE,RM,RN • Executive Sign-offs &amp; Result Publication
            </p>
          </div>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-xs text-amber-300 font-bold">
          High-Level Academic Oversight
        </div>
      </div>

      {/* Provost Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveProvostTab('firestore_database')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeProvostTab === 'firestore_database'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Firestore Master Registry (Students &amp; Payments)</span>
        </button>

        <button
          onClick={() => setActiveProvostTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeProvostTab === 'overview'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Result Approvals &amp; Sign-off</span>
        </button>

        <button
          onClick={() => setActiveProvostTab('admissions')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeProvostTab === 'admissions'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Applicant Review &amp; Registrar Requests</span>
        </button>

        <button
          onClick={() => setActiveProvostTab('master_sheets')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeProvostTab === 'master_sheets'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-teal-400" />
          <span>Master Score Broadsheets</span>
        </button>
      </div>

      {/* TAB 1: FIRESTORE MASTER REGISTRY (STUDENTS & PAYMENTS) */}
      {activeProvostTab === 'firestore_database' && (
        <FirestoreMasterDashboard forcedRole="provost" />
      )}

      {/* TAB 2: OVERVIEW & RESULT SIGN-OFF */}
      {activeProvostTab === 'overview' && (
        <div className="space-y-8">
          {/* College Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-bold block">Enrolled Students</span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">{students.length}</span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Full-time Nursing & Midwifery</span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-bold block">New Applicants</span>
              <span className="text-2xl font-black text-amber-700 mt-2 block">{applicants.length}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">2026/2027 Cohort</span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-bold block">College Fee Revenue</span>
              <span className="text-2xl font-black text-emerald-900 mt-2 block font-mono">
                ₦{totalRevenue.toLocaleString('en-NG')}
              </span>
              <span className="text-[11px] text-emerald-700 mt-1 block font-semibold">Paystack Verified</span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-bold block">Accredited Courses</span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">{courses.length}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">NMCN & NBTE Approved</span>
            </div>
          </div>

          {/* Provost Result Approval & Publication Gateway */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-emerald-950 uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" /> Final Result Publication & Executive Sign-off
              </h2>
              <p className="text-xs text-slate-500">
                Per college statutes, semester results remain restricted until signed and published by the Provost.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <th className="py-3 px-3">Matric No</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Session</th>
                    <th className="py-3 px-2 text-center">GPA</th>
                    <th className="py-3 px-3 text-center">Stage</th>
                    <th className="py-3 px-3 text-center">Student Visibility</th>
                    <th className="py-3 px-3 text-right">Provost Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950">{r.admissionNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{r.studentName}</td>
                      <td className="py-3 px-3">{r.session}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-emerald-900 text-sm">
                        {r.gpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                          {r.approvalStage}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {r.published ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Eye className="w-3.5 h-3.5" /> Published (Visible)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <EyeOff className="w-3.5 h-3.5" /> Hidden (Restricted)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleFinalPublish(r.id)}
                            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm"
                          >
                            Approve & Publish
                          </button>
                          <button
                            onClick={() => toggleResultPublish(r.id)}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                            title="Toggle visibility"
                          >
                            {r.published ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROVOST APPLICANT REVIEW & REGISTRAR REQUESTS */}
      {activeProvostTab === 'admissions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-black text-emerald-950 uppercase flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-700" />
                  Provost Applicant Review
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect applicant records and uploaded documents. After review, recommend eligible candidates to the Registrar for final admission processing.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportStudentsToExcel(students)}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Students Excel
                </button>
                <button
                  onClick={() => exportStudentsToPDF(students)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Students PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-5">
              <table className="w-full text-xs text-left">
                <thead><tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                  <th className="p-3">Applicant</th><th className="p-3">JAMB</th><th className="p-3">Programme</th>
                  <th className="p-3">Status</th><th className="p-3 text-right">Provost Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{applicant.fullName}</div>
                        <div className="font-mono text-[10px] text-slate-500">{applicant.applicationNumber}</div>
                      </td>
                      <td className="p-3 font-mono font-bold">{applicant.jambScore}</td>
                      <td className="p-3">{applicant.chosenProgrammeName}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase">
                          {applicant.admissionStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick={() => setSelectedApplicant(applicant)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer">
                            <Eye className="w-3.5 h-3.5 text-emerald-700" /> Review &amp; Documents
                          </button>
                          {['eligible', 'under_review'].includes(applicant.admissionStatus) && (
                            <button
                              onClick={async () => {
                                await updateApplicantStatus(
                                  applicant.id,
                                  'recommended_for_admission',
                                  'Provost has reviewed the application and requests Registrar admission processing.'
                                );
                                alert(`${applicant.fullName} has been recommended to the Registrar for admission.`);
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Ask Registrar to Admit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!applicants.length && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No applicants in the registry.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950">
            <strong>Workflow:</strong> Provost reviews the full application and documents → marks eligible/recommends → Registrar receives the request → Registrar admits the candidate.
            Students should not be marked admitted directly from this Provost workflow.
          </div>
        </div>
      )}

      {/* TAB 3: MASTER SCORE SHEETS */}
      {activeProvostTab === 'master_sheets' && (
        <DistributedMasterScoreSheetsSection
          currentOfficerRole="provost"
          title="Provost Executive Ratification & Master Broadsheets"
          subtitle="Final executive board scrutiny and statutory ratification before publication by the Diocese and Academic Board."
        />
      )}
      {selectedApplicant && (
        <ApplicantInspectionModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onUpdateStatus={async (id, status, notes) => {
            await updateApplicantStatus(id, status, notes);
            setSelectedApplicant((current: any) =>
              current ? { ...current, admissionStatus: status, notes } : current
            );
          }}
          viewerRoleTitle="Provost Executive Review"
        />
      )}
    </div>
  );
};
