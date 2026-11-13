import type {
  SchoolInformation,
  SchoolMediaConfig as SchoolMediaConfiguration,
  TeacherRecord as SchoolTeacherRecord,
} from "./data/schools/types";

export type SchoolMediaConfig = SchoolMediaConfiguration;
export type TeacherRecord = SchoolTeacherRecord;

export type ScreenName =
  | 'Splash' | 'Login' | 'SignUp' | 'ForgotPassword' | 'Home' | 'AddChild'
  | 'ChildDashboard' | 'Attendance' | 'Results' | 'SubjectResults' | 'FeesReceipt'
  | 'RaiseComplaint' | 'LeaveRequest' | 'Notifications' | 'MyProfile' | 'EditProfile'
  | 'ChangePassword' | 'HelpSupport' | 'TermsConditions' | 'PrivacyPolicy'
  | 'SchoolDetails' | 'TeachersDirectory' | 'TeacherProfile';

export type Route = { name: ScreenName; params?: Record<string, unknown> };
export type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'noClass' | 'unmarked';
export type SchoolConfig = SchoolInformation;
export type ComplaintRecord = {
  id: string;
  childId: string;
  subject: string;
  message: string;
  attachmentName: string | null;
  status: string;
  createdAt: string;
};
export type LeaveRequestRecord = {
  id: string;
  childId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
};
export type LinkRequestRecord = {
  id: string;
  studentNumber: string;
  status: string;
  createdAt: string;
};
export type HelpTopic = { id: string; title: string; body: string };
export type PolicySection = { title: string; body: string };
export type GuardianProfile = {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  profilePhotoUrl: string | null;
  address: string;
  relationship: string;
  profileComplete?: boolean;
};
export type AttendanceRecord = {
  day: number;
  date: string;
  status: AttendanceStatus;
};
export type AttendanceMonthRecord = {
  month: string;
  monthNumber: number;
  year: number;
  records: AttendanceRecord[];
};
export type SubjectTestRecord = {
  id: string;
  name: string;
  date: string;
  score: number;
  maxScore: number;
  teacherId: string;
  teacherRemarks: string;
};
export type StudentSubjectRecord = {
  id: string;
  name: string;
  teacherId: string;
  icon: string;
  color: string;
  tests: SubjectTestRecord[];
};
export type FeeReceiptRecord = {
  id: string;
  label: string;
  academicYear: string;
  breakdown: Record<string, number>;
  total: number;
  paid: boolean;
  paymentDate: string;
  paymentMode: string;
  transactionId: string;
};
export type AcademicYearRecord = {
  label: string;
  startYear: number;
  className: string;
  section: string;
  attendance: {
    totalClasses: number;
    present: number;
    absent: number;
    holidays: number;
    percentage: number;
    months: AttendanceMonthRecord[];
  };
  subjects: StudentSubjectRecord[];
  feeReceipts: FeeReceiptRecord[];
  classTeacherId: string;
};
export type ChildRecord = {
  id: string;
  fullName: string;
  photoUrl: string;
  studentId: string;
  className: string;
  section: string;
  rollNumber?: number;
  relationship: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  admissionNumber: string;
  currentAcademicYear: string;
  academicYears: AcademicYearRecord[];
};
export type SubjectRecord = StudentSubjectRecord;
export type TestRecord = SubjectTestRecord;
export type ExaminationType = "halfYearly" | "yearly" | "preboard";
export type ExaminationSubjectResult = {
  subjectId: string;
  score: number;
  maxScore: number;
};
export type ExaminationRecord = {
  id: string;
  childId: string;
  academicYear: string;
  type: ExaminationType;
  title: string;
  date: string;
  subjects: ExaminationSubjectResult[];
};
export type Notice = { id: string; type: string; title: string; message: string; dateLabel: string; read: boolean; childId?: string };
export type ToastMessage = {
  title: string;
  message?: string;
  tone?: "success" | "error" | "info";
  action?: { label: string; onPress: () => void };
};
