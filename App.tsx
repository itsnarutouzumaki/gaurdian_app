import React, { useCallback, useMemo, useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/app-context";
import type { AppContextValue } from "./src/app-context";
import mock from "./src/data/mock-data.json";
import config from "./src/data/school-config.json";
import type {
  ComplaintRecord,
  GuardianProfile,
  LeaveRequestRecord,
  LinkRequestRecord,
  Notice,
  Route,
  ScreenName,
  ToastMessage,
} from "./src/types";
import { C } from "./src/theme";
import {
  BottomTabs,
  ActionButton,
  AppText,
  ModalFrame,
  Spacer,
} from "./src/components/UI";
import { styles } from "./App.styles";
import { SplashScreen } from "./src/screens/SplashScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignUpScreen } from "./src/screens/SignUpScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AddChildScreen } from "./src/screens/AddChildScreen";
import { ChildDashboardScreen } from "./src/screens/ChildDashboardScreen";
import { AttendanceScreen } from "./src/screens/AttendanceScreen";
import { ResultsScreen } from "./src/screens/ResultsScreen";
import { SubjectResultsScreen } from "./src/screens/SubjectResultsScreen";
import { FeesReceiptScreen } from "./src/screens/FeesReceiptScreen";
import { RaiseComplaintScreen } from "./src/screens/RaiseComplaintScreen";
import { LeaveRequestScreen } from "./src/screens/LeaveRequestScreen";
import { MyProfileScreen } from "./src/screens/MyProfileScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { ChangePasswordScreen } from "./src/screens/ChangePasswordScreen";
import { HelpSupportScreen } from "./src/screens/HelpSupportScreen";
import { TermsConditionsScreen } from "./src/screens/TermsConditionsScreen";
import { PrivacyPolicyScreen } from "./src/screens/PrivacyPolicyScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { SchoolDetailsScreen } from "./src/screens/SchoolDetailsScreen";
import { TeachersDirectoryScreen } from "./src/screens/TeachersDirectoryScreen";
import { TeacherProfileScreen } from "./src/screens/TeacherProfileScreen";

const seed = mock;
const schoolConfig = config;
const children = seed.children;

export default function App() {
  const [stack, setStack] = useState<Route[]>([{ name: "Splash" }]);
  const [authenticated, setAuthenticated] = useState(false);
  const [guardian, setGuardian] = useState<GuardianProfile>(() => ({
    ...seed.guardian,
  }));
  const [notifications, setNotifications] = useState<Notice[]>(() =>
    seed.notifications.map((item: Notice) => ({ ...item })),
  );
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(() =>
    seed.complaints.map((item) => ({ ...item })),
  );
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>(() =>
    seed.leaveRequests.map((item) => ({ ...item })),
  );
  const [linkRequests, setLinkRequests] = useState<LinkRequestRecord[]>(() =>
    seed.linkRequests.map((item) => ({ ...item })),
  );
  const [selectedChildId, setSelectedChildIdState] = useState<string>(
    children[0]?.id || "",
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    schoolConfig.app.defaultAcademicYear,
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    seed.teachers[0]?.id || "",
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const currentRoute = stack[stack.length - 1] || {
    name: "Splash" as ScreenName,
  };

  const navigate = useCallback(
    (name: ScreenName, params?: Record<string, unknown>) => {
      setStack((previous) => [...previous, { name, params }]);
    },
    [],
  );
  const replace = useCallback(
    (name: ScreenName, params?: Record<string, unknown>) => {
      setStack((previous) => [...previous.slice(0, -1), { name, params }]);
    },
    [],
  );
  const goBack = useCallback(() => {
    setStack((previous) =>
      previous.length > 1
        ? previous.slice(0, -1)
        : [{ name: authenticated ? "Home" : "Login" }],
    );
  }, [authenticated]);
  const resetTo = useCallback((name: ScreenName) => setStack([{ name }]), []);
  const showToast = useCallback((message: ToastMessage) => {
    setToast(message);
    setTimeout(
      () => setToast((current) => (current === message ? null : current)),
      3200,
    );
  }, []);
  const changeChild = useCallback((id: string) => {
    setSelectedChildIdState(id);
    const child = children.find((item) => item.id === id);
    if (child) setSelectedYear(child.currentAcademicYear);
  }, []);
  const signIn = useCallback(() => {
    setAuthenticated(true);
    setStack([{ name: "Home" }]);
  }, []);
  const value: AppContextValue = useMemo(
    () => ({
      school: schoolConfig.school,
      guardian,
      setGuardian,
      children,
      notifications,
      setNotifications,
      complaints,
      setComplaints,
      leaveRequests,
      setLeaveRequests,
      linkRequests,
      setLinkRequests,
      teachers: seed.teachers,
      selectedChildId,
      setSelectedChildId: changeChild,
      selectedYear,
      setSelectedYear,
      selectedSubjectId,
      setSelectedSubjectId,
      selectedTeacherId,
      setSelectedTeacherId,
      currentRoute,
      navigate,
      replace,
      goBack,
      resetTo,
      showToast,
      toast,
      setToast,
      logoutDialogVisible,
      setLogoutDialogVisible,
      signIn,
    }),
    [
      guardian,
      notifications,
      complaints,
      leaveRequests,
      linkRequests,
      selectedChildId,
      selectedYear,
      selectedSubjectId,
      selectedTeacherId,
      currentRoute,
      navigate,
      replace,
      goBack,
      resetTo,
      showToast,
      toast,
      logoutDialogVisible,
      signIn,
      changeChild,
    ],
  );

  const showTabs =
    authenticated &&
    !["Splash", "Login", "SignUp", "ForgotPassword"].includes(
      currentRoute.name,
    );
  const activeTab: "Home" | "Notifications" | "Profile" =
    currentRoute.name === "Notifications"
      ? "Notifications"
      : [
            "MyProfile",
            "EditProfile",
            "ChangePassword",
            "HelpSupport",
            "TermsConditions",
            "PrivacyPolicy",
          ].includes(currentRoute.name)
        ? "Profile"
        : "Home";
  const onTabPress = (tab: "Home" | "Notifications" | "Profile") => {
    if (tab === "Home") resetTo("Home");
    if (tab === "Notifications") resetTo("Notifications");
    if (tab === "Profile") resetTo("MyProfile");
  };
  const renderScreen = () => {
    switch (currentRoute.name) {
      case "Splash":
        return <SplashScreen />;
      case "Login":
        return <LoginScreen />;
      case "SignUp":
        return <SignUpScreen />;
      case "ForgotPassword":
        return <ForgotPasswordScreen />;
      case "Home":
        return <HomeScreen />;
      case "AddChild":
        return <AddChildScreen />;
      case "ChildDashboard":
        return <ChildDashboardScreen />;
      case "Attendance":
        return <AttendanceScreen />;
      case "Results":
        return <ResultsScreen />;
      case "SubjectResults":
        return <SubjectResultsScreen />;
      case "FeesReceipt":
        return <FeesReceiptScreen />;
      case "RaiseComplaint":
        return <RaiseComplaintScreen />;
      case "LeaveRequest":
        return <LeaveRequestScreen />;
      case "Notifications":
        return <NotificationsScreen />;
      case "MyProfile":
        return <MyProfileScreen />;
      case "EditProfile":
        return <EditProfileScreen />;
      case "ChangePassword":
        return <ChangePasswordScreen />;
      case "HelpSupport":
        return <HelpSupportScreen />;
      case "TermsConditions":
        return <TermsConditionsScreen />;
      case "PrivacyPolicy":
        return <PrivacyPolicyScreen />;
      case "SchoolDetails":
        return <SchoolDetailsScreen />;
      case "TeachersDirectory":
        return <TeachersDirectoryScreen />;
      case "TeacherProfile":
        return <TeacherProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <AppProvider value={value}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.app}>
          <View style={styles.screen}>{renderScreen()}</View>
          {showTabs ? (
            <BottomTabs
              active={activeTab}
              onPress={onTabPress}
              profileName={guardian.fullName}
              profilePhotoUrl={guardian.profilePhotoUrl}
            />
          ) : null}
          {toast ? (
            <View
              style={[styles.toastPosition, { bottom: showTabs ? 72 : 18 }]}
            >
              <View
                style={[
                  styles.toast,
                  {
                    backgroundColor:
                      toast.tone === "error"
                        ? "#922A35"
                        : toast.tone === "success"
                          ? "#087347"
                          : "#123C73",
                  },
                ]}
              >
                <AppText size={13} color="#FFFFFF" weight="bold">
                  {toast.title}
                </AppText>
                {toast.message ? (
                  <AppText size={11} color="#EAF3FF" style={styles.toastMessage}>
                    {toast.message}
                  </AppText>
                ) : null}
              </View>
            </View>
          ) : null}
          <ModalFrame
            visible={logoutDialogVisible}
            onClose={() => setLogoutDialogVisible(false)}
            title="Logout"
          >
            <AppText size={13} color={C.muted} lineHeight={20}>
              Are you sure you want to log out of your guardian account?
            </AppText>
            <View style={styles.logoutActions}>
              <ActionButton
                title="Cancel"
                variant="outline"
                onPress={() => setLogoutDialogVisible(false)}
                style={styles.logoutAction}
              />
              <ActionButton
                title="Logout"
                variant="danger"
                onPress={() => {
                  setLogoutDialogVisible(false);
                  setAuthenticated(false);
                  setStack([{ name: "Login" }]);
                  setToast(null);
                }}
                style={styles.logoutAction}
              />
            </View>
          </ModalFrame>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
