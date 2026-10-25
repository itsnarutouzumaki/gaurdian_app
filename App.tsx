import React, { useCallback, useMemo, useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/app-context";
import type { AppContextValue } from "./src/app-context";
import mock from "./src/data/mock-data.json";
import config from "./src/data/school-config.json";
import type {
  ChildRecord,
  GuardianProfile,
  Notice,
  Route,
  ScreenName,
  TeacherRecord,
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
import {
  SplashScreen,
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
} from "./src/screens/AuthScreens";
import {
  HomeScreen,
  AddChildScreen,
  ChildDashboardScreen,
  AttendanceScreen,
  ResultsScreen,
  SubjectResultsScreen,
} from "./src/screens/MainScreens";
import {
  FeesReceiptScreen,
  RaiseComplaintScreen,
  LeaveRequestScreen,
} from "./src/screens/RequestScreens";
import {
  MyProfileScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  HelpSupportScreen,
  TermsConditionsScreen,
  PrivacyPolicyScreen,
} from "./src/screens/ProfileScreens";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import {
  SchoolDetailsScreen,
  TeachersDirectoryScreen,
  TeacherProfileScreen,
} from "./src/screens/SchoolScreens";

const seed = mock as any;
const schoolConfig = config as any;

export default function App() {
  const [stack, setStack] = useState<Route[]>([{ name: "Splash" }]);
  const [authenticated, setAuthenticated] = useState(false);
  const [guardian, setGuardian] = useState<GuardianProfile>(() => ({
    ...seed.guardian,
  }));
  const [notifications, setNotifications] = useState<Notice[]>(() =>
    seed.notifications.map((item: Notice) => ({ ...item })),
  );
  const [complaints, setComplaints] = useState<any[]>(() =>
    seed.complaints.map((item: any) => ({ ...item })),
  );
  const [leaveRequests, setLeaveRequests] = useState<any[]>(() =>
    seed.leaveRequests.map((item: any) => ({ ...item })),
  );
  const [linkRequests, setLinkRequests] = useState<any[]>(() =>
    seed.linkRequests.map((item: any) => ({ ...item })),
  );
  const [selectedChildId, setSelectedChildIdState] = useState<string>(
    seed.children[0]?.id || "",
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
    (name: ScreenName, params?: Record<string, any>) => {
      setStack((previous) => [...previous, { name, params }]);
    },
    [],
  );
  const replace = useCallback(
    (name: ScreenName, params?: Record<string, any>) => {
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
    const child = seed.children.find((item: ChildRecord) => item.id === id);
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
      children: seed.children as ChildRecord[],
      notifications,
      setNotifications,
      complaints,
      setComplaints,
      leaveRequests,
      setLeaveRequests,
      linkRequests,
      setLinkRequests,
      teachers: seed.teachers as TeacherRecord[],
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
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{ flex: 1 }}>{renderScreen()}</View>
          {showTabs ? (
            <BottomTabs active={activeTab} onPress={onTabPress} />
          ) : null}
          {toast ? (
            <View
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                bottom: showTabs ? 72 : 18,
                zIndex: 20,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    toast.tone === "error"
                      ? "#922A35"
                      : toast.tone === "success"
                        ? "#087347"
                        : "#123C73",
                  borderRadius: 14,
                  padding: 13,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <AppText size={13} color="#FFFFFF" weight="bold">
                  {toast.title}
                </AppText>
                {toast.message ? (
                  <AppText size={11} color="#EAF3FF" style={{ marginTop: 3 }}>
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
            <View style={{ flexDirection: "row", gap: 9, marginTop: 20 }}>
              <ActionButton
                title="Cancel"
                variant="outline"
                onPress={() => setLogoutDialogVisible(false)}
                style={{ flex: 1 }}
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
                style={{ flex: 1 }}
              />
            </View>
          </ModalFrame>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
