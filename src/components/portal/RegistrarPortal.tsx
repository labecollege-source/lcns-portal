import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { AcademicSession, Student, Applicant } from '../../types/college';
import { CourseRegistrationApprovalQueue } from './CourseRegistrationApprovalQueue';
import { DistributedMasterScoreSheetsSection } from './DistributedMasterScoreSheetsSection';
import { CourseManagement } from './CourseManagement';
import { ApplicantInspectionModal } from './ApplicantInspectionModal';
import { PrintableApplicationFormModal } from '../common/PrintableDocument';
import {
  Calendar,
  GraduationCap,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Award,
  Users,
  Search,
  Eye,
  Printer,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const RegistrarPortal: React.FC = () => {
  const {
    currentSession,
    updateSession,
    students,
    updateStudent,
    results,
    updateResultStage,
    logAction,
    applicants,
    updateApplicantStatus,
  } = useCollege();

  const [sessionName, setSessionName] = useState(currentSession.name);
  const [semester, setSemester] = useState<'First' | 'Second'>(currentSession.currentSemester);
  const [maxCU, setMaxCU] = useState(currentSession.maxCreditUnits);

  // Application registry state
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [quickPrintApplicant, setQuickPrintApplicant] = useState<Applicant | null>(null);

  const filteredApplicants = applicants.filter((a) => {
    const matchesFilter = applicantStatusFilter === 'all' || a.admissionStatus === applicantStatusFilter;
    const matchesSearch =
      a.fullName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      a.jambRegNo.toLowerCase().includes(applicantSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateSession = async () => {
    const updated: AcademicSession = {
      ...currentSession,
      name: sessionName,
      currentSemester: semester,
      maxCreditUnits: Number(maxCU),
    };
    await updateSession(updated);
    alert('Academic session configuration updated!');
  };

  const handlePromoteStudent = async (student: Student) => {
    const nextLevel = student.level === 100 ? 200 : 200;
    if (student.level >= 200) {
      alert('Student is in final ND 2 level and eligible for graduation review.');
      return;
    }
    const updated: Student = {
      ...student,
      level: nextLevel,
    };
    await updateStudent(updated);
    await logAction('Promote Student to Next Academic Level', student.admissionNumber, `${student.level}L`, `${nextLevel}L`);
    alert(`${student.fullName} (${student.admissionNumber}) has been promoted to ND 2!`);
  };

  const handleRegistrarApproveResult = async (resultId: string) => {
    await updateResultStage(resultId, 'registrar_approved');
    alert('Result vetted and recommended for Provost final executive sign-off!');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
            Central College Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Registrar Executive Portal
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Academic Sessions, Candidate Application Registry &amp; Document Verification, Matriculation Rosters, and Broadsheets
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-mono">
          Current Session: <strong className="text-amber-300">{currentSession.name} ({currentSession.currentSemester})</strong>
        </div>
      </div>

      <CourseRegistrationApprovalQueue stage="registrar" title="Registrar" />

      {/* ADMISSION & SUBMITTED APPLICATION REGISTRY */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Registry Records
              </span>
              <h3 className="text-lg font-black text-emerald-950 uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" /> Submitted Applications &amp; Admissions Registry
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review submitted candidate registrations, inspect passport photos and attached credentials, and download/print official application form PDFs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">
              Total Applications: <strong className="text-emerald-900 font-bold">{applicants.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'applied', 'payment_verified', 'under_review', 'eligible', 'admitted', 'recommended_for_admission', 'acceptance_paid'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setApplicantStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    applicantStatusFilter === st
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search candidate, App No, JAMB..."
              value={applicantSearch}
              onChange={(e) => setApplicantSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Applications Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Passport &amp; App No</th>
                <th className="py-2.5 px-3">Candidate Full Name</th>
                <th className="py-2.5 px-3">JAMB Reg</th>
                <th className="py-2.5 px-2 text-center">Score</th>
                <th className="py-2.5 px-3">Programme</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Registry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-10 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                        {app.passportUrl ? (
                          <img
                            src={app.passportUrl}
                            alt={app.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">
                            {app.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-mono font-bold text-emerald-950 block">
                          {app.applicationNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {app.createdAt || '2026/2027'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900 block">{app.fullName}</span>
                    <span className="text-[10px] text-slate-500">{app.gender} • {app.stateOfOrigin} State</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{app.jambRegNo}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-black text-emerald-800">
                    {app.jambScore}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{app.chosenProgrammeName}</td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      {app.admissionStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Full Application, Passport & Documents"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => setQuickPrintApplicant(app)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-lg text-xs border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Download / Print Application PDF"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Print PDF</span>
                      </button>
                      {(app.admissionStatus === 'recommended_for_admission' || app.admissionStatus === 'eligible') && (
                        <button
                          onClick={async () => {
                            await updateApplicantStatus(
                              app.id,
                              'admitted',
                              'Registrar approved admission following Provost recommendation.'
                            );
                            alert(`${app.fullName} has been formally admitted by the Registrar.`);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                          title="Final Registrar admission"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Admit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Academic Session Controls & Student Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Academic Session Manager */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-emerald-950 uppercase flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" /> Academic Session Controls
            </h3>
            <p className="text-xs text-slate-500">
              Configure current calendar session, semester, and credit limits.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Session Name</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as 'First' | 'Second')}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              >
                <option value="First">First Semester</option>
                <option value="Second">Second Semester</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Credit Units Limit</label>
              <input
                type="number"
                value={maxCU}
                onChange={(e) => setMaxCU(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
              />
            </div>

            <button
              onClick={handleUpdateSession}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer mt-2"
            >
              Update Academic Calendar
            </button>
          </div>
        </div>

        {/* Student Promotions Engine */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-emerald-950 uppercase flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" /> Student Academic Promotion Engine
            </h3>
            <p className="text-xs text-slate-500">
              Promote students meeting academic standing (CGPA &gt; 1.50 with zero carryovers).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Matric No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-2 text-center">Level</th>
                  <th className="py-2.5 px-3 text-right">Promotion Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-950">{s.admissionNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{s.fullName}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700">{s.level}L</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handlePromoteStudent(s)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Promote to {s.level + 100}L →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Results Approval Queue */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
        <h3 className="text-base font-black text-emerald-950 uppercase">
          Results Awaiting Registrar Endorsement
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-3">Matric No</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Session</th>
                <th className="py-3 px-2 text-center">GPA</th>
                <th className="py-3 px-3 text-center">Current Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-950">{r.admissionNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-3">{r.session}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-emerald-800">{r.gpa.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      {r.approvalStage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleRegistrarApproveResult(r.id)}
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Endorse &amp; Forward to Provost →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Master Score Sheets Distributed to Registrar */}
      <DistributedMasterScoreSheetsSection
        currentOfficerRole="registrar"
        title="Registry Master Examination Broadsheets"
        subtitle="Review student matriculation records and certify academic progression before transmitting to the Provost."
      />

      {/* Applicant Inspection Modal */}
      {selectedApplicant && (
        <ApplicantInspectionModal
          applicant={selectedApplicant}
          viewerRoleTitle="Registrar Central Registry Review"
          onClose={() => setSelectedApplicant(null)}
        />
      )}

      {/* Quick Print Modal */}
      {quickPrintApplicant && (
        <PrintableApplicationFormModal
          applicant={quickPrintApplicant}
          onClose={() => setQuickPrintApplicant(null)}
        />
      )}
      <CourseManagement officerLabel="Registrar" />
    </div>
  );
};
