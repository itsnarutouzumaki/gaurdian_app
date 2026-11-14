import type {
  ChildRecord,
  ComplaintRecord,
  ExaminationRecord,
  GuardianProfile,
  LeaveRequestRecord,
  LinkRequestRecord,
  Notice,
  TeacherRecord,
} from "../../types";

export type GuardianBootstrapChild = {
  id: string;
  studentNumber: string;
  fullName: string;
  admissionNumber?: string;
  gender?: string;
  photoFileId?: string;
  photoUrl?: string;
  rollNumber?: string;
  relationship: string;
  classSection?: {
    academicYearId: string;
    className: string;
    section: string;
    classTeacherId?: string;
  };
  academicYears: Array<{ _id: string; label: string; startsOn: string; endsOn: string; status: string }>;
  attendance: Array<{ date: string; status: "present" | "absent" | "holiday" | "noClass" }>;
  publishedAssessments: Array<{
    _id: string;
    classSectionId: string;
    subjectId: string;
    academicYearId: string;
    teacherId: string;
    type: "test" | "yearly" | "halfYearly" | "preBoard" | "other";
    title: string;
    date: string;
  }>;
  results: Array<{
    assessmentId: string;
    studentId: string;
    obtainedMarks: number;
    maxMarks: number;
    remarks?: string;
    answerCopyFileId?: string;
  }>;
  feeReceipts: Array<{
    _id: string;
    academicYearId: string;
    period: string;
    periodSort: number;
    breakdown: Array<{ label: string; amountMinor: number }>;
    totalMinor: number;
    currency: string;
    status: "due" | "paid" | "void" | "refunded";
    paidAt?: string;
    paymentMethod?: string;
    receiptNumber: string;
  }>;
  subjectAssignments: Array<{ classSectionId: string; subjectId: string; teacherId: string; academicYearId: string }>;
  subjects: Array<{ _id: string; name: string; code?: string }>;
  teachers: Array<{
    _id: string;
    displayName: string;
    designation?: string;
    subjects?: string[];
    qualifications?: string[];
    experienceYears?: number;
    specialization?: string;
    biography?: string;
    languages?: string[];
    gender?: string;
    photoFileId?: string;
    photoUrl?: string;
  }>;
};

export type GuardianBootstrap = {
  school: {
    code: string;
    name: string;
    timezone: string;
    academicYears: Array<{ _id: string; label: string; startsOn: string; endsOn: string; status: string }>;
    currentAcademicYearId?: string;
    branding?: { primaryColor?: string; accentColor?: string; logoFileId?: string };
  } | null;
  account: {
    id: string;
    role: "guardian";
    profile: {
      id: string;
      fullName: string;
      phone: string;
      email: string;
      gender?: string;
      photoFileId?: string;
      photoUrl?: string;
      address?: string;
      relationship: string;
    };
  };
  children: GuardianBootstrapChild[];
  complaints: Array<{ _id: string; studentId: string; subject: string; message: string; status: string; attachmentFileIds: string[]; createdAt: string }>;
  leaveRequests: Array<{ _id: string; studentId: string; startsOn: string; endsOn: string; reason: string; status: string; createdAt: string }>;
  childLinkRequests: Array<{ _id: string; proposedStudentNumber: string; relationship: string; status: string; createdAt: string; reviewedAt?: string; reviewNote?: string }>;
  notifications: Array<{ eventId: string; eventType: string; subject: string; body: string; routeName?: string; routeParams?: Record<string, string>; readAt?: string; createdAt: string }>;
};

export type GuardianAppData = {
  guardian: GuardianProfile;
  children: ChildRecord[];
  examinations: ExaminationRecord[];
  complaints: ComplaintRecord[];
  leaveRequests: LeaveRequestRecord[];
  linkRequests: LinkRequestRecord[];
  notifications: Notice[];
  teachers: TeacherRecord[];
};
