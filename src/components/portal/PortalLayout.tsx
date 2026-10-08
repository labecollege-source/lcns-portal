import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { UserRole } from '../../types/college';
import { OfficialCrest } from '../common/OfficialCrest';
import { StudentPortal } from './StudentPortal';
import { ApplicantPortal } from './ApplicantPortal';
import { LecturerPortal } from './LecturerPortal';
import { HodPortal } from './HodPortal';
import { ExamOfficerPortal } from './ExamOfficerPortal';
import { RegistrarPortal } from './RegistrarPortal';
import { ProvostPortal } from './ProvostPortal';
import { BursarPortal } from './BursarPortal';
import { AdmissionOfficerPortal } from './AdmissionOfficerPortal';
import { ICTAdminPortal } from './ICTAdminPortal';
import { ChangePasswordModal } from '../common/ChangePasswordModal';
import { PrintableMasterScoreSheetModal } from '../common/PrintableDocument';
import {
  User,
  GraduationCap,
  Shield,
  CreditCard,
  BookOpen,
  Award,
  Users,
  LogOut,
  Globe,
  Settings,
  ChevronDown,
  Menu,
  X,
  KeyRound,
} from 'lucide-react';

interface PortalLayoutProps {
  onBackToWebsite: () => void;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ onBackToWebsite }) => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    siteSettings,
    setIsChangePasswordModalOpen,
    setIsLoginModalOpen,
    logout,
    selectedMasterSheetForPrint,
    setSelectedMasterSheetForPrint,
  } = useCollege();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const roleDefinitions: Record<
    UserRole,
    { title: string; subtitle: string; color: string; icon: React.ReactNode }
  > = {
    student: {
      title: 'Student Portal',
      subtitle: 'Course Registration, Bursary & Results',
      color: 'bg-emerald-700',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    applicant: {
      title: 'Applicant Portal',
      subtitle: 'Post-UTME Screening & Admission Offer',
      color: 'bg-blue-700',
      icon: <User className="w-4 h-4" />,
    },
    lecturer: {
      title: 'Lecturer Portal',
      subtitle: 'Continuous Assessment & CBT Exams',
      color: 'bg-emerald-800',
      icon: <BookOpen className="w-4 h-4" />,
    },
    hod_nursing: {
      title: 'HOD Nursing Portal',
      subtitle: 'Departmental Vetting & Course Allocation',
      color: 'bg-rose-700',
      icon: <Users className="w-4 h-4" />,
    },
    exam_officer: {
      title: 'Examination Officer',
      subtitle: 'Master Scores & Grade Verification',
      color: 'bg-cyan-700',
      icon: <Award className="w-4 h-4" />,
    },
    registrar: {
      title: 'Registrar Portal',
      subtitle: 'Academic Calendar & Promotion Engine',
      color: 'bg-indigo-700',
      icon: <Shield className="w-4 h-4" />,
    },
    provost: {
      title: 'Provost Executive Portal',
      subtitle: 'Executive Approvals & Result Publication',
      color: 'bg-amber-700',
      icon: <Award className="w-4 h-4" />,
    },
    bursar: {
      title: 'Bursary & Accounts',
      subtitle: 'Student Fee Ledgers & Reconciliation',
      color: 'bg-teal-700',
      icon: <CreditCard className="w-4 h-4" />,
    },
    accountant: {
      title: 'College Accountant',
      subtitle: 'Manual Fee Entry & Student Ledger Clearance',
      color: 'bg-teal-800',
      icon: <CreditCard className="w-4 h-4" />,
    },
    admission_officer: {
      title: 'Admission Officer',
      subtitle: 'Post-UTME Screening & Quota Approvals',
      color: 'bg-sky-700',
      icon: <User className="w-4 h-4" />,
    },
    super_admin: {
      title: 'ICT Admin / Control Center',
      subtitle: 'Accounts, PINs, CMS, Pictures & Broadsheets',
      color: 'bg-purple-800',
      icon: <Settings className="w-4 h-4" />,
    },
  };

  const currentRoleInfo = roleDefinitions[currentRole] || roleDefinitions.student;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Identity & Governance Security Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-300" />
              PORTAL ACCESS
            </span>
            <span className="text-slate-300 text-[11px]">
              Active Duty: <strong className="text-amber-300 uppercase">{currentRole.replace(/_/g, ' ')}</strong>
            </span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              Only ICT Admin is authorized to create users and assign duties.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-[11px] font-semibold cursor-pointer border border-slate-700"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Login</span>
            </button>

            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold text-[11px] cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>Website</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Portal Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBackToWebsite} className="cursor-pointer">
              <OfficialCrest size="sm" showText={true} />
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {currentRoleInfo.title}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                {currentRoleInfo.subtitle}
              </span>
            </div>
          </div>

          {/* User Profile & Account Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block">
                {currentUser.displayName}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {currentRole.replace(/_/g, ' ')} Account • PIN: {currentUser.loginPin || '1234'}
              </span>
            </div>

            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              title="Change Password"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              <span>Change Password</span>
            </button>

            <button
              onClick={logout}
              title="Logout to website"
              className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div
              className={`w-9 h-9 rounded-xl ${currentRoleInfo.color} text-white flex items-center justify-center font-bold text-sm shadow`}
            >
              {currentUser.displayName.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Portal Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {currentRole === 'student' && <StudentPortal />}
        {currentRole === 'applicant' && <ApplicantPortal />}
        {currentRole === 'lecturer' && <LecturerPortal />}
        {currentRole === 'hod_nursing' && <HodPortal />}
        {currentRole === 'exam_officer' && <ExamOfficerPortal />}
        {currentRole === 'registrar' && <RegistrarPortal />}
        {currentRole === 'provost' && <ProvostPortal />}
        {(currentRole === 'bursar' || currentRole === 'accountant') && <BursarPortal />}
        {currentRole === 'admission_officer' && <AdmissionOfficerPortal />}
        {currentRole === 'super_admin' && <ICTAdminPortal />}
      </main>

      {/* Modal Dialogs */}
      <ChangePasswordModal />
      {selectedMasterSheetForPrint && (
        <PrintableMasterScoreSheetModal
          sheet={selectedMasterSheetForPrint}
          onClose={() => setSelectedMasterSheetForPrint(null)}
        />
      )}
    </div>
  );
};
