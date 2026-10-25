import React, { createContext, useContext } from "react";
import type {
  ChildRecord,
  ComplaintRecord,
  GuardianProfile,
  LeaveRequestRecord,
  LinkRequestRecord,
  Notice,
  Route,
  SchoolConfig,
  ScreenName,
  TeacherRecord,
  ToastMessage,
} from "./types";

export type AppContextValue = {
  school: SchoolConfig;
  guardian: GuardianProfile;
  setGuardian: React.Dispatch<React.SetStateAction<GuardianProfile>>;
  children: ChildRecord[];
  notifications: Notice[];
  setNotifications: React.Dispatch<React.SetStateAction<Notice[]>>;
  complaints: ComplaintRecord[];
  setComplaints: React.Dispatch<React.SetStateAction<ComplaintRecord[]>>;
  leaveRequests: LeaveRequestRecord[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequestRecord[]>>;
  linkRequests: LinkRequestRecord[];
  setLinkRequests: React.Dispatch<React.SetStateAction<LinkRequestRecord[]>>;
  teachers: TeacherRecord[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  currentRoute: Route;
  navigate: (name: ScreenName, params?: Record<string, unknown>) => void;
  replace: (name: ScreenName, params?: Record<string, unknown>) => void;
  goBack: () => void;
  resetTo: (name: ScreenName) => void;
  showToast: (toast: ToastMessage) => void;
  toast: ToastMessage | null;
  setToast: (toast: ToastMessage | null) => void;
  logoutDialogVisible: boolean;
  setLogoutDialogVisible: (visible: boolean) => void;
  signIn: () => void;
};

const Ctx = createContext<AppContextValue | null>(null);
export const AppProvider = Ctx.Provider;
export function useApp() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
