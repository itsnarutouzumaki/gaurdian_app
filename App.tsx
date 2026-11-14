import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  BackHandler,
  Pressable,
  StatusBar,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutGuardian } from "./src/services/auth-api";
import { loadGuardianAppData } from "./src/services/guardian-data/load-guardian-app-data";
import type { GuardianAppData } from "./src/services/guardian-data/guardian-bootstrap.types";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AppProvider, LanguageProvider } from "./src/app-context";
import type { AppContextValue } from "./src/app-context";
import { getSchoolConfiguration } from "./src/config/schoolConfig";
import { getActiveSchoolConfig } from "./src/data/schools/registry";
import { getHardwareBackDecision } from "./src/lib/back-navigation";
import { setFormatLanguage } from "./src/lib/format";
import { i18n, translate, type Language } from "./src/lib/i18n";
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
import { TeacherProfileScreen } from "./src/screens/TeacherProfileScreen";

const schoolConfig = getActiveSchoolConfig();
const defaultLanguage = getSchoolConfiguration().localization.defaultLanguage;
const languageStorageKey = "guardian-app.language";

function GuardianApp() {
  const insets = useSafeAreaInsets();
  const [stack, setStack] = useState<Route[]>([{ name: "Splash" }]);
  const [authenticated, setAuthenticated] = useState(false);
  const [language, setLanguageState] = useState<Language>(() =>
    Intl.DateTimeFormat().resolvedOptions().locale
      .toLowerCase()
      .startsWith("hi")
      ? "hi"
      : defaultLanguage === "hi"
        ? "hi"
        : "en",
  );
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [guardian, setGuardian] = useState<GuardianProfile>(() => ({
    id: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    profilePhotoUrl: null,
    address: "",
    relationship: "",
    profileComplete: false,
  }));
  const [children, setChildren] = useState<GuardianAppData["children"]>([]);
  const [examinations, setExaminations] = useState<GuardianAppData["examinations"]>([]);
  const [notifications, setNotifications] = useState<Notice[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>([]);
  const [linkRequests, setLinkRequests] = useState<LinkRequestRecord[]>([]);
  const [teachers, setTeachers] = useState<GuardianAppData["teachers"]>([]);
  const [selectedChildId, setSelectedChildIdState] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    schoolConfig.school.defaultAcademicYear,
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
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
  const setLanguage = useCallback(async (nextLanguage: Language) => {
    await AsyncStorage.setItem(languageStorageKey, nextLanguage);
    await i18n.changeLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  }, []);
  useEffect(() => setFormatLanguage(language), [language]);
  const showAlert = useCallback(
    (...args: Parameters<typeof Alert.alert>) => {
      const [title, message, buttons, options] = args;
      const localizedTitle = translate(title ?? "", language);
      const localizedMessage = message
        ? translate(message, language)
        : undefined;
      if (!buttons?.length) {
        showToast({
          title: localizedTitle,
          message: localizedMessage,
          tone: "info",
        });
        return;
      }
      Alert.alert(
        localizedTitle,
        localizedMessage,
        buttons.map((button) => ({
          ...button,
          text: button.text ? translate(button.text, language) : undefined,
        })),
        options,
      );
    },
    [language, showToast],
  );
  const changeChild = useCallback((id: string) => {
    setSelectedChildIdState(id);
    const child = children.find((item) => item.id === id);
    if (child) setSelectedYear(child.currentAcademicYear);
  }, [children]);
  const signIn = useCallback((data: GuardianAppData) => {
    setGuardian(data.guardian);
    setChildren(data.children);
    setExaminations(data.examinations);
    setNotifications(data.notifications);
    setComplaints(data.complaints);
    setLeaveRequests(data.leaveRequests);
    setLinkRequests(data.linkRequests);
    setTeachers(data.teachers);
    setSelectedChildIdState(data.children[0]?.id ?? "");
    setSelectedYear(data.children[0]?.currentAcademicYear ?? schoolConfig.school.defaultAcademicYear);
    setSelectedTeacherId(data.teachers[0]?.id ?? "");
    setAuthenticated(true);
    setStack([{ name: "Home" }]);
  }, []);
  const refreshData = useCallback(async () => {
    const data = await loadGuardianAppData();
    setGuardian(data.guardian);
    setChildren(data.children);
    setExaminations(data.examinations);
    setNotifications(data.notifications);
    setComplaints(data.complaints);
    setLeaveRequests(data.leaveRequests);
    setLinkRequests(data.linkRequests);
    setTeachers(data.teachers);

    const selectedChild =
      data.children.find((child) => child.id === selectedChildId) ??
      data.children[0];
    setSelectedChildIdState(selectedChild?.id ?? "");
    setSelectedYear((current) =>
      selectedChild?.academicYears.some((year) => year.label === current)
        ? current
        : selectedChild?.currentAcademicYear ??
          schoolConfig.school.defaultAcademicYear,
    );
    setSelectedTeacherId(data.teachers[0]?.id ?? "");
  }, [selectedChildId]);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(languageStorageKey)
      .then(async (savedLanguage) => {
        if (active && (savedLanguage === "en" || savedLanguage === "hi")) {
          await i18n.changeLanguage(savedLanguage);
          setLanguageState(savedLanguage);
        } else if (active) {
          await i18n.changeLanguage(language);
        }
      })
      .catch((error: unknown) => {
        console.error("Unable to load the saved language preference.", error);
      })
      .finally(() => {
        if (active) setPreferencesReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const decision = getHardwareBackDecision({
          stackLength: stack.length,
          route: currentRoute.name,
          authenticated,
          modalVisible: logoutDialogVisible,
        });
        if (decision === "exit") return false;
        if (decision === "dismiss-modal") {
          setLogoutDialogVisible(false);
        } else if (decision === "pop") {
          goBack();
        } else if (authenticated) {
          resetTo("Home");
        } else {
          replace("Login");
        }
        return true;
      },
    );
    return () => subscription.remove();
  }, [
    authenticated,
    currentRoute.name,
    goBack,
    logoutDialogVisible,
    replace,
    resetTo,
    stack.length,
  ]);
  const value: AppContextValue = useMemo(
    () => ({
      school: schoolConfig.school,
      media: schoolConfig.media,
      guardian,
      setGuardian,
      children,
      examinations,
      notifications,
      complaints,
      leaveRequests,
      linkRequests,
      teachers,
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
      refreshData,
      language,
      setLanguage,
      alert: showAlert,
    }),
    [
      guardian,
      children,
      examinations,
      teachers,
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
      refreshData,
      changeChild,
      language,
      setLanguage,
      showAlert,
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
      case "TeacherProfile":
        return <TeacherProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (!preferencesReady) {
    return <View style={styles.app} />;
  }

  return (
    <LanguageProvider value={language}>
      <AppProvider value={value}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={C.bg}
          translucent={false}
        />
        <View style={styles.app}>
          {showTabs ? (
            <View style={styles.screen}>{renderScreen()}</View>
          ) : (
            <SafeAreaView edges={["bottom"]} style={styles.screen}>
              {renderScreen()}
            </SafeAreaView>
          )}
          {showTabs ? (
            <BottomTabs
              active={activeTab}
              onPress={onTabPress}
              profileName={guardian.fullName}
              profilePhotoUrl={guardian.profilePhotoUrl}
              hasUnreadNotifications={notifications.some((item) => !item.read)}
            />
          ) : null}
          {toast ? (
            <View
              pointerEvents="box-none"
              style={[
                styles.toastPosition,
                { top: Math.max(insets.top, 8) + 8 },
              ]}
            >
              <View
                style={[
                  styles.toast,
                  {
                    backgroundColor:
                      toast.tone === "error"
                        ? C.danger
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
                {toast.action ? (
                  <Pressable
                    onPress={() => {
                      toast.action?.onPress();
                      setToast(null);
                    }}
                    style={styles.toastAction}
                  >
                    <AppText size={11} color="#FFFFFF" weight="bold">
                      {toast.action.label}
                    </AppText>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : null}
          <ModalFrame
            visible={logoutDialogVisible}
            onClose={() => {
              if (!logoutPending) setLogoutDialogVisible(false);
            }}
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
                disabled={logoutPending}
                style={styles.logoutAction}
              />
              <ActionButton
                title="Logout"
                variant="danger"
                loading={logoutPending}
                disabled={logoutPending}
                onPress={async () => {
                  setToast(null);
                  setLogoutPending(true);
                  try {
                    await logoutGuardian();
                  } catch (error) {
                    console.error("Guardian logout request failed.", error);
                    showToast({
                      title: "Signed out on this device",
                      message: error instanceof Error
                        ? error.message
                        : "The server could not confirm logout.",
                      tone: "error",
                    });
                  } finally {
                    setLogoutDialogVisible(false);
                    setAuthenticated(false);
                    setStack([{ name: "Login" }]);
                    setLogoutPending(false);
                  }
                }}
                style={styles.logoutAction}
              />
            </View>
          </ModalFrame>
        </View>
      </AppProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GuardianApp />
    </SafeAreaProvider>
  );
}
