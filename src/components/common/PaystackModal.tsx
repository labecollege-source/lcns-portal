import React, { useState } from 'react';
import { X, CreditCard, Landmark, PhoneCall, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentType: 'post_utme' | 'acceptance_fee' | 'school_fees' | 'hostel';
  payerName: string;
  payerEmail: string;
  admissionOrAppNumber: string;
  onSuccess: (reference: string) => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  isOpen,
  onClose,
  amount,
  paymentType,
  payerName,
  payerEmail,
  admissionOrAppNumber,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('4084 0840 0840 0840');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('840');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'pin' | 'success'>('form');
  const [generatedRef, setGeneratedRef] = useState('');

  if (!isOpen) return null;

  const paymentTitles: Record<string, string> = {
    post_utme: 'Post-UTME Application Screening Fee',
    acceptance_fee: 'Non-Refundable Provisional Acceptance Fee',
    school_fees: 'Academic Tuition & College Charges',
    hostel: 'Student Accommodation & Hostel Welfare Fee',
  };

  const handlePay = () => {
    if (tab === 'card') {
      setStep('pin');
    } else {
      processFinalPayment();
    }
  };

  const processFinalPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const ref = `PST_${paymentType.toUpperCase().substring(0, 3)}_${Date.now()}`;
      setGeneratedRef(ref);
      setProcessing(false);
      setStep('success');

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onSuccess(ref);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#001f3f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">
                Paystack Secure Payment Gateway
              </div>
              <div className="text-sm font-semibold truncate max-w-[260px]">
                Labe College of Nursing Sciences
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Pill */}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-800 font-medium">{paymentTitles[paymentType]}</p>
            <p className="text-xs text-slate-500">
              Ref: <span className="font-mono">{admissionOrAppNumber}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Due</span>
            <span className="text-2xl font-black text-emerald-900">
              ₦{amount.toLocaleString('en-NG')}
            </span>
          </div>
        </div>

        {/* Payment Channels Tabs */}
        {step !== 'success' && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
            <button
              onClick={() => {
                setTab('card');
                setStep('form');
              }}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
                tab === 'card'
                  ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white font-bold'
                  : 'hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Card
            </button>
            <button
              onClick={() => {
                setTab('bank');
                setStep('form');
              }}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
                tab === 'bank'
                  ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white font-bold'
                  : 'hover:bg-slate-100'
              }`}
            >
              <Landmark className="w-4 h-4" /> Bank Transfer
            </button>
            <button
              onClick={() => {
                setTab('ussd');
                setStep('form');
              }}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
                tab === 'ussd'
                  ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white font-bold'
                  : 'hover:bg-slate-100'
              }`}
            >
              <PhoneCall className="w-4 h-4" /> USSD
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {step === 'success' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Payment Successful!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your transaction has been securely verified by Paystack.
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200 inline-block">
                  Reference: {generatedRef}
                </div>
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                Redirecting and updating your college records...
              </p>
            </div>
          ) : step === 'pin' ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-700 mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800">Enter Your 4-Digit Card PIN</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Prompted by your bank for authorization
                </p>
              </div>

              <div className="flex justify-center gap-3 my-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="password"
                    maxLength={1}
                    value={pin[i] || ''}
                    onChange={(e) => {
                      const newPin = (pin + e.target.value).slice(0, 4);
                      setPin(newPin);
                    }}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-hidden"
                  />
                ))}
              </div>

              <button
                disabled={pin.length < 4 || processing}
                onClick={processFinalPayment}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  `Authorize ₦${amount.toLocaleString('en-NG')}`
                )}
              </button>
            </div>
          ) : tab === 'card' ? (
            <div className="space-y-4">
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-800">
                <span className="font-semibold">Demo Sandbox Mode:</span> A standard test MasterCard is pre-filled. Click "Pay" to proceed.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Card Expiry
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handlePay}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Pay ₦{amount.toLocaleString('en-NG')}
                </button>
              </div>
            </div>
          ) : tab === 'bank' ? (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                Transfer exactly <strong className="text-slate-900">₦{amount.toLocaleString('en-NG')}</strong> to the dynamic Paystack dedicated virtual account below:
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-semibold text-slate-800">Wema Bank / Paystack</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">7829103940</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-semibold text-slate-800">Labe College of Nursing</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded">
                This account expires in 30 minutes. Once payment is made, confirmation is automatic.
              </p>
              <button
                onClick={processFinalPayment}
                disabled={processing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
              >
                {processing ? 'Confirming Transfer...' : 'I Have Sent The Money'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                Dial the USSD code below from your registered bank phone number:
              </p>
              <div className="p-4 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 font-mono text-lg font-bold">
                *737*2*{amount}*829103#
              </div>
              <p className="text-[11px] text-slate-500">
                Supported for GTBank, Zenith, FirstBank, UBA, and Access Bank.
              </p>
              <button
                onClick={processFinalPayment}
                disabled={processing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
              >
                {processing ? 'Verifying USSD Session...' : 'I Have Dialled The Code'}
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-bit SSL Encryption
          </span>
          <span className="font-semibold tracking-wider text-slate-400">PCI-DSS COMPLIANT</span>
        </div>
      </div>
    </div>
  );
};
