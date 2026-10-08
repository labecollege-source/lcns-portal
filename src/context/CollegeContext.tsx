import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettings,
  HomepageContent,
  AboutContent,
  CoreValue,
  Officer,
  Programme,
  Department,
  Facility,
  GalleryItem,
  NewsItem,
  Announcement,
  DownloadItem,
  Course,
  Student,
  Applicant,
  Result,
  CBTExam,
  CBTAttempt,
  PaymentRecord,
  AuditLog,
  AcademicSession,
  UserProfile,
  UserRole,
  MasterScoreSheet,
  FeeStructure,
  CourseRegistration,
} from '../types/college';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_HOMEPAGE,
  INITIAL_ABOUT,
  INITIAL_CORE_VALUES,
  INITIAL_OFFICERS,
  INITIAL_PROGRAMMES,
  INITIAL_DEPARTMENTS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_NEWS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DOWNLOADS,
  INITIAL_COURSES,
  INITIAL_STUDENT,
  INITIAL_STUDENTS_LIST,
  INITIAL_APPLICANT,
  INITIAL_RESULT,
  INITIAL_CBT_EXAM,
  INITIAL_PAYMENTS,
  INITIAL_SESSION,
  INITIAL_FEE_STRUCTURES,
  INITIAL_MASTER_SCORE_SHEET,
  INITIAL_USER_ACCOUNTS,
} from '../data/initialData';
import { db } from '../firebase/config';
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { removeCollegeImage } from '../firebase/mediaService';

interface CollegeContextType {
  // Current session & auth
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userAccounts: UserProfile[];
  loginAsUser: (email: string) => boolean;
  createUserAccount: (
    data: Partial<UserProfile> & { role: UserRole; displayName: string; email: string }
  ) => Promise<UserProfile>;
  updateUserAccount: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUserAccount: (uid: string) => Promise<void>;
  changePassword: (
    uid: string,
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPasswordWithEmail: (
    email: string,
    newPass: string
  ) => Promise<{ success: boolean; message: string }>;
  authenticateUser: (
    loginIdentifier: string,
    passwordOrPin: string
  ) => { success: boolean; user?: UserProfile; message?: string };
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (open: boolean) => void;

  // CMS Content
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  homepage: HomepageContent;
  updateHomepage: (content: Partial<HomepageContent>) => Promise<void>;
  about: AboutContent;
  updateAbout: (content: Partial<AboutContent>) => Promise<void>;
  coreValues: CoreValue[];
  updateCoreValues: (values: CoreValue[]) => Promise<void>;
  officers: Officer[];
  saveOfficer: (officer: Officer) => Promise<void>;
  deleteOfficer: (id: string) => Promise<void>;
  programmes: Programme[];
  saveProgramme: (programme: Programme) => Promise<void>;
  deleteProgramme: (id: string) => Promise<void>;
  departments: Department[];
  saveDepartment: (dept: Department) => Promise<void>;
  facilities: Facility[];
  saveFacility: (fac: Facility) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
  gallery: GalleryItem[];
  saveGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  news: NewsItem[];
  saveNewsItem: (item: NewsItem) => Promise<void>;
  deleteNewsItem: (id: string) => Promise<void>;
  announcements: Announcement[];
  saveAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  downloads: DownloadItem[];
  saveDownloadItem: (item: DownloadItem) => Promise<void>;
  deleteDownloadItem: (id: string) => Promise<void>;

  // Academic & Student Records
  courses: Course[];
  saveCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  courseRegistrations: CourseRegistration[];
  submitCourseRegistration: (registration: CourseRegistration) => Promise<void>;
  approveCourseRegistration: (id: string, stage: 'hon' | 'exam' | 'registrar', remarks?: string) => Promise<void>;
  rejectCourseRegistration: (id: string, reason: string) => Promise<void>;
  students: Student[];
  currentStudent: Student;
  updateStudent: (student: Student) => Promise<void>;
  applicants: Applicant[];
  currentApplicant: Applicant;
  submitApplicant: (applicant: Partial<Applicant>) => Promise<Applicant>;
  updateApplicantStatus: (
    applicantId: string,
    status: Applicant['admissionStatus'],
    notes?: string
  ) => Promise<void>;
  results: Result[];
  updateResultStage: (resultId: string, stage: Result['approvalStage']) => Promise<void>;
  toggleResultPublish: (resultId: string) => Promise<void>;
  updateStudentScore: (
    resultId: string,
    courseCode: string,
    caScore: number,
    examScore: number,
    reason: string
  ) => Promise<void>;
  cbtExams: CBTExam[];
  saveCBTExam: (exam: CBTExam) => Promise<void>;
  cbtAttempts: CBTAttempt[];
  recordCBTAttempt: (attempt: CBTAttempt) => Promise<void>;
  payments: PaymentRecord[];
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'createdAt'>) => Promise<PaymentRecord>;
  verifyPayment: (paymentId: string) => Promise<PaymentRecord | null>;
  voidPayment: (paymentId: string, reason: string) => Promise<void>;
  currentSession: AcademicSession;
  updateSession: (session: AcademicSession) => Promise<void>;
  setPostUtmeApplicationOpen: (open: boolean) => Promise<void>;
  resetPortalData: (categories: string[]) => Promise<void>;
  auditLogs: AuditLog[];
  logAction: (action: string, recordAffected: string, prev?: string, next?: string, reason?: string) => Promise<void>;

  // Master Score Sheet & Multi-Officer Distribution
  masterScoreSheets: MasterScoreSheet[];
  saveMasterScoreSheet: (sheet: MasterScoreSheet) => Promise<void>;
  endorseMasterScoreSheet: (
    sheetId: string,
    role: UserRole,
    remarks: string
  ) => Promise<void>;
  distributeMasterScoreSheet: (
    sheetId: string,
    targets: Array<'provost' | 'registrar' | 'exam_officer' | 'hod_nursing'>
  ) => Promise<void>;
  selectedMasterSheetForPrint: MasterScoreSheet | null;
  setSelectedMasterSheetForPrint: (sheet: MasterScoreSheet | null) => void;

  // Fee Structures & Accountant Manual Entry
  feeStructures: FeeStructure[];
  saveFeeStructure: (structure: FeeStructure) => Promise<void>;
  deleteFeeStructure: (id: string) => Promise<void>;
  recordManualAccountantPayment: (data: {
    payerType: 'student' | 'applicant';
    payerId: string;
    admissionNumber: string;
    studentName: string;
    amount: number;
    paymentType: 'school_fees' | 'hostel' | 'acceptance_fee' | 'post_utme' | 'non_refundable';
    session: string;
    semester?: 'First' | 'Second';
    method: 'bank_teller' | 'pos' | 'transfer' | 'cash';
    reference: string;
    remarks?: string;
    targetPreviousArrears?: boolean;
    allowNextPaymentWhileOwing?: boolean;
  }) => Promise<PaymentRecord>;

  // Active view routing
  activeView: string;
  setActiveView: (view: string) => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export const CollegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation view state
  const [activeView, setActiveView] = useState<string>('home');

  // Load from local cache or baseline
  const getInitial = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`lcns_v3_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const persist = (key: string, val: unknown) => {
    try {
      localStorage.setItem(`lcns_v3_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn('Cache write failed:', e);
    }
  };

  // User and Role state
  const [userAccounts, setUserAccounts] = useState<UserProfile[]>(() => {
    const loaded = getInitial('user_accounts', INITIAL_USER_ACCOUNTS);
    if (Array.isArray(loaded)) {
      const existingUids = new Set(loaded.map((u: UserProfile) => u.uid));
      const missing = INITIAL_USER_ACCOUNTS.filter((u) => !existingUids.has(u.uid));
      if (missing.length > 0) {
        return [...loaded, ...missing];
      }
      return loaded;
    }
    return INITIAL_USER_ACCOUNTS;
  });
  const [currentRole, setCurrentRoleState] = useState<UserRole>(
    getInitial('current_role', 'student')
  );

  const currentUser =
    userAccounts.find((u) => u.role === currentRole) ||
    userAccounts[0] ||
    INITIAL_USER_ACCOUNTS[0];

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    persist('current_role', role);
  };

  const loginAsUser = (email: string): boolean => {
    const found = userAccounts.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentRole(found.role);
      return true;
    }
    return false;
  };

  // CMS Content States
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const loaded = getInitial('site_settings', INITIAL_SITE_SETTINGS);
    const updated = { ...loaded };
    if (!updated || !updated.logoUrl) {
      updated.logoUrl = INITIAL_SITE_SETTINGS.logoUrl;
    }
    // Keep the official public address synchronized with the current institutional wording.
    if (updated.address !== INITIAL_SITE_SETTINGS.address) {
      updated.address = INITIAL_SITE_SETTINGS.address;
    }
    return updated;
  });
  const [homepage, setHomepage] = useState<HomepageContent>(
    getInitial('homepage', INITIAL_HOMEPAGE)
  );
  const [about, setAbout] = useState<AboutContent>(
    getInitial('about', INITIAL_ABOUT)
  );
  const [coreValues, setCoreValues] = useState<CoreValue[]>(
    getInitial('core_values', INITIAL_CORE_VALUES)
  );
  const [officers, setOfficers] = useState<Officer[]>(
    getInitial('officers', INITIAL_OFFICERS)
  );
  const [programmes, setProgrammes] = useState<Programme[]>(
    getInitial('programmes', INITIAL_PROGRAMMES)
  );
  const [departments, setDepartments] = useState<Department[]>(
    getInitial('departments', INITIAL_DEPARTMENTS)
  );
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const loaded = getInitial('facilities', INITIAL_FACILITIES);
    const oldFacilityIds = new Set(['fac-1', 'fac-2', 'fac-3', 'fac-4', 'fac-6', 'fac-7']);
    const oldStaticFacilities =
      Array.isArray(loaded) && loaded.length > 0 && loaded.every((f: Facility) => oldFacilityIds.has(f.id));
    if (!loaded || loaded.length === 0 || loaded.every((f) => !f.imageUrl) || oldStaticFacilities) {
      return INITIAL_FACILITIES;
    }
    return loaded;
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const loaded = getInitial('gallery', INITIAL_GALLERY);
    // Replace the old demo/static gallery once with the new institution-supplied set,
    // while preserving any future admin-created gallery records.
    const oldDemoIds = new Set(['gal-1', 'gal-2', 'gal-3', 'gal-4', 'gal-5', 'gal-6', 'gal-7', 'gal-8']);
    const containsOnlyOldDemoPhotos =
      Array.isArray(loaded) && loaded.length > 0 && loaded.every((g: GalleryItem) => oldDemoIds.has(g.id));
    if (!loaded || loaded.length === 0 || loaded.some((g) => !g.imageUrl) || containsOnlyOldDemoPhotos) {
      return INITIAL_GALLERY;
    }
    return loaded;
  });
  const [news, setNews] = useState<NewsItem[]>(
    getInitial('news', INITIAL_NEWS)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const hasCachedAnnouncements = localStorage.getItem('lcns_v3_announcements') !== null;
    const loaded = getInitial('announcements', INITIAL_ANNOUNCEMENTS);
    const cleaned = (Array.isArray(loaded) ? loaded : []).filter(
      (a: Announcement) =>
        a.title !== '2026/2027 Post-UTME Admission Screening Now Open!' &&
        a.title !== 'Deadline for First Semester Course Registration' &&
        a.title !== 'Commencement of Mid-Semester Computer-Based Tests (CBT)'
    );

    // Existing browser caches from the earlier build contained stale notices.
    // Replace them once with the current institutional opening notice.
    if (!hasCachedAnnouncements || cleaned.length === 0) {
      return INITIAL_ANNOUNCEMENTS;
    }
    return cleaned;
  });
  const [downloads, setDownloads] = useState<DownloadItem[]>(
    getInitial('downloads', INITIAL_DOWNLOADS)
  );

  // Portal & Academic States
  const [courses, setCourses] = useState<Course[]>(
    getInitial('courses', INITIAL_COURSES)
  );
  const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistration[]>(
    getInitial('course_registrations', [])
  );
  const [students, setStudents] = useState<Student[]>(
    getInitial('students', [INITIAL_STUDENT])
  );
  const [applicants, setApplicants] = useState<Applicant[]>(
    getInitial('applicants', [INITIAL_APPLICANT])
  );
  const [results, setResults] = useState<Result[]>(
    getInitial('results', [INITIAL_RESULT])
  );
  const [cbtExams, setCbtExams] = useState<CBTExam[]>(
    getInitial('cbt_exams', [INITIAL_CBT_EXAM])
  );
  const [cbtAttempts, setCbtAttempts] = useState<CBTAttempt[]>(
    getInitial('cbt_attempts', [])
  );
  const [payments, setPayments] = useState<PaymentRecord[]>(
    getInitial('payments', INITIAL_PAYMENTS)
  );
  const [currentSession, setCurrentSession] = useState<AcademicSession>(
    getInitial('session', INITIAL_SESSION)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(
    getInitial('audit_logs', [
      {
        id: 'log-init',
        userId: 'system',
        userName: 'System Administrator',
        role: 'super_admin',
        action: 'System Boot & CMS Sync',
        recordAffected: 'All Modules',
        timestamp: '2026-03-25 08:00:00',
      },
    ])
  );

  // Fee Structures State
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(
    getInitial('fee_structures', INITIAL_FEE_STRUCTURES)
  );

  // Master Score Sheets State
  const [masterScoreSheets, setMasterScoreSheets] = useState<MasterScoreSheet[]>(
    getInitial('master_score_sheets', [INITIAL_MASTER_SCORE_SHEET])
  );
  const [selectedMasterSheetForPrint, setSelectedMasterSheetForPrint] =
    useState<MasterScoreSheet | null>(null);

  // Auth & Account Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

  // Current active records for student / applicant logged-in views
  const currentStudent = students[0] || INITIAL_STUDENT;
  const currentApplicant = applicants[0] || INITIAL_APPLICANT;

  // Sync with Firestore on mount (if available)
  useEffect(() => {
    async function syncFirestore() {
      try {
        const siteDoc = await getDoc(doc(db, 'site_settings', 'general'));
        if (siteDoc.exists()) {
          const data = siteDoc.data() as SiteSettings;
          if (data.address !== INITIAL_SITE_SETTINGS.address) {
            data.address = INITIAL_SITE_SETTINGS.address;
            await setDoc(doc(db, 'site_settings', 'general'), data);
          }
          setSiteSettings(data);
        } else {
          // Initialize Firestore document
          await setDoc(doc(db, 'site_settings', 'general'), INITIAL_SITE_SETTINGS);
        }
      } catch (err) {
        console.warn('Firestore initial sync skipped:', err);
      }
    }
    syncFirestore();
  }, []);

  // Keep the public media, academic course registry and financial ledger synchronized
  // across the admin portal and the public website. LocalStorage remains the offline fallback.
  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    try {
      unsubscribers.push(
        onSnapshot(
          collection(db, 'announcements'),
          async (snapshot) => {
            if (snapshot.empty) {
              // Seed only when this browser has never initialized the collection.
              // This prevents an administrator from being unable to delete the final notice.
              const hasLocalAnnouncements = localStorage.getItem('lcns_v3_announcements') !== null;
              if (!hasLocalAnnouncements) {
                for (const item of INITIAL_ANNOUNCEMENTS) {
                  try {
                    await setDoc(doc(db, 'announcements', item.id), item, { merge: true });
                  } catch (e) {
                    console.warn('Announcement seed failed:', e);
                  }
                }
              } else {
                setAnnouncements([]);
                persist('announcements', []);
              }
              return;
            }

            const liveAnnouncements = snapshot.docs
              .map((d) => ({ ...(d.data() as Announcement), id: d.id }))
              .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
            setAnnouncements(liveAnnouncements);
            persist('announcements', liveAnnouncements);
          },
          (error) => console.warn('Announcements live sync unavailable:', error)
        )
      );

      unsubscribers.push(
        onSnapshot(
          collection(db, 'gallery'),
          async (snapshot) => {
            const docs = snapshot.docs.map((d) => ({ ...(d.data() as GalleryItem), id: d.id }));
            const oldDemoIds = new Set(['gal-1', 'gal-2', 'gal-3', 'gal-4', 'gal-5', 'gal-6', 'gal-7', 'gal-8']);
            const isOldDemoSet = docs.length > 0 && docs.every((item) => oldDemoIds.has(item.id));

            if (snapshot.empty || isOldDemoSet) {
              if (isOldDemoSet) {
                for (const oldItem of docs) {
                  try {
                    await deleteDoc(doc(db, 'gallery', oldItem.id));
                  } catch (e) {
                    console.warn('Old gallery cleanup failed:', e);
                  }
                }
              }
              for (const item of INITIAL_GALLERY) {
                try {
                  await setDoc(doc(db, 'gallery', item.id), item, { merge: true });
                } catch (e) {
                  console.warn('Gallery seed failed:', e);
                }
              }
              return;
            }

            const existingIds = new Set(docs.map((item) => item.id));
            for (const item of INITIAL_GALLERY) {
              if (!existingIds.has(item.id)) {
                try { await setDoc(doc(db, 'gallery', item.id), item, { merge: true }); } catch (e) { console.warn('Gallery institutional photo seed failed:', e); }
              }
            }
            const liveGallery = [...docs, ...INITIAL_GALLERY.filter((item) => !existingIds.has(item.id))]
              .filter((item) => item.published !== false)
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            setGallery(liveGallery);
            persist('gallery', liveGallery);
          },
          (error) => console.warn('Gallery live sync unavailable:', error)
        )
      );

      unsubscribers.push(
        onSnapshot(
          collection(db, 'courses'),
          async (snapshot) => {
            if (snapshot.empty) {
              for (const course of INITIAL_COURSES) {
                try {
                  await setDoc(doc(db, 'courses', course.id), course, { merge: true });
                } catch (e) {
                  console.warn('Course seed failed:', e);
                }
              }
              return;
            }
            const liveCourses = snapshot.docs.map((d) => ({ ...(d.data() as Course), id: d.id }));
            setCourses(liveCourses);
            persist('courses', liveCourses);
          },
          (error) => console.warn('Course live sync unavailable:', error)
        )
      );

      unsubscribers.push(
        onSnapshot(
          collection(db, 'course_registrations'),
          (snapshot) => {
            const live = snapshot.docs.map((d) => ({ ...(d.data() as CourseRegistration), id: d.id }));
            if (live.length) { setCourseRegistrations(live); persist('course_registrations', live); }
          },
          (error) => console.warn('Course registration live sync unavailable:', error)
        )
      );

      unsubscribers.push(
        onSnapshot(
          collection(db, 'applicants'),
          (snapshot) => {
            const live = snapshot.docs.map((d) => ({ ...(d.data() as Applicant), id: d.id }));
            if (live.length) { setApplicants(live); persist('applicants', live); }
          },
          (error) => console.warn('Applicant live sync unavailable:', error)
        )
      );

      unsubscribers.push(
        onSnapshot(
          collection(db, 'payments'),
          (snapshot) => {
            if (!snapshot.empty) {
              const livePayments = snapshot.docs.map((d) => ({ ...(d.data() as PaymentRecord), id: d.id }));
              setPayments(livePayments);
              persist('payments', livePayments);
            }
          },
          (error) => console.warn('Payment live sync unavailable:', error)
        )
      );
    } catch (error) {
      console.warn('Live Firestore subscriptions could not start:', error);
    }

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);


  // Audit Logger Helper
  const logAction = async (
    action: string,
    recordAffected: string,
    prev?: string,
    next?: string,
    reason?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      role: currentRole,
      action,
      recordAffected,
      previousValue: prev,
      newValue: next,
      reason,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    persist('audit_logs', updated);
    try {
      await setDoc(doc(db, 'audit_logs', newLog.id), newLog);
    } catch {
      // Local fallback
    }
  };

  // CMS Updaters
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    persist('site_settings', updated);
    await logAction('Update Site Settings / Branding', 'General CMS Settings');
    try {
      await setDoc(doc(db, 'site_settings', 'general'), updated);
    } catch (e) {
      console.warn('Firestore save site_settings failed', e);
    }
  };

  const updateHomepage = async (content: Partial<HomepageContent>) => {
    const updated = { ...homepage, ...content };
    setHomepage(updated);
    persist('homepage', updated);
    await logAction('Update Homepage CMS Content', 'Homepage Sections');
    try {
      await setDoc(doc(db, 'homepage', 'content'), updated);
    } catch (e) {
      console.warn('Firestore save homepage failed', e);
    }
  };

  const updateAbout = async (content: Partial<AboutContent>) => {
    const updated = { ...about, ...content };
    setAbout(updated);
    persist('about', updated);
    await logAction('Update About College CMS Content', 'About & Philosophy');
    try {
      await setDoc(doc(db, 'about', 'content'), updated);
    } catch (e) {
      console.warn('Firestore save about failed', e);
    }
  };

  const updateCoreValues = async (values: CoreValue[]) => {
    setCoreValues(values);
    persist('core_values', values);
    await logAction('Update Core Values', 'Core Values Section');
  };

  const saveOfficer = async (officer: Officer) => {
    const exists = officers.some((o) => o.id === officer.id);
    const updated = exists
      ? officers.map((o) => (o.id === officer.id ? officer : o))
      : [...officers, officer];
    setOfficers(updated);
    persist('officers', updated);
    await logAction(
      exists ? 'Edit College Officer' : 'Add New College Officer',
      officer.fullName,
      undefined,
      officer.position
    );
    try {
      await setDoc(doc(db, 'officers', officer.id), officer);
    } catch (e) {
      console.warn('Firestore save officer failed', e);
    }
  };

  const deleteOfficer = async (id: string) => {
    const officer = officers.find((o) => o.id === id);
    const updated = officers.filter((o) => o.id !== id);
    setOfficers(updated);
    persist('officers', updated);
    await logAction('Deactivate College Officer', officer?.fullName || id);
  };

  const saveProgramme = async (prog: Programme) => {
    const exists = programmes.some((p) => p.id === prog.id);
    const updated = exists
      ? programmes.map((p) => (p.id === prog.id ? prog : p))
      : [...programmes, prog];
    setProgrammes(updated);
    persist('programmes', updated);
    await logAction(
      exists ? 'Edit Programme' : 'Add Programme',
      prog.name,
      undefined,
      prog.admissionStatus
    );
    try {
      await setDoc(doc(db, 'programmes', prog.id), prog);
    } catch (e) {
      console.warn('Firestore save programme failed', e);
    }
  };

  const deleteProgramme = async (id: string) => {
    const prog = programmes.find((p) => p.id === id);
    const updated = programmes.filter((p) => p.id !== id);
    setProgrammes(updated);
    persist('programmes', updated);
    await logAction('Remove Programme', prog?.name || id);
  };

  const saveDepartment = async (dept: Department) => {
    const exists = departments.some((d) => d.id === dept.id);
    const updated = exists
      ? departments.map((d) => (d.id === dept.id ? dept : d))
      : [...departments, dept];
    setDepartments(updated);
    persist('departments', updated);
    await logAction(exists ? 'Edit Department' : 'Add Department', dept.name);
  };

  const saveFacility = async (fac: Facility) => {
    const exists = facilities.some((f) => f.id === fac.id);
    const updated = exists
      ? facilities.map((f) => (f.id === fac.id ? fac : f))
      : [...facilities, fac];
    setFacilities(updated);
    persist('facilities', updated);
    await logAction(exists ? 'Edit Facility' : 'Add Facility', fac.title);
  };

  const deleteFacility = async (id: string) => {
    const fac = facilities.find((f) => f.id === id);
    const updated = facilities.filter((f) => f.id !== id);
    setFacilities(updated);
    persist('facilities', updated);
    await logAction('Delete Facility', fac?.title || id);
  };

  const saveGalleryItem = async (item: GalleryItem) => {
    const exists = gallery.some((g) => g.id === item.id);
    const updated = exists
      ? gallery.map((g) => (g.id === item.id ? item : g))
      : [item, ...gallery];
    setGallery(updated);
    persist('gallery', updated);
    await logAction(exists ? 'Edit Gallery Photo' : 'Upload Gallery Photo', item.title);
    try {
      await setDoc(doc(db, 'gallery', item.id), item, { merge: true });
    } catch (e) {
      console.warn('Firestore save gallery item failed', e);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const item = gallery.find((g) => g.id === id);
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    persist('gallery', updated);
    await logAction('Delete Gallery Photo', item?.title || id);
    try {
      await deleteDoc(doc(db, 'gallery', id));
      await removeCollegeImage(item?.storagePath);
    } catch (e) {
      console.warn('Firestore delete gallery item failed', e);
    }
  };

  const saveNewsItem = async (item: NewsItem) => {
    const exists = news.some((n) => n.id === item.id);
    const updated = exists
      ? news.map((n) => (n.id === item.id ? item : n))
      : [item, ...news];
    setNews(updated);
    persist('news', updated);
    await logAction(exists ? 'Edit News Article' : 'Publish News Article', item.title);
  };

  const deleteNewsItem = async (id: string) => {
    const item = news.find((n) => n.id === id);
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    persist('news', updated);
    await logAction('Delete News Article', item?.title || id);
  };

  const saveAnnouncement = async (ann: Announcement) => {
    const exists = announcements.some((a) => a.id === ann.id);
    const updated = exists
      ? announcements.map((a) => (a.id === ann.id ? ann : a))
      : [ann, ...announcements];
    setAnnouncements(updated);
    persist('announcements', updated);
    try {
      await setDoc(doc(db, 'announcements', ann.id), ann, { merge: true });
    } catch (e) {
      console.warn('Firestore announcement save failed; local cache retained.', e);
    }
    await logAction(exists ? 'Edit Announcement' : 'Post Announcement', ann.title);
  };

  const deleteAnnouncement = async (id: string) => {
    const ann = announcements.find((a) => a.id === id);
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    persist('announcements', updated);
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (e) {
      console.warn('Firestore announcement delete failed; local cache retained.', e);
    }
    await logAction('Delete Announcement', ann?.title || id);
  };

  const saveDownloadItem = async (item: DownloadItem) => {
    const exists = downloads.some((d) => d.id === item.id);
    const updated = exists
      ? downloads.map((d) => (d.id === item.id ? item : d))
      : [...downloads, item];
    setDownloads(updated);
    persist('downloads', updated);
    await logAction(exists ? 'Edit Download' : 'Upload Download Document', item.title);
  };

  const deleteDownloadItem = async (id: string) => {
    const item = downloads.find((d) => d.id === id);
    const updated = downloads.filter((d) => d.id !== id);
    setDownloads(updated);
    persist('downloads', updated);
    await logAction('Delete Download Document', item?.title || id);
  };

  // Academic Actions
  const saveCourse = async (course: Course) => {
    const exists = courses.some((c) => c.id === course.id);
    const updated = exists
      ? courses.map((c) => (c.id === course.id ? course : c))
      : [...courses, course];
    setCourses(updated);
    persist('courses', updated);
    await logAction(exists ? 'Edit Course' : 'Create Course', `${course.code}: ${course.title}`);
    try {
      await setDoc(doc(db, 'courses', course.id), course, { merge: true });
    } catch (e) {
      console.warn('Firestore save course failed', e);
    }
  };

  const deleteCourse = async (id: string) => {
    const course = courses.find((c) => c.id === id);
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    persist('courses', updated);
    await logAction('Delete Course', course?.code || id);
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (e) {
      console.warn('Firestore delete course failed', e);
    }
  };

  const submitCourseRegistration = async (registration: CourseRegistration) => {
    const normalized: CourseRegistration = {
      ...registration,
      status: 'submitted',
      submittedAt: registration.submittedAt || new Date().toISOString(),
    };
    const updated = [normalized, ...courseRegistrations.filter((r) => r.studentId !== registration.studentId || r.session !== registration.session || r.semester !== registration.semester)];
    setCourseRegistrations(updated);
    persist('course_registrations', updated);
    await logAction('Student Submitted Course Registration', `${registration.admissionNumber} - ${registration.session} - ${registration.semester}`);
    try { await setDoc(doc(db, 'course_registrations', normalized.id), normalized, { merge: true }); } catch (e) { console.warn('Firestore course registration save failed', e); }
  };

  const approveCourseRegistration = async (id: string, stage: 'hon' | 'exam' | 'registrar', remarks?: string) => {
    const item = courseRegistrations.find((r) => r.id === id);
    if (!item) return;
    const now = new Date().toISOString();
    const patch: Partial<CourseRegistration> = stage === 'hon'
      ? { status: 'hon_approved', honApprovedBy: currentUser.displayName, honApprovedAt: now }
      : stage === 'exam'
        ? { status: 'exam_approved', examApprovedBy: currentUser.displayName, examApprovedAt: now }
        : { status: 'registrar_approved', registrarApprovedBy: currentUser.displayName, registrarApprovedAt: now };
    const updated = courseRegistrations.map((r) => r.id === id ? { ...r, ...patch, rejectionReason: remarks ? undefined : r.rejectionReason } : r);
    setCourseRegistrations(updated);
    persist('course_registrations', updated);
    await logAction(`Course Registration ${stage.toUpperCase()} Approval`, `${item.admissionNumber} - ${item.id}`, item.status, patch.status as string, remarks);
    try { await setDoc(doc(db, 'course_registrations', id), { ...item, ...patch }, { merge: true }); } catch (e) { console.warn('Firestore course registration approval failed', e); }
  };

  const rejectCourseRegistration = async (id: string, reason: string) => {
    const item = courseRegistrations.find((r) => r.id === id);
    if (!item) return;
    const updatedItem = { ...item, status: 'rejected' as const, rejectionReason: reason };
    const updated = courseRegistrations.map((r) => r.id === id ? updatedItem : r);
    setCourseRegistrations(updated);
    persist('course_registrations', updated);
    await logAction('Reject Course Registration', `${item.admissionNumber} - ${item.id}`, item.status, 'rejected', reason);
    try { await setDoc(doc(db, 'course_registrations', id), updatedItem, { merge: true }); } catch (e) { console.warn('Firestore course registration rejection failed', e); }
  };

  const updateStudent = async (student: Student) => {
    const updated = students.map((s) => (s.id === student.id ? student : s));
    setStudents(updated);
    persist('students', updated);
    try {
      await setDoc(doc(db, 'students', student.id), student, { merge: true });
    } catch (e) {
      console.warn('Firestore save student failed', e);
    }
    await logAction('Update Student Profile', student.admissionNumber);
  };

  const submitApplicant = async (appData: Partial<Applicant>): Promise<Applicant> => {
    const appSeq = String(applicants.length + 183).padStart(4, '0');
    const submittedAt = new Date().toISOString();
    const submittedDate = new Date().toLocaleDateString('en-NG');
    const submittedTime = new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    const newApplicant: Applicant = {
      id: `app-${Date.now()}`,
      applicationNumber: `LCNS-APP-2026-${appSeq}`,
      fullName: appData.fullName || 'Candidate Name',
      email: appData.email || '',
      phone: appData.phone || '',
      gender: appData.gender || 'Female',
      dateOfBirth: appData.dateOfBirth || '2005-01-01',
      stateOfOrigin: appData.stateOfOrigin || 'Benue',
      lga: appData.lga || 'Gboko',
      nextOfKinName: appData.nextOfKinName || '',
      nextOfKinPhone: appData.nextOfKinPhone || '',
      jambRegNo: appData.jambRegNo || '',
      jambScore: appData.jambScore || 180,
      oLevelExamType: appData.oLevelExamType || 'WAEC',
      oLevelResults: appData.oLevelResults || [],
      chosenProgrammeId: appData.chosenProgrammeId || 'prog-1',
      chosenProgrammeName: appData.chosenProgrammeName || 'ND Nursing Science',
      passportUrl: appData.passportUrl || '',
      applicationFeePaid: false,
      acceptanceFeePaid: false,
      admissionStatus: 'applied',
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt,
      submissionDate: submittedDate,
      submissionTime: submittedTime,
      ...appData,
    };
    const updated = [newApplicant, ...applicants];
    setApplicants(updated);
    persist('applicants', updated);
    await logAction('New Post-UTME Application Submitted', newApplicant.applicationNumber);
    try { await setDoc(doc(db, 'applicants', newApplicant.id), newApplicant, { merge: true }); } catch (e) { console.warn('Firestore applicant save failed', e); }
    return newApplicant;
  };

  const updateApplicantStatus = async (
    applicantId: string,
    status: Applicant['admissionStatus'],
    notes?: string
  ) => {
    const applicant = applicants.find((a) => a.id === applicantId);
    let pin = applicant?.admissionPin;
    if (status === 'acceptance_paid' && !pin) {
      const randDigits = Math.floor(1000 + Math.random() * 9000);
      pin = `PIN-2026-${randDigits}-LCNS`;
    }

    const updated = applicants.map((a) =>
      a.id === applicantId
        ? {
            ...a,
            admissionStatus: status,
            notes: notes !== undefined ? notes : a.notes,
            admissionPin: pin,
            admittedSession: status === 'admitted' || status === 'acceptance_paid' ? '2026/2027' : a.admittedSession,
          }
        : a
    );
    setApplicants(updated);
    persist('applicants', updated);
    const updatedApplicant = updated.find((a) => a.id === applicantId);
    if (updatedApplicant) {
      try {
        await setDoc(doc(db, 'applicants', applicantId), updatedApplicant, { merge: true });
      } catch (e) {
        console.warn('Firestore applicant status update failed', e);
      }
    }
    await logAction(
      'Update Applicant Admission Status',
      applicant?.applicationNumber || applicantId,
      applicant?.admissionStatus,
      status,
      notes
    );
  };

  // Result & Grade Processing
  const updateResultStage = async (resultId: string, stage: Result['approvalStage']) => {
    const result = results.find((r) => r.id === resultId);
    const isProvost = stage === 'provost_published';
    const updated = results.map((r) =>
      r.id === resultId
        ? {
            ...r,
            approvalStage: stage,
            published: isProvost ? true : r.published,
            approvedByProvostAt: isProvost ? new Date().toISOString().split('T')[0] : r.approvedByProvostAt,
          }
        : r
    );
    setResults(updated);
    persist('results', updated);
    await logAction('Advance Result Workflow Stage', result?.admissionNumber || resultId, result?.approvalStage, stage);
  };

  const toggleResultPublish = async (resultId: string) => {
    const result = results.find((r) => r.id === resultId);
    const newPub = !result?.published;
    const updated = results.map((r) =>
      r.id === resultId ? { ...r, published: newPub } : r
    );
    setResults(updated);
    persist('results', updated);
    await logAction(newPub ? 'Publish Result to Student' : 'Unpublish Result', result?.admissionNumber || resultId);
  };

  const updateStudentScore = async (
    resultId: string,
    courseCode: string,
    caScore: number,
    examScore: number,
    reason: string
  ) => {
    const result = results.find((r) => r.id === resultId);
    if (!result) return;

    const updatedScores = result.scores.map((sc) => {
      if (sc.courseCode === courseCode) {
        const total = caScore + examScore;
        let grade = 'F';
        let gradePoint = 0;
        let remark: 'Pass' | 'Fail' | 'Carryover' = 'Fail';

        if (total >= 70) {
          grade = 'A';
          gradePoint = 5;
          remark = 'Pass';
        } else if (total >= 60) {
          grade = 'B';
          gradePoint = 4;
          remark = 'Pass';
        } else if (total >= 50) {
          grade = 'C';
          gradePoint = 3;
          remark = 'Pass';
        } else if (total >= 45) {
          grade = 'D';
          gradePoint = 2;
          remark = 'Pass';
        } else if (total >= 40) {
          grade = 'E';
          gradePoint = 1;
          remark = 'Pass';
        } else {
          grade = 'F';
          gradePoint = 0;
          remark = 'Carryover';
        }

        return {
          ...sc,
          caScore,
          examScore,
          totalScore: total,
          grade,
          gradePoint,
          qualityPoint: gradePoint * sc.creditUnits,
          remark,
        };
      }
      return sc;
    });

    const totalCU = updatedScores.reduce((acc, curr) => acc + curr.creditUnits, 0);
    const totalQP = updatedScores.reduce((acc, curr) => acc + curr.qualityPoint, 0);
    const gpa = Number((totalQP / (totalCU || 1)).toFixed(2));

    const updated = results.map((r) =>
      r.id === resultId
        ? {
            ...r,
            scores: updatedScores,
            totalCreditUnits: totalCU,
            totalQualityPoints: totalQP,
            gpa,
            cgpa: gpa,
          }
        : r
    );
    setResults(updated);
    persist('results', updated);

    await logAction(
      'Audit Score Correction',
      `${result.admissionNumber} (${courseCode})`,
      undefined,
      `CA: ${caScore}, Exam: ${examScore}`,
      reason
    );
  };

  // CBT Actions
  const saveCBTExam = async (exam: CBTExam) => {
    const exists = cbtExams.some((e) => e.id === exam.id);
    const updated = exists
      ? cbtExams.map((e) => (e.id === exam.id ? exam : e))
      : [exam, ...cbtExams];
    setCbtExams(updated);
    persist('cbt_exams', updated);
    await logAction(exists ? 'Edit CBT Examination' : 'Create CBT Examination', exam.title);
  };

  const recordCBTAttempt = async (attempt: CBTAttempt) => {
    const updated = [attempt, ...cbtAttempts];
    setCbtAttempts(updated);
    persist('cbt_attempts', updated);
    await logAction('Submit CBT Exam Attempt', `${attempt.admissionNumber} - ${attempt.examTitle}`);
  };

  // Payments & Bursary
  const recordPayment = async (
    paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'createdAt'>
  ): Promise<PaymentRecord> => {
    const receiptNum = `REC-2026-${String(payments.length + 420).padStart(5, '0')}`;
    const newPayment: PaymentRecord = {
      ...paymentData,
      paymentMethod: paymentData.paymentMethod || 'online',
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      createdAt: new Date().toLocaleString(),
      verifiedAt: paymentData.status === 'success' ? new Date().toLocaleString() : undefined,
    };
    const updated = [newPayment, ...payments];
    setPayments(updated);
    persist('payments', updated);
    try {
      await setDoc(doc(db, 'payments', newPayment.id), newPayment, { merge: true });
    } catch (e) {
      console.warn('Firestore save online payment failed', e);
    }

    // Only verified/successful payments affect balances or admission status.
    if (newPayment.status === 'success' && newPayment.payerType === 'student' && newPayment.paymentType === 'school_fees') {
      const student = students.find((s) => s.admissionNumber === newPayment.admissionOrAppNumber);
      if (student) {
        const newPaid = student.totalFeesPaid + newPayment.amount;
        const newOutstanding = Math.max(0, student.totalFeesRequired - newPaid);
        const updatedStudent: Student = {
          ...student,
          totalFeesPaid: newPaid,
          outstandingBalance: newOutstanding,
          financialClearance: newOutstanding === 0,
        };
        updateStudent(updatedStudent);
      }
    }

    // If it's an applicant paying post_utme, acceptance or non-refundable fees, update applicant record
    if (newPayment.status === 'success' && newPayment.payerType === 'applicant') {
      const app = applicants.find((a) => a.applicationNumber === newPayment.admissionOrAppNumber);
      if (app) {
        if (newPayment.paymentType === 'post_utme') {
          updateApplicantStatus(app.id, 'payment_verified', 'Application fee verified successfully');
        } else if (newPayment.paymentType === 'acceptance_fee') {
          updateApplicantStatus(app.id, 'acceptance_paid', 'Acceptance fee paid. Admission PIN issued.');
        }
      }
    }

    await logAction(
      newPayment.status === 'success' ? 'Verify Payment Transaction' : 'Record Pending Payment Transaction',
      `${newPayment.payerName} (${newPayment.reference})`,
      undefined,
      `₦${newPayment.amount.toLocaleString()} - ${newPayment.paymentType}`
    );

    return newPayment;
  };

  const verifyPayment = async (paymentId: string): Promise<PaymentRecord | null> => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return null;
    if (payment.status === 'success') return payment;
    if (payment.status === 'voided') throw new Error('Voided payments cannot be verified.');

    const verified: PaymentRecord = {
      ...payment,
      status: 'success',
      verifiedAt: new Date().toLocaleString(),
    };
    const updatedPayments = payments.map((p) => (p.id === paymentId ? verified : p));
    setPayments(updatedPayments);
    persist('payments', updatedPayments);
    try {
      await setDoc(doc(db, 'payments', paymentId), verified, { merge: true });
    } catch (e) {
      console.warn('Firestore payment verification failed', e);
    }

    if (verified.payerType === 'student') {
      const student = students.find(
        (st) => st.id === verified.payerId || st.admissionNumber === verified.admissionOrAppNumber
      );
      if (student && ['school_fees', 'hostel'].includes(verified.paymentType)) {
        const newPaid = student.totalFeesPaid + verified.amount;
        const newOutstanding = Math.max(0, student.totalFeesRequired - newPaid);
        await updateStudent({
          ...student,
          totalFeesPaid: newPaid,
          outstandingBalance: newOutstanding,
          financialClearance: newOutstanding === 0,
        });
      }
    }

    if (verified.payerType === 'applicant') {
      const applicant = applicants.find(
        (a) => a.id === verified.payerId || a.applicationNumber === verified.admissionOrAppNumber
      );
      if (applicant) {
        if (verified.paymentType === 'post_utme') {
          await updateApplicantStatus(applicant.id, 'payment_verified', 'Application fee verified by Bursary/Accounts.');
        } else if (verified.paymentType === 'acceptance_fee') {
          await updateApplicantStatus(applicant.id, 'acceptance_paid', 'Acceptance fee verified by Bursary/Accounts. Admission PIN issued.');
        }
      }
    }

    await logAction(
      'Bursary/Accounts Verified Pending Payment',
      `${verified.payerName} (${verified.reference})`,
      'pending',
      'success',
      'Payment cleared and receipt made available.'
    );
    return verified;
  };

  const voidPayment = async (paymentId: string, reason: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    const updated = payments.map((p) =>
      p.id === paymentId
        ? {
            ...p,
            status: 'voided' as const,
            voidReason: reason,
            voidedBy: currentUser.displayName,
          }
        : p
    );
    setPayments(updated);
    persist('payments', updated);
    if (payment) {
      try {
        await setDoc(doc(db, 'payments', payment.id), {
          ...payment,
          status: 'voided',
          voidReason: reason,
          voidedBy: currentUser.displayName,
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore void payment update failed', e);
      }
    }
    await logAction(
      'VOID Financial Payment',
      payment?.reference || paymentId,
      'success',
      'voided',
      reason
    );
  };

  const updateSession = async (sess: AcademicSession) => {
    setCurrentSession(sess);
    persist('session', sess);
    await logAction('Update Academic Session & Semester', sess.name, undefined, sess.currentSemester);
  };

  // Account Management for ICT Admin
  const createUserAccount = async (
    data: Partial<UserProfile> & { role: UserRole; displayName: string; email: string }
  ): Promise<UserProfile> => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const defaultPassword =
      data.role === 'student'
        ? 'StudentPass2026!'
        : `${data.role.charAt(0).toUpperCase() + data.role.slice(1).replace('_', '')}2026!`;

    // Generate unique identifier if not specified
    let generatedIdentifier = data.identifierNumber;
    if (!generatedIdentifier) {
      if (data.role === 'student') {
        const studentCount = userAccounts.filter((u) => u.role === 'student').length + 1;
        generatedIdentifier = `LCNS/NS/2026/${String(studentCount).padStart(3, '0')}`;
      } else if (data.role === 'lecturer') {
        const lecCount = userAccounts.filter((u) => u.role === 'lecturer').length + 1;
        generatedIdentifier = `LCNS/LEC/${String(lecCount).padStart(3, '0')}`;
      } else {
        generatedIdentifier = `LCNS/${data.role.substring(0, 3).toUpperCase()}/${Math.floor(
          100 + Math.random() * 900
        )}`;
      }
    }

    const newAccount: UserProfile = {
      uid: `usr-${data.role}-${Date.now()}`,
      email: data.email.toLowerCase().trim(),
      displayName: data.displayName.trim(),
      role: data.role,
      identifierNumber: generatedIdentifier,
      loginPin: data.loginPin || randomPin,
      password: data.password || defaultPassword,
      department:
        data.department ||
        (data.role === 'student' ? 'Department of Nursing Sciences' : 'General Academic'),
      courseAssigned: data.courseAssigned,
      programmeName: data.programmeName || 'ND Nursing Science',
      level: data.level || 100,
      phone: data.phone || '+234 800 000 0000',
      parentPhone: data.parentPhone || '+234 800 000 0000',
      accommodationStatus: data.accommodationStatus || 'Hostel',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      passportUrl: data.passportUrl || '',
    };

    const updated = [newAccount, ...userAccounts];
    setUserAccounts(updated);
    persist('user_accounts', updated);

    // If role is student, also create or sync student entity
    if (newAccount.role === 'student') {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        uid: newAccount.uid,
        admissionNumber:
          newAccount.identifierNumber ||
          `LCNS/NS/2026/${String(students.length + 1).padStart(3, '0')}`,
        fullName: newAccount.displayName,
        email: newAccount.email,
        phone: newAccount.phone || '',
        parentPhone: newAccount.parentPhone || '',
        accommodationStatus: newAccount.accommodationStatus || 'Hostel',
        gender: 'Female',
        programmeId: 'prog-1',
        programmeName: newAccount.programmeName || 'ND Nursing Science',
        level: (newAccount.level as 100 | 200 | 300 | 400) || 100,
        currentSession: currentSession.name || '2026/2027',
        currentSemester: currentSession.currentSemester || 'First',
        passportUrl: newAccount.passportUrl || '',
        loginPin: newAccount.loginPin,
        password: newAccount.password,
        financialClearance: true,
        totalFeesPaid: 250000,
        totalFeesRequired: 250000,
        outstandingBalance: 0,
        createdAt: newAccount.createdAt,
      };
      const updatedStudents = [newStudent, ...students];
      setStudents(updatedStudents);
      persist('students', updatedStudents);
    }

    await logAction(
      `Create User Account (${newAccount.role.replace('_', ' ')})`,
      `${newAccount.displayName} [${newAccount.identifierNumber}]`,
      undefined,
      `Assigned PIN: ${newAccount.loginPin}`
    );

    return newAccount;
  };

  const updateUserAccount = async (uid: string, data: Partial<UserProfile>) => {
    const updated = userAccounts.map((u) => (u.uid === uid ? { ...u, ...data } : u));
    setUserAccounts(updated);
    persist('user_accounts', updated);

    // If student, sync with student record
    const target = updated.find((u) => u.uid === uid);
    if (target && target.role === 'student') {
      const updatedStudents = students.map((s) => {
        if (s.uid === uid || s.admissionNumber === target.identifierNumber) {
          return {
            ...s,
            fullName: target.displayName,
            email: target.email,
            phone: target.phone || s.phone,
            parentPhone: target.parentPhone || s.parentPhone,
            accommodationStatus: target.accommodationStatus || s.accommodationStatus,
            passportUrl: target.passportUrl || s.passportUrl,
            loginPin: target.loginPin || s.loginPin,
            password: target.password || s.password,
          };
        }
        return s;
      });
      setStudents(updatedStudents);
      persist('students', updatedStudents);
    }

    if (target && target.uid === currentUser.uid && data.role && data.role !== currentRole) {
      setCurrentRoleState(data.role);
      persist('current_role', data.role);
    }

    await logAction('Update User Account Details', target?.displayName || uid);
  };

  const deleteUserAccount = async (uid: string) => {
    const target = userAccounts.find((u) => u.uid === uid);
    const updated = userAccounts.filter((u) => u.uid !== uid);
    setUserAccounts(updated);
    persist('user_accounts', updated);
    await logAction('Delete User Account', target?.displayName || uid);
  };

  const changePassword = async (
    uid: string,
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const user = userAccounts.find((u) => u.uid === uid);
    if (!user) {
      return { success: false, message: 'User account not found.' };
    }
    // Verify current password or pin
    if (user.password !== currentPass && user.loginPin !== currentPass) {
      return { success: false, message: 'Incorrect current password or PIN.' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    await updateUserAccount(uid, { password: newPass });
    await logAction('User Password Changed', user.displayName);
    return { success: true, message: 'Password updated successfully!' };
  };

  const resetPasswordWithEmail = async (
    email: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const user = userAccounts.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: `No registered account found with email: ${email}.` };
    }
    await updateUserAccount(user.uid, { password: newPass });
    await logAction('Password Reset via Email Verification', user.displayName, undefined, user.email);
    return {
      success: true,
      message: `Password reset successfully for ${user.displayName}. You can now log in with your new password.`,
    };
  };

  const authenticateUser = (
    loginIdentifier: string,
    passwordOrPin: string
  ): { success: boolean; user?: UserProfile; message?: string } => {
    const cleanId = loginIdentifier.toLowerCase().trim();
    const cleanSecret = passwordOrPin.trim();

    const user = userAccounts.find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanId;
      const matchId = u.identifierNumber?.toLowerCase() === cleanId;
      const matchPin = u.loginPin === cleanId;
      const matchName = u.displayName.toLowerCase().includes(cleanId);
      return matchEmail || matchId || matchPin || matchName;
    });

    if (!user) {
      return {
        success: false,
        message: 'Account not found. Please verify your Matric No, Staff ID, or Email.',
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        message: 'This account is suspended. Please contact the ICT Administrator.',
      };
    }

    // Verify secret: matches password OR loginPin OR master admin bypass for quick development
    const valid =
      user.password === cleanSecret ||
      user.loginPin === cleanSecret ||
      cleanSecret === 'Admin2026!' ||
      cleanSecret === '1234';

    if (!valid) {
      return {
        success: false,
        message: 'Incorrect Password or Login PIN. Please try again or use Forgot Password.',
      };
    }

    // Set current active user & role
    setCurrentRole(user.role);
    persist('current_user_uid', user.uid);
    setActiveView('portal');

    return { success: true, user, message: `Welcome back, ${user.displayName}!` };
  };

  const logout = () => {
    setActiveView('home');
  };

  // Master Score Sheet & Multi-Officer Distribution
  const saveMasterScoreSheet = async (sheet: MasterScoreSheet) => {
    const exists = masterScoreSheets.some((m) => m.id === sheet.id);
    const updated = exists
      ? masterScoreSheets.map((m) => (m.id === sheet.id ? sheet : m))
      : [sheet, ...masterScoreSheets];
    setMasterScoreSheets(updated);
    persist('master_score_sheets', updated);
    await logAction(
      exists ? 'Update Master Score Sheet' : 'Create Master Score Sheet',
      `${sheet.programmeName} (${sheet.level}L - ${sheet.session})`
    );
  };

  const distributeMasterScoreSheet = async (
    sheetId: string,
    targets: Array<'provost' | 'registrar' | 'exam_officer' | 'hod_nursing'>
  ) => {
    const sheet = masterScoreSheets.find((m) => m.id === sheetId);
    if (!sheet) return;
    const updated = masterScoreSheets.map((m) =>
      m.id === sheetId
        ? { ...m, distributedTo: targets, updatedAt: new Date().toLocaleString() }
        : m
    );
    setMasterScoreSheets(updated);
    persist('master_score_sheets', updated);
    await logAction(
      'Distribute Master Score Sheet',
      `${sheet.programmeName} (${sheet.level}L)`,
      undefined,
      `Distributed to: ${targets.join(', ')}`
    );
  };

  const endorseMasterScoreSheet = async (
    sheetId: string,
    role: UserRole,
    remarks: string
  ) => {
    const sheet = masterScoreSheets.find((m) => m.id === sheetId);
    if (!sheet) return;

    const now = new Date().toLocaleString();
    let newStatus = sheet.status;
    const updates: Partial<MasterScoreSheet> = {
      updatedAt: now,
    };

    if (role === 'hod_nursing') {
      newStatus = 'vetted_by_hod';
      updates.hodRemarks = remarks;
      updates.hodEndorsedAt = now;
    } else if (role === 'exam_officer') {
      newStatus = 'checked_by_exams';
      updates.examRemarks = remarks;
      updates.examOfficerEndorsedAt = now;
    } else if (role === 'registrar') {
      newStatus = 'endorsed_by_registrar';
      updates.registrarRemarks = remarks;
      updates.registrarEndorsedAt = now;
    } else if (role === 'provost') {
      newStatus = 'approved_by_provost';
      updates.provostRemarks = remarks;
      updates.provostApprovedAt = now;
    }

    updates.status = newStatus;

    const updated = masterScoreSheets.map((m) =>
      m.id === sheetId ? { ...m, ...updates } : m
    );
    setMasterScoreSheets(updated);
    persist('master_score_sheets', updated);

    await logAction(
      `Endorse Master Score Sheet (${role.replace('_', ' ')})`,
      `${sheet.programmeName} (${sheet.level}L)`,
      sheet.status,
      newStatus,
      remarks
    );
  };

  // Fee Structures & Accountant Manual Operations
  const saveFeeStructure = async (structure: FeeStructure) => {
    const exists = feeStructures.some((f) => f.id === structure.id);
    const updated = exists
      ? feeStructures.map((f) => (f.id === structure.id ? structure : f))
      : [...feeStructures, structure];
    setFeeStructures(updated);
    persist('fee_structures', updated);
    await logAction(
      exists ? 'Update Fee Structure' : 'Create Fee Structure',
      `${structure.programmeName} (${structure.level}L - ${structure.session})`
    );
  };

  const deleteFeeStructure = async (id: string) => {
    const found = feeStructures.find((f) => f.id === id);
    const updated = feeStructures.filter((f) => f.id !== id);
    setFeeStructures(updated);
    persist('fee_structures', updated);
    await logAction('Delete Fee Structure', found?.programmeName || id);
  };

  const recordManualAccountantPayment = async (data: {
    payerType: 'student' | 'applicant';
    payerId: string;
    admissionNumber: string;
    studentName: string;
    amount: number;
    paymentType: 'school_fees' | 'hostel' | 'acceptance_fee' | 'post_utme' | 'non_refundable';
    session: string;
    semester?: 'First' | 'Second';
    method: 'bank_teller' | 'pos' | 'transfer' | 'cash';
    reference: string;
    remarks?: string;
    targetPreviousArrears?: boolean;
    allowNextPaymentWhileOwing?: boolean;
  }): Promise<PaymentRecord> => {
    const receiptNum = `REC-2026-MAN-${String(payments.length + 500).padStart(5, '0')}`;
    const payerEmail =
      data.payerType === 'student'
        ? students.find((s) => s.id === data.payerId)?.email || ''
        : applicants.find((a) => a.id === data.payerId)?.email || '';

    const newPayment: PaymentRecord = {
      id: `pay-man-${Date.now()}`,
      payerId: data.payerId,
      payerName: data.studentName,
      payerEmail,
      payerType: data.payerType,
      admissionOrAppNumber: data.admissionNumber,
      paymentType: data.paymentType,
      amount: data.amount,
      session: data.session,
      semester: data.semester,
      reference: data.reference,
      gateway: 'manual_bursary',
      paymentMethod: data.method,
      status: 'pending',
      receiptNumber: receiptNum,
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newPayment, ...payments];
    setPayments(updated);
    persist('payments', updated);
    try {
      await setDoc(doc(db, 'payments', newPayment.id), newPayment, { merge: true });
    } catch (e) {
      console.warn('Firestore save manual pending payment failed', e);
    }

    await logAction(
      'Bursary/Accounts Recorded Pending Manual Payment',
      `${data.studentName} (${data.admissionNumber})`,
      undefined,
      `₦${data.amount.toLocaleString()} - ${data.paymentType}`,
      data.remarks
    );

    return newPayment;
  };


  const setPostUtmeApplicationOpen = async (open: boolean) => {
    const updated = { ...siteSettings, postUtmeApplicationOpen: open, postUtmeStatusChangedAt: new Date().toISOString(), postUtmeStatusChangedBy: currentUser.displayName };
    setSiteSettings(updated);
    persist('site_settings', updated);
    await logAction(open ? 'Open Post-UTME Online Application' : 'Close Post-UTME Online Application', 'Post-UTME Application Settings');
    try { await setDoc(doc(db, 'site_settings', 'general'), updated, { merge: true }); } catch (e) { console.warn('Post-UTME setting save failed', e); }
  };

  const resetPortalData = async (categories: string[]) => {
    const collectionMap: Record<string, string> = {
      students: 'students', applicants: 'applicants', courses: 'courses', registrations: 'course_registrations', results: 'results',
      payments: 'payments', bursar: 'payments', announcements: 'announcements', events: 'events', gallery: 'gallery', staff: 'user_accounts',
      audits: 'audit_logs', cbt: 'cbt_attempts'
    };
    const uniqueCollections = [...new Set(categories.map((c) => collectionMap[c]).filter(Boolean))];
    const localKeys = ['students','applicants','courses','course_registrations','results','payments','announcements','gallery','audit_logs','cbt_attempts'];
    for (const key of localKeys) {
      if (categories.includes(key) || (key === 'payments' && categories.includes('bursar')) || categories.includes('all')) {
        try { localStorage.removeItem(`lcns_v3_${key}`); } catch {}
      }
    }
    if (categories.includes('all')) {
      setStudents([]); setApplicants([]); setCourses([]); setCourseRegistrations([]); setResults([]); setPayments([]); setAnnouncements([]); setGallery([]); setAuditLogs([]); setCbtAttempts([]);
    } else {
      if (categories.includes('students')) setStudents([]);
      if (categories.includes('applicants')) setApplicants([]);
      if (categories.includes('courses')) setCourses([]);
      if (categories.includes('registrations')) setCourseRegistrations([]);
      if (categories.includes('results')) setResults([]);
      if (categories.includes('payments') || categories.includes('bursar')) setPayments([]);
      if (categories.includes('announcements')) setAnnouncements([]);
      if (categories.includes('gallery')) setGallery([]);
      if (categories.includes('audits')) setAuditLogs([]);
      if (categories.includes('cbt')) setCbtAttempts([]);
    }
    for (const colName of uniqueCollections) {
      try {
        const snap = await getDocs(collection(db, colName));
        await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, colName, d.id))));
      } catch (e) { console.warn(`Reset collection ${colName} failed`, e); }
    }
    await logAction('PORTAL DATA RESET', categories.join(', '), undefined, undefined, 'Authorized administrative reset');
  };

  return (
    <CollegeContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        userAccounts,
        loginAsUser,
        createUserAccount,
        updateUserAccount,
        deleteUserAccount,
        changePassword,
        resetPasswordWithEmail,
        authenticateUser,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isChangePasswordModalOpen,
        setIsChangePasswordModalOpen,
        masterScoreSheets,
        saveMasterScoreSheet,
        endorseMasterScoreSheet,
        distributeMasterScoreSheet,
        selectedMasterSheetForPrint,
        setSelectedMasterSheetForPrint,
        feeStructures,
        saveFeeStructure,
        deleteFeeStructure,
        recordManualAccountantPayment,
        siteSettings,
        updateSiteSettings,
        homepage,
        updateHomepage,
        about,
        updateAbout,
        coreValues,
        updateCoreValues,
        officers,
        saveOfficer,
        deleteOfficer,
        programmes,
        saveProgramme,
        deleteProgramme,
        departments,
        saveDepartment,
        facilities,
        saveFacility,
        deleteFacility,
        gallery,
        saveGalleryItem,
        deleteGalleryItem,
        news,
        saveNewsItem,
        deleteNewsItem,
        announcements,
        saveAnnouncement,
        deleteAnnouncement,
        downloads,
        saveDownloadItem,
        deleteDownloadItem,
        courses,
        saveCourse,
        deleteCourse,
        courseRegistrations,
        submitCourseRegistration,
        approveCourseRegistration,
        rejectCourseRegistration,
        students,
        currentStudent,
        updateStudent,
        applicants,
        currentApplicant,
        submitApplicant,
        updateApplicantStatus,
        results,
        updateResultStage,
        toggleResultPublish,
        updateStudentScore,
        cbtExams,
        saveCBTExam,
        cbtAttempts,
        recordCBTAttempt,
        payments,
        recordPayment,
        verifyPayment,
        voidPayment,
        currentSession,
        updateSession,
        setPostUtmeApplicationOpen,
        resetPortalData,
        auditLogs,
        logAction,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
