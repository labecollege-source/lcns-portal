import React from 'react';
import { OfficialCrest } from './OfficialCrest';
import { Applicant, Result, Student, PaymentRecord, MasterScoreSheet } from '../../types/college';
import { Printer, X, CheckCircle, ShieldCheck, Award } from 'lucide-react';

interface AdmissionLetterModalProps {
  applicant: Applicant;
  onClose: () => void;
}

export const AdmissionLetterModal: React.FC<AdmissionLetterModalProps> = ({
  applicant,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-300">
        {/* Actions bar (hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-mono font-bold">
              OFFICIAL DOCUMENT
            </span>
            <span className="text-sm font-semibold">Provisional Admission Letter</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-area" className="p-8 sm:p-12 text-slate-800 bg-white relative">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <OfficialCrest size="xl" />
          </div>

          {/* College Header */}
          <div className="border-b-2 border-emerald-900 pb-4 text-center relative">
            <div className="flex justify-between items-center mb-2">
              <OfficialCrest size="lg" />
              <div className="text-center flex-1 px-4">
                <h1 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight">
                  LABE COLLEGE OF NURSING SCIENCES
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-wider">
                  Catholic Diocese of Gboko
                </p>
                <p className="text-[11px] text-slate-600 font-medium">
                  Off Gboko Hill Road, Gboko, PMB 1955, Gboko,
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold tracking-wider mt-0.5">
                  Motto: LEARN, SERVE AND SAVE
                </p>
              </div>
              {/* Applicant Photo */}
              <div className="w-20 h-24 border-2 border-slate-300 rounded p-1 bg-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {applicant.passportUrl ? (
                  <img
                    src={applicant.passportUrl}
                    alt={applicant.fullName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 text-center uppercase">
                    Passport Photo
                  </span>
                )}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200 pt-1 font-mono">
              <span>Ref: LCNS/ADM/2026/PROV-{applicant.applicationNumber.slice(-4)}</span>
              <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="py-6 space-y-4 text-sm leading-relaxed text-justify">
            <div>
              <p className="font-bold text-slate-900">{applicant.fullName.toUpperCase()}</p>
              <p className="text-xs text-slate-600">Application No: <span className="font-mono font-semibold">{applicant.applicationNumber}</span></p>
              <p className="text-xs text-slate-600">JAMB Reg No: <span className="font-mono">{applicant.jambRegNo}</span> (Score: {applicant.jambScore})</p>
              <p className="text-xs text-slate-600">State of Origin: {applicant.stateOfOrigin} State</p>
            </div>

            <div className="text-center py-2">
              <h2 className="text-base font-black text-emerald-950 uppercase underline tracking-wide">
                OFFER OF PROVISIONAL ADMISSION FOR 2026/2027 ACADEMIC SESSION
              </h2>
            </div>

            <p>
              Dear <strong className="text-slate-950">{applicant.fullName}</strong>,
            </p>

            <p>
              I am pleased to inform you that on the recommendation of the College Academic Board and with the approval of the Provost, you have been offered provisional admission into <strong>Labe College of Nursing Sciences, Gboko</strong>, to undertake a course of study leading to the award of:
            </p>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg my-2 text-center">
              <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                Admitted Programme
              </div>
              <div className="text-lg font-black text-emerald-950 mt-1">
                {applicant.chosenProgrammeName}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Faculty / Department: Department of Nursing Sciences
              </div>
              <div className="mt-2 inline-block px-3 py-1 bg-amber-100 border border-amber-300 rounded text-xs font-mono font-bold text-amber-900">
                Official Admission PIN: {applicant.admissionPin || 'PIN-2026-LCNS-VERIFIED'}
              </div>
            </div>

            <p className="text-xs">
              This offer is subject to the confirmation of your minimum entry requirements (WAEC/NECO/NABTEB science credits in English, Mathematics, Biology, Chemistry, and Physics) and successful medical clearance at the College Health Center.
            </p>

            <div className="border-l-4 border-emerald-700 pl-4 py-1 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">Mandatory Next Steps:</p>
              <p>1. Present this admission letter and original credentials during the physical clearance.</p>
              <p>2. Complete formal student matriculation registration on the college portal.</p>
              <p>3. Adhere strictly to the Catholic Christian moral code and clinical disciplinary statutes.</p>
            </div>

            <p className="text-xs pt-2">
              Congratulations on your admission to Labe College of Nursing Sciences. We look forward to guiding you on your noble vocation to <em>Learn, Serve, and Save</em>.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic font-bold text-base text-emerald-900">
                  Ahire Job
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Ahire Job MBA,MMHN,Bsc,Nsg,RN,RNMH..
              </div>
              <div className="text-[11px] text-slate-500">Registrar, LCNS Gboko</div>
            </div>

            <div className="relative">
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic font-bold text-base text-emerald-900">
                  Mrs. Terna Fiase
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Mrs Terna Fiase Msc, Bnsc, Dip Nursing Education, RNE,RM,RN
              </div>
              <div className="text-[11px] text-slate-500">Provost, LCNS Gboko</div>

              {/* Verified Stamp Badge */}
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-80 border-2 border-emerald-700 rounded-full w-20 h-20 flex flex-col items-center justify-center text-[8px] font-black text-emerald-800 -rotate-12 pointer-events-none">
                <span>LCNS GBOKO</span>
                <span className="text-[7px]">OFFICIALLY</span>
                <span>APPROVED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResultSlipModalProps {
  result: Result;
  student: Student;
  onClose: () => void;
}

export const ResultSlipModal: React.FC<ResultSlipModalProps> = ({
  result,
  student,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-300">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold font-mono">
              EXAM TRANSCRIPT
            </span>
            <span className="text-sm font-semibold">Semester Examination Result Slip</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Result Slip
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 text-slate-800 bg-white relative">
          <div className="border-b-2 border-emerald-900 pb-3 text-center">
            <div className="flex justify-between items-center mb-2">
              <OfficialCrest size="md" />
              <div className="text-center flex-1 px-4">
                <h1 className="text-lg sm:text-xl font-black text-emerald-950 uppercase tracking-tight">
                  LABE COLLEGE OF NURSING SCIENCES, GBOKO
                </h1>
                <p className="text-xs font-bold text-amber-700 uppercase">
                  Catholic Diocese of Gboko
                </p>
                <p className="text-[10px] text-slate-500">
                  OFFICE OF THE REGISTRAR & EXAMINATION BOARD
                </p>
              </div>
              <div className="w-16 h-20 border border-slate-300 rounded p-1 bg-slate-50 flex items-center justify-center overflow-hidden">
                {student.passportUrl ? (
                  <img
                    src={student.passportUrl}
                    alt={student.fullName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-slate-400 text-center uppercase">
                    Photo
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-wide bg-slate-100 py-1 rounded">
              OFFICIAL SEMESTER RESULT SLIP ({result.session} - {result.semester} SEMESTER)
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
            <div>
              <p><span className="text-slate-500 font-medium">Student Name:</span> <strong className="text-slate-900">{result.studentName}</strong></p>
              <p><span className="text-slate-500 font-medium">Admission No:</span> <strong className="font-mono text-emerald-900">{result.admissionNumber}</strong></p>
              <p><span className="text-slate-500 font-medium">Programme:</span> {result.programmeName}</p>
            </div>
            <div className="text-right sm:text-left">
              <p><span className="text-slate-500 font-medium">Level:</span> {result.level} Level</p>
              <p><span className="text-slate-500 font-medium">Academic Session:</span> {result.session}</p>
              <p>
                <span className="text-slate-500 font-medium">Bursary Clearance:</span>{' '}
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  CLEARED & VERIFIED
                </span>
              </p>
            </div>
          </div>

          {/* Course Grades Table */}
          <div className="py-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] border-y border-slate-300">
                  <th className="py-2 px-2">Code</th>
                  <th className="py-2 px-2">Course Title</th>
                  <th className="py-2 px-1 text-center">CU</th>
                  <th className="py-2 px-1 text-center">CA</th>
                  <th className="py-2 px-1 text-center">Exam</th>
                  <th className="py-2 px-1 text-center">Total</th>
                  <th className="py-2 px-1 text-center">Grade</th>
                  <th className="py-2 px-1 text-center">GP</th>
                  <th className="py-2 px-1 text-center">QP</th>
                  <th className="py-2 px-2 text-center">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {result.scores.map((sc) => (
                  <tr key={sc.courseCode} className="hover:bg-slate-50">
                    <td className="py-2 px-2 font-bold text-emerald-950 font-sans">{sc.courseCode}</td>
                    <td className="py-2 px-2 font-sans font-medium text-slate-800">{sc.courseTitle}</td>
                    <td className="py-2 px-1 text-center font-semibold">{sc.creditUnits}</td>
                    <td className="py-2 px-1 text-center">{sc.caScore}</td>
                    <td className="py-2 px-1 text-center">{sc.examScore}</td>
                    <td className="py-2 px-1 text-center font-bold text-slate-900">{sc.totalScore}</td>
                    <td className="py-2 px-1 text-center font-bold text-emerald-700">{sc.grade}</td>
                    <td className="py-2 px-1 text-center">{sc.gradePoint}</td>
                    <td className="py-2 px-1 text-center font-semibold">{sc.qualityPoint}</td>
                    <td className="py-2 px-2 text-center font-sans">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sc.remark === 'Pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sc.remark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Result Calculation Summary */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Total Registered CU</span>
              <strong className="text-sm font-black text-slate-800">{result.totalCreditUnits}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Total Quality Points</span>
              <strong className="text-sm font-black text-slate-800">{result.totalQualityPoints}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Semester GPA</span>
              <strong className="text-base font-black text-emerald-900">{result.gpa.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Cumulative CGPA</span>
              <strong className="text-base font-black text-emerald-900">{result.cgpa.toFixed(2)}</strong>
            </div>
          </div>

          {/* Grading Legend */}
          <div className="mt-3 p-2 bg-slate-100/60 rounded text-[9px] text-slate-600 flex justify-between">
            <span>A: 70-100% (5.00)</span>
            <span>B: 60-69% (4.00)</span>
            <span>C: 50-59% (3.00)</span>
            <span>D: 45-49% (2.00)</span>
            <span>E: 40-44% (1.00)</span>
            <span>F: 0-39% (0.00)</span>
          </div>

          {/* Official Signatures */}
          <div className="mt-6 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Dr. Celestine K. Aondoaver
              </div>
              <div className="text-[10px] text-slate-500">Examination Officer</div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Ahire Job MBA,MMHN,Bsc,Nsg,RN,RNMH..
              </div>
              <div className="text-[10px] text-slate-500">Registrar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PaymentReceiptModalProps {
  payment: PaymentRecord;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-300">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <span className="text-sm font-semibold">Official College e-Receipt</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 text-slate-800 bg-white relative">
          <div className="border-b-2 border-emerald-900 pb-3 text-center">
            <div className="flex justify-center mb-2">
              <OfficialCrest size="md" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-emerald-950 uppercase">
              LABE COLLEGE OF NURSING SCIENCES, GBOKO
            </h1>
            <p className="text-xs text-amber-700 font-bold uppercase">
              Catholic Diocese of Gboko • Bursary Department
            </p>
            <div className="text-xs font-mono font-bold text-slate-700 mt-2 bg-slate-100 py-1 rounded inline-block px-4">
              RECEIPT NO: {payment.receiptNumber}
            </div>
          </div>

          <div className="py-4 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Payer Name:</span>
              <strong className="text-slate-900">{payment.payerName}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Payer Type / ID:</span>
              <span className="font-mono font-semibold text-emerald-900">
                {payment.payerType.toUpperCase()} ({payment.admissionOrAppNumber})
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Payment Purpose:</span>
              <span className="font-semibold text-slate-800 uppercase">
                {payment.paymentType.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Academic Session:</span>
              <span>{payment.session}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Payment Reference:</span>
              <span className="font-mono text-slate-700">{payment.reference}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold text-slate-800 uppercase">
                {(payment.paymentMethod || (payment.gateway === 'paystack' ? 'online' : 'bursary')).replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-700 uppercase">{payment.status}</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-200 mt-2">
              <span className="font-bold text-emerald-950">Amount Paid:</span>
              <span className="text-xl font-black text-emerald-900">
                ₦{payment.amount.toLocaleString('en-NG')}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
            <div>
              <p>Generated: {payment.createdAt}</p>
              <p>Electronic Verification Secured</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800">Bursary / Accounts Department</p>
              <p>College Bursar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MasterScoreSheetModalProps {
  sheet: MasterScoreSheet;
  onClose: () => void;
}

export const PrintableMasterScoreSheetModal: React.FC<MasterScoreSheetModalProps> = ({
  sheet,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalStudents = sheet.rows.length;
  const goodStandingCount = sheet.rows.filter((r) => r.standing === 'Good Standing').length;
  const passRate = totalStudents > 0 ? Math.round((goodStandingCount / totalStudents) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-4 border border-slate-300">
        {/* Top Control Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono font-bold uppercase">
              OFFICIAL BROADSHEET
            </span>
            <span className="text-sm font-semibold">
              Master Score Sheet • {sheet.programmeName} ({sheet.level}L - {sheet.session})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-300 hidden sm:block">
              Status: <span className="font-bold text-amber-400 uppercase">{sheet.status.replace(/_/g, ' ')}</span>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Broadsheet Area */}
        <div id="master-sheet-printable" className="p-6 sm:p-10 text-slate-900 bg-white">
          {/* Header */}
          <div className="border-b-2 border-emerald-950 pb-4 text-center">
            <div className="flex justify-between items-center mb-2">
              <OfficialCrest size="md" />
              <div className="text-center flex-1 px-4">
                <h1 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight">
                  LABE COLLEGE OF NURSING SCIENCES
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-widest">
                  Catholic Diocese of Gboko • Academic Planning Directorate
                </p>
                <p className="text-[11px] text-slate-600 font-medium">
                  Off Gboko Hill Road, Gboko, PMB 1955, Gboko,
                </p>
                <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-wider mt-0.5">
                  Motto: LEARN, SERVE AND SAVE
                </p>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-600">
                <p className="font-bold text-slate-900">SHEET ID: {sheet.id}</p>
                <p>Date: {sheet.generatedAt || new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="bg-emerald-950 text-white py-1.5 px-4 rounded-md mt-2 flex flex-wrap justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span>Programme: {sheet.programmeName}</span>
              <span>Level: {sheet.level} Level</span>
              <span>Session: {sheet.session}</span>
              <span>Semester: {sheet.semester} Semester</span>
            </div>
          </div>

          {/* Master Broadsheet Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-[10px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold text-center border-b border-slate-400">
                  <th className="border border-slate-400 py-2 px-1 w-8">S/N</th>
                  <th className="border border-slate-400 py-2 px-2 text-left">Matric No</th>
                  <th className="border border-slate-400 py-2 px-3 text-left">Student Full Name</th>
                  {sheet.coursesInSheet.map((c) => (
                    <th key={c.code} className="border border-slate-400 py-1 px-1 min-w-[70px]">
                      <div className="font-black text-emerald-950">{c.code}</div>
                      <div className="text-[8px] font-normal text-slate-600">{c.cu} CU</div>
                      <div className="text-[8px] font-mono text-slate-500 border-t border-slate-300 mt-0.5 pt-0.5 flex justify-between px-1">
                        <span>CA</span>
                        <span>EX</span>
                        <span>TOT</span>
                        <span>GR</span>
                      </div>
                    </th>
                  ))}
                  <th className="border border-slate-400 py-2 px-1.5">TCU</th>
                  <th className="border border-slate-400 py-2 px-1.5">TQP</th>
                  <th className="border border-slate-400 py-2 px-1.5 font-black text-emerald-950">GPA</th>
                  <th className="border border-slate-400 py-2 px-1.5 font-black text-emerald-950">CGPA</th>
                  <th className="border border-slate-400 py-2 px-2 text-left">Academic Standing & Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {sheet.rows.map((row, idx) => (
                  <tr key={row.studentId} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border border-slate-300 py-2 px-1 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-300 py-2 px-2 font-mono font-bold text-emerald-950">
                      {row.admissionNumber}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 font-semibold text-slate-900">
                      {row.studentName}
                    </td>
                    {sheet.coursesInSheet.map((c) => {
                      const score = row.courseScores[c.code];
                      return (
                        <td key={c.code} className="border border-slate-300 py-1 px-1 text-center font-mono">
                          {score ? (
                            <div className="flex justify-between items-center text-[9px] px-0.5">
                              <span className="text-slate-600">{score.ca}</span>
                              <span className="text-slate-600">{score.exam}</span>
                              <span className="font-bold text-slate-950">{score.total}</span>
                              <span
                                className={`font-bold px-1 rounded ${
                                  score.grade === 'A'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : score.grade === 'B'
                                    ? 'bg-blue-100 text-blue-900'
                                    : score.grade === 'C'
                                    ? 'bg-yellow-100 text-yellow-900'
                                    : 'bg-rose-100 text-rose-900'
                                }`}
                              >
                                {score.grade}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="border border-slate-300 py-2 px-1 text-center font-mono font-semibold">
                      {row.totalCU}
                    </td>
                    <td className="border border-slate-300 py-2 px-1 text-center font-mono font-semibold">
                      {row.totalQP}
                    </td>
                    <td className="border border-slate-300 py-2 px-1 text-center font-mono font-black text-emerald-950 bg-emerald-50">
                      {row.gpa.toFixed(2)}
                    </td>
                    <td className="border border-slate-300 py-2 px-1 text-center font-mono font-black text-emerald-950 bg-emerald-50">
                      {row.cgpa.toFixed(2)}
                    </td>
                    <td className="border border-slate-300 py-2 px-2 text-[9px]">
                      <span className="font-bold text-emerald-900 block">{row.standing}</span>
                      <span className="text-slate-600">{row.remark}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Broadsheet Statistics */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between text-xs text-slate-700 font-medium">
            <div>
              Total Enrolled Students: <strong className="text-slate-900">{totalStudents}</strong>
            </div>
            <div>
              Good Academic Standing: <strong className="text-emerald-700">{goodStandingCount}</strong>
            </div>
            <div>
              Overall Cohort Pass Rate: <strong className="text-emerald-800">{passRate}%</strong>
            </div>
            <div>
              Grading Scheme: <span className="font-mono">70-100 (A, 5.0) | 60-69 (B, 4.0) | 50-59 (C, 3.0)</span>
            </div>
          </div>

          {/* Official Endorsement & Multi-Officer Distribution Sign-Offs */}
          <div className="mt-8 pt-6 border-t-2 border-slate-300">
            <h3 className="text-xs font-black uppercase text-emerald-950 tracking-wider mb-4 text-center">
              Official Four-Tier Institutional Endorsements & Approvals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* 1. HOD Nursing */}
              <div className="border border-slate-300 p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-1">
                  1. Departmental Vetting
                </span>
                <p className="font-bold text-slate-900">Mrs. Theresa N. Iorwuese</p>
                <p className="text-[10px] text-slate-500">HOD, Nursing Sciences</p>
                <div className="my-2 py-1 px-2 bg-white rounded border border-slate-200 text-[10px]">
                  <p className="font-semibold text-emerald-800">Status: Vetted</p>
                  <p className="text-slate-600 italic">"{sheet.hodRemarks || 'Departmental scores vetted & confirmed'}"</p>
                  <p className="text-[9px] text-slate-400 mt-1">{sheet.hodEndorsedAt || '2026-03-24'}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[9px] font-mono text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Departmental Seal Applied
                </div>
              </div>

              {/* 2. Exam Officer */}
              <div className="border border-slate-300 p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-cyan-900 uppercase block mb-1">
                  2. Examination Audit
                </span>
                <p className="font-bold text-slate-900">Dr. Celestine K. Aondoaver</p>
                <p className="text-[10px] text-slate-500">Examination Officer</p>
                <div className="my-2 py-1 px-2 bg-white rounded border border-slate-200 text-[10px]">
                  <p className="font-semibold text-cyan-800">Status: Verified</p>
                  <p className="text-slate-600 italic">"{sheet.examRemarks || 'Computation & CA-to-Exam verified'}"</p>
                  <p className="text-[9px] text-slate-400 mt-1">{sheet.examOfficerEndorsedAt || '2026-03-24'}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[9px] font-mono text-cyan-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Examination Audit Passed
                </div>
              </div>

              {/* 3. Registrar */}
              <div className="border border-slate-300 p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-indigo-900 uppercase block mb-1">
                  3. Academic Registry
                </span>
                <p className="font-bold text-slate-900">Ahire Job MBA,MMHN,Bsc,Nsg,RN,RNMH..</p>
                <p className="text-[10px] text-slate-500">College Registrar</p>
                <div className="my-2 py-1 px-2 bg-white rounded border border-slate-200 text-[10px]">
                  <p className="font-semibold text-indigo-800">Status: Endorsed</p>
                  <p className="text-slate-600 italic">"{sheet.registrarRemarks || 'Matriculation regulations certified'}"</p>
                  <p className="text-[9px] text-slate-400 mt-1">{sheet.registrarEndorsedAt || '2026-03-24'}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[9px] font-mono text-indigo-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> College Registry Endorsed
                </div>
              </div>

              {/* 4. Provost */}
              <div className="border border-amber-300 p-3 rounded-xl bg-amber-50/60">
                <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                  4. Executive Ratification
                </span>
                <p className="font-bold text-slate-900">Mrs Terna Fiase Msc, Bnsc, Dip Nursing Education, RNE,RM,RN</p>
                <p className="text-[10px] text-slate-500">College Provost / Rector</p>
                <div className="my-2 py-1 px-2 bg-white rounded border border-amber-200 text-[10px]">
                  <p className="font-semibold text-amber-800">Status: Approved</p>
                  <p className="text-slate-600 italic">"{sheet.provostRemarks || 'Officially ratified by Academic Board'}"</p>
                  <p className="text-[9px] text-slate-400 mt-1">{sheet.provostApprovedAt || '2026-03-24'}</p>
                </div>
                <div className="pt-2 border-t border-amber-200 text-[9px] font-mono text-amber-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Provost Official Stamp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface PrintableApplicationFormModalProps {
  applicant: Applicant;
  onClose: () => void;
  onPrintedOrDownloaded?: () => void;
}

export const PrintableApplicationFormModal: React.FC<PrintableApplicationFormModalProps> = ({
  applicant,
  onClose,
  onPrintedOrDownloaded,
}) => {
  const handlePrint = () => {
    onPrintedOrDownloaded?.();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-4 border border-slate-300">
        {/* Actions bar (hidden during print) */}
        <div className="bg-slate-950 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
              OFFICIAL REGISTRATION SLIP
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              Completed Post-UTME Application Form ({applicant.applicationNumber})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-area" className="p-6 sm:p-10 text-slate-800 bg-white relative print:p-4">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <OfficialCrest size="2xl" />
          </div>

          {/* College Header */}
          <div className="border-b-2 border-emerald-950 pb-4 relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <OfficialCrest size="lg" />
              </div>
              <div className="text-center flex-1 px-2">
                <h1 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight font-serif">
                  LABE COLLEGE OF NURSING SCIENCES, GBOKO
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-wider">
                  Catholic Diocese of Gboko
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Off Gboko Hill Road, Gboko, PMB 1955, Gboko,
                </p>
                <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">
                  Motto: LEARN, SERVE AND SAVE
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Admissions Directorate • For Technical Assistance Call @ICT 08126799565
                </p>
              </div>

              {/* Candidate Passport Photo */}
              <div className="w-24 h-28 border-2 border-slate-400 rounded-lg p-1 bg-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                {applicant.passportUrl ? (
                  <img
                    src={applicant.passportUrl}
                    alt={applicant.fullName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center p-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Candidate Passport Photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs font-mono">
              <span className="font-bold text-emerald-950">
                APPLICATION NO: <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-sm font-black">{applicant.applicationNumber}</span>
              </span>
              <span className="text-slate-600">
                DATE SUBMITTED: {applicant.createdAt || new Date().toISOString().split('T')[0]}
              </span>
              <span className="text-amber-800 font-bold uppercase">
                STATUS: {applicant.admissionStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Form Title */}
          <div className="text-center py-2.5 bg-emerald-950 text-white my-3 rounded-lg print:border print:border-slate-800">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              2026/2027 POST-UTME SCREENING APPLICATION REGISTRATION SLIP
            </h2>
            <p className="text-[10px] text-emerald-200 uppercase font-mono tracking-widest">
              National Diploma (ND) in Nursing Science Programme
            </p>
          </div>

          {/* Body Sections */}
          <div className="space-y-3.5 text-xs">
            {/* Section 1: Candidate Personal Biodata */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-1 font-bold text-slate-900 uppercase text-[11px] border-b border-slate-300 flex justify-between">
                <span>1. Candidate Personal Biodata</span>
                <span className="font-mono text-slate-500 font-normal text-[10px]">Section A</span>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{applicant.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Gender</span>
                  <span className="font-semibold text-slate-800">{applicant.gender}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{applicant.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">State of Origin (LGA)</span>
                  <span className="font-semibold text-slate-800">{applicant.stateOfOrigin} State ({applicant.lga})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Phone Number</span>
                  <span className="font-mono font-semibold text-slate-800">{applicant.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Email Address</span>
                  <span className="font-mono text-slate-800">{applicant.email}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase">Contact Address</span>
                  <span className="text-slate-800">{applicant.lga}, {applicant.stateOfOrigin} State, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Section 2: Next of Kin / Guardian Information */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-1 font-bold text-slate-900 uppercase text-[11px] border-b border-slate-300 flex justify-between">
                <span>2. Next of Kin / Guardian Details</span>
                <span className="font-mono text-slate-500 font-normal text-[10px]">Section B</span>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Next of Kin Full Name</span>
                  <span className="font-bold text-slate-900">{applicant.nextOfKinName || 'Emmanuel Tyokyaa'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Relationship to Candidate</span>
                  <span className="font-semibold text-slate-800">Parent / Guardian</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Phone Number</span>
                  <span className="font-mono font-semibold text-slate-800">{applicant.nextOfKinPhone || '+234 803 000 0000'}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Academic Programme Choice & JAMB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 font-bold text-slate-900 uppercase text-[11px] border-b border-slate-300">
                  3. Academic Programme Choice
                </div>
                <div className="p-3 space-y-1 bg-white">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Selected Programme</span>
                    <strong className="text-emerald-950 text-sm block">{applicant.chosenProgrammeName || 'ND Nursing Science'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Department / Faculty</span>
                    <span className="text-slate-700">Department of Nursing Sciences</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Curriculum Duration</span>
                    <span className="text-slate-700">2 Years (Full-Time National Diploma)</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 font-bold text-slate-900 uppercase text-[11px] border-b border-slate-300">
                  4. JAMB UTME Examination Score
                </div>
                <div className="p-3 space-y-1 bg-white">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">JAMB Registration Number</span>
                    <strong className="font-mono text-emerald-950 text-sm block">{applicant.jambRegNo}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">UTME Aggregate Score</span>
                      <strong className="font-mono text-base text-emerald-800">{applicant.jambScore}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px] uppercase">Benchmark Cut-Off</span>
                      <span className="font-mono text-xs font-bold text-emerald-900">180 (Eligible)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Senior Secondary School O'Level Science Results */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-1 font-bold text-slate-900 uppercase text-[11px] border-b border-slate-300 flex justify-between items-center">
                <span>5. Senior Secondary School O-Level Credentials</span>
                <span className="font-mono text-emerald-900 font-bold text-[10px]">Exam: {applicant.oLevelExamType || 'WAEC May/June 2024'}</span>
              </div>
              <div className="p-3 bg-white">
                <table className="w-full text-xs border border-slate-300 text-center">
                  <thead>
                    <tr className="bg-slate-50 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-300">
                      <th className="py-1.5 px-2 text-left">Required Science Subject</th>
                      <th className="py-1.5 px-2">Grade</th>
                      <th className="py-1.5 px-2">Credit Status</th>
                      <th className="py-1.5 px-2">Institutional Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {applicant.oLevelResults && applicant.oLevelResults.length > 0 ? (
                      applicant.oLevelResults.map((r) => (
                        <tr key={r.subject}>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-900">{r.subject}</td>
                          <td className="py-1 px-2 font-bold text-emerald-900">{r.grade}</td>
                          <td className="py-1 px-2 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-1 px-2 font-sans text-slate-500 text-[10px]">Compulsory NMCN Core</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-900">English Language</td>
                          <td className="py-1 px-2 font-bold text-emerald-900">B3</td>
                          <td className="py-1 px-2 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-1 px-2 font-sans text-slate-500 text-[10px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-900">Mathematics</td>
                          <td className="py-1 px-2 font-bold text-emerald-900">A1</td>
                          <td className="py-1 px-2 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-1 px-2 font-sans text-slate-500 text-[10px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-900">Biology</td>
                          <td className="py-1 px-2 font-bold text-emerald-900">A1</td>
                          <td className="py-1 px-2 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-1 px-2 font-sans text-slate-500 text-[10px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-900">Chemistry</td>
                          <td className="py-1 px-2 font-bold text-emerald-900">B2</td>
                          <td className="py-1 px-2 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-1 px-2 font-sans text-slate-500 text-[10px]">Compulsory</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-900">Physics</td>
                          <td className="py-1 px-2 font-bold text-emerald-900">B3</td>
                          <td className="py-1 px-2 font-sans text-emerald-700 font-semibold">Credit Pass</td>
                          <td className="py-1 px-2 font-sans text-slate-500 text-[10px]">Compulsory</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 6: Candidate Solemn Declaration & Signatures */}
            <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 space-y-2">
              <p className="text-[10px] text-slate-700 leading-relaxed text-justify">
                <strong>Candidate Solemn Declaration:</strong> I, <strong>{applicant.fullName}</strong>, hereby declare that all details, grades, and credentials supplied on this application form are accurate, true, and authentic. I understand that falsification of any data or result will result in immediate disqualification and forfeiture of admission offer.
              </p>
              <div className="pt-3 flex justify-between items-end text-xs">
                <div className="text-center">
                  <div className="w-40 border-b border-slate-700 pb-0.5 font-serif italic text-slate-800">
                    {applicant.fullName}
                  </div>
                  <span className="text-[9px] text-slate-500">Applicant Digital Signature</span>
                </div>

                <div className="text-center">
                  <div className="w-36 border-b border-slate-700 pb-0.5 font-mono text-slate-800">
                    {applicant.createdAt || new Date().toISOString().split('T')[0]}
                  </div>
                  <span className="text-[9px] text-slate-500">Date of Registration</span>
                </div>

                <div className="text-center">
                  <div className="w-40 border-b border-slate-700 pb-0.5 font-serif font-bold text-emerald-900">
                    Ahire Job MBA,MMHN..
                  </div>
                  <span className="text-[9px] text-slate-500">College Registrar / Verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-3 pt-2 border-t border-slate-200 text-center text-[10px] text-slate-500">
            Official System Generated Document • Labe College of Nursing Sciences, Gboko • Catholic Diocese of Gboko • Keep this slip safe for verification.
          </div>
        </div>
      </div>
    </div>
  );
};
