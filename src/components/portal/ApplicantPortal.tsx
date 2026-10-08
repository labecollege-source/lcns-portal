import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Applicant } from '../../types/college';
import { OfficialCrest } from '../common/OfficialCrest';
import { PaystackModal } from '../common/PaystackModal';
import {
  AdmissionLetterModal,
  PrintableApplicationFormModal,
} from '../common/PrintableDocument';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Printer,
  ShieldCheck,
  AlertCircle,
  Award,
  Copy,
  Check,
  Lock,
  Search,
  ArrowRight,
  Upload,
  UserCheck,
  Download,
  RefreshCw,
  Eye,
  FileCheck,
} from 'lucide-react';

export const ApplicantPortal: React.FC = () => {
  const {
    applicants,
    currentApplicant,
    submitApplicant,
    updateApplicantStatus,
    recordPayment,
    programmes,
    siteSettings,
  } = useCollege();
  const applicationOpen = siteSettings.postUtmeApplicationOpen !== false;

  // Active view: 'return_application' | 'apply' | 'submitted_success' | 'dashboard'
  const [activeTab, setActiveTab] = useState<
    'return_application' | 'apply' | 'submitted_success' | 'dashboard'
  >('return_application');

  // Currently viewed applicant in dashboard
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant>(
    currentApplicant || applicants[0]
  );

  // Return Application lookup state
  const [returnAppNumber, setReturnAppNumber] = useState('');
  const [returnLookupError, setReturnLookupError] = useState('');

  // Just-submitted applicant reference for success screen
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);

  // Mandatory Gate: must print or download application before proceeding to Return Application
  const [hasPrintedOrDownloaded, setHasPrintedOrDownloaded] = useState<boolean>(false);
  const [copiedAppNumber, setCopiedAppNumber] = useState<boolean>(false);

  // Application Form States (Steps 1 to 5)
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [dob, setDob] = useState('2005-05-12');
  const [stateOfOrigin, setStateOfOrigin] = useState('Benue');
  const [lga, setLga] = useState('Gboko');
  const [address, setAddress] = useState('Gboko, Benue State');
  const [nextOfKin, setNextOfKin] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');
  const [jambRegNo, setJambRegNo] = useState('');
  const [jambScore, setJambScore] = useState<number>(205);
  const [chosenProgId, setChosenProgId] = useState('prog-1');
  const [passportUrl, setPassportUrl] = useState('');
  const [oLevelSlipName, setOlevelSlipName] = useState('');
  const [jambSlipName, setJambSlipName] = useState('');
  const [oLevelSlipUrl, setOlevelSlipUrl] = useState('');
  const [jambSlipUrl, setJambSlipUrl] = useState('');
  const [attestationAccepted, setAttestationAccepted] = useState(false);

  // O'Level Results State
  const [oLevelType, setOlevelType] = useState('WAEC May/June 2024');
  const [englishGrade, setEnglishGrade] = useState('B3');
  const [mathsGrade, setMathsGrade] = useState('A1');
  const [bioGrade, setBioGrade] = useState('A1');
  const [chemGrade, setChemGrade] = useState('B2');
  const [physGrade, setPhysGrade] = useState('B3');

  // Modals
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [paystackConfig, setPaystackConfig] = useState<{
    amount: number;
    paymentType: 'post_utme' | 'acceptance_fee';
  }>({ amount: 10000, paymentType: 'post_utme' });

  const [admissionLetterModalOpen, setAdmissionLetterModalOpen] = useState(false);
  const [applicationSlipModalOpen, setApplicationSlipModalOpen] = useState(false);

  // Default Candidate Passport fallback
  const defaultCandidatePassport =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="%23e2e8f0"/><circle cx="100" cy="85" r="45" fill="%23059669"/><path d="M 30 220 C 30 155 70 145 100 145 C 130 145 170 155 170 220 Z" fill="%23064e3b"/><circle cx="100" cy="85" r="40" fill="%23cbd5e1"/><path d="M 45 220 C 45 168 75 160 100 160 C 125 160 155 168 155 220 Z" fill="%23059669"/></svg>';

  // Handle Photo File Upload
  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPassportUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOlevelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOlevelSlipName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setOlevelSlipUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJambUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJambSlipName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setJambSlipUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartNewApplication = () => {
    if (!applicationOpen) { alert('Post-UTME online application is currently closed.'); return; }
    setActiveTab('apply');
    setStep(1);
    setHasPrintedOrDownloaded(false);
  };

  // Submit Application Handler
  const handleFinishApplication = async () => {
    if (!applicationOpen) { alert('Post-UTME online application is currently closed.'); return; }
    if (!fullName || !email || !phone || !jambRegNo) {
      alert('Please fill in all required fields (Full Name, Email, Phone, JAMB Registration).');
      return;
    }

    const prog = programmes.find((p) => p.id === chosenProgId) || programmes[0];
    const finalPassport = passportUrl || defaultCandidatePassport;

    const newApp = await submitApplicant({
      fullName,
      email,
      phone,
      gender,
      dateOfBirth: dob,
      stateOfOrigin,
      lga,
      address,
      nextOfKinName: nextOfKin || 'Parent/Guardian',
      nextOfKinPhone: nextOfKinPhone || phone,
      jambRegNo: jambRegNo.toUpperCase(),
      jambScore: Number(jambScore),
      oLevelExamType: oLevelType,
      oLevelResults: [
        { subject: 'English Language', grade: englishGrade },
        { subject: 'Mathematics', grade: mathsGrade },
        { subject: 'Biology', grade: bioGrade },
        { subject: 'Chemistry', grade: chemGrade },
        { subject: 'Physics', grade: physGrade },
      ],
      chosenProgrammeId: prog.id,
      chosenProgrammeName: prog.name,
      passportUrl: finalPassport,
      oLevelSlipName: oLevelSlipName || 'WAEC_Science_Result_2024.pdf',
      jambSlipName: jambSlipName || 'JAMB_Official_UTME_Slip.pdf',
      oLevelSlipUrl,
      jambSlipUrl,
      admissionStatus: 'applied',
    });

    setSubmittedApplicant(newApp);
    setSelectedApplicant(newApp);
    setReturnAppNumber(newApp.applicationNumber);
    setHasPrintedOrDownloaded(false);
    setActiveTab('submitted_success');
  };

  // Copy Application Number to Clipboard
  const handleCopyAppNumber = (appNo: string) => {
    navigator.clipboard.writeText(appNo);
    setCopiedAppNumber(true);
    setTimeout(() => setCopiedAppNumber(false), 2500);
  };

  // Return Application Lookup
  const handleRetrieveApplication = (appNoToLookup?: string) => {
    const targetNo = (appNoToLookup || returnAppNumber).trim().toUpperCase();
    if (!targetNo) {
      setReturnLookupError('Please enter your Application Number (e.g. LCNS-APP-2026-0182).');
      return;
    }

    const found = applicants.find(
      (a) =>
        a.applicationNumber.toUpperCase() === targetNo ||
        a.id.toUpperCase() === targetNo ||
        a.jambRegNo.toUpperCase() === targetNo
    );

    if (found) {
      setSelectedApplicant(found);
      setReturnLookupError('');
      setActiveTab('dashboard');
    } else {
      setReturnLookupError(
        `Application number "${targetNo}" was not found. Please double-check your application number or start a new registration.`
      );
    }
  };

  // Fee Payments
  const handlePayPostUtme = () => {
    setPaystackConfig({ amount: 10000, paymentType: 'post_utme' });
    setPaystackOpen(true);
  };

  const handlePayAcceptance = () => {
    setPaystackConfig({ amount: 30000, paymentType: 'acceptance_fee' });
    setPaystackOpen(true);
  };

  const handlePaymentSuccess = async (ref: string) => {
    setPaystackOpen(false);
    if (paystackConfig.paymentType === 'post_utme') {
      await recordPayment({
        payerId: selectedApplicant.id,
        payerName: selectedApplicant.fullName,
        payerEmail: selectedApplicant.email,
        payerType: 'applicant',
        admissionOrAppNumber: selectedApplicant.applicationNumber,
        paymentType: 'post_utme',
        amount: 10000,
        session: '2026/2027',
        reference: ref,
        gateway: 'paystack',
        status: 'success',
      });
      await updateApplicantStatus(
        selectedApplicant.id,
        'payment_verified',
        'Post-UTME Screening fee paid and verified.'
      );
      setSelectedApplicant((prev) => ({
        ...prev,
        admissionStatus: 'payment_verified',
        applicationFeePaid: true,
        applicationFeeRef: ref,
      }));
    } else if (paystackConfig.paymentType === 'acceptance_fee') {
      await recordPayment({
        payerId: selectedApplicant.id,
        payerName: selectedApplicant.fullName,
        payerEmail: selectedApplicant.email,
        payerType: 'applicant',
        admissionOrAppNumber: selectedApplicant.applicationNumber,
        paymentType: 'acceptance_fee',
        amount: 30000,
        session: '2026/2027',
        reference: ref,
        gateway: 'paystack',
        status: 'success',
      });
      await updateApplicantStatus(
        selectedApplicant.id,
        'acceptance_paid',
        'Acceptance fee confirmed.'
      );
      setSelectedApplicant((prev) => ({
        ...prev,
        admissionStatus: 'acceptance_paid',
        acceptanceFeePaid: true,
        acceptanceFeeRef: ref,
      }));
    }
  };

  // Workflow steps array
  const workflowSteps = [
    { key: 'applied', label: '1. Application Submitted' },
    { key: 'payment_verified', label: '2. Screening Fee Paid' },
    { key: 'under_review', label: '3. Credentials Vetting' },
    { key: 'eligible', label: '4. Screening Passed' },
    { key: 'admitted', label: '5. Admission Offered' },
    { key: 'acceptance_paid', label: '6. Acceptance Paid & Letter' },
  ];

  const currentStepIndex = workflowSteps.findIndex(
    (w) => w.key === selectedApplicant.admissionStatus
  );

  return (
    <div className="space-y-8">
      {!applicationOpen && activeTab === 'apply' && <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">Post-UTME online application is currently closed. Existing applicants can still access their application status.</div>}
      {/* Top Banner Navigation Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <OfficialCrest size="lg" light={true} />
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
              Admission Bureau • 2026/2027 Academic Session
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Candidate Admission &amp; Post-UTME Portal
            </h1>
            <p className="text-xs text-emerald-200 mt-1">
              {siteSettings.collegeName} • {siteSettings.address}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('return_application')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'return_application'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Return to Application</span>
          </button>

          <button
            onClick={handleStartNewApplication}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'apply'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-emerald-800 text-white hover:bg-emerald-700 border border-emerald-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Apply for Post-UTME</span>
          </button>

          {selectedApplicant && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Application Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: SUBMITTED SUCCESSFULLY & MANDATORY PRINT/DOWNLOAD GATE */}
      {activeTab === 'submitted_success' && submittedApplicant && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-emerald-500 text-center space-y-6">
            {/* Success Icon & Header */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase px-3.5 py-1 rounded-full tracking-wider">
                Registration Status: Submitted Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
                Application Submitted Successfully!
                {submittedApplicant?.submissionDate && <p className="text-xs text-slate-600 mt-2">Submitted: <strong>{submittedApplicant.submissionDate}</strong> at <strong>{submittedApplicant.submissionTime}</strong></p>}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Dear <strong>{submittedApplicant.fullName}</strong>, your Post-UTME application for{' '}
                <strong>{submittedApplicant.chosenProgrammeName}</strong> has been officially logged
                into the Central Registry of Labe College of Nursing Sciences, Gboko.
              </p>
            </div>

            {/* Application Number Box */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 text-white p-6 rounded-2xl border-2 border-amber-400 shadow-xl space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                Official Candidate Application Number
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl sm:text-4xl font-black text-amber-400 tracking-wider">
                  {submittedApplicant.applicationNumber}
                </span>
                <button
                  onClick={() => handleCopyAppNumber(submittedApplicant.applicationNumber)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs"
                  title="Copy Application Number"
                >
                  {copiedAppNumber ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{copiedAppNumber ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-200">
                Important: Write down or save this number. You will use it to Return to your Application.
              </p>
            </div>

            {/* MANDATORY INSTRUCTION NOTICE */}
            <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl text-left space-y-2 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>MANDATORY STEP: Print &amp; Download Application PDF</span>
              </div>
              <p className="leading-relaxed">
                As required by College Admissions Regulations, you must first print and/or download
                your completed application registration slip as a PDF. The PDF contains your uploaded
                passport photograph, personal biodata, JAMB scores, and verified O-Level credentials.
              </p>
              <p className="font-bold text-emerald-900">
                Only after completing this print/download step can you unlock the next stage (Return Application).
              </p>
            </div>

            {/* Primary Action Button: Print / Download Completed Application Form */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setApplicationSlipModalOpen(true);
                  setHasPrintedOrDownloaded(true);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Printer className="w-5 h-5 text-amber-300" />
                <span>Print / Download Completed Application Form (PDF)</span>
              </button>
            </div>

            {/* Verification confirmation badge if downloaded */}
            {hasPrintedOrDownloaded && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Application Form Printed / Downloaded Successfully! Next Stage Unlocked.</span>
              </div>
            )}

            {/* NEXT STAGE GATE BUTTON */}
            <div className="pt-4 border-t border-slate-200">
              {!hasPrintedOrDownloaded ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3.5 bg-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300"
                  >
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Proceed to Next Stage: Return Application (Locked - Print Form Above First)</span>
                  </button>
                  <p className="text-[11px] text-slate-500">
                    Click the "Print / Download Completed Application Form (PDF)" button above to unlock this button.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReturnAppNumber(submittedApplicant.applicationNumber);
                    setActiveTab('return_application');
                  }}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Next Stage: Return Application</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RETURN APPLICATION STAGE */}
      {activeTab === 'return_application' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                Stage 2: Return Application
              </span>
              <h2 className="text-2xl font-black text-emerald-950">
                Return to Application / Check Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Enter your Application Number below to access your applicant dashboard, pay your Post-UTME screening fee, check admission status, pay acceptance fee, and print your admission letter.
              </p>
            </div>

            {/* Input Box */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Enter Your Application Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={returnAppNumber}
                    onChange={(e) => {
                      setReturnAppNumber(e.target.value);
                      setReturnLookupError('');
                    }}
                    placeholder="e.g. LCNS-APP-2026-0182"
                    className="w-full pl-4 pr-10 py-3.5 border-2 border-slate-300 rounded-2xl text-sm font-mono uppercase font-bold focus:border-emerald-600 focus:outline-hidden shadow-xs"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              {returnLookupError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{returnLookupError}</span>
                </div>
              )}

              <button
                onClick={() => handleRetrieveApplication()}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Retrieve &amp; Continue Application</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Quick Helper for active applications */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Registered Candidates on Record (Quick Lookup):
              </span>
              <div className="flex flex-wrap gap-2">
                {applicants.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setReturnAppNumber(a.applicationNumber);
                      handleRetrieveApplication(a.applicationNumber);
                    }}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-xl border border-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{a.applicationNumber}</span>
                    <span className="text-[10px] text-slate-400 font-sans">({a.fullName.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleStartNewApplication}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Don't have an application yet? Start New Post-UTME Registration &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: APPLICANT DASHBOARD (Retrieved Application Stages) */}
      {activeTab === 'dashboard' && selectedApplicant && (
        <div className="space-y-8">
          {/* Candidate Card & Print Slip Action */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-2xl border-2 border-emerald-600 overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center shadow-xs">
                  {selectedApplicant.passportUrl ? (
                    <img
                      src={selectedApplicant.passportUrl}
                      alt={selectedApplicant.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-slate-400 text-xl">
                      {selectedApplicant.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedApplicant.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Application No:{' '}
                    <strong className="text-emerald-950 text-sm font-black">
                      {selectedApplicant.applicationNumber}
                    </strong>
                  </p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Programme:{' '}
                    <span className="text-emerald-800 font-bold">
                      {selectedApplicant.chosenProgrammeName}
                    </span>{' '}
                    (2026/2027 Session)
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Current Stage Status
                  </span>
                  <span className="inline-block mt-0.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedApplicant.admissionStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Print Application Form Button */}
                <button
                  onClick={() => setApplicationSlipModalOpen(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-300"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>View / Print Application Form (PDF)</span>
                </button>
              </div>
            </div>

            {/* Workflow Step Bar */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admission Workflow Progression
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {workflowSteps.map((ws, i) => {
                  const isDone = currentStepIndex >= i;
                  const isCurrent = currentStepIndex === i;
                  return (
                    <div
                      key={ws.key}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-300/40'
                          : isDone
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] text-slate-400 flex items-center justify-center">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] block leading-tight">{ws.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE STAGES */}
            <div className="space-y-4 pt-2">
              {/* STAGE 1: POST-UTME SCREENING PAYMENT */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Stage 1 of 4
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Post-UTME Screening Processing Fee (₦10,000)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Statutory administrative charge for computer credential vetting, verification, and Council indexing.
                    </p>
                  </div>

                  {selectedApplicant.admissionStatus === 'applied' ? (
                    <button
                      onClick={handlePayPostUtme}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₦10,000 via Paystack</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold border border-emerald-300 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Screening Fee Paid &amp; Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* STAGE 2: CREDENTIAL REVIEW & ADMISSION CHECKING */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Stage 2 of 4
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Academic Credential Review &amp; Admission Status Checking
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      The Admission Directorate verifies UTME score (≥ 180) and 5 science O-Level credit requirements.
                    </p>
                  </div>

                  {selectedApplicant.admissionStatus === 'applied' ? (
                    <span className="text-xs text-slate-400 italic font-medium">
                      Awaiting Screening Payment
                    </span>
                  ) : selectedApplicant.admissionStatus === 'payment_verified' ||
                    selectedApplicant.admissionStatus === 'under_review' ||
                    selectedApplicant.admissionStatus === 'eligible' ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Credentials Under Review</span>
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Screening Cleared • Admission Granted</span>
                    </span>
                  )}
                </div>
              </div>

              {/* STAGE 3: ACCEPTANCE FEE PAYMENT */}
              {(selectedApplicant.admissionStatus === 'admitted' ||
                selectedApplicant.admissionStatus === 'acceptance_paid') && (
                <div className="p-6 rounded-2xl border-2 border-emerald-600 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                        OFFICIAL OFFER OF PROVISIONAL ADMISSION
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-emerald-950">
                        Provisional Admission Offer Granted!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                        Congratulations! You have been granted provisional admission into{' '}
                        <strong>{selectedApplicant.chosenProgrammeName}</strong> at Labe College of
                        Nursing Sciences, Gboko for the 2026/2027 academic session.
                      </p>
                    </div>
                  </div>

                  {selectedApplicant.admissionStatus === 'admitted' ? (
                    <div className="pt-3 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-amber-950 bg-amber-100/80 p-3 rounded-xl border border-amber-300">
                        <strong>Mandatory Step:</strong> Pay the provisional acceptance fee of{' '}
                        <strong>₦30,000</strong> to verify your slot and unlock your official Admission
                        Letter and PIN.
                      </div>
                      <button
                        onClick={handlePayAcceptance}
                        className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <CreditCard className="w-4 h-4 text-amber-300" />
                        <span>Pay ₦30,000 Acceptance Fee</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-800 block">
                          Acceptance Fee Confirmed • Admission PIN Issued
                        </span>
                        <div className="inline-block px-3 py-1 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-xs text-emerald-950">
                          OFFICIAL PIN: {selectedApplicant.admissionPin || 'PIN-2026-9842-LCNS'}
                        </div>
                      </div>

                      {/* STAGE 4: PRINT OFFICIAL ADMISSION LETTER */}
                      <button
                        onClick={() => setAdmissionLetterModalOpen(true)}
                        className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <Printer className="w-4 h-4 text-amber-300" />
                        <span>Print Official Admission Letter</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Application Data Summary Table */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b pb-1">
                  Candidate Bio-Data &amp; JAMB Scores
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Gender / DOB:</span>
                  <span className="font-medium text-slate-800">
                    {selectedApplicant.gender} • {selectedApplicant.dateOfBirth}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Origin / LGA:</span>
                  <span className="font-medium text-slate-800">
                    {selectedApplicant.stateOfOrigin} State ({selectedApplicant.lga})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">JAMB Reg Number:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedApplicant.jambRegNo}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">UTME Aggregate Score:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {selectedApplicant.jambScore} (Cut-off: 180)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b pb-1">
                  Senior Secondary O-Level Results ({selectedApplicant.oLevelExamType})
                </h4>
                <div className="grid grid-cols-5 gap-1 text-center font-mono">
                  {selectedApplicant.oLevelResults.map((r) => (
                    <div key={r.subject} className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block truncate">
                        {r.subject.split(' ')[0]}
                      </span>
                      <strong className="text-xs text-emerald-900">{r.grade}</strong>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between text-slate-500 text-[11px]">
                  <span>
                    Next of Kin: <strong>{selectedApplicant.nextOfKinName}</strong>
                  </span>
                  <span>Contact: {selectedApplicant.nextOfKinPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: NEW POST-UTME APPLICATION REGISTRATION WIZARD */}
      {activeTab === 'apply' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200 max-w-3xl mx-auto space-y-8">
          <div className="border-b border-slate-200 pb-4 text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              2026/2027 Academic Session
            </span>
            <h2 className="text-2xl font-black text-emerald-950 mt-1">
              Online Post-UTME Registration Form
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Step {step} of 5:{' '}
              {step === 1
                ? 'Candidate Personal Biodata'
                : step === 2
                ? 'JAMB & Academic Programme Choice'
                : step === 3
                ? "Senior Secondary O'Level Science Results"
                : step === 4
                ? 'Passport Photograph & Documents'
                : 'Review & Submit Application'}
            </p>
          </div>

          {/* STEP 1: PERSONAL BIODATA */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Candidate Full Name (as in JAMB) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dooshima Grace Tyokyaa"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="grace@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 814 000 0000"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Female' | 'Male')}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State of Origin *
                  </label>
                  <input
                    type="text"
                    value={stateOfOrigin}
                    onChange={(e) => setStateOfOrigin(e.target.value)}
                    placeholder="Benue"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Local Government Area (LGA) *
                  </label>
                  <input
                    type="text"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    placeholder="Gboko"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential / Contact Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. No. 12 Adekaa Street, Gboko, Benue State"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next of Kin Full Name *
                  </label>
                  <input
                    type="text"
                    value={nextOfKin}
                    onChange={(e) => setNextOfKin(e.target.value)}
                    placeholder="e.g. Mr. Emmanuel Tyokyaa"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next of Kin Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={nextOfKinPhone}
                    onChange={(e) => setNextOfKinPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName || !email || !phone) {
                      alert('Please provide your Full Name, Email, and Phone Number.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-emerald-700"
                >
                  Next: JAMB &amp; Programme Choice &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: JAMB & ACADEMIC CHOICE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    JAMB Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={jambRegNo}
                    onChange={(e) => setJambRegNo(e.target.value)}
                    placeholder="e.g. 202638491028BF"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono uppercase focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UTME Aggregate Score (Min. 180) *
                  </label>
                  <input
                    type="number"
                    min={150}
                    max={400}
                    value={jambScore}
                    onChange={(e) => setJambScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:border-emerald-600 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-emerald-800 mt-1 font-semibold">
                    Institutional UTME Cut-off mark for ND Nursing Science is 180.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Preferred Programme *
                </label>
                <select
                  value={chosenProgId}
                  onChange={(e) => setChosenProgId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                >
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.duration}) - Accredited
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Department of Nursing Sciences • 2-Year Full-Time National Diploma.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!jambRegNo) {
                      alert('Please provide your JAMB Registration Number.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-emerald-700"
                >
                  Next: O'Level Science Results &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: O'LEVEL RESULTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                <strong>O-Level Prerequisite:</strong> Candidate must possess a minimum of five (5)
                science credit passes at not more than two sittings in WAEC, NECO, or NABTEB in English,
                Mathematics, Biology, Chemistry, and Physics.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Examination Type &amp; Year *
                </label>
                <input
                  type="text"
                  value={oLevelType}
                  onChange={(e) => setOlevelType(e.target.value)}
                  placeholder="e.g. WAEC May/June 2024"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">English</label>
                  <select
                    value={englishGrade}
                    onChange={(e) => setEnglishGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  >
                    <option>A1</option><option>B2</option><option>B3</option><option>C4</option><option>C5</option><option>C6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Maths</label>
                  <select
                    value={mathsGrade}
                    onChange={(e) => setMathsGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  >
                    <option>A1</option><option>B2</option><option>B3</option><option>C4</option><option>C5</option><option>C6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Biology</label>
                  <select
                    value={bioGrade}
                    onChange={(e) => setBioGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  >
                    <option>A1</option><option>B2</option><option>B3</option><option>C4</option><option>C5</option><option>C6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chemistry</label>
                  <select
                    value={chemGrade}
                    onChange={(e) => setChemGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  >
                    <option>A1</option><option>B2</option><option>B3</option><option>C4</option><option>C5</option><option>C6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Physics</label>
                  <select
                    value={physGrade}
                    onChange={(e) => setPhysGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  >
                    <option>A1</option><option>B2</option><option>B3</option><option>C4</option><option>C5</option><option>C6</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-emerald-700"
                >
                  Next: Passport &amp; Documents &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PASSPORT PHOTOGRAPH & DOCUMENTS UPLOAD */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Upload Candidate Passport Photograph *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50">
                  <div className="w-28 h-32 rounded-xl border-2 border-slate-400 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {passportUrl ? (
                      <img
                        src={passportUrl}
                        alt="Passport Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400 text-xs font-bold">
                        Passport Preview
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-xs text-slate-700 font-medium">
                      Select a clear, front-facing colored passport photo against a plain background (JPEG/PNG, max 2MB).
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePassportUpload}
                      className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                    />
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setPassportUrl(defaultCandidatePassport)}
                        className="text-[11px] text-emerald-800 font-bold hover:underline cursor-pointer"
                      >
                        Or use standard verified nursing avatar &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting Document Slips */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Attach Supporting Verification Slips (Optional / Physical Clearance Verification)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800 block">
                      O-Level Result Slip / Certificate
                    </span>
                    <input
                      type="file"
                      onChange={handleOlevelUpload}
                      className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-slate-200"
                    />
                    {oLevelSlipName && (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Selected: {oLevelSlipName}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800 block">
                      JAMB UTME Result Slip
                    </span>
                    <input
                      type="file"
                      onChange={handleJambUpload}
                      className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-slate-200"
                    />
                    {jambSlipName && (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Selected: {jambSlipName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-emerald-700"
                >
                  Next: Final Review &amp; Submit &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL REVIEW & SUBMIT */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
                <h4 className="font-bold text-slate-900 uppercase border-b pb-1.5 text-sm">
                  Review Your Registration Summary
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Candidate</span>
                    <strong>{fullName}</strong> ({gender})
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Contact</span>
                    {phone} | {email}
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">State &amp; LGA</span>
                    {stateOfOrigin} State ({lga})
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">JAMB UTME</span>
                    <strong>{jambRegNo}</strong> (Score: {jambScore})
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px] uppercase">Programme</span>
                    <strong className="text-emerald-900">National Diploma in Nursing Science (ND Nursing Science)</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px] uppercase">Science O-Levels</span>
                    <span className="font-mono font-bold text-slate-800">
                      ENG: {englishGrade} | MTH: {mathsGrade} | BIO: {bioGrade} | CHM: {chemGrade} | PHY: {physGrade}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="attestation"
                  checked={attestationAccepted}
                  onChange={(e) => setAttestationAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                />
                <label htmlFor="attestation" className="cursor-pointer">
                  I solemnly declare that all information, passport photo, and academic grades provided above are accurate and true. I understand that I must print and download my completed application slip upon submission.
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  disabled={!attestationAccepted}
                  onClick={handleFinishApplication}
                  className={`px-8 py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer ${
                    attestationAccepted
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white transform hover:-translate-y-0.5'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Submit Application Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paystack Checkout Modal */}
      <PaystackModal
        isOpen={paystackOpen}
        onClose={() => setPaystackOpen(false)}
        amount={paystackConfig.amount}
        paymentType={paystackConfig.paymentType}
        payerName={selectedApplicant.fullName}
        payerEmail={selectedApplicant.email}
        admissionOrAppNumber={selectedApplicant.applicationNumber}
        onSuccess={handlePaymentSuccess}
      />

      {/* Printable Official Application Form Slip Modal (PDF) */}
      {applicationSlipModalOpen && (
        <PrintableApplicationFormModal
          applicant={submittedApplicant || selectedApplicant}
          onClose={() => setApplicationSlipModalOpen(false)}
          onPrintedOrDownloaded={() => setHasPrintedOrDownloaded(true)}
        />
      )}

      {/* Printable Official Admission Letter Modal */}
      {admissionLetterModalOpen && (
        <AdmissionLetterModal
          applicant={selectedApplicant}
          onClose={() => setAdmissionLetterModalOpen(false)}
        />
      )}
    </div>
  );
};
