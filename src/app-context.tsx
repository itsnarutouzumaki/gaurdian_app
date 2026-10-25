import React, { createContext, useContext } from "react";
import type {
  ChildRecord,
  GuardianProfile,
  Notice,
  Route,
  ScreenName,
  TeacherRecord,
  ToastMessage,
} from "./types";

export type AppContextValue = {
  school: any;
  guardian: GuardianProfile;
  setGuardian: React.Dispatch<React.SetStateAction<GuardianProfile>>;
  children: ChildRecord[];
  notifications: Notice[];
  setNotifications: React.Dispatch<React.SetStateAction<Notice[]>>;
  complaints: any[];
  setComplaints: React.Dispatch<React.SetStateAction<any[]>>;
  leaveRequests: any[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<any[]>>;
  linkRequests: any[];
  setLinkRequests: React.Dispatch<React.SetStateAction<any[]>>;
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
  navigate: (name: ScreenName, params?: Record<string, any>) => void;
  replace: (name: ScreenName, params?: Record<string, any>) => void;
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
