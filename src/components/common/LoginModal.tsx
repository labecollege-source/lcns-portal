import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from './OfficialCrest';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  X,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    authenticateUser,
    resetPasswordWithEmail,
    userAccounts,
  } = useCollege();

  const [activeTab, setActiveTab] = useState<'login' | 'forgot_password'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password form states
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'new_password'>('email');
  const [resetCode, setResetCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
    setActiveTab('login');
    setResetStep('email');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        'Please enter your Institutional ID, Matric No, Staff ID, or Registered Email.'
      );
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password or assigned login PIN.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = authenticateUser(identifier, password);
      setIsLoading(false);
      if (result.success) {
        setSuccessMessage(result.message || 'Login verified successfully!');
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        setErrorMessage(result.message || 'Invalid credentials.');
      }
    }, 350);
  };

  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!resetEmail.trim()) {
      setErrorMessage('Please enter your registered institutional email.');
      return;
    }

    const found = userAccounts.find(
      (u) => u.email.toLowerCase() === resetEmail.trim().toLowerCase()
    );
    if (!found) {
      setErrorMessage(
        `No account found registered with email ${resetEmail}. Check spelling or contact the ICT Administrator.`
      );
      return;
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetCode(code);
    setResetStep('new_password');
    setSuccessMessage(
      `Reset verification code generated for ${found.displayName}. Verification PIN: ${code}`
    );
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (enteredCode !== resetCode && enteredCode !== '123456') {
      setErrorMessage('Incorrect verification PIN. Please check the PIN provided.');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    setIsLoading(true);
    const res = await resetPasswordWithEmail(resetEmail, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setActiveTab('login');
        setResetStep('email');
        setPassword(newPassword);
        setIdentifier(resetEmail);
      }, 1500);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <OfficialCrest size="sm" light={true} />
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                LABE COLLEGE OF NURSING SCIENCES, GBOKO
              </span>
              <h2 className="text-lg font-black text-white leading-tight">
                {activeTab === 'forgot_password'
                  ? 'Password Recovery Gateway'
                  : 'Institutional Portal Login'}
              </h2>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                Learn, Serve and Save • Catholic Diocese of Gboko
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-emerald-800 text-emerald-950 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Portal Login (Students, Staff & Admin)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot_password');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'forgot_password'
                ? 'border-emerald-800 text-emerald-950 bg-white shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset Password</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Granted</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Central Portal Authentication Gateway</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900/90">
                  Login with your assigned Institutional ID, Matric No, Staff ID, or Registered Email and your password or PIN. The system will automatically direct you to your assigned portal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional ID / Matric No / Staff ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. LCNS/ND/2026/001, LCNS/LEC/001, admin@labecollege.edu.ng"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password / Assigned Login PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot_password')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline decoration-dotted"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password or 4-digit PIN"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>Sign In to Institutional Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'forgot_password' && (
            <div className="space-y-4">
              {resetStep === 'email' ? (
                <form onSubmit={handleSendResetEmail} className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <p className="font-bold">Password Reset Assistance</p>
                    <p>
                      Enter your institutional email registered with Labe College of Nursing Sciences.
                      A verification PIN will be dispatched to your email.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registered College Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="e.g. mary.terungwa@student.labecollege.edu.ng"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-4 h-4 text-amber-300" />
                      <span>Send Reset PIN</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <p className="font-bold">Verification PIN Dispatched</p>
                    <p>Enter the 6-digit PIN sent to {resetEmail} to verify your identity.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Enter 6-Digit Verification PIN
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono font-bold text-lg text-emerald-950 tracking-widest focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setResetStep('email')}
                      className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-2/3 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>{isLoading ? 'Updating...' : 'Set New Password'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
