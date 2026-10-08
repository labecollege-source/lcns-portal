import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { PaymentRecord, Student, FeeStructure, FeeStructureItem } from '../../types/college';
import { PaymentReceiptModal } from '../common/PrintableDocument';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Printer,
  ShieldAlert,
  Search,
  Settings,
  Plus,
  Edit2,
  Save,
  CheckCircle2,
  FileText,
  Building,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const BursarPortal: React.FC = () => {
  const {
    payments,
    students,
    applicants,
    updateStudent,
    voidPayment,
    logAction,
    feeStructures,
    saveFeeStructure,
    currentSession,
    recordManualAccountantPayment,
    verifyPayment,
  } = useCollege();

  const [activeTab, setActiveTab] = useState<'fees' | 'clearance' | 'pending' | 'transactions' | 'manual_payment'>('fees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Manual bursary/accountant payment entry
  const [manualPayerType, setManualPayerType] = useState<'student' | 'applicant'>('student');
  const [manualPayerId, setManualPayerId] = useState('');
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [manualPaymentType, setManualPaymentType] = useState<'school_fees' | 'hostel' | 'acceptance_fee' | 'post_utme' | 'non_refundable'>('school_fees');
  const [manualMethod, setManualMethod] = useState<'bank_teller' | 'pos' | 'transfer' | 'cash'>('bank_teller');
  const [manualReference, setManualReference] = useState('');
  const [manualRemarks, setManualRemarks] = useState('');
  const [manualNotice, setManualNotice] = useState<string | null>(null);

  // Void payment modal state
  const [voidModalPayment, setVoidModalPayment] = useState<PaymentRecord | null>(null);
  const [voidReason, setVoidReason] = useState<string>('');

  // Fee Structure Editing State
  const activeFeeStructure = feeStructures[0] || {
    id: 'fee-ns-100l-first',
    session: currentSession.name || '2026/2027',
    semester: 'First',
    programmeId: 'prog-1',
    programmeName: 'ND Nursing Science',
    level: 100,
    items: [],
    totalAmount: 250000,
    hostelFee: 45000,
    acceptanceFee: 25000,
    postUtmeFee: 2000,
    nonRefundableFee: 15000,
    developmentLevy: 10000,
    nmcnIndexingFee: 35000,
    updatedAt: new Date().toISOString(),
  };

  const [editingFees, setEditingFees] = useState<FeeStructure>(activeFeeStructure);
  const [feeNotice, setFeeNotice] = useState<string | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>(10000);
  const [newItemCategory, setNewItemCategory] = useState<FeeStructureItem['category']>('tuition');
  const [newItemCompulsory, setNewItemCompulsory] = useState(true);

  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const schoolFeesRevenue = payments
    .filter((p) => p.status === 'success' && p.paymentType === 'school_fees')
    .reduce((sum, p) => sum + p.amount, 0);

  const acceptanceRevenue = payments
    .filter((p) => p.status === 'success' && p.paymentType === 'acceptance_fee')
    .reduce((sum, p) => sum + p.amount, 0);

  const postUtmeRevenue = payments
    .filter((p) => p.status === 'success' && p.paymentType === 'post_utme')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(
    (p) =>
      p.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.admissionOrAppNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleClearance = async (student: Student) => {
    const updated: Student = {
      ...student,
      financialClearance: !student.financialClearance,
    };
    await updateStudent(updated);
    await logAction(
      'Bursary Clearance Status Changed',
      student.admissionNumber,
      student.financialClearance ? 'CLEARED' : 'NOT CLEARED',
      updated.financialClearance ? 'CLEARED' : 'NOT CLEARED'
    );
  };

  const handleConfirmVoid = async () => {
    if (!voidModalPayment) return;
    if (!voidReason.trim()) {
      alert('A valid reason is required to void a financial transaction.');
      return;
    }
    await voidPayment(voidModalPayment.id, voidReason);
    setVoidModalPayment(null);
    setVoidReason('');
    alert('Payment has been officially VOIDED and permanently logged in audit records.');
  };

  const handleSaveFeeStructure = async () => {
    // Recalculate total itemized fees
    const itemsTotal = editingFees.items.reduce((sum, it) => sum + Number(it.amount || 0), 0);
    const updatedStructure: FeeStructure = {
      ...editingFees,
      totalAmount: itemsTotal > 0 ? itemsTotal : Number(editingFees.totalAmount),
      updatedAt: new Date().toLocaleString(),
      updatedBy: 'Bursar',
    };
    await saveFeeStructure(updatedStructure);
    setFeeNotice('Fee structure successfully saved and published across the college system!');
    setTimeout(() => setFeeNotice(null), 5000);
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim() || newItemAmount <= 0) {
      alert('Please enter a valid item name and amount.');
      return;
    }
    const newItem: FeeStructureItem = {
      id: `fi-${Date.now()}`,
      name: newItemName.trim(),
      amount: Number(newItemAmount),
      category: newItemCategory,
      compulsory: newItemCompulsory,
    };
    const updatedItems = [...editingFees.items, newItem];
    const newTotal = updatedItems.reduce((s, it) => s + it.amount, 0);
    setEditingFees({
      ...editingFees,
      items: updatedItems,
      totalAmount: newTotal,
    });
    setNewItemName('');
    setNewItemAmount(10000);
    setIsAddItemModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = editingFees.items.filter((it) => it.id !== itemId);
    const newTotal = updatedItems.reduce((s, it) => s + it.amount, 0);
    setEditingFees({
      ...editingFees,
      items: updatedItems,
      totalAmount: newTotal,
    });
  };

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payer =
      manualPayerType === 'student'
        ? students.find((item) => item.id === manualPayerId)
        : applicants.find((item) => item.id === manualPayerId);

    if (!payer) {
      alert(`Select the ${manualPayerType} whose payment is being received.`);
      return;
    }
    if (!manualAmount || manualAmount <= 0) {
      alert('Enter a valid payment amount.');
      return;
    }
    if (!manualReference.trim()) {
      alert('Enter the bank teller, POS, transfer or receipt reference.');
      return;
    }

    const payerNumber = 'admissionNumber' in payer ? payer.admissionNumber : payer.applicationNumber;
    const payment = await recordManualAccountantPayment({
      payerType: manualPayerType,
      payerId: payer.id,
      admissionNumber: payerNumber,
      studentName: payer.fullName,
      amount: Number(manualAmount),
      paymentType: manualPaymentType,
      session: currentSession.name,
      semester: currentSession.currentSemester,
      method: manualMethod,
      reference: manualReference.trim(),
      remarks: manualRemarks.trim(),
    });

    setManualPayerId('');
    setManualAmount(0);
    setManualReference('');
    setManualRemarks('');
    setActiveTab('pending');
    setManualNotice(
      `Payment received and marked PENDING for verification. Receipt ${payment.receiptNumber} will become printable after Bursary/Accounts clearance.`
    );
    setTimeout(() => setManualNotice(null), 7000);
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const verified = await verifyPayment(paymentId);
      if (verified) {
        setSelectedReceipt(verified);
        setActiveTab('transactions');
        alert(`Payment ${verified.receiptNumber} has been verified, cleared and the official receipt is ready to print.`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to verify this payment.');
    }
  };


  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
            Finance &amp; Bursary Directorate
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Bursary &amp; Accounts Portal
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Institutional Fee Configuration, Student Fee Ledgers, and Revenue Clearances
          </p>
          <span className="text-[11px] text-amber-300 mt-1 block font-mono">
            Support Line: For technical assistance call @ICT 08126799565
          </span>
        </div>

        <div className="text-right bg-white/10 p-4 rounded-2xl border border-white/20">
          <span className="text-[10px] uppercase text-emerald-200 block font-bold">
            Total Verified Collections
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            ₦{totalRevenue.toLocaleString('en-NG')}
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      {feeNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feeNotice}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-xs overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fees'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Fee Structure Management (Set All Fees)</span>
        </button>

        <button
          onClick={() => setActiveTab('clearance')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'clearance'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Student Clearances &amp; Ledgers ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Pending Payments ({payments.filter((p) => p.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-cyan-400" />
          <span>Transaction Records &amp; Receipts ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manual_payment')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'manual_payment'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Receive Payment at Bursary</span>
        </button>
      </div>

      {/* TAB 1: BURSAR FEE STRUCTURE MANAGEMENT (Set all fees) */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider block">
                  Official Financial Governance
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Institutional Fee Structure Setup ({editingFees.session})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  The Bursar can configure school fees, post-UTME screening fee, non-refundable acceptance fee, hostel accommodation, and statutory levies.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveFeeStructure}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  Save &amp; Publish Fees
                </button>
              </div>
            </div>

            {/* Quick Fee Highlights Input Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Post-UTME Fee */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Post-UTME Fee
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Admissions
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                  <input
                    type="number"
                    value={editingFees.postUtmeFee || 0}
                    onChange={(e) =>
                      setEditingFees({ ...editingFees, postUtmeFee: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Required for screening slip</span>
              </div>

              {/* 2. Non-Refundable Acceptance Fee */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Acceptance Fee
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Non-Refundable
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                  <input
                    type="number"
                    value={editingFees.acceptanceFee || 0}
                    onChange={(e) =>
                      setEditingFees({ ...editingFees, acceptanceFee: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Admitted candidate pledge</span>
              </div>

              {/* 3. Hostel Accommodation Fee */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Hostel Fee
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Per Session
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                  <input
                    type="number"
                    value={editingFees.hostelFee || 0}
                    onChange={(e) =>
                      setEditingFees({ ...editingFees, hostelFee: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Diocesan female residential hall</span>
              </div>

              {/* 4. Non-Refundable Caution & Maintenance */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Caution / Maintenance
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    Non-Refundable
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                  <input
                    type="number"
                    value={editingFees.nonRefundableFee || 0}
                    onChange={(e) =>
                      setEditingFees({ ...editingFees, nonRefundableFee: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Campus maintenance fee</span>
              </div>
            </div>

            {/* School Fees Total Summary */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-300 block">
                  Total Composite School Fees ({editingFees.programmeName} - {editingFees.level}L)
                </span>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Sum of all compulsory academic, laboratory, clinical, and examination items below.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300">
                  ₦{editingFees.totalAmount.toLocaleString('en-NG')}
                </span>
              </div>
            </div>

            {/* Itemized School Fees Breakdown Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase">
                  Itemized School Fees Components
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Fee Component
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Component / Fee Item</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-center">Requirement</th>
                      <th className="py-3 px-3 text-right">Amount (₦)</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editingFees.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-3 capitalize text-slate-600">
                          {item.category.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.compulsory
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.compulsory ? 'Compulsory' : 'Optional'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ₦{item.amount.toLocaleString('en-NG')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Remove Fee Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT FINANCIAL CLEARANCE & LEDGERS */}
      {activeTab === 'clearance' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-emerald-950 uppercase">
              Student Fee Ledgers &amp; Financial Clearance
            </h2>
            <p className="text-xs text-slate-500">
              Clear students for semester examination and transcript generation based on full fee settlement.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Matric No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Programme</th>
                  <th className="py-3 px-2 text-right">Required (₦)</th>
                  <th className="py-3 px-2 text-right">Paid (₦)</th>
                  <th className="py-3 px-2 text-right">Balance (₦)</th>
                  <th className="py-3 px-3 text-center">Clearance Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 font-sans">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                      {st.admissionNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{st.fullName}</td>
                    <td className="py-3 px-3 text-slate-600">{st.programmeName}</td>
                    <td className="py-3 px-2 text-right font-mono">
                      ₦{st.totalFeesRequired.toLocaleString('en-NG')}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-emerald-700 font-bold">
                      ₦{st.totalFeesPaid.toLocaleString('en-NG')}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-rose-700 font-bold">
                      ₦{st.outstandingBalance.toLocaleString('en-NG')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          st.financialClearance
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {st.financialClearance ? 'Cleared' : 'Pending Payment'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleClearance(st)}
                        className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          st.financialClearance
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {st.financialClearance ? 'Revoke Clearance' : 'Clear Student'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'manual_payment' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="bg-emerald-950 text-white rounded-2xl p-5">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">Bursary / Accounts Department</span>
            <h2 className="text-xl font-black mt-1">Receive School Payment Manually</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Use this screen when a student pays at the Bursary/Accounts Department by bank teller, POS, transfer or cash. Online payments remain available through the student portal.
            </p>
          </div>

          {manualNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {manualNotice}
            </div>
          )}

          <form onSubmit={handleManualPayment} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payer Type *</label>
                <select required value={manualPayerType} onChange={(e) => { setManualPayerType(e.target.value as typeof manualPayerType); setManualPayerId(''); }} className="w-full p-3 border border-slate-300 rounded-xl text-xs">
                  <option value="student">Student</option>
                  <option value="applicant">Applicant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{manualPayerType === 'student' ? 'Student' : 'Applicant'} *</label>
                <select required value={manualPayerId} onChange={(e) => setManualPayerId(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl text-xs">
                  <option value="">-- Select {manualPayerType} --</option>
                  {manualPayerType === 'student'
                    ? students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.admissionNumber} — {student.fullName} — Outstanding ₦{student.outstandingBalance.toLocaleString('en-NG')}
                        </option>
                      ))
                    : applicants.map((applicant) => (
                        <option key={applicant.id} value={applicant.id}>
                          {applicant.applicationNumber} — {applicant.fullName} — {applicant.admissionStatus.replace('_', ' ')}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₦) *</label>
                <input type="number" min={1} required value={manualAmount || ''} onChange={(e) => setManualAmount(Number(e.target.value))} className="w-full p-3 border border-slate-300 rounded-xl font-mono font-bold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Purpose *</label>
                <select value={manualPaymentType} onChange={(e) => setManualPaymentType(e.target.value as typeof manualPaymentType)} className="w-full p-3 border border-slate-300 rounded-xl text-xs">
                  <option value="school_fees">School Fees</option>
                  <option value="hostel">Hostel</option>
                  <option value="acceptance_fee">Acceptance Fee</option>
                  <option value="post_utme">Post-UTME</option>
                  <option value="non_refundable">Non-Refundable Fee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                <select value={manualMethod} onChange={(e) => setManualMethod(e.target.value as typeof manualMethod)} className="w-full p-3 border border-slate-300 rounded-xl text-xs">
                  <option value="bank_teller">Bank Teller</option>
                  <option value="pos">POS</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="cash">Cash at Bursary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment / Teller Reference *</label>
                <input required value={manualReference} onChange={(e) => setManualReference(e.target.value)} placeholder="e.g. TELLER-001234 or POS-8842" className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks</label>
                <textarea rows={3} value={manualRemarks} onChange={(e) => setManualRemarks(e.target.value)} placeholder="Optional payment note..." className="w-full p-3 border border-slate-300 rounded-xl text-xs" />
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
              <strong>Payment policy:</strong> School fees may be paid online through the student portal or physically at the Bursary/Accounts Department. Every physical payment must be entered here as PENDING; an authorized Bursary/Accounts officer must verify it before the ledger is cleared and the official receipt becomes printable.
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                <CreditCard className="w-4 h-4 text-amber-300" /> Record Payment as Pending
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PENDING PAYMENTS — BURSARY/ACCOUNTS VERIFICATION */}
      {activeTab === 'pending' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-5">
          <div>
            <h2 className="text-lg font-black text-emerald-950 uppercase">Pending Payments Awaiting Clearance</h2>
            <p className="text-xs text-slate-500 mt-1">
              A payment entered by Accounts/Bursary stays pending until an authorized finance officer verifies it.
              Only verified payments update the ledger and become printable receipts.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead><tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                <th className="p-3">Payer</th><th className="p-3">ID</th><th className="p-3">Purpose</th>
                <th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Reference</th><th className="p-3 text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {payments.filter((p) => p.status === 'pending').map((payment) => (
                  <tr key={payment.id}>
                    <td className="p-3 font-semibold">{payment.payerName}</td>
                    <td className="p-3 font-mono">{payment.admissionOrAppNumber}</td>
                    <td className="p-3 uppercase">{payment.paymentType.replace('_', ' ')}</td>
                    <td className="p-3 font-mono font-bold">₦{payment.amount.toLocaleString('en-NG')}</td>
                    <td className="p-3">{(payment.paymentMethod || '').replace('_', ' ')}</td>
                    <td className="p-3 font-mono">{payment.reference}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleVerifyPayment(payment.id)}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer">
                        Verify, Clear &amp; Receipt
                      </button>
                    </td>
                  </tr>
                ))}
                {!payments.some((p) => p.status === 'pending') && (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No pending payments.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTION RECORDS & RECEIPTS */}
      {activeTab === 'transactions' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-emerald-950 uppercase">
                Transaction Records &amp; Receipts
              </h2>
              <p className="text-xs text-slate-500">
                Online and Bursary/Accounts transactions. Voiding requires confirmation, reason, and audit log.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search reference or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Receipt No</th>
                  <th className="py-3 px-3">Payer Name</th>
                  <th className="py-3 px-3">Purpose</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 font-sans">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                      {pay.receiptNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{pay.payerName}</td>
                    <td className="py-3 px-3 capitalize">{pay.paymentType.replace('_', ' ')}</td>
                    <td className="py-3 px-3 font-mono font-black text-slate-900">
                      ₦{pay.amount.toLocaleString('en-NG')}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {pay.reference}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          pay.status === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pay.status === 'voided'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {pay.status === 'success' ? (
                          <button
                            onClick={() => setSelectedReceipt(pay)}
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded text-[11px] cursor-pointer"
                          >
                            Receipt
                          </button>
                        ) : pay.status === 'pending' ? (
                          <button
                            onClick={() => handleVerifyPayment(pay.id)}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[11px] cursor-pointer"
                          >
                            Verify &amp; Clear
                          </button>
                        ) : null}
                        {pay.status !== 'voided' && (
                          <button
                            onClick={() => setVoidModalPayment(pay)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-[11px] cursor-pointer"
                          >
                            Void Payment
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
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <PaymentReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* ADD NEW FEE ITEM MODAL */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-base text-slate-900">Add School Fee Component</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fee Component Name *
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Clinical Practicum Logbook, Laboratory Paraphernalia"
                className="w-full p-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount (₦) *
              </label>
              <input
                type="number"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="tuition">Tuition</option>
                  <option value="clinical">Clinical</option>
                  <option value="examination">Examination</option>
                  <option value="lab">Laboratory</option>
                  <option value="library_ict">Library &amp; ICT</option>
                  <option value="nmcn_dues">NMCN Dues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requirement
                </label>
                <select
                  value={newItemCompulsory ? 'yes' : 'no'}
                  onChange={(e) => setNewItemCompulsory(e.target.value === 'yes')}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="yes">Compulsory</option>
                  <option value="no">Optional</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewItem}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOID PAYMENT MODAL */}
      {voidModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-300">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Void Financial Payment</h3>
                <p className="text-xs text-slate-500 font-mono">{voidModalPayment.reference}</p>
              </div>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-900">
              <strong>Caution:</strong> Financial transactions are never silently deleted. Voiding this record will mark it as voided and preserve an immutable audit entry with your recorded reason.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mandatory Void Reason *
              </label>
              <textarea
                required
                rows={3}
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="e.g. Duplicate Paystack charge, customer request refund..."
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setVoidModalPayment(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVoid}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Confirm &amp; Record Void
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
