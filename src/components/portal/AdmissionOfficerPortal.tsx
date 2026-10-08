import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Applicant } from '../../types/college';
import { ApplicantInspectionModal } from './ApplicantInspectionModal';
import { PrintableApplicationFormModal } from '../common/PrintableDocument';
import {
  Users,
  CheckCircle,
  XCircle,
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Printer,
  Eye,
  Download,
} from 'lucide-react';

export const AdmissionOfficerPortal: React.FC = () => {
  const { applicants, updateApplicantStatus } = useCollege();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [quickPrintApplicant, setQuickPrintApplicant] = useState<Applicant | null>(null);

  const filteredApplicants = applicants.filter((a) => {
    const matchesFilter = filterStatus === 'all' || a.admissionStatus === filterStatus;
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.jambRegNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSetStatus = async (
    applicantId: string,
    status: Applicant['admissionStatus'],
    notes: string
  ) => {
    await updateApplicantStatus(applicantId, status, notes);
    // keep selected applicant in sync if open
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, admissionStatus: status } : null));
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
            Admissions &amp; Screening Directorate
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Admission Officer Portal
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Post-UTME Screening, O-Level Vetting, Passport &amp; Document Review, and Provisional Quota Admissions
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
          Total Candidates: <strong className="text-amber-300 font-bold">{applicants.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'applied', 'payment_verified', 'under_review', 'eligible', 'admitted', 'acceptance_paid'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  filterStatus === st
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
            placeholder="Search name, App No, JAMB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Candidates Roster */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-emerald-950 uppercase">
              Post-UTME Candidate Applications Roster
            </h3>
            <p className="text-xs text-slate-500">
              Inspect candidate profiles, verify passport photos and attached documents, and print or download official application forms.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredApplicants.length} of {applicants.length} candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-3">Passport &amp; App No</th>
                <th className="py-3 px-3">Candidate Full Name</th>
                <th className="py-3 px-3">JAMB Reg</th>
                <th className="py-3 px-2 text-center">UTME Score</th>
                <th className="py-3 px-3">Programme</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-11 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
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
                        <span className="text-[10px] text-slate-400 block">
                          {app.createdAt || '2026/2027'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{app.fullName}</span>
                    <span className="text-[11px] text-slate-500">{app.gender} • {app.stateOfOrigin} State</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{app.jambRegNo}</td>
                  <td className="py-3 px-2 text-center font-mono font-black text-emerald-800">
                    {app.jambScore}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{app.chosenProgrammeName}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      {app.admissionStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
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

                      {app.admissionStatus !== 'admitted' && app.admissionStatus !== 'acceptance_paid' && (
                        <button
                          onClick={() => handleSetStatus(app.id, 'admitted', 'Met UTME cut-off & O-Level requirements')}
                          className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
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

      {/* Comprehensive Application, Passport, and Document Inspection Modal */}
      {selectedApplicant && (
        <ApplicantInspectionModal
          applicant={selectedApplicant}
          viewerRoleTitle="Admission Officer Review"
          onClose={() => setSelectedApplicant(null)}
          onUpdateStatus={handleSetStatus}
        />
      )}

      {/* Direct 1-Click Quick Print Modal */}
      {quickPrintApplicant && (
        <PrintableApplicationFormModal
          applicant={quickPrintApplicant}
          onClose={() => setQuickPrintApplicant(null)}
        />
      )}
    </div>
  );
};
