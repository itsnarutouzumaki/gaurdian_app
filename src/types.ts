export type ScreenName =
  | 'Splash' | 'Login' | 'SignUp' | 'ForgotPassword' | 'Home' | 'AddChild'
  | 'ChildDashboard' | 'Attendance' | 'Results' | 'SubjectResults' | 'FeesReceipt'
  | 'RaiseComplaint' | 'LeaveRequest' | 'Notifications' | 'MyProfile' | 'EditProfile'
  | 'ChangePassword' | 'HelpSupport' | 'TermsConditions' | 'PrivacyPolicy'
  | 'SchoolDetails' | 'TeachersDirectory' | 'TeacherProfile';

export type Route = { name: ScreenName; params?: Record<string, any> };
export type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'noClass' | 'unmarked';
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
export type ChildRecord = {
  id: string;
  fullName: string;
  photoUrl: string;
  studentId: string;
  className: string;
  section: string;
  currentAcademicYear: string;
  academicYears: AcademicYearRecord[];
  [key: string]: any;
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
    months: Array<{ month: string; monthNumber: number; year: number; records: Array<{ day: number; date: string; status: AttendanceStatus }> }>;
  };
  subjects: SubjectRecord[];
  feeReceipts: FeeReceiptRecord[];
  classTeacherId: string;
};
export type SubjectRecord = {
  id: string;
  name: string;
  teacherId: string;
  icon: string;
  color: string;
  tests: TestRecord[];
};
export type TestRecord = {
  id: string;
  name: string;
  date: string;
  score: number;
  maxScore: number;
  teacherId: string;
  copyAvailable: boolean;
  teacherRemarks?: string;
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
