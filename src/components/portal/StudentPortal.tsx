import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { ResultSlipModal, PaymentReceiptModal } from '../common/PrintableDocument';
import { PaystackModal } from '../common/PaystackModal';
import { CBTExamInterface } from '../cbt/CBTExamInterface';
import { CBTAttempt, Course, PaymentRecord } from '../../types/college';
import {
  User,
  GraduationCap,
  CreditCard,
  BookOpen,
  Award,
  Clock,
  Printer,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileText,
  Play,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    currentStudent,
    courses,
    results,
    cbtExams,
    recordCBTAttempt,
    payments,
    recordPayment,
    currentSession,
    courseRegistrations,
    submitCourseRegistration,
  } = useCollege();

  const [activeTab, setActiveTab] = useState<'profile' | 'fees' | 'courses' | 'cbt' | 'results'>('profile');

  // Modals
  const [resultSlipOpen, setResultSlipOpen] = useState(false);
  const [receiptModalPayment, setReceiptModalPayment] = useState<PaymentRecord | null>(null);
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [activeCbtExam, setActiveCbtExam] = useState<any | null>(null);

  // Course Registration selection
  const availableCourses = courses.filter(
    (c) => c.approved && c.level === currentStudent.level && c.semester === currentStudent.currentSemester
  );
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(
    availableCourses.map((c) => c.id)
  );
  const currentRegistration = courseRegistrations.find((r) => r.studentId === currentStudent.id && r.session === currentStudent.currentSession && r.semester === currentStudent.currentSemester);
  const [courseRegistered, setCourseRegistered] = useState<boolean>(Boolean(currentRegistration));

  // Student specific results
  const studentResult = results.find(
    (r) => r.admissionNumber === currentStudent.admissionNumber && r.session === currentStudent.currentSession
  );

  // Student payments
  const studentPayments = payments.filter(
    (p) => p.admissionOrAppNumber === currentStudent.admissionNumber
  );

  const totalRegisteredCU = availableCourses
    .filter((c) => selectedCourseIds.includes(c.id))
    .reduce((sum, c) => sum + c.creditUnits, 0);

  const handlePayTuition = () => {
    setPaystackOpen(true);
  };

  const handlePaymentSuccess = async (ref: string) => {
    setPaystackOpen(false);
    await recordPayment({
      payerId: currentStudent.uid,
      payerName: currentStudent.fullName,
      payerEmail: currentStudent.email,
      payerType: 'student',
      admissionOrAppNumber: currentStudent.admissionNumber,
      paymentType: 'school_fees',
      amount: currentStudent.outstandingBalance || 250000,
      session: currentStudent.currentSession,
      semester: currentStudent.currentSemester,
      reference: ref,
      gateway: 'paystack',
      status: 'success',
    });
    alert('Tuition fee payment processed and verified successfully!');
  };

  const handleFinishCBT = async (attempt: CBTAttempt) => {
    await recordCBTAttempt(attempt);
    setActiveCbtExam(null);
  };

  const toggleCourseSelection = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      const course = courses.find((c) => c.id === courseId);
      if (course && totalRegisteredCU + course.creditUnits > currentSession.maxCreditUnits) {
        alert(`Cannot exceed maximum limit of ${currentSession.maxCreditUnits} Credit Units per semester.`);
        return;
      }
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const submitRegistration = async () => {
    if (selectedCourseIds.length === 0) {
      alert('Select at least one course before submitting.');
      return;
    }
    const selected = courses.filter((c) => selectedCourseIds.includes(c.id));
    const registration = {
      id: `reg-${currentStudent.id}-${currentStudent.currentSession}-${currentStudent.currentSemester}`,
      studentId: currentStudent.id,
      admissionNumber: currentStudent.admissionNumber,
      studentName: currentStudent.fullName,
      programmeName: currentStudent.programmeName,
      session: currentStudent.currentSession,
      semester: currentStudent.currentSemester,
      level: currentStudent.level,
      courses: selected.map((c) => ({ courseId: c.id, courseCode: c.code, courseTitle: c.title, creditUnits: c.creditUnits })),
      totalCreditUnits: totalRegisteredCU,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
    };
    await submitCourseRegistration(registration);
    setCourseRegistered(true);
    alert('Course registration submitted. It now awaits HON., Exam Officer and Registrar approval.');
  };

  const printCourseRegistration = () => {
    if (!currentRegistration || currentRegistration.status !== 'registrar_approved') {
      alert('The official PDF/printout is available only after HON., Exam Officer and Registrar approval.');
      return;
    }
    const rows = currentRegistration.courses.map((c, i) => `<tr><td>${i+1}</td><td>${c.courseCode}</td><td>${c.courseTitle}</td><td>${c.creditUnits}</td></tr>`).join('');
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<html><head><title>LCNS Course Registration</title><style>body{font-family:Arial;padding:35px;color:#0f172a}h1{text-align:center;color:#064e3b}h2{text-align:center}table{width:100%;border-collapse:collapse;margin-top:25px}th,td{border:1px solid #94a3b8;padding:9px;text-align:left}th{background:#ecfdf5}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:20px}.sign{display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px;margin-top:60px}.line{border-top:1px solid #334155;padding-top:8px;text-align:center}</style></head><body><h1>LABE COLLEGE OF NURSING SCIENCES, GBOKO</h1><h2>OFFICIAL COURSE REGISTRATION</h2><div class="meta"><div><b>Student:</b> ${currentStudent.fullName}</div><div><b>Admission No:</b> ${currentStudent.admissionNumber}</div><div><b>Programme:</b> ${currentStudent.programmeName}</div><div><b>Level:</b> ${currentStudent.level === 100 ? 'ND 1' : 'ND 2'}</div><div><b>Session:</b> ${currentRegistration.session}</div><div><b>Semester:</b> ${currentRegistration.semester}</div></div><table><thead><tr><th>S/N</th><th>Code</th><th>Course Title</th><th>CU</th></tr></thead><tbody>${rows}</tbody></table><p><b>Total Credit Units:</b> ${currentRegistration.totalCreditUnits}</p><div class="sign"><div class="line">Student</div><div class="line">Exam Officer</div><div class="line">Registrar</div></div><p style="margin-top:30px;font-size:12px">Registration Reference: ${currentRegistration.id}<br>Approved: ${new Date(currentRegistration.registrarApprovedAt || '').toLocaleString()}</p><script>window.print()</script></body></html>`);
    w.document.close();
  };

  // If taking a CBT exam, render full-screen test environment
  if (activeCbtExam) {
    return (
      <CBTExamInterface
        exam={activeCbtExam}
        student={currentStudent}
        onFinish={handleFinishCBT}
        onExit={() => setActiveCbtExam(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-slate-100 flex-shrink-0 flex items-center justify-center">
            {currentStudent.passportUrl ? (
              <img
                src={currentStudent.passportUrl}
                alt={currentStudent.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono font-black text-emerald-950 text-xl">
                {currentStudent.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                Student Profile
              </span>
              <span className="bg-emerald-800 text-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                {currentStudent.level === 100 ? 'ND 1' : currentStudent.level === 200 ? 'ND 2' : 'ND 2'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {currentStudent.fullName}
            </h1>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Matric No: <strong className="text-amber-300">{currentStudent.admissionNumber}</strong>
            </p>
            <p className="text-xs text-emerald-200 mt-0.5">
              {currentStudent.programmeName} • {currentStudent.currentSession} ({currentStudent.currentSemester} Semester)
            </p>
          </div>
        </div>

        {/* Financial Clearance Pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center sm:text-right min-w-[200px]">
          <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">
            Bursary Financial Clearance
          </span>
          <div className="mt-1">
            {currentStudent.financialClearance ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-bold text-xs uppercase rounded-full shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                Cleared for Exams
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white font-bold text-xs uppercase rounded-full shadow">
                <AlertCircle className="w-3.5 h-3.5" />
                Not Cleared
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-300 block mt-1">
            Bal: ₦{currentStudent.outstandingBalance.toLocaleString('en-NG')}
          </span>
        </div>
      </div>

      {/* Portal Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> My Profile
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'fees'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Bursary & Fees
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Course Registration
        </button>
        <button
          onClick={() => setActiveTab('cbt')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'cbt'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> CBT Examinations
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'results'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" /> Semester Results
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-emerald-950 uppercase">Student Biodata & Academic Record</h2>
            <p className="text-xs text-slate-500">Official student record verified by College Registry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Full Name:</span>
                <span className="font-bold text-slate-900">{currentStudent.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Admission / Matric No:</span>
                <span className="font-mono font-bold text-emerald-900">{currentStudent.admissionNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Programme:</span>
                <span className="font-semibold text-slate-800">{currentStudent.programmeName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Current Level:</span>
                <span className="font-bold text-slate-900">{currentStudent.level} Level</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Official Student Email:</span>
                <span className="font-mono text-slate-800">{currentStudent.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Phone Number:</span>
                <span>{currentStudent.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Parent / Guardian Phone:</span>
                <span className="font-mono text-slate-800">{currentStudent.parentPhone || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Accommodation:</span>
                <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                  Staying: {currentStudent.accommodationStatus || 'Hostel'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Assigned Login PIN:</span>
                <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                  {currentStudent.loginPin || '4921'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Gender:</span>
                <span>{currentStudent.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Session & Semester:</span>
                <span className="font-semibold text-emerald-900">
                  {currentStudent.currentSession} — {currentStudent.currentSemester} Semester
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BURSARY & FEES */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">
                Total Fees Required
              </span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">
                ₦{currentStudent.totalFeesRequired.toLocaleString('en-NG')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Full Session 2026/2027</span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-emerald-700 uppercase tracking-wider block font-bold">
                Amount Paid
              </span>
              <span className="text-2xl font-black text-emerald-800 mt-2 block">
                ₦{currentStudent.totalFeesPaid.toLocaleString('en-NG')}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">Verified by Bursar</span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <span className="text-xs text-amber-700 uppercase tracking-wider block font-bold">
                Outstanding Balance
              </span>
              <span className="text-2xl font-black text-amber-900 mt-2 block">
                ₦{currentStudent.outstandingBalance.toLocaleString('en-NG')}
              </span>
              {currentStudent.outstandingBalance > 0 ? (
                <button
                  onClick={handlePayTuition}
                  className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  Pay Outstanding Now →
                </button>
              ) : (
                <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">
                  Zero Outstanding • Account Cleared
                </span>
              )}
            </div>
          </div>

          {/* Payment Receipts History */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-emerald-950 uppercase">
                  Verified Payment Receipts
                </h3>
                <p className="text-xs text-slate-500">
                  Electronic receipts verified by Paystack and the College Bursary.
                </p>
              </div>

              {currentStudent.outstandingBalance > 0 && (
                <button
                  onClick={handlePayTuition}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  + Pay Tuition Online
                </button>
              )}
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
              <strong>College payment options:</strong> Pay school fees online through this student portal, or pay physically at the Bursary/Accounts Department. Physical payments must be recorded by the Bursar/Accountant and a receipt issued.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <th className="py-3 px-3">Receipt No</th>
                    <th className="py-3 px-3">Purpose</th>
                    <th className="py-3 px-3">Session</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment Ref</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950">{p.receiptNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 uppercase">
                        {p.paymentType.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{p.session}</td>
                      <td className="py-3 px-3 font-black text-slate-900">
                        ₦{p.amount.toLocaleString('en-NG')}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{p.reference}</td>
                      <td className="py-3 px-3 text-slate-500">{p.createdAt}</td>
                      <td className="py-3 px-3 text-right">
                        {p.status === 'pending' ? (
                          <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg">
                            Pending Bursary Clearance
                          </span>
                        ) : p.status === 'success' ? (
                          <button
                            onClick={() => setReceiptModalPayment(p)}
                            className="px-3 py-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Print e-Receipt
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-rose-700 uppercase">{p.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE REGISTRATION */}
      {activeTab === 'courses' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-emerald-950 uppercase">
                Online Course Registration
              </h2>
              <p className="text-xs text-slate-500">
                Select required core science and practical courses. Max allowed: {currentSession.maxCreditUnits} CU.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Selected</span>
              <strong className="text-base font-black text-emerald-950">
                {totalRegisteredCU} / {currentSession.maxCreditUnits} CU
              </strong>
            </div>
          </div>

          {currentRegistration && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-xs font-black text-emerald-950 uppercase mb-3">Approval Status</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-bold">
                {['submitted','hon_approved','exam_approved','registrar_approved'].map((stage, i) => {
                  const order = ['submitted','hon_approved','exam_approved','registrar_approved'];
                  const approved = order.indexOf(currentRegistration.status) >= i;
                  return <div key={stage} className={`rounded-xl px-3 py-2 ${approved ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-slate-400 border border-slate-200'}`}>{approved ? '✓' : '○'} {stage === 'hon_approved' ? 'HON. Approved' : stage === 'exam_approved' ? 'Exam Officer' : stage === 'registrar_approved' ? 'Registrar' : 'Submitted'}</div>;
                })}
              </div>
              {currentRegistration.status === 'rejected' && <p className="text-xs text-rose-700 mt-2 font-semibold">Rejected: {currentRegistration.rejectionReason}</p>}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Select</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Course Title</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Units</th>
                  <th className="py-3 px-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {availableCourses.map((c) => {
                  const isChecked = selectedCourseIds.includes(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCourseSelection(c.id)}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-bold font-mono text-emerald-950">{c.code}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{c.title}</td>
                      <td className="py-3 px-3 text-slate-600">{c.department}</td>
                      <td className="py-3 px-3 text-center font-bold">{c.creditUnits}</td>
                      <td className="py-3 px-3 capitalize">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.type === 'compulsory'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.type}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {currentRegistration ? `Registration status: ${currentRegistration.status.replace('_', ' ')}` : 'Registration status: Not yet submitted'}
            </span>
            {currentRegistration?.status === 'registrar_approved' ? (
              <button onClick={printCourseRegistration} className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer">
                <Printer className="w-4 h-4 text-amber-300" /> Print Approved Course Registration PDF
              </button>
            ) : (
              <button onClick={submitRegistration} disabled={['submitted','hon_approved','exam_approved'].includes(currentRegistration?.status || '')} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 text-emerald-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                <FileText className="w-4 h-4" /> Submit Course Registration
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CBT EXAMINATIONS */}
      {activeTab === 'cbt' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-emerald-950 uppercase">
              Online Computer Based Tests (CBT)
            </h2>
            <p className="text-xs text-slate-500">
              Mid-semester Continuous Assessment tests scheduled in the secure testing interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cbtExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                    {exam.courseCode}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {exam.durationMinutes} Minutes Duration
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{exam.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{exam.instructions}</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Total Marks: <strong className="text-slate-800">{exam.totalMarks} Marks</strong>
                  </span>
                  <button
                    onClick={() => setActiveCbtExam(exam)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-amber-300" /> Start CBT Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SEMESTER RESULTS */}
      {activeTab === 'results' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-emerald-950 uppercase">
                Official Semester Examination Result
              </h2>
              <p className="text-xs text-slate-500">
                Academic Session: {currentStudent.currentSession} • {currentStudent.currentSemester} Semester
              </p>
            </div>
            {studentResult?.published && (
              <button
                onClick={() => setResultSlipOpen(true)}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                Print Official Result Slip
              </button>
            )}
          </div>

          {studentResult ? (
            <div className="space-y-6">
              {/* GPA Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Registered Units</span>
                  <span className="text-xl font-black text-emerald-950">{studentResult.totalCreditUnits}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Quality Points</span>
                  <span className="text-xl font-black text-emerald-950">{studentResult.totalQualityPoints}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Semester GPA</span>
                  <span className="text-2xl font-black text-emerald-900 font-mono">{studentResult.gpa.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Cumulative CGPA</span>
                  <span className="text-2xl font-black text-emerald-900 font-mono">{studentResult.cgpa.toFixed(2)}</span>
                </div>
              </div>

              {/* Scores Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                      <th className="py-3 px-3">Code</th>
                      <th className="py-3 px-3">Course Title</th>
                      <th className="py-3 px-2 text-center">Units</th>
                      <th className="py-3 px-2 text-center">CA</th>
                      <th className="py-3 px-2 text-center">Exam</th>
                      <th className="py-3 px-2 text-center">Total</th>
                      <th className="py-3 px-2 text-center">Grade</th>
                      <th className="py-3 px-2 text-center">GP</th>
                      <th className="py-3 px-3 text-center">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {studentResult.scores.filter((sc) => !currentRegistration || currentRegistration.courses.some((c) => c.courseCode === sc.courseCode)).map((sc) => (
                      <tr key={sc.courseCode} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-emerald-950 font-sans">{sc.courseCode}</td>
                        <td className="py-3 px-3 font-sans font-medium text-slate-800">{sc.courseTitle}</td>
                        <td className="py-3 px-2 text-center">{sc.creditUnits}</td>
                        <td className="py-3 px-2 text-center">{sc.caScore}</td>
                        <td className="py-3 px-2 text-center">{sc.examScore}</td>
                        <td className="py-3 px-2 text-center font-bold text-slate-900">{sc.totalScore}</td>
                        <td className="py-3 px-2 text-center font-black text-emerald-700">{sc.grade}</td>
                        <td className="py-3 px-2 text-center">{sc.gradePoint}</td>
                        <td className="py-3 px-3 text-center font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sc.remark === 'Pass'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
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
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Semester results are currently undergoing academic board computation and vetting.
            </div>
          )}
        </div>
      )}

      {/* Result Slip Modal */}
      {resultSlipOpen && studentResult && (
        <ResultSlipModal
          result={studentResult}
          student={currentStudent}
          onClose={() => setResultSlipOpen(false)}
        />
      )}

      {/* Payment Receipt Modal */}
      {receiptModalPayment && (
        <PaymentReceiptModal
          payment={receiptModalPayment}
          onClose={() => setReceiptModalPayment(null)}
        />
      )}

      {/* Paystack Checkout Modal */}
      <PaystackModal
        isOpen={paystackOpen}
        onClose={() => setPaystackOpen(false)}
        amount={currentStudent.outstandingBalance || 250000}
        paymentType="school_fees"
        payerName={currentStudent.fullName}
        payerEmail={currentStudent.email}
        admissionOrAppNumber={currentStudent.admissionNumber}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
