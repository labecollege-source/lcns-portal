export type UserRole =
  | 'super_admin'
  | 'provost'
  | 'registrar'
  | 'admission_officer'
  | 'exam_officer'
  | 'hod_nursing'
  | 'bursar'
  | 'accountant'
  | 'lecturer'
  | 'student'
  | 'applicant';

export interface SiteSettings {
  collegeName: string;
  shortName: string;
  motto: string;
  diocese: string;
  bishopName: string;
  address: string;
  phone: string;
  altPhone?: string;
  email: string;
  altEmail?: string;
  website: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  mapEmbedUrl?: string;
  copyrightText: string;
  logoUrl?: string;
  crestUrl?: string;
  primaryColor?: string;
  darkGreen?: string;
  goldColor?: string;
  redColor?: string;
  bishopPhotoUrl?: string;
  postUtmeApplicationOpen?: boolean;
  postUtmeStatusChangedAt?: string;
  postUtmeStatusChangedBy?: string;
}

export interface HomepageContent {
  hero: {
    heading: string;
    subheading: string;
    motto: string;
    description: string;
    heroImageUrl: string;
    buttonText: string;
    buttonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    enabled: boolean;
  };
  mottoSection: {
    learnTitle: string;
    learnDesc: string;
    serveTitle: string;
    serveDesc: string;
    saveTitle: string;
    saveDesc: string;
  };
  welcomeMessage: {
    title: string;
    provostName: string;
    provostTitle: string;
    message: string;
    imageUrl: string;
  };
}

export interface AboutContent {
  history: string;
  namedAfter: string;
  founderInfo: string;
  vision: string;
  mission: string;
  philosophyIntro: string;
  beliefs: string[];
  numberedPhilosophy: string[];
  objectives: string[];
  facilitiesDescription?: string;
  campusLocation?: string;
  colorsSummary?: Array<{ color: string; meaning: string; hex: string; role: string }>;
}

export interface CoreValue {
  id: string;
  name: string;
  description: string;
  iconName: string;
  order: number;
}

export interface Officer {
  id: string;
  fullName: string;
  position: string;
  department: string;
  biography: string;
  photographUrl: string;
  email: string;
  phone: string;
  displayOrder: number;
  active: boolean;
  role: UserRole;
}

export interface Programme {
  id: string;
  name: string;
  code: string;
  duration: string;
  entryRequirements: string;
  description: string;
  imageUrl: string;
  objectives: string[];
  admissionStatus: 'open' | 'closed';
  active: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  description: string;
  email: string;
  active: boolean;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | 'Campus'
    | 'Laboratories'
    | 'Clinical'
    | 'Matriculation'
    | 'Sports'
    | 'Ceremony'
    | 'Milestones'
    | 'Academic'
    | 'ICT'
    | 'Healthcare'
    | string;
  imageUrl: string;
  /** Firebase Storage object path when the image was uploaded through the Media Center. */
  storagePath?: string;
  caption: string;
  date: string;
  displayOrder: number;
  published: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  expiryDate?: string;
  priority: 'normal' | 'important' | 'urgent';
  active: boolean;
  linkText?: string;
  linkUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  fileFormat: string;
  downloadUrl: string;
  uploadDate: string;
  active: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  identifierNumber?: string; // Matric No or Staff ID
  loginPin?: string;
  password?: string;
  department?: string;
  courseAssigned?: string;
  assignedCourses?: string[];
  programmeName?: string;
  level?: number;
  phone?: string;
  parentPhone?: string;
  accommodationStatus?: 'Hostel' | 'Off-Campus';
  status: 'active' | 'suspended';
  firstLoginPasswordChangeRequired?: boolean;
  createdAt: string;
  passportUrl?: string;
}

export interface Applicant {
  id: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  address?: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  jambRegNo: string;
  jambScore: number;
  oLevelExamType: string;
  oLevelResults: Array<{ subject: string; grade: string }>;
  chosenProgrammeId: string;
  chosenProgrammeName: string;
  passportUrl: string;
  oLevelSlipName?: string;
  jambSlipName?: string;
  oLevelSlipUrl?: string;
  jambSlipUrl?: string;
  applicationFeePaid: boolean;
  applicationFeeRef?: string;
  acceptanceFeePaid: boolean;
  acceptanceFeeRef?: string;
  admissionPin?: string;
  admissionStatus:
    | 'applied'
    | 'payment_verified'
    | 'under_review'
    | 'eligible'
    | 'recommended_for_admission'
    | 'admitted'
    | 'acceptance_paid'
    | 'rejected';
  admittedSession?: string;
  createdAt: string;
  submittedAt?: string;
  submissionDate?: string;
  submissionTime?: string;
  notes?: string;
}

export interface Student {
  id: string;
  uid: string;
  admissionNumber: string;
  fullName: string;
  email: string;
  phone: string;
  parentPhone: string;
  accommodationStatus: 'Hostel' | 'Off-Campus';
  gender: 'Male' | 'Female';
  programmeId: string;
  programmeName: string;
  level: 100 | 200 | 300 | 400;
  currentSession: string;
  currentSemester: 'First' | 'Second';
  passportUrl: string;
  loginPin?: string;
  password?: string;
  financialClearance: boolean;
  totalFeesPaid: number;
  totalFeesRequired: number;
  outstandingBalance: number;
  previousOutstandingArrears?: number;
  currentSessionFeesDue?: number;
  createdAt: string;
}

export interface FeeStructureItem {
  id: string;
  name: string;
  amount: number;
  category: 'tuition' | 'clinical' | 'examination' | 'lab' | 'library_ict' | 'nmcn_dues' | 'hostel' | 'other';
  compulsory: boolean;
}

export interface FeeStructure {
  id: string;
  session: string;
  semester: 'First' | 'Second' | 'Full Year';
  programmeId: string;
  programmeName: string;
  level: 100 | 200 | 300 | 400;
  items: FeeStructureItem[];
  totalAmount: number;
  hostelFee: number;
  acceptanceFee: number;
  postUtmeFee: number;
  nonRefundableFee?: number;
  developmentLevy?: number;
  nmcnIndexingFee?: number;
  updatedAt: string;
  updatedBy?: string;
}

export interface MasterScoreSheetRow {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  programmeName: string;
  level: number;
  session: string;
  semester: string;
  courseScores: Record<
    string,
    { ca: number; exam: number; total: number; grade: string; gp: number; qp: number }
  >;
  totalCU: number;
  totalQP: number;
  gpa: number;
  cgpa: number;
  standing: 'Good Standing' | 'Academic Warning' | 'Probation';
  remark: string;
}

export interface MasterScoreSheet {
  id: string;
  session: string;
  semester: 'First' | 'Second';
  level: number;
  programmeId: string;
  programmeName: string;
  coursesInSheet: Array<{ code: string; title: string; cu: number }>;
  distributedTo: Array<'provost' | 'registrar' | 'exam_officer' | 'hod_nursing'>;
  status:
    | 'draft'
    | 'vetted_by_hod'
    | 'checked_by_exams'
    | 'endorsed_by_registrar'
    | 'approved_by_provost';
  rows: MasterScoreSheetRow[];
  generatedAt: string;
  updatedAt: string;
  hodRemarks?: string;
  hodEndorsedAt?: string;
  examRemarks?: string;
  examOfficerEndorsedAt?: string;
  registrarRemarks?: string;
  registrarEndorsedAt?: string;
  provostRemarks?: string;
  provostApprovedAt?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  level: 100 | 200 | 300 | 400;
  semester: 'First' | 'Second';
  creditUnits: number;
  durationHours?: number;
  assignedLecturerId?: string;
  assignedLecturerName?: string;
  type: 'compulsory' | 'elective';
  approved: boolean;
  description?: string;
}

export type CourseApprovalStatus = 'submitted' | 'hon_approved' | 'exam_approved' | 'registrar_approved' | 'rejected';

export interface CourseRegistration {
  id: string;
  studentId: string;
  admissionNumber: string;
  studentName: string;
  programmeName: string;
  session: string;
  semester: 'First' | 'Second';
  level: 100 | 200 | 300 | 400;
  courses: Array<{
    courseId: string;
    courseCode: string;
    courseTitle: string;
    creditUnits: number;
  }>;
  totalCreditUnits: number;
  status: CourseApprovalStatus;
  submittedAt: string;
  honApprovedBy?: string;
  honApprovedAt?: string;
  examApprovedBy?: string;
  examApprovedAt?: string;
  registrarApprovedBy?: string;
  registrarApprovedAt?: string;
  rejectionReason?: string;
}

export interface StudentScoreRecord {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  caScore: number; // max 30 or 40
  examScore: number; // max 70 or 60
  totalScore: number; // ca + exam
  grade: string; // A, B, C, D, E, F
  gradePoint: number; // 5, 4, 3, 2, 1, 0
  qualityPoint: number; // gradePoint * creditUnits
  remark: 'Pass' | 'Fail' | 'Carryover';
}

export interface Result {
  id: string;
  studentId: string;
  admissionNumber: string;
  studentName: string;
  programmeName: string;
  level: 100 | 200 | 300 | 400;
  session: string;
  semester: 'First' | 'Second';
  scores: StudentScoreRecord[];
  totalCreditUnits: number;
  totalQualityPoints: number;
  gpa: number;
  cgpa: number;
  approvalStage:
    | 'lecturer_submitted'
    | 'hod_approved'
    | 'exam_checked'
    | 'registrar_approved'
    | 'provost_published';
  published: boolean;
  approvedByProvostAt?: string;
}

export interface ScoreCorrectionLog {
  id: string;
  resultId: string;
  studentAdmissionNo: string;
  courseCode: string;
  previousScore: { ca: number; exam: number; total: number };
  newScore: { ca: number; exam: number; total: number };
  reason: string;
  modifiedBy: string;
  modifiedByRole: string;
  timestamp: string;
}

export interface CBTQuestion {
  id: string;
  questionText: string;
  type: 'mcq' | 'true_false';
  options: string[];
  correctOptionIndex: number;
  marks: number;
}

export interface CBTExam {
  id: string;
  title: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerId: string;
  lecturerName: string;
  durationMinutes: number;
  totalMarks: number;
  questions: CBTQuestion[];
  instructions: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: 'draft' | 'published' | 'completed';
  allowCalculator: boolean;
  maxViolationsAllowed: number;
}

export interface CBTAttempt {
  id: string;
  examId: string;
  examTitle: string;
  courseCode: string;
  studentId: string;
  admissionNumber: string;
  studentName: string;
  answers: Record<string, number>; // questionId -> chosenOptionIndex
  score: number;
  totalMarks: number;
  violationsCount: number;
  violationLogs: string[];
  status: 'in_progress' | 'submitted' | 'auto_submitted';
  startedAt: string;
  submittedAt?: string;
}

export interface PaymentRecord {
  id: string;
  payerId: string;
  payerName: string;
  payerEmail: string;
  payerType: 'applicant' | 'student';
  admissionOrAppNumber: string;
  paymentType: 'post_utme' | 'acceptance_fee' | 'school_fees' | 'hostel' | 'non_refundable';
  amount: number;
  session: string;
  semester?: 'First' | 'Second';
  reference: string;
  gateway: 'paystack' | 'manual_bursary';
  paymentMethod?: 'online' | 'bank_teller' | 'pos' | 'transfer' | 'cash';
  status: 'pending' | 'success' | 'failed' | 'voided';
  receiptNumber: string;
  verifiedAt?: string;
  voidReason?: string;
  voidedBy?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  recordAffected: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  timestamp: string;
}

export interface AcademicSession {
  id: string;
  name: string; // e.g. "2026/2027"
  currentSemester: 'First' | 'Second';
  status: 'open' | 'closed';
  maxCreditUnits: number;
  minCreditUnits: number;
  startDate: string;
  endDate: string;
}
