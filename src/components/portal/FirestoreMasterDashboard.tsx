import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Student, PaymentRecord } from '../../types/college';
import {
  fetchFirestoreStudents,
  fetchFirestorePayments,
  subscribeToFirestoreStudents,
  subscribeToFirestorePayments,
  saveFirestoreStudent,
  deleteFirestoreStudent,
} from '../../firebase/firestoreService';
import {
  exportStudentsToExcel,
  exportPaymentsToExcel,
  exportCombinedMasterExcel,
  exportStudentsToCsv,
  exportPaymentsToCsv,
} from '../../utils/excelExport';
import {
  Database,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  Lock,
  CheckCircle,
  AlertCircle,
  Users,
  CreditCard,
  Building,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  Eye,
  Trash2,
} from 'lucide-react';

interface FirestoreMasterDashboardProps {
  forcedRole?: 'super_admin' | 'provost';
}

export const FirestoreMasterDashboard: React.FC<FirestoreMasterDashboardProps> = ({ forcedRole }) => {
  const { currentRole, siteSettings, logAction } = useCollege();
  const effectiveRole = forcedRole || currentRole;
  const isAdmin = effectiveRole === 'super_admin';

  // State from Firestore
  const [firestoreStudents, setFirestoreStudents] = useState<Student[]>([]);
  const [firestorePayments, setFirestorePayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'students' | 'payments' | 'analytics'>('students');

  // Search & Filter State
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState<string>('all');
  const [studentClearanceFilter, setStudentClearanceFilter] = useState<string>('all');
  const [studentAccommodationFilter, setStudentAccommodationFilter] = useState<string>('all');

  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Selected student for details modal
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Load and listen to Firestore
  useEffect(() => {
    let unsubscribeStudents = () => {};
    let unsubscribePayments = () => {};

    async function initFirestore() {
      setIsLoading(true);
      try {
        const [stds, pyms] = await Promise.all([
          fetchFirestoreStudents(),
          fetchFirestorePayments(),
        ]);
        setFirestoreStudents(stds);
        setFirestorePayments(pyms);
        setLastSyncedTime(new Date().toLocaleTimeString());
      } catch (err) {
        console.warn('Firestore initial load error:', err);
      } finally {
        setIsLoading(false);
      }

      // Realtime subscriptions
      unsubscribeStudents = subscribeToFirestoreStudents((updated) => {
        setFirestoreStudents(updated);
        setLastSyncedTime(new Date().toLocaleTimeString());
      });

      unsubscribePayments = subscribeToFirestorePayments((updated) => {
        setFirestorePayments(updated);
        setLastSyncedTime(new Date().toLocaleTimeString());
      });
    }

    initFirestore();

    return () => {
      unsubscribeStudents();
      unsubscribePayments();
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsSyncing(true);
    try {
      const [stds, pyms] = await Promise.all([
        fetchFirestoreStudents(),
        fetchFirestorePayments(),
      ]);
      setFirestoreStudents(stds);
      setFirestorePayments(pyms);
      setLastSyncedTime(new Date().toLocaleTimeString());
      await logAction('Manual Firestore Resync', "Collections: 'students', 'payments'");
    } catch (e) {
      console.warn('Sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Student filtering
  const filteredStudents = firestoreStudents.filter((s) => {
    const q = studentSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.programmeName.toLowerCase().includes(q);

    const matchesLevel =
      studentLevelFilter === 'all' || String(s.level) === studentLevelFilter;

    const matchesClearance =
      studentClearanceFilter === 'all' ||
      (studentClearanceFilter === 'cleared' && s.financialClearance) ||
      (studentClearanceFilter === 'owing' && !s.financialClearance);

    const matchesAccommodation =
      studentAccommodationFilter === 'all' ||
      s.accommodationStatus.toLowerCase() === studentAccommodationFilter.toLowerCase();

    return matchesSearch && matchesLevel && matchesClearance && matchesAccommodation;
  });

  // Payment filtering
  const filteredPayments = firestorePayments.filter((p) => {
    const q = paymentSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.receiptNumber.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q) ||
      p.payerName.toLowerCase().includes(q) ||
      p.admissionOrAppNumber.toLowerCase().includes(q) ||
      p.payerEmail.toLowerCase().includes(q);

    const matchesType =
      paymentTypeFilter === 'all' || p.paymentType === paymentTypeFilter;

    const matchesStatus =
      paymentStatusFilter === 'all' || p.status === paymentStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Analytics Aggregates
  const totalVerifiedRevenue = firestorePayments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFeesRequired = firestoreStudents.reduce(
    (sum, s) => sum + (s.totalFeesRequired || 0),
    0
  );
  const totalFeesPaid = firestoreStudents.reduce(
    (sum, s) => sum + (s.totalFeesPaid || 0),
    0
  );
  const totalOutstandingArrears = firestoreStudents.reduce(
    (sum, s) => sum + (s.outstandingBalance || 0),
    0
  );
  const totalClearedStudents = firestoreStudents.filter(
    (s) => s.financialClearance
  ).length;
  const totalOwingStudents = firestoreStudents.length - totalClearedStudents;

  // Excel Handlers with Permission Check
  const handleExportStudentsExcel = () => {
    if (!isAdmin) {
      alert('Security Restriction: Excel download is reserved exclusively for the ICT Administrator.');
      return;
    }
    exportStudentsToExcel(filteredStudents, siteSettings.collegeName);
  };

  const handleExportStudentsCsv = () => {
    if (!isAdmin) {
      alert('Security Restriction: CSV download is reserved exclusively for the ICT Administrator.');
      return;
    }
    exportStudentsToCsv(filteredStudents);
  };

  const handleExportPaymentsExcel = () => {
    if (!isAdmin) {
      alert('Security Restriction: Excel download is reserved exclusively for the ICT Administrator.');
      return;
    }
    exportPaymentsToExcel(filteredPayments, siteSettings.collegeName);
  };

  const handleExportPaymentsCsv = () => {
    if (!isAdmin) {
      alert('Security Restriction: CSV download is reserved exclusively for the ICT Administrator.');
      return;
    }
    exportPaymentsToCsv(filteredPayments);
  };

  const handleExportCombinedExcel = () => {
    if (!isAdmin) {
      alert('Security Restriction: Excel download is reserved exclusively for the ICT Administrator.');
      return;
    }
    exportCombinedMasterExcel(firestoreStudents, firestorePayments, siteSettings.collegeName);
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!isAdmin) {
      alert('Only the ICT Administrator is authorized to delete student records from Firestore.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete student "${name}" from Firestore collection 'students'?`)) {
      await deleteFirestoreStudent(studentId);
      setFirestoreStudents((prev) => prev.filter((s) => s.id !== studentId));
      await logAction('Delete Student from Firestore', name, studentId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Firestore Connection Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Firebase Firestore Master Database
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-[11px] font-semibold">
                Collection: 'students' &amp; 'payments'
              </span>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full text-[11px] font-extrabold uppercase shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Full Admin Control &amp; Excel Export
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[11px] font-medium">
                  <Eye className="w-3.5 h-3.5 text-amber-300" /> Provost Audit View
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Administrative &amp; Provost Firestore Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Real-time synchronization with Google Cloud Firestore collections. View, query, and verify
              all enrolled students and bursary payment records. 
              {isAdmin ? (
                <span className="font-semibold text-amber-300">
                  {' '}Excel downloading and storage is active for Administrator.
                </span>
              ) : (
                <span className="text-slate-300">
                  {' '}Viewing enabled for Provost. Excel export is restricted to ICT Admin.
                </span>
              )}
            </p>
          </div>

          {/* Sync & Excel Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleManualRefresh}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Resync live from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            {isAdmin ? (
              <button
                onClick={handleExportCombinedExcel}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-emerald-900/40 cursor-pointer"
                title="Download combined students & payments to Excel (.xls)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                <span>Download Master Excel (.xls)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Excel Export Restricted (Admin Only)</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="mt-4 pt-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between text-[11px] text-emerald-200/70 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Cloud Database Status: <strong className="text-emerald-300">Connected &amp; Synchronized</strong></span>
          </div>
          <div>
            <span>Last Snapshot Received: <strong>{lastSyncedTime || 'Connecting...'}</strong></span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Firestore Students
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {firestoreStudents.length}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-emerald-700 font-semibold">{totalClearedStudents} Cleared</span>
              <span className="text-slate-300">•</span>
              <span className="text-rose-700 font-semibold">{totalOwingStudents} Owing</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Collections */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Inflow Verified
            </span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block font-mono">
              ₦{totalVerifiedRevenue.toLocaleString('en-NG')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {firestorePayments.length} Total Bursary Receipts
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Outstanding Arrears
            </span>
            <span className="text-2xl font-black text-rose-700 mt-1 block font-mono">
              ₦{totalOutstandingArrears.toLocaleString('en-NG')}
            </span>
            <span className="text-[11px] text-rose-600 font-medium mt-1 block">
              Requires Bursary Clearing
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Fees Required */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Fees Ledger Demand
            </span>
            <span className="text-2xl font-black text-slate-800 mt-1 block font-mono">
              ₦{totalFeesRequired.toLocaleString('en-NG')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Total Required Academic Dues
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Firestore Students Collection ({firestoreStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Firestore Payments Collection ({firestorePayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Bursary &amp; Registry Reconciliation</span>
          </button>
        </div>

        {/* Excel Download Actions Bar */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={activeTab === 'students' ? handleExportStudentsExcel : handleExportPaymentsExcel}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                title="Download currently active table to Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export {activeTab === 'students' ? 'Students' : 'Payments'} (.xls)</span>
              </button>

              <button
                onClick={activeTab === 'students' ? handleExportStudentsCsv : handleExportPaymentsCsv}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer transition-colors"
                title="Download CSV"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>CSV</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold">Excel Export Authorized for ICT Admin Only</span>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: FIRESTORE STUDENTS COLLECTION TABLE */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by student name, matric no, phone, email, or programme..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={studentLevelFilter}
                onChange={(e) => setStudentLevelFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Levels</option>
                <option value="100">ND 1</option>
                <option value="200">ND 2</option>
              </select>

              <select
                value={studentClearanceFilter}
                onChange={(e) => setStudentClearanceFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Clearance Status</option>
                <option value="cleared">Financially Cleared</option>
                <option value="owing">Owing Fee Arrears</option>
              </select>

              <select
                value={studentAccommodationFilter}
                onChange={(e) => setStudentAccommodationFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Accommodation</option>
                <option value="hostel">Hostel Resident</option>
                <option value="off-campus">Off-Campus</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
                  <th className="py-3 px-3">Student / Matric</th>
                  <th className="py-3 px-3">Programme &amp; Level</th>
                  <th className="py-3 px-3">Contact &amp; Parent</th>
                  <th className="py-3 px-3">Accommodation</th>
                  <th className="py-3 px-3">Fees Required</th>
                  <th className="py-3 px-3">Fees Paid</th>
                  <th className="py-3 px-3">Outstanding Balance</th>
                  <th className="py-3 px-3 text-center">Clearance</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No students found matching your criteria in Firestore collection 'students'.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Matric */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              s.passportUrl ||
                              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23047857"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>'
                            }
                            alt={s.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs bg-emerald-50"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {s.fullName}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-emerald-800 block">
                              {s.admissionNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{s.gender}</span>
                          </div>
                        </div>
                      </td>

                      {/* Programme & Level */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">{s.programmeName}</span>
                        <span className="text-[11px] text-slate-500 block">
                          Level {s.level} • {s.currentSession} ({s.currentSemester} Sem.)
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="text-slate-700 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {s.phone}
                          </span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {s.email}
                          </span>
                          <span className="text-slate-500 text-[10px]">
                            Parent: {s.parentPhone || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Accommodation */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.accommodationStatus === 'Hostel'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.accommodationStatus}
                        </span>
                      </td>

                      {/* Required */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        ₦{(s.totalFeesRequired || 0).toLocaleString()}
                      </td>

                      {/* Paid */}
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                        ₦{(s.totalFeesPaid || 0).toLocaleString()}
                      </td>

                      {/* Balance */}
                      <td className="py-3 px-3 font-mono font-bold">
                        {(s.outstandingBalance || 0) > 0 ? (
                          <span className="text-rose-700">
                            ₦{(s.outstandingBalance || 0).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold">₦0</span>
                        )}
                      </td>

                      {/* Clearance */}
                      <td className="py-3 px-3 text-center">
                        {s.financialClearance ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Cleared
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Owing Arrears
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForModal(s)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-emerald-800 rounded-lg transition-colors cursor-pointer"
                            title="View student dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.fullName)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                              title="Delete student from Firestore"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing {filteredStudents.length} of {firestoreStudents.length} total students in Firestore.
            </span>
            {isAdmin && (
              <span className="text-emerald-700 font-semibold">
                ✓ Administrator Verified: Database collection 'students' active.
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FIRESTORE PAYMENTS COLLECTION TABLE */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                placeholder="Search by receipt number, reference, payer name, or matric/app number..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Payment Types</option>
                <option value="school_fees">School Fees</option>
                <option value="post_utme">Post-UTME Screening</option>
                <option value="acceptance_fee">Acceptance Fee</option>
                <option value="hostel">Hostel Accommodation</option>
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success / Verified</option>
                <option value="voided">Voided</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
                  <th className="py-3 px-3">Receipt / Ref</th>
                  <th className="py-3 px-3">Payer &amp; ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Amount (NGN)</th>
                  <th className="py-3 px-3">Session &amp; Sem</th>
                  <th className="py-3 px-3">Gateway</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No payments found in Firestore collection 'payments'.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Receipt & Ref */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 block">
                          {p.receiptNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Ref: {p.reference}
                        </span>
                      </td>

                      {/* Payer */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{p.payerName}</span>
                        <span className="text-[11px] font-mono text-emerald-800 font-semibold block">
                          {p.admissionOrAppNumber} ({p.payerType})
                        </span>
                        <span className="text-[10px] text-slate-400 block">{p.payerEmail}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                          {p.paymentType.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 font-mono font-black text-sm text-emerald-900">
                        ₦{p.amount.toLocaleString()}
                      </td>

                      {/* Session */}
                      <td className="py-3 px-3 text-slate-700">
                        <span>{p.session}</span>
                        {p.semester && (
                          <span className="text-[10px] text-slate-400 block">{p.semester} Sem</span>
                        )}
                      </td>

                      {/* Gateway */}
                      <td className="py-3 px-3">
                        <span className="capitalize font-semibold text-slate-700">{p.gateway}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            p.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'voided'
                              ? 'bg-rose-100 text-rose-800 line-through'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        <span>{p.createdAt}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Payments Table Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing {filteredPayments.length} of {firestorePayments.length} payments recorded in Firestore.
            </span>
            <span className="font-mono font-bold text-slate-900">
              Total Filtered Sum: ₦
              {filteredPayments
                .filter((p) => p.status === 'success')
                .reduce((s, p) => s + p.amount, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: BURSARY & REGISTRY RECONCILIATION */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700" /> Revenue Stream Composition
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: 'School Fees (Tuition, Clinical, Exam, NMCN)',
                  type: 'school_fees',
                  color: 'bg-emerald-600',
                },
                {
                  label: 'Post-UTME Screening Applications',
                  type: 'post_utme',
                  color: 'bg-blue-600',
                },
                {
                  label: 'Acceptance Dues & Pin Issuance',
                  type: 'acceptance_fee',
                  color: 'bg-teal-600',
                },
                {
                  label: 'Hostel Accommodation Rentals',
                  type: 'hostel',
                  color: 'bg-purple-600',
                },
              ].map((item) => {
                const total = firestorePayments
                  .filter((p) => p.paymentType === item.type && p.status === 'success')
                  .reduce((sum, p) => sum + p.amount, 0);
                const percent =
                  totalVerifiedRevenue > 0 ? Math.round((total / totalVerifiedRevenue) * 100) : 0;
                return (
                  <div key={item.type} className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{item.label}</span>
                      <span className="font-mono font-black text-slate-900">
                        ₦{total.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Financial Clearance Status
            </h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Enrolled Population</span>
                  <span className="text-xl font-black text-slate-900">{firestoreStudents.length} Students</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Clearance Rate</span>
                  <span className="text-xl font-black text-emerald-700 font-mono">
                    {firestoreStudents.length > 0
                      ? Math.round((totalClearedStudents / firestoreStudents.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Financially Cleared (Eligible for Exams)
                  </span>
                  <span className="font-bold text-slate-900">{totalClearedStudents} Students</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-rose-800 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Owing Fees / Balance (Blocked from Exams)
                  </span>
                  <span className="font-bold text-slate-900">{totalOwingStudents} Students</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Statutory Rule:</strong> As mandated by the Provost and Bursary Council, students
                with previous unliquidated school fee arrears cannot pay subsequent semester dues until
                formally cleared by the Accounts Directorate.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Dossier Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedStudentForModal.passportUrl ||
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23047857"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>'
                  }
                  alt={selectedStudentForModal.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md bg-white"
                />
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                    Firestore Student Record
                  </span>
                  <h3 className="text-xl font-black text-white">{selectedStudentForModal.fullName}</h3>
                  <p className="text-xs text-emerald-200 font-mono">
                    Matric No: {selectedStudentForModal.admissionNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Academic Programme</span>
                  <span className="font-bold text-slate-900">{selectedStudentForModal.programmeName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Current Level &amp; Session</span>
                  <span className="font-bold text-slate-900">
                    {selectedStudentForModal.level} Level • {selectedStudentForModal.currentSession} (
                    {selectedStudentForModal.currentSemester} Semester)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Student Contact</span>
                  <span className="font-bold text-slate-900 block">{selectedStudentForModal.phone}</span>
                  <span className="text-slate-600 block">{selectedStudentForModal.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Parent / Guardian Phone</span>
                  <span className="font-bold text-slate-900">{selectedStudentForModal.parentPhone || 'None specified'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Accommodation Status</span>
                  <span className="font-bold text-slate-900">{selectedStudentForModal.accommodationStatus}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Clearance Status</span>
                  <span className={`font-bold ${selectedStudentForModal.financialClearance ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedStudentForModal.financialClearance ? 'CLEARED' : 'OWING ARREARS'}
                  </span>
                </div>
              </div>

              {/* Financial Ledger Section */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px]">
                  Bursary Financial Ledger Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Total Demanded</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ₦{selectedStudentForModal.totalFeesRequired.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Total Paid</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">
                      ₦{selectedStudentForModal.totalFeesPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Balance Due</span>
                    <span className="font-mono font-bold text-rose-700 text-sm">
                      ₦{selectedStudentForModal.outstandingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credentials reminder for Admin */}
              {isAdmin && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Student Login Credentials</span>
                    <span className="font-mono font-semibold">
                      Login PIN: <strong>{selectedStudentForModal.loginPin || '4921'}</strong> • Password: <strong>{selectedStudentForModal.password || 'StudentPass2026!'}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded font-bold">Admin Only</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
