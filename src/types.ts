import type mock from "./data/mock-data.json";
import type config from "./data/school-config.json";

export type ScreenName =
  | 'Splash' | 'Login' | 'SignUp' | 'ForgotPassword' | 'Home' | 'AddChild'
  | 'ChildDashboard' | 'Attendance' | 'Results' | 'SubjectResults' | 'FeesReceipt'
  | 'RaiseComplaint' | 'LeaveRequest' | 'Notifications' | 'MyProfile' | 'EditProfile'
  | 'ChangePassword' | 'HelpSupport' | 'TermsConditions' | 'PrivacyPolicy'
  | 'SchoolDetails' | 'TeachersDirectory' | 'TeacherProfile';

export type Route = { name: ScreenName; params?: Record<string, unknown> };
export type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'noClass' | 'unmarked';
export type SchoolConfig = typeof config.school;
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
  studentId: string;
  studentName: string;
  status: string;
  createdAt: string;
};
export type HelpTopic = (typeof mock.helpTopics)[number];
export type PolicySection = (typeof mock.termsSections)[number];
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
export type ChildRecord = (typeof mock.children)[number];
export type AcademicYearRecord = ChildRecord["academicYears"][number];
export type SubjectRecord = AcademicYearRecord["subjects"][number];
export type TestRecord = SubjectRecord["tests"][number];
export type FeeReceiptRecord = AcademicYearRecord["feeReceipts"][number];
export type TeacherRecord = {
  id: string;
  name: string;
  photoUrl: string;
  designation: string;
  subjects: string[];
  highestDegree: string;
  qualifications: Array<{ degree: string; institution: string; year: string }>;
  experienceYears: number;
  specialization: string;
  about: string;
  email: string;
  phone: string;
  classes: string[];
  languages: string[];
  awards: string[];
  officeHours: string;
  isActive?: boolean;
};
export type Notice = { id: string; type: string; title: string; message: string; dateLabel: string; read: boolean; childId?: string };
export type ToastMessage = { title: string; message?: string; tone?: 'success' | 'error' | 'info' };
