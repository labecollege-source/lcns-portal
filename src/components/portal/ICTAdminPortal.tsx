import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  UserProfile,
  UserRole,
  MasterScoreSheet,
  Programme,
  Course,
  Student,
  Applicant,
  Facility,
  Officer,
} from '../../types/college';
import { ImageUploadWidget } from '../common/ImageUploadWidget';
import { DistributedMasterScoreSheetsSection } from './DistributedMasterScoreSheetsSection';
import { CourseManagement } from './CourseManagement';
import { SystemDataManager } from './SystemDataManager';
import { FirestoreMasterDashboard } from './FirestoreMasterDashboard';
import { ApplicantInspectionModal } from './ApplicantInspectionModal';
import { PrintableApplicationFormModal } from '../common/PrintableDocument';
import { saveFirestoreStudent } from '../../firebase/firestoreService';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Image as ImageIcon,
  Settings,
  Shield,
  Search,
  KeyRound,
  Trash2,
  Edit2,
  Edit3,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Eye,
  Sparkles,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Plus,
  Printer,
  Share2,
  Lock,
  ArrowRight,
  Globe,
  Upload,
  Database,
  Camera,
  RefreshCw,
  Save,
  Check,
  Award,
  Briefcase,
} from 'lucide-react';

const COMMON_ND_COURSES = [
  'NUR 101 Foundations of Nursing',
  'ANA 101 Gross Anatomy',
  'PHY 101 Medical Physiology',
  'BCH 101 Medical Biochemistry',
  'NUR 103 Clinical Practicum I',
  'GST 101 Use of English',
  'NUR 102 Primary Health Care',
  'ANA 102 Histology & Embryology',
  'PHY 102 Physiology II',
  'NUR 104 Clinical Nursing II',
];

export const ICTAdminPortal: React.FC = () => {
  const {
    userAccounts,
    createUserAccount,
    updateUserAccount,
    deleteUserAccount,
    setCurrentRole,
    masterScoreSheets,
    saveMasterScoreSheet,
    distributeMasterScoreSheet,
    setSelectedMasterSheetForPrint,
    siteSettings,
    updateSiteSettings,
    homepage,
    updateHomepage,
    about,
    updateAbout,
    programmes,
    saveProgramme,
    facilities,
    saveFacility,
    officers,
    saveOfficer,
    gallery,
    saveGalleryItem,
    deleteGalleryItem,
    news,
    saveNewsItem,
    announcements,
    saveAnnouncement,
    auditLogs,
    courses,
    students,
    applicants,
    updateApplicantStatus,
  } = useCollege();

  const [activeTab, setActiveTab] = useState<
    'firestore_dashboard' | 'applications' | 'accounts' | 'courses' | 'master_scores' | 'pictures' | 'website_cms' | 'audit' | 'system'
  >('firestore_dashboard');

  // Search & Filter for Applications
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [quickPrintApplicant, setQuickPrintApplicant] = useState<Applicant | null>(null);

  // Search & Filter for Accounts
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal / Form state for Creating an Account
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoleToCreate, setSelectedRoleToCreate] = useState<UserRole>('student');

  // Account Form Fields (as requested by user)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [identifierNumber, setIdentifierNumber] = useState('');
  const [phone, setPhone] = useState('08126799565');
  const [parentPhone, setParentPhone] = useState('08126799565');
  const [accommodationStatus, setAccommodationStatus] = useState<'Hostel' | 'Off-Campus'>('Hostel');
  const [courseOrProgramme, setCourseOrProgramme] = useState('ND Nursing Science');
  const [courseAssigned, setCourseAssigned] = useState('NUR 101, ANA 101');
  const [department, setDepartment] = useState('Department of Nursing Sciences');
  const [level, setLevel] = useState<number>(100);
  const [loginPin, setLoginPin] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [passportUrl, setPassportUrl] = useState('');
  const [switchUponCreation, setSwitchUponCreation] = useState(false);

  // Edit Staff Role & Courses Modal State
  const [editingStaff, setEditingStaff] = useState<UserProfile | null>(null);
  const [editStaffRole, setEditStaffRole] = useState<UserRole>('lecturer');
  const [editStaffCourses, setEditStaffCourses] = useState<string>('');
  const [editStaffPhone, setEditStaffPhone] = useState<string>('');
  const [editStaffName, setEditStaffName] = useState<string>('');
  const [editStaffDept, setEditStaffDept] = useState<string>('');
  const [editStaffId, setEditStaffId] = useState<string>('');
  const [editStaffPin, setEditStaffPin] = useState<string>('');
  const [editStaffPassword, setEditStaffPassword] = useState<string>('');

  // Password Reset / Change Form State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newPasswordForUser, setNewPasswordForUser] = useState('');

  // Master Score Sheet Creation Modal
  const [isGenerateSheetModalOpen, setIsGenerateSheetModalOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState('2026/2027');
  const [sheetSemester, setSheetSemester] = useState<'First' | 'Second'>('First');
  const [sheetLevel, setSheetLevel] = useState<number>(100);
  const [sheetProgramme, setSheetProgramme] = useState('ND Nursing Science');

  // Picture Upload Management Form States
  const [heroImageUpload, setHeroImageUpload] = useState(homepage.hero.heroImageUrl || '');
  const [crestImageUpload, setCrestImageUpload] = useState(siteSettings.crestUrl || '');
  const [provostImageUpload, setProvostImageUpload] = useState(homepage.welcomeMessage.imageUrl || '');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<
    'Campus' | 'Laboratories' | 'Clinical' | 'Matriculation' | 'Sports' | 'Ceremony'
  >('Laboratories');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  // Feedback notifications
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleOpenEditStaff = (user: UserProfile) => {
    setEditingStaff(user);
    setEditStaffRole(user.role);
    setEditStaffCourses(user.courseAssigned || '');
    setEditStaffPhone(user.phone || '08126799565');
    setEditStaffName(user.displayName);
    setEditStaffDept(user.department || '');
    setEditStaffId(user.identifierNumber || '');
    setEditStaffPin(user.loginPin || '1234');
    setEditStaffPassword(user.password || '');
  };

  const handleSaveStaffEdit = async (switchRoleAfter: boolean = false) => {
    if (!editingStaff) return;
    if (!editStaffName.trim()) {
      showNotice('error', 'Staff name cannot be blank.');
      return;
    }
    try {
      await updateUserAccount(editingStaff.uid, {
        displayName: editStaffName.trim(),
        role: editStaffRole,
        courseAssigned: editStaffCourses.trim(),
        phone: editStaffPhone.trim(),
        department: editStaffDept.trim(),
        identifierNumber: editStaffId.trim(),
        loginPin: editStaffPin.trim(),
        password: editStaffPassword.trim(),
      });

      if (switchRoleAfter) {
        setCurrentRole(editStaffRole);
        showNotice(
          'success',
          `Staff record updated! Active role switched to ${editStaffRole.replace(/_/g, ' ')} (${editStaffName}). You now have access to all ${editStaffRole.replace(/_/g, ' ')} features!`
        );
      } else {
        showNotice(
          'success',
          `Staff record updated successfully for ${editStaffName} (Assigned Role: ${editStaffRole.replace(/_/g, ' ')})!`
        );
      }
      setEditingStaff(null);
    } catch {
      showNotice('error', 'Failed to update staff record.');
    }
  };

  // Auto-generate Login PIN and Default Password on role change
  const handleOpenCreateModal = (role: UserRole = 'student') => {
    setSelectedRoleToCreate(role);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setLoginPin(pin);
    setCustomPassword(
      role === 'student'
        ? 'StudentPass2026!'
        : `${role.charAt(0).toUpperCase() + role.slice(1).replace('_', '')}2026!`
    );
    setFullName('');
    setEmail('');
    setPhone('08126799565');
    setParentPhone('08126799565');
    setAccommodationStatus('Hostel');
    setPassportUrl('');
    setSwitchUponCreation(false);

    if (role === 'student') {
      const studentNum = userAccounts.filter((u) => u.role === 'student').length + 1;
      setIdentifierNumber(`LCNS/NS/2026/${String(studentNum).padStart(3, '0')}`);
      setDepartment('Department of Nursing Sciences');
      setCourseOrProgramme('ND Nursing Science');
      setLevel(100);
    } else if (role === 'lecturer') {
      const lecNum = userAccounts.filter((u) => u.role === 'lecturer').length + 1;
      setIdentifierNumber(`LCNS/LEC/${String(lecNum).padStart(3, '0')}`);
      setDepartment('Department of Nursing Sciences');
      setCourseAssigned('NUR 101 Foundations of Nursing, ANA 101 Gross Anatomy');
    } else if (role === 'provost') {
      setIdentifierNumber('LCNS/PRV/001');
      setDepartment("Provost's Office");
      setCourseAssigned('');
    } else if (role === 'bursar') {
      setIdentifierNumber('LCNS/BUR/001');
      setDepartment('Finance & Bursary Directorate');
      setCourseAssigned('');
    } else if (role === 'registrar') {
      setIdentifierNumber('LCNS/REG/001');
      setDepartment('Academic Registry');
      setCourseAssigned('');
    } else {
      setIdentifierNumber(
        `LCNS/${role.substring(0, 3).toUpperCase()}/${Math.floor(100 + Math.random() * 900)}`
      );
      setDepartment('Administrative Directorate');
      setCourseAssigned('');
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      showNotice('error', 'Full Name and Email are mandatory fields.');
      return;
    }

    try {
      const created = await createUserAccount({
        displayName: fullName.trim(),
        email: email.trim().toLowerCase(),
        role: selectedRoleToCreate,
        identifierNumber: identifierNumber.trim(),
        phone: phone.trim(),
        parentPhone: selectedRoleToCreate === 'student' ? parentPhone.trim() : undefined,
        accommodationStatus:
          selectedRoleToCreate === 'student' ? accommodationStatus : undefined,
        department,
        programmeName: courseOrProgramme,
        courseAssigned: selectedRoleToCreate === 'lecturer' ? courseAssigned : undefined,
        level: selectedRoleToCreate === 'student' ? level : undefined,
        loginPin: loginPin || Math.floor(1000 + Math.random() * 9000).toString(),
        password: customPassword || 'LabePass2026!',
        passportUrl,
      });

      // Synchronize newly created student directly to Firestore collection 'students'
      if (selectedRoleToCreate === 'student') {
        try {
          await saveFirestoreStudent({
            id: `std-${Date.now()}`,
            uid: created.uid,
            admissionNumber:
              created.identifierNumber ||
              `LCNS/NS/2026/${String(students.length + 1).padStart(3, '0')}`,
            fullName: created.displayName,
            email: created.email,
            phone: created.phone || '',
            parentPhone: created.parentPhone || '',
            accommodationStatus: created.accommodationStatus || 'Hostel',
            gender: 'Female',
            programmeId: 'prog-1',
            programmeName: created.programmeName || 'ND Nursing Science',
            level: (created.level as 100 | 200 | 300 | 400) || 100,
            currentSession: '2026/2027',
            currentSemester: 'First',
            passportUrl: created.passportUrl || '',
            loginPin: created.loginPin,
            password: created.password,
            financialClearance: true,
            totalFeesPaid: 250000,
            totalFeesRequired: 250000,
            outstandingBalance: 0,
            createdAt: created.createdAt,
          });
        } catch (syncErr) {
          console.warn('Could not sync student to Firestore:', syncErr);
        }
      }

      if (switchUponCreation) {
        setCurrentRole(created.role);
        showNotice(
          'success',
          `Account created for ${created.displayName}! Active portal switched to ${created.role.replace(/_/g, ' ')} — you now have access to all ${created.role.replace(/_/g, ' ')} features!`
        );
      } else {
        showNotice(
          'success',
          `Account created successfully for ${created.displayName}! Assigned Role: ${created.role.replace(/_/g, ' ')}, Login PIN: ${created.loginPin}`
        );
      }
      setIsCreateModalOpen(false);
    } catch {
      showNotice('error', 'Error creating user account. Please check data.');
    }
  };

  const handleSavePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !newPasswordForUser) return;
    await updateUserAccount(editingUser.uid, { password: newPasswordForUser });
    showNotice('success', `Password updated for ${editingUser.displayName}!`);
    setEditingUser(null);
    setNewPasswordForUser('');
  };

  const handleGenerateMasterSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    const sheetId = `mss-${Date.now().toString().slice(-6)}`;

    // Build sample course list and student rows for the new broadsheet
    const sampleCourses = [
      { code: 'NUR 101', title: 'Foundations of Nursing', cu: 3 },
      { code: 'ANA 101', title: 'Gross Anatomy I', cu: 3 },
      { code: 'PHY 101', title: 'Medical Physiology I', cu: 3 },
      { code: 'BCH 101', title: 'Medical Biochemistry I', cu: 2 },
      { code: 'NUR 103', title: 'Clinical Practicum I', cu: 2 },
      { code: 'GST 101', title: 'Use of English', cu: 2 },
    ];

    const studentRows = students.map((std, idx) => {
      const caBase = 28 + (idx % 5);
      const examBase = 46 + (idx % 8);
      const total = caBase + examBase;
      return {
        studentId: std.id,
        admissionNumber: std.admissionNumber,
        studentName: std.fullName,
        programmeName: sheetProgramme,
        level: sheetLevel,
        session: sheetSession,
        semester: sheetSemester,
        courseScores: {
          'NUR 101': { ca: caBase, exam: examBase, total, grade: 'A', gp: 5, qp: 15 },
          'ANA 101': { ca: caBase - 3, exam: examBase - 2, total: total - 5, grade: 'A', gp: 5, qp: 15 },
          'PHY 101': { ca: caBase - 2, exam: examBase - 4, total: total - 6, grade: 'B', gp: 4, qp: 12 },
          'BCH 101': { ca: caBase - 5, exam: examBase - 6, total: total - 11, grade: 'B', gp: 4, qp: 8 },
          'NUR 103': { ca: caBase + 2, exam: examBase + 2, total: total + 4, grade: 'A', gp: 5, qp: 10 },
          'GST 101': { ca: caBase - 4, exam: examBase - 3, total: total - 7, grade: 'B', gp: 4, qp: 8 },
        },
        totalCU: 15,
        totalQP: 68,
        gpa: 4.53,
        cgpa: 4.53,
        standing: 'Good Standing' as const,
        remark: 'Passed All Courses in First Sitting',
      };
    });

    const newSheet: MasterScoreSheet = {
      id: sheetId,
      session: sheetSession,
      semester: sheetSemester,
      level: sheetLevel,
      programmeId: 'prog-1',
      programmeName: sheetProgramme,
      coursesInSheet: sampleCourses,
      distributedTo: ['provost', 'registrar', 'exam_officer', 'hod_nursing'],
      status: 'draft',
      rows: studentRows,
      generatedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    await saveMasterScoreSheet(newSheet);
    showNotice(
      'success',
      `Master Score Sheet generated for ${sheetProgramme} (${sheetLevel}L - ${sheetSession}) and distributed to Provost, Registrar, Exam Officer, and HOD!`
    );
    setIsGenerateSheetModalOpen(false);
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryImage || !newGalleryTitle) {
      showNotice('error', 'Please upload or provide an image URL and title.');
      return;
    }

    await saveGalleryItem({
      id: `gal-${Date.now()}`,
      title: newGalleryTitle,
      category: newGalleryCategory,
      imageUrl: newGalleryImage,
      caption: newGalleryCaption || newGalleryTitle,
      date: new Date().toISOString().split('T')[0],
      displayOrder: gallery.length + 1,
      published: true,
    });

    showNotice('success', 'New picture successfully published to the College Gallery!');
    setNewGalleryTitle('');
    setNewGalleryImage('');
    setNewGalleryCaption('');
  };

  // Filtered users
  const filteredUsers = userAccounts.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.identifierNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Top ICT Administration Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              SUPER ADMIN / ICT DIRECTORATE
            </span>
            <span className="text-xs text-purple-300">Complete Institutional Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Central College Control Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Create and manage accounts for students & staff, assign login PINs and passwords, upload pictures, update CMS content, and distribute master score sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenCreateModal('student')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Student</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal('lecturer')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Staff</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 shadow-sm ${
            notice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border border-rose-300 text-rose-900'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-bold">{notice.message}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('firestore_dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'firestore_dashboard'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Firestore Live Registry (Students &amp; Payments)</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-emerald-950 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4 text-amber-400" />
          <span>Submitted Applications ({applicants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'accounts'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>User Accounts &amp; PINs ({userAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'courses'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>Course Registry &amp; Lecturer Assignment</span>
        </button>

        <button
          onClick={() => setActiveTab('master_scores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'master_scores'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          <span>Master Score Sheets & Distribution</span>
        </button>

        <button
          onClick={() => setActiveTab('pictures')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pictures'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Picture Upload & Media Center</span>
        </button>

        <button
          onClick={() => setActiveTab('website_cms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'website_cms'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>College Website CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'system' ? 'bg-rose-700 text-white shadow' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-900'
          }`}
        >
          <Shield className="w-4 h-4 text-rose-500" />
          <span>System Reset &amp; Admissions</span>
        </button>
      </div>

      {/* TAB 0: FIRESTORE LIVE REGISTRY (STUDENTS & PAYMENTS) WITH EXCEL DOWNLOAD */}
      {activeTab === 'system' && <SystemDataManager />}

      {activeTab === 'firestore_dashboard' && (
        <FirestoreMasterDashboard forcedRole="super_admin" />
      )}

      {/* TAB: SUBMITTED APPLICATIONS & ADMISSIONS ARCHIVE */}
      {activeTab === 'applications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Admissions Registry
                </span>
                <h2 className="text-lg font-black text-slate-900 uppercase">
                  Candidate Applications, Passport &amp; Documents Archive
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Central administrative repository of all online candidate submissions. View applicant profiles, verify passport photos and attached documents, and print or download completed application form PDFs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Total Submissions: <strong className="text-emerald-950 font-bold">{applicants.length}</strong>
              </span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'applied', 'payment_verified', 'under_review', 'eligible', 'admitted', 'acceptance_paid'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setApplicantStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                      applicantStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate, App No, JAMB..."
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Applicants Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Passport &amp; App No</th>
                  <th className="py-3 px-3">Candidate Full Name</th>
                  <th className="py-3 px-3">JAMB Reg</th>
                  <th className="py-3 px-2 text-center">Score</th>
                  <th className="py-3 px-3">Programme</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants
                  .filter((a) => {
                    const matchesFilter =
                      applicantStatusFilter === 'all' || a.admissionStatus === applicantStatusFilter;
                    const matchesSearch =
                      a.fullName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
                      a.applicationNumber.toLowerCase().includes(applicantSearch.toLowerCase()) ||
                      a.jambRegNo.toLowerCase().includes(applicantSearch.toLowerCase());
                    return matchesFilter && matchesSearch;
                  })
                  .map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-10 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                            {app.passportUrl ? (
                              <img
                                src={app.passportUrl}
                                alt={app.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">
                                {app.fullName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-mono font-bold text-emerald-950 block">
                              {app.applicationNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {app.createdAt || '2026/2027'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{app.fullName}</span>
                        <span className="text-[10px] text-slate-500">{app.gender} • {app.stateOfOrigin} State</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{app.jambRegNo}</td>
                      <td className="py-3 px-2 text-center font-mono font-black text-emerald-800">
                        {app.jambScore}
                      </td>
                      <td className="py-3 px-3 text-slate-700">{app.chosenProgrammeName}</td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                          {app.admissionStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Inspect Application, Passport & Documents"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => setQuickPrintApplicant(app)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-lg text-xs border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Download / Print Application PDF"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Print PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: USER ACCOUNTS & ASSIGNED DUTIES */}
      {activeTab === 'accounts' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase">
                Institutional Directory & Assigned Duties
              </h2>
              <p className="text-xs text-slate-500">
                All accounts have a system-assigned Login PIN and Password. Users can change their password anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenCreateModal('student')}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Student Account
              </button>
              <button
                onClick={() => handleOpenCreateModal('lecturer')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Staff Account
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, matric no, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter:</span>
              {['all', 'student', 'lecturer', 'hod_nursing', 'exam_officer', 'registrar', 'provost', 'super_admin'].map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                      roleFilter === r
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">User &amp; Passport</th>
                  <th className="py-3 px-3">Assigned Duty / Role</th>
                  <th className="py-3 px-3">ID / Matric No</th>
                  <th className="py-3 px-3">Staff Phone &amp; Courses</th>
                  <th className="py-3 px-3">Accommodation / Parent</th>
                  <th className="py-3 px-2 text-center">Login PIN</th>
                  <th className="py-3 px-2 text-center">Password</th>
                  <th className="py-3 px-3 text-right">Role Management &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                          {u.passportUrl ? (
                            <img src={u.passportUrl} alt={u.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                              {u.displayName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.displayName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.role === 'student'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : u.role === 'lecturer'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : u.role === 'super_admin'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {u.role.replace(/_/g, ' ')}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{u.department}</p>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                      {u.identifierNumber || '-'}
                    </td>

                    <td className="py-3 px-3 space-y-1">
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-950 font-bold px-2 py-0.5 rounded-md border border-emerald-200 w-fit font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>{u.phone || '08126799565'}</span>
                      </div>
                      {u.courseAssigned && (
                        <div className="flex items-start gap-1 text-[10px] text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <BookOpen className="w-3 h-3 text-blue-700 shrink-0 mt-0.5" />
                          <span className="font-semibold line-clamp-2">{u.courseAssigned}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {u.role === 'student' ? (
                        <div className="space-y-0.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.accommodationStatus === 'Hostel'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Staying: {u.accommodationStatus || 'Hostel'}
                          </span>
                          <p className="text-[10px] text-slate-600 font-mono">
                            Parent: {u.parentPhone || 'Not set'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Staff Residence</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-bold text-purple-900 bg-purple-50/50">
                      {u.loginPin || '1234'}
                    </td>

                    <td className="py-3 px-2 text-center font-mono text-[10px] text-slate-600">
                      {u.password || '••••••••'}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleOpenEditStaff(u)}
                          title="Change Role, Courses, Phone &amp; Profile"
                          className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Edit Role &amp; Courses</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentRole(u.role);
                            showNotice(
                              'success',
                              `Switched active portal to ${u.displayName} (${u.role.replace(/_/g, ' ')}) — you now have full access to ${u.role.replace(/_/g, ' ')} features!`
                            );
                          }}
                          title={`Access features as ${u.role.replace(/_/g, ' ')}`}
                          className="px-2 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-emerald-950 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-300"
                        >
                          <ExternalLink className="w-3 h-3 text-emerald-800" />
                          <span>Access Role</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setNewPasswordForUser(u.password || '');
                          }}
                          title="Change password"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-emerald-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${u.displayName}'s account?`)) {
                              deleteUserAccount(u.uid);
                              showNotice('success', `Account for ${u.displayName} removed.`);
                            }
                          }}
                          title="Delete account"
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER SCORE SHEETS & MULTI-OFFICER DISTRIBUTION */}
      {activeTab === 'courses' && (
        <CourseManagement officerLabel="ICT Super Administrator" />
      )}

      {activeTab === 'master_scores' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-800 tracking-wider block">
                Academic Broadsheet Management
              </span>
              <h2 className="text-lg font-black text-slate-900 uppercase">
                Master Score Sheet Generation & Statutory Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate broadsheets and distribute directly to Provost, Registrar, Examination Officer, and HOD Nursing.
              </p>
            </div>

            <button
              onClick={() => setIsGenerateSheetModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Generate Master Score Sheet</span>
            </button>
          </div>

          {/* Render the full Multi-Officer Broadsheet Component */}
          <DistributedMasterScoreSheetsSection
            currentOfficerRole="super_admin"
            title="Active College Master Score Broadsheets"
            subtitle="Four-tier statutory endorsement chain: Vetted by HOD Nursing, Audited by Exams Officer, Endorsed by Registrar, and Ratified by Provost."
          />
        </div>
      )}

      {/* TAB 3: UNIVERSAL PICTURE UPLOAD & MEDIA CENTER */}
      {activeTab === 'pictures' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-8">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-600" /> Universal Picture Uploader & Media Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload picture files directly from your computer/device or enter web URLs to instantly update everything across the college portal and public website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Site Hero Banner */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                1. Homepage Main Hero Banner
              </h3>
              <ImageUploadWidget
                label="Hero Background Image"
                value={heroImageUpload}
                onChange={(val) => {
                  setHeroImageUpload(val);
                  updateHomepage({ hero: { ...homepage.hero, heroImageUrl: val } });
                  showNotice('success', 'Homepage Hero Image updated in real-time!');
                }}
                aspectRatio="banner"
                helperText="This picture appears on the public website front page hero section."
              />
            </div>

            {/* 2. Official Crest / Logo */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                2. Official College Crest / Logo Image
              </h3>
              <ImageUploadWidget
                label="College Official Crest"
                value={crestImageUpload}
                onChange={(val) => {
                  setCrestImageUpload(val);
                  updateSiteSettings({ crestUrl: val });
                  showNotice('success', 'College Crest / Seal updated!');
                }}
                aspectRatio="square"
                helperText="Used on official admission letters, certificates, and student ID cards."
              />
            </div>

            {/* 3. Provost Photograph */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 md:col-span-2">
              <h3 className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                3. Provost Photograph
              </h3>
              <ImageUploadWidget
                label="Provost Official Photograph"
                value={provostImageUpload}
                onChange={(val) => {
                  setProvostImageUpload(val);
                  updateHomepage({
                    welcomeMessage: { ...homepage.welcomeMessage, imageUrl: val },
                  });
                  showNotice(
                    'success',
                    val
                      ? 'Provost photograph published to the public website.'
                      : 'Provost photograph removed from the public website.'
                  );
                }}
                aspectRatio="square"
                helperText="Upload a new official Provost photograph or use Remove Picture to take it off the website."
              />
            </div>
          </div>

          {/* Upload New Picture to Gallery */}
          <div className="p-6 bg-emerald-950 text-white rounded-3xl space-y-4 border border-emerald-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                Gallery & Campus Photo Publishing
              </span>
              <h3 className="text-base font-bold text-white">
                Upload New Picture to College Public Gallery
              </h3>
              <p className="text-xs text-emerald-200">
                Pictures uploaded here will be published immediately to the public Gallery page.
              </p>
            </div>

            <form onSubmit={handleAddGalleryItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">Picture Title</label>
                  <input
                    type="text"
                    required
                    value={newGalleryTitle}
                    onChange={(e) => setNewGalleryTitle(e.target.value)}
                    placeholder="e.g. Clinical Simulation Laboratory Demonstration"
                    className="w-full px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white placeholder:text-emerald-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">Category</label>
                  <select
                    value={newGalleryCategory}
                    onChange={(e) =>
                      setNewGalleryCategory(
                        e.target.value as 'Campus' | 'Laboratories' | 'Clinical' | 'Matriculation' | 'Sports' | 'Ceremony'
                      )
                    }
                    className="w-full px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white focus:outline-hidden"
                  >
                    <option value="Laboratories">Laboratories</option>
                    <option value="Campus">Campus Infrastructure</option>
                    <option value="Clinical">Clinical Practical</option>
                    <option value="Matriculation">Matriculation & Capping</option>
                    <option value="Sports">Sports & Vitality</option>
                    <option value="Ceremony">Ceremonies & Liturgy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1 text-xs">
                  Caption / Description
                </label>
                <input
                  type="text"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  placeholder="e.g. Nursing students mastering pediatric vital sign measurements."
                  className="w-full px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white text-xs placeholder:text-emerald-400 focus:outline-hidden"
                />
              </div>

              <div className="text-slate-800">
                <ImageUploadWidget
                  label="Select or Upload Picture"
                  value={newGalleryImage}
                  onChange={setNewGalleryImage}
                  aspectRatio="card"
                  helperText="Choose a high-resolution photo from your phone/computer."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-950" />
                <span>Publish Picture to Gallery</span>
              </button>
            </form>

            <div className="pt-6 border-t border-emerald-800/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Published Gallery Pictures</h4>
                  <p className="text-[11px] text-emerald-300">Delete a picture here and it disappears from the public Gallery. Upload another picture above to replace it.</p>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded-lg">{gallery.length} published records</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-white/10 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-14 rounded-xl object-cover bg-white/10" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-emerald-300">{item.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Delete "${item.title}" from the public Gallery?`)) {
                          await deleteGalleryItem(item.id);
                          showNotice('success', 'Picture deleted from the public Gallery.');
                        }
                      }}
                      className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 rounded-xl cursor-pointer"
                      title="Delete picture"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COLLEGE WEBSITE CMS */}
      {activeTab === 'website_cms' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 uppercase">
              College Website Content Management (CMS)
            </h2>
            <p className="text-xs text-slate-500">
              Manage institution identity, vision, mission, motto, and contact addresses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">College Name</label>
              <input
                type="text"
                value={siteSettings.collegeName}
                onChange={(e) => updateSiteSettings({ collegeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Motto</label>
              <input
                type="text"
                value={siteSettings.motto}
                onChange={(e) => updateSiteSettings({ motto: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Catholic Diocese</label>
              <input
                type="text"
                value={siteSettings.diocese}
                onChange={(e) => updateSiteSettings({ diocese: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Diocesan Bishop</label>
              <input
                type="text"
                value={siteSettings.bishopName}
                onChange={(e) => updateSiteSettings({ bishopName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Campus Address</label>
              <input
                type="text"
                value={siteSettings.address}
                onChange={(e) => updateSiteSettings({ address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={siteSettings.phone}
                onChange={(e) => updateSiteSettings({ phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase">
                System Security & Academic Audit Trail
              </h2>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all administrative, financial, and grade modifications.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-900 font-bold px-3 py-1 rounded-lg border border-purple-200">
              {auditLogs.length} Logged Events
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Action Performed</th>
                  <th className="py-2.5 px-3">Record Affected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-sans">
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900">{log.userName}</strong>
                      <span className="text-[10px] text-slate-400 block capitalize">
                        {log.role?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-950">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[10px]">{log.recordAffected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ACCOUNT MODAL (As requested by user) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-slate-900 to-purple-950 text-white p-6 relative">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                ICT Account Provisioning Engine
              </span>
              <h3 className="text-lg font-black text-white">
                Create Assigned Account for {selectedRoleToCreate.replace(/_/g, ' ').toUpperCase()}
              </h3>
              <p className="text-xs text-purple-200 mt-0.5">
                The system assigns a unique Login PIN and Password to the account.
              </p>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="p-6 sm:p-8 space-y-4">
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Role / Assigned Duty
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(
                    [
                      'student',
                      'lecturer',
                      'hod_nursing',
                      'exam_officer',
                      'registrar',
                      'provost',
                      'bursar',
                      'accountant',
                      'admission_officer',
                      'super_admin',
                    ] as UserRole[]
                  ).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleOpenCreateModal(r)}
                      className={`p-2 rounded-xl text-center text-xs font-bold capitalize transition-colors cursor-pointer ${
                        selectedRoleToCreate === r
                          ? 'bg-emerald-800 text-white shadow'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Fields: Name, Email, ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name (with Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      selectedRoleToCreate === 'student'
                        ? 'e.g. Mary Torkwase Terungwa'
                        : 'e.g. Dr. Joseph U. Anongo'
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@student.labecollege.edu.ng"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {selectedRoleToCreate === 'student' ? 'Matric / Admission Number' : 'Staff ID Number'}
                  </label>
                  <input
                    type="text"
                    value={identifierNumber}
                    onChange={(e) => setIdentifierNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student / Staff Official Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08126799565"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Will be displayed on staff directory and portal header
                  </span>
                </div>
              </div>

              {/* Student Specific Fields: Parent Phone & Accommodation & Course/Level */}
              {selectedRoleToCreate === 'student' && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4 text-xs">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest block">
                    Student Details &amp; Accommodation
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Course / Programme</label>
                      <select
                        value={courseOrProgramme}
                        onChange={(e) => setCourseOrProgramme(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-emerald-950"
                      >
                        <option value="ND Nursing Science">ND Nursing Science (Sole Programme)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Academic Level</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      >
                        <option value={100}>ND 1</option>
                        <option value={200}>ND 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Parent / Guardian Phone Number
                      </label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="08126799565"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Accommodation Status (Staying Hostel or Off-Campus)
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-600 flex-1">
                        <input
                          type="radio"
                          name="accommodation"
                          checked={accommodationStatus === 'Hostel'}
                          onChange={() => setAccommodationStatus('Hostel')}
                          className="text-emerald-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Staying in College Hostel</p>
                          <p className="text-[10px] text-slate-500">On-campus diocesan hall</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-600 flex-1">
                        <input
                          type="radio"
                          name="accommodation"
                          checked={accommodationStatus === 'Off-Campus'}
                          onChange={() => setAccommodationStatus('Off-Campus')}
                          className="text-emerald-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900">Staying Off-Campus</p>
                          <p className="text-[10px] text-slate-500">Private accommodation</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Staff Specific Fields: Department & Course Allocation */}
              {selectedRoleToCreate !== 'student' && (
                <div className="space-y-3 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">
                    Staff Assignment &amp; Portfolio
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Department / Directorate</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Staff Role</label>
                      <div className="px-3 py-2 bg-emerald-100 text-emerald-950 font-bold rounded-xl border border-emerald-300 uppercase text-xs">
                        {selectedRoleToCreate.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>

                  {selectedRoleToCreate === 'lecturer' && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <label className="block font-bold text-slate-800">
                        Assign Courses to Lecturer (Click tags to toggle or edit text):
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200">
                        {COMMON_ND_COURSES.map((c) => {
                          const code = c.split(' ')[0] + ' ' + c.split(' ')[1];
                          const isAssigned = courseAssigned.includes(code);
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                if (isAssigned) {
                                  setCourseAssigned(
                                    courseAssigned
                                      .split(',')
                                      .map((s) => s.trim())
                                      .filter((s) => !s.startsWith(code))
                                      .join(', ')
                                  );
                                } else {
                                  setCourseAssigned(
                                    courseAssigned ? `${courseAssigned}, ${code}` : code
                                  );
                                }
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                isAssigned
                                  ? 'bg-emerald-800 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {isAssigned ? '✓ ' : '+ '}
                              {c}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        value={courseAssigned}
                        onChange={(e) => setCourseAssigned(e.target.value)}
                        placeholder="e.g. NUR 101, ANA 101, PHY 101"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* System Credentials Assignment */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-widest block">
                  System Security Credentials (Assigned by ICT)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Assigned Login PIN (4-Digit)
                    </label>
                    <input
                      type="text"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-emerald-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Passport Picture Upload */}
              <div>
                <ImageUploadWidget
                  label="Passport / Profile Picture Upload"
                  value={passportUrl}
                  onChange={setPassportUrl}
                  aspectRatio="square"
                  helperText="Upload official passport photo from computer or device."
                />
              </div>

              {/* Switch immediately option */}
              <label className="flex items-center gap-2.5 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={switchUponCreation}
                  onChange={(e) => setSwitchUponCreation(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded cursor-pointer"
                />
                <span>
                  Immediately switch active portal to this user upon creation (Access &amp; test features as {selectedRoleToCreate.replace(/_/g, ' ')})
                </span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Create Account & Assign PIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE MASTER SCORE SHEET MODAL */}
      {isGenerateSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-6">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                Academic Broadsheet Compiler
              </span>
              <h3 className="text-lg font-black text-white">Generate Master Score Sheet</h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Automatically compiles course CA & exam marks and distributes to all 4 officers.
              </p>
            </div>

            <form onSubmit={handleGenerateMasterSheet} className="p-6 sm:p-8 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Programme</label>
                <select
                  value={sheetProgramme}
                  onChange={(e) => setSheetProgramme(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-950"
                >
                  <option value="ND Nursing Science">ND Nursing Science (Sole Programme)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Academic Level</label>
                  <select
                    value={sheetLevel}
                    onChange={(e) => setSheetLevel(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value={100}>ND 1</option>
                    <option value={200}>ND 2</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Semester</label>
                  <select
                    value={sheetSemester}
                    onChange={(e) => setSheetSemester(e.target.value as 'First' | 'Second')}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="First">First Semester</option>
                    <option value="Second">Second Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session</label>
                <input
                  type="text"
                  value={sheetSession}
                  onChange={(e) => setSheetSession(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-amber-700" /> Multi-Officer Distribution:
                </span>
                <p className="text-[11px]">
                  This sheet will be distributed simultaneously to:
                  <strong className="block text-slate-900">
                    1. HOD Nursing • 2. Exam Officer • 3. Registrar • 4. Provost
                  </strong>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateSheetModalOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>Generate & Distribute Sheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PASSWORD CHANGE MODAL FOR ADMIN */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="bg-slate-900 text-white p-6">
              <h3 className="text-base font-bold text-white">Reset User Password</h3>
              <p className="text-xs text-slate-400">
                {editingUser.displayName} ({editingUser.identifierNumber})
              </p>
            </div>

            <form onSubmit={handleSavePasswordChange} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="text"
                  required
                  value={newPasswordForUser}
                  onChange={(e) => setNewPasswordForUser(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF ROLE, COURSES, PHONE & PORTFOLIO MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 relative">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                Staff Portfolio &amp; Role Management
              </span>
              <h3 className="text-xl font-black text-white">
                Edit Staff: {editingStaff.displayName}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Assign new role (e.g. Provost, Bursar, Lecturer), update courses, change phone numbers, and grant feature access.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Change / Assign Staff Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      'provost',
                      'registrar',
                      'bursar',
                      'lecturer',
                      'hod_nursing',
                      'exam_officer',
                      'admission_officer',
                      'accountant',
                      'super_admin',
                      'student',
                    ] as UserRole[]
                  ).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setEditStaffRole(r);
                        if (r === 'provost' && !editStaffDept) setEditStaffDept("Provost's Office");
                        if (r === 'registrar' && !editStaffDept) setEditStaffDept('Academic Registry');
                        if (r === 'bursar' && !editStaffDept) setEditStaffDept('Finance & Bursary Directorate');
                        if (r === 'lecturer' && !editStaffDept) setEditStaffDept('Department of Nursing Sciences');
                      }}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold capitalize transition-all cursor-pointer border ${
                        editStaffRole === r
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/50'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {r.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Staff Full Name (with Titles)
                  </label>
                  <input
                    type="text"
                    value={editStaffName}
                    onChange={(e) => setEditStaffName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Staff Phone Number (Displayed on Staff List)
                  </label>
                  <input
                    type="tel"
                    value={editStaffPhone}
                    onChange={(e) => setEditStaffPhone(e.target.value)}
                    placeholder="08126799565"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Staff ID / Matric Number
                  </label>
                  <input
                    type="text"
                    value={editStaffId}
                    onChange={(e) => setEditStaffId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Department / Directorate
                  </label>
                  <input
                    type="text"
                    value={editStaffDept}
                    onChange={(e) => setEditStaffDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Courses Assigned Section (Prominent for lecturer or any role) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">
                    Courses Assigned to Staff (ND Nursing Science)
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Click course badge to toggle
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200">
                  {COMMON_ND_COURSES.map((c) => {
                    const code = c.split(' ')[0] + ' ' + c.split(' ')[1];
                    const isSelected = editStaffCourses.includes(code);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setEditStaffCourses(
                              editStaffCourses
                                .split(',')
                                .map((s) => s.trim())
                                .filter((s) => !s.startsWith(code))
                                .join(', ')
                            );
                          } else {
                            setEditStaffCourses(
                              editStaffCourses ? `${editStaffCourses}, ${code}` : code
                            );
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {c}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={editStaffCourses}
                  onChange={(e) => setEditStaffCourses(e.target.value)}
                  placeholder="e.g. NUR 101 Foundations of Nursing, ANA 101 Gross Anatomy"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              {/* Security Credentials */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-purple-50/60 rounded-xl border border-purple-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login PIN (4-Digit)</label>
                  <input
                    type="text"
                    value={editStaffPin}
                    onChange={(e) => setEditStaffPin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-purple-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Password</label>
                  <input
                    type="text"
                    value={editStaffPassword}
                    onChange={(e) => setEditStaffPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveStaffEdit(false)}
                  className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Save Staff Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveStaffEdit(true)}
                  className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  title="Save and immediately log in as this user to access their role features"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-950" />
                  <span>Save &amp; Access {editStaffRole.replace(/_/g, ' ').toUpperCase()} Features</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Application & Document Inspection Modal */}
      {selectedApplicant && (
        <ApplicantInspectionModal
          applicant={selectedApplicant}
          viewerRoleTitle="System Administrator Audit"
          onClose={() => setSelectedApplicant(null)}
          onUpdateStatus={async (id, status, notes) => {
            await updateApplicantStatus(id, status, notes);
            setSelectedApplicant((prev) => (prev ? { ...prev, admissionStatus: status } : null));
          }}
        />
      )}

      {/* Quick Print Application PDF Modal */}
      {quickPrintApplicant && (
        <PrintableApplicationFormModal
          applicant={quickPrintApplicant}
          onClose={() => setQuickPrintApplicant(null)}
        />
      )}
    </div>
  );
};
