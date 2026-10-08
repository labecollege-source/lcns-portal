import React, { useState } from 'react';
import { Applicant } from '../../types/college';
import { OfficialCrest } from '../common/OfficialCrest';
import { PrintableApplicationFormModal } from '../common/PrintableDocument';
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  FileCheck,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Download,
} from 'lucide-react';

interface ApplicantInspectionModalProps {
  applicant: Applicant;
  onClose: () => void;
  onUpdateStatus?: (
    applicantId: string,
    status: Applicant['admissionStatus'],
    notes: string
  ) => Promise<void>;
  viewerRoleTitle?: string; // e.g. "Admission Officer", "Registrar", "System Administrator"
}

export const ApplicantInspectionModal: React.FC<ApplicantInspectionModalProps> = ({
  applicant,
  onClose,
  onUpdateStatus,
  viewerRoleTitle = 'Official Review',
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState<string>('');

  const handleStatusChange = async (newStatus: Applicant['admissionStatus'], notes: string) => {
    if (onUpdateStatus) {
      await onUpdateStatus(applicant.id, newStatus, notes);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
          {/* Header */}
          <div className="bg-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <OfficialCrest size="md" light={true} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">
                    {viewerRoleTitle}
                  </span>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {applicant.applicationNumber}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Candidate Application &amp; Document Verification Dossier
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Download / Print Application PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm text-slate-800">
            {/* Top Identity Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50 border border-slate-200">
              {/* Passport Photo */}
              <div className="w-28 h-36 rounded-2xl border-2 border-emerald-600 bg-white overflow-hidden shadow-md shrink-0 flex items-center justify-center relative">
                {applicant.passportUrl ? (
                  <img
                    src={applicant.passportUrl}
                    alt={applicant.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <User className="w-10 h-10 mx-auto text-slate-300 mb-1" />
                    <span className="text-[10px] font-bold uppercase block">Official Passport</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-[9px] text-center text-white py-0.5 font-bold uppercase">
                  Verified Photo
                </div>
              </div>

              {/* Identity & Status */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-black text-slate-900">{applicant.fullName}</h3>
                  <span className="px-3 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    {applicant.admissionStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-mono">
                  Application No: <strong className="text-emerald-900">{applicant.applicationNumber}</strong> • JAMB Reg:{' '}
                  <strong className="text-slate-900">{applicant.jambRegNo}</strong>
                </p>

                <p className="text-xs text-slate-700">
                  Applied Programme:{' '}
                  <strong className="text-emerald-800 font-bold">{applicant.chosenProgrammeName}</strong>{' '}
                  (2026/2027 Academic Session)
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {applicant.address || `${applicant.lga}, ${applicant.stateOfOrigin} State`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {applicant.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    {applicant.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid: Biodata & Academic Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Biodata */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" /> Candidate Personal Biodata
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Gender</span>
                    <span className="font-semibold text-slate-800">{applicant.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{applicant.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">State of Origin</span>
                    <span className="font-semibold text-slate-800">{applicant.stateOfOrigin} State</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">LGA of Origin</span>
                    <span className="font-semibold text-slate-800">{applicant.lga}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px] uppercase">Residential Address</span>
                    <span className="font-semibold text-slate-800">
                      {applicant.address || `${applicant.lga}, ${applicant.stateOfOrigin} State, Nigeria`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Next of Kin Name</span>
                    <span className="font-semibold text-slate-800">{applicant.nextOfKinName || 'Emmanuel Tyokyaa'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Next of Kin Phone</span>
                    <span className="font-mono text-slate-800">{applicant.nextOfKinPhone || applicant.phone}</span>
                  </div>
                </div>
              </div>

              {/* JAMB & UTME Scores */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" /> JAMB UTME &amp; Screening Status
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">JAMB Reg Number:</span>
                    <span className="font-mono font-bold text-slate-950">{applicant.jambRegNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Aggregate UTME Score:</span>
                    <span className="font-mono font-black text-sm text-emerald-800">
                      {applicant.jambScore}{' '}
                      <span className="text-[11px] font-normal text-slate-500">(Cut-off: 180)</span>
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Screening Fee (₦10,000):</span>
                    <span className="font-semibold text-emerald-700">
                      {applicant.applicationFeePaid ? 'Paid & Verified' : 'Pending Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Acceptance Fee (₦30,000):</span>
                    <span className="font-semibold text-emerald-700">
                      {applicant.acceptanceFeePaid ? 'Paid & Verified' : 'Pending Admission'}
                    </span>
                  </div>
                  {applicant.admissionPin && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600">Issued Admission PIN:</span>
                      <span className="font-mono font-bold text-emerald-950">{applicant.admissionPin}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Senior Secondary O'Level Science Results */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  Verified O'Level Science Results ({applicant.oLevelExamType || 'WAEC May/June 2024'})
                </h4>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Compulsory 5 Science Credits Met
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3 text-left">Subject</th>
                      <th className="py-2 px-3">Grade</th>
                      <th className="py-2 px-3">Credit Qualification</th>
                      <th className="py-2 px-3 text-right">NMCN Statutory Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {applicant.oLevelResults && applicant.oLevelResults.length > 0 ? (
                      applicant.oLevelResults.map((r) => (
                        <tr key={r.subject} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-left font-sans font-semibold text-slate-900">
                            {r.subject}
                          </td>
                          <td className="py-2 px-3 font-black text-emerald-900 text-sm">{r.grade}</td>
                          <td className="py-2 px-3 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-2 px-3 text-right font-sans text-slate-500 text-[11px]">
                            Compulsory Requirement
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td className="py-2 px-3 text-left font-sans font-semibold text-slate-900">English Language</td>
                          <td className="py-2 px-3 font-black text-emerald-900 text-sm">B3</td>
                          <td className="py-2 px-3 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-2 px-3 text-right font-sans text-slate-500 text-[11px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-left font-sans font-semibold text-slate-900">Mathematics</td>
                          <td className="py-2 px-3 font-black text-emerald-900 text-sm">A1</td>
                          <td className="py-2 px-3 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-2 px-3 text-right font-sans text-slate-500 text-[11px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-left font-sans font-semibold text-slate-900">Biology</td>
                          <td className="py-2 px-3 font-black text-emerald-900 text-sm">A1</td>
                          <td className="py-2 px-3 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-2 px-3 text-right font-sans text-slate-500 text-[11px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-left font-sans font-semibold text-slate-900">Chemistry</td>
                          <td className="py-2 px-3 font-black text-emerald-900 text-sm">B2</td>
                          <td className="py-2 px-3 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-2 px-3 text-right font-sans text-slate-500 text-[11px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-left font-sans font-semibold text-slate-900">Physics</td>
                          <td className="py-2 px-3 font-black text-emerald-900 text-sm">B3</td>
                          <td className="py-2 px-3 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-2 px-3 text-right font-sans text-slate-500 text-[11px]">Compulsory</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attached Verification Documents & Slips */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-700" /> Attached Application Documents &amp; Slips
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  Registered Documents ({applicant.applicationNumber})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* O-Level Slip Card */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          O'Level Result Certificate / Slip
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {applicant.oLevelSlipName || 'WAEC_Science_Result_2024.pdf'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Attached
                    </span>
                  </div>

                  {applicant.oLevelSlipUrl ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPreviewDocUrl(applicant.oLevelSlipUrl || '');
                          setPreviewDocTitle("Candidate O'Level Result Slip");
                        }}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <a
                        href={applicant.oLevelSlipUrl}
                        download={applicant.oLevelSlipName || 'OLevel_Result.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Physical slip verified for verification board.</span>
                    </div>
                  )}
                </div>

                {/* JAMB Slip Card */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          JAMB UTME Result Slip
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {applicant.jambSlipName || 'JAMB_Official_UTME_Slip.pdf'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Attached
                    </span>
                  </div>

                  {applicant.jambSlipUrl ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPreviewDocUrl(applicant.jambSlipUrl || '');
                          setPreviewDocTitle('Candidate JAMB Result Slip');
                        }}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <a
                        href={applicant.jambSlipUrl}
                        download={applicant.jambSlipName || 'JAMB_UTME_Slip.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>JAMB Portal Central Registration indexed.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Officer Action Bar & Controls */}
            {onUpdateStatus && (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                    Admissions Decision &amp; Quota Assignment
                  </span>
                  <p className="text-[11px] text-emerald-800">
                    Update candidate screening outcome or grant provisional admission.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleStatusChange('under_review', 'Credentials in vetting')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('eligible', 'Screening cut-off passed')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Mark Eligible
                  </button>
                  <button
                    onClick={() => handleStatusChange('recommended_for_admission', 'Provost review completed. Registrar requested to process admission.')}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                  >
                    Recommend to Registrar
                  </button>
                  {viewerRoleTitle !== 'Provost Executive Review' && (
                    <button
                      onClick={() => handleStatusChange('admitted', 'Granted provisional admission offer')}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                    >
                      Grant Admission Offer
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="bg-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 shrink-0">
            <span className="text-[11px] text-slate-500 font-mono">
              Labe College of Nursing Sciences • Registry Archives
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Download / Print Application PDF</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Application Form Modal */}
      {printModalOpen && (
        <PrintableApplicationFormModal
          applicant={applicant}
          onClose={() => setPrintModalOpen(false)}
        />
      )}

      {/* Generic Document Slip Preview Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">{previewDocTitle}</h3>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-2">
              <img
                src={previewDocUrl}
                alt="Document Preview"
                className="max-w-full max-h-[65vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
