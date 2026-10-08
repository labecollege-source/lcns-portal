import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { MasterScoreSheet, UserRole } from '../../types/college';
import {
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
  Award,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

interface DistributedMasterScoreSheetsSectionProps {
  currentOfficerRole: UserRole;
  title?: string;
  subtitle?: string;
}

export const DistributedMasterScoreSheetsSection: React.FC<
  DistributedMasterScoreSheetsSectionProps
> = ({
  currentOfficerRole,
  title = 'Distributed Master Score Sheets & Academic Broadsheets',
  subtitle = 'Official departmental grade broadsheets submitted for institutional scrutiny, endorsement, and ratification.',
}) => {
  const {
    masterScoreSheets,
    endorseMasterScoreSheet,
    setSelectedMasterSheetForPrint,
    currentUser,
  } = useCollege();

  const [selectedSheetId, setSelectedSheetId] = useState<string>(
    masterScoreSheets[0]?.id || ''
  );
  const [endorsementRemarks, setEndorsementRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const activeSheet =
    masterScoreSheets.find((m) => m.id === selectedSheetId) || masterScoreSheets[0];

  if (!masterScoreSheets || masterScoreSheets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 text-center py-10">
        <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-bold text-slate-700">No Master Score Sheets Distributed Yet</p>
        <p className="text-[11px] text-slate-500">
          The ICT Administrator or Examination Board generates and distributes broadsheets to your office.
        </p>
      </div>
    );
  }

  const handleEndorse = async (sheetId: string) => {
    if (!endorsementRemarks.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please enter formal endorsement remarks before signing off.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await endorseMasterScoreSheet(sheetId, currentOfficerRole, endorsementRemarks);
      setFeedback({
        type: 'success',
        message: `Master Score Sheet officially endorsed by ${currentUser.displayName} (${currentOfficerRole.replace(/_/g, ' ')})!`,
      });
      setEndorsementRemarks('');
    } catch {
      setFeedback({ type: 'error', message: 'Failed to record endorsement.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine stage label and colors
  const getStatusBadge = (status: MasterScoreSheet['status']) => {
    switch (status) {
      case 'approved_by_provost':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1">
            <Award className="w-3 h-3 text-emerald-700" />
            Provost Ratified & Published
          </span>
        );
      case 'endorsed_by_registrar':
        return (
          <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-700" />
            Registrar Endorsed (Awaiting Provost)
          </span>
        );
      case 'checked_by_exams':
        return (
          <span className="bg-cyan-100 text-cyan-900 border border-cyan-300 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-cyan-700" />
            Exams Officer Verified (Awaiting Registrar)
          </span>
        );
      case 'vetted_by_hod':
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-rose-700" />
            HOD Vetted (Awaiting Exams Board)
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-600" />
            Draft / Pending Initial Vetting
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base sm:text-lg font-black text-emerald-950 uppercase">
              {title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {activeSheet && (
          <button
            onClick={() => setSelectedMasterSheetForPrint(activeSheet)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Official Broadsheet</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Select active Master Sheet if more than 1 */}
      {masterScoreSheets.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {masterScoreSheets.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSheetId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                s.id === activeSheet?.id
                  ? 'bg-emerald-800 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.programmeName} ({s.level}L - {s.session})
            </button>
          ))}
        </div>
      )}

      {/* Active Broadsheet Card */}
      {activeSheet && (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Programme & Cohort
              </span>
              <h3 className="text-base font-black text-emerald-950">
                {activeSheet.programmeName} • {activeSheet.level} Level
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Academic Session: <strong className="text-slate-800">{activeSheet.session}</strong> |
                Semester: <strong className="text-slate-800">{activeSheet.semester}</strong> |
                Enrolled Students: <strong className="text-emerald-900">{activeSheet.rows.length}</strong>
              </p>
            </div>

            <div className="text-right">
              <div className="mb-2">{getStatusBadge(activeSheet.status)}</div>
              <p className="text-[10px] text-slate-600 font-mono">
                Distributed to: {activeSheet.distributedTo.map((d) => d.replace('_', ' ')).join(', ')}
              </p>
            </div>
          </div>

          {/* Four-Tier Endorsement Tracking Pipeline */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-800" />
              Four-Tier Distribution & Institutional Endorsement Chain
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* 1. HOD */}
              <div
                className={`p-3 rounded-xl border ${
                  activeSheet.hodEndorsedAt
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">1. HOD Nursing</span>
                  {activeSheet.hodEndorsedAt ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="font-bold text-slate-900 mt-1">Mrs. Theresa N. Iorwuese</p>
                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  "{activeSheet.hodRemarks || 'Pending departmental vetting'}"
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">
                  {activeSheet.hodEndorsedAt ? `Vetted: ${activeSheet.hodEndorsedAt}` : 'Awaiting sign-off'}
                </p>
              </div>

              {/* 2. Exam Officer */}
              <div
                className={`p-3 rounded-xl border ${
                  activeSheet.examOfficerEndorsedAt
                    ? 'bg-cyan-50/80 border-cyan-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">2. Exam Officer</span>
                  {activeSheet.examOfficerEndorsedAt ? (
                    <CheckCircle className="w-4 h-4 text-cyan-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="font-bold text-slate-900 mt-1">Dr. Celestine K. Aondoaver</p>
                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  "{activeSheet.examRemarks || 'Pending examination verification'}"
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">
                  {activeSheet.examOfficerEndorsedAt
                    ? `Verified: ${activeSheet.examOfficerEndorsedAt}`
                    : 'Awaiting sign-off'}
                </p>
              </div>

              {/* 3. Registrar */}
              <div
                className={`p-3 rounded-xl border ${
                  activeSheet.registrarEndorsedAt
                    ? 'bg-indigo-50/80 border-indigo-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">3. Registrar</span>
                  {activeSheet.registrarEndorsedAt ? (
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="font-bold text-slate-900 mt-1">Ahire Job MBA,MMHN,Bsc,Nsg,RN,RNMH..</p>
                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  "{activeSheet.registrarRemarks || 'Pending registry compliance check'}"
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">
                  {activeSheet.registrarEndorsedAt
                    ? `Endorsed: ${activeSheet.registrarEndorsedAt}`
                    : 'Awaiting sign-off'}
                </p>
              </div>

              {/* 4. Provost */}
              <div
                className={`p-3 rounded-xl border ${
                  activeSheet.provostApprovedAt
                    ? 'bg-amber-50/80 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">4. Provost</span>
                  {activeSheet.provostApprovedAt ? (
                    <Award className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="font-bold text-slate-900 mt-1">Mrs Terna Fiase Msc, Bnsc, Dip Nursing Education, RNE,RM,RN</p>
                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  "{activeSheet.provostRemarks || 'Pending executive approval'}"
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">
                  {activeSheet.provostApprovedAt
                    ? `Ratified: ${activeSheet.provostApprovedAt}`
                    : 'Awaiting sign-off'}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Table Preview */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Matric No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  {activeSheet.coursesInSheet.map((c) => (
                    <th key={c.code} className="py-2.5 px-2 text-center">
                      {c.code}
                    </th>
                  ))}
                  <th className="py-2.5 px-2 text-center">TCU</th>
                  <th className="py-2.5 px-2 text-center">TQP</th>
                  <th className="py-2.5 px-2 text-center">GPA</th>
                  <th className="py-2.5 px-3">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {activeSheet.rows.map((r) => (
                  <tr key={r.studentId} className="hover:bg-slate-50 font-sans">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-950">
                      {r.admissionNumber}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.studentName}</td>
                    {activeSheet.coursesInSheet.map((c) => {
                      const sc = r.courseScores[c.code];
                      return (
                        <td key={c.code} className="py-2.5 px-2 text-center font-mono">
                          {sc ? (
                            <span className="font-semibold text-slate-800">
                              {sc.total} ({sc.grade})
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-2 text-center font-mono">{r.totalCU}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{r.totalQP}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-black text-emerald-900">
                      {r.gpa.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-xs">
                      <span className="font-bold text-emerald-800">{r.standing}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Endorsement Action Box for Current Officer */}
          <div className="bg-emerald-950 text-white p-6 rounded-2xl shadow-lg border border-emerald-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Officer Action Gate
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Endorse & Sign Off as {currentUser.displayName} ({currentOfficerRole.replace(/_/g, ' ').toUpperCase()})
                </h4>
              </div>
              <span className="text-xs text-emerald-200">
                Institutional Digital Authentication Enabled
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Official Endorsement Remarks / Board Minute Reference
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-emerald-400 pointer-events-none">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    value={endorsementRemarks}
                    onChange={(e) => setEndorsementRemarks(e.target.value)}
                    placeholder={`e.g. As ${currentOfficerRole.replace(/_/g, ' ')}, I have thoroughly scrutinized and validated all course scores according to regulatory standards.`}
                    className="w-full pl-9 pr-4 py-2.5 bg-emerald-900/60 border border-emerald-700 rounded-xl text-xs text-white placeholder:text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-emerald-300">
                  Clicking endorse applies your institutional digital stamp and advances the sheet down the statutory pipeline.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMasterSheetForPrint(activeSheet)}
                    className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-850 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Inspect Broadsheet
                  </button>

                  <button
                    onClick={() => handleEndorse(activeSheet.id)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-950" />
                    <span>{isSubmitting ? 'Signing...' : `Endorse Master Score Sheet`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
