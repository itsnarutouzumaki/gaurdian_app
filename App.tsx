import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  StatusBar,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRunningInExpoGo } from "expo";
import { getLocales } from "expo-localization";
import type * as Notifications from "expo-notifications";
import * as ExpoSplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, LanguageProvider } from "./src/app-context";
import type { AppContextValue } from "./src/app-context";
import mock from "./src/data/mock-data.json";
import { getActiveSchoolConfig } from "./src/data/schools/registry";
import { getHardwareBackDecision } from "./src/lib/back-navigation";
import { setFormatLanguage } from "./src/lib/format";
import { i18n, translate, type Language } from "./src/lib/i18n";
import { configurePushChannel } from "./src/lib/push-notifications";
import {
  parsePushTapPayload,
  type PushTapPayload,
} from "./src/lib/push-payload";
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
const schoolConfig = getActiveSchoolConfig();
const children = seed.children;
const languageStorageKey = "guardian-app.language";

void ExpoSplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.error("Unable to keep the native splash visible while loading preferences.", error);
});

export default function App() {
  const [stack, setStack] = useState<Route[]>([{ name: "Splash" }]);
  const [authenticated, setAuthenticated] = useState(false);
  const [language, setLanguageState] = useState<Language>(() =>
    getLocales()[0]?.languageCode === "hi" ? "hi" : "en",
  );
  const [preferencesReady, setPreferencesReady] = useState(false);
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
    schoolConfig.school.defaultAcademicYear,
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    schoolConfig.teachers[0]?.id || "",
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const pendingPushRoute = useRef<PushTapPayload | null>(null);
  const handledPushResponses = useRef(new Set<string>());
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
  }, []);
  const openPushRoute = useCallback(
    (payload: PushTapPayload) => {
      if (payload.childId) {
        if (!children.some((child) => child.id === payload.childId)) return;
        changeChild(payload.childId);
      }
      if (authenticated) {
        setStack((previous) => [
          ...previous,
          {
            name: payload.route,
            ...(payload.childId ? { params: { childId: payload.childId } } : {}),
          },
        ]);
      } else {
        pendingPushRoute.current = payload;
        setStack([{ name: "Login" }]);
      }
    },
    [authenticated, changeChild],
  );
  const openPushRouteRef = useRef(openPushRoute);
  const signIn = useCallback(() => {
    setAuthenticated(true);
    const pending = pendingPushRoute.current;
    pendingPushRoute.current = null;
    setStack([
      { name: "Home" },
      ...(pending ? [{ name: pending.route, ...(pending.childId ? { params: { childId: pending.childId } } : {}) }] : []),
    ]);
  }, []);
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
    if (!preferencesReady) return;
    ExpoSplashScreen.hideAsync().catch((error: unknown) => {
      console.error("Unable to hide the native splash screen.", error);
    });
  }, [preferencesReady]);
  useEffect(() => {
    openPushRouteRef.current = openPushRoute;
  }, [openPushRoute]);
  useEffect(() => {
    if (isRunningInExpoGo()) return;
    let active = true;
    let received: { remove: () => void } | undefined;
    let responseSubscription: { remove: () => void } | undefined;

    const openNotification = (response: Notifications.NotificationResponse) => {
      const responseId = response.notification.request.identifier;
      if (handledPushResponses.current.has(responseId)) return;
      handledPushResponses.current.add(responseId);
      const payload = parsePushTapPayload(
        response.notification.request.content.data,
      );
      if (payload) openPushRouteRef.current(payload);
    };

    void import("expo-notifications")
      .then(async (Notifications) => {
        if (!active) return;
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
        if (Platform.OS === "android") await configurePushChannel();
        if (!active) return;
        received = Notifications.addNotificationReceivedListener((notification) => {
          const { request } = notification;
          const content = request.content;
          setNotifications((previous) => {
            if (previous.some((item) => item.id === request.identifier)) return previous;
            const data = content.data as Record<string, unknown>;
            const type =
              data.type === "request" ||
              data.type === "complaint" ||
              data.type === "fee" ||
              data.type === "result"
                ? data.type
                : "update";
            return [
              {
                id: request.identifier,
                type,
                title: content.title || "Notifications",
                message: content.body || "",
                dateLabel: "Just now",
                read: false,
                ...(typeof data.childId === "string" ? { childId: data.childId } : {}),
              },
              ...previous,
            ];
          });
        });
        responseSubscription =
          Notifications.addNotificationResponseReceivedListener(openNotification);
        const response = await Notifications.getLastNotificationResponseAsync();
        if (active && response) openNotification(response);
      })
      .catch((error: unknown) => {
        console.error("Unable to initialize push notification handling.", error);
      });

    return () => {
      active = false;
      received?.remove();
      responseSubscription?.remove();
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
      notifications,
      setNotifications,
      complaints,
      setComplaints,
      leaveRequests,
      setLeaveRequests,
      linkRequests,
      setLinkRequests,
      teachers: schoolConfig.teachers,
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
      language,
      setLanguage,
      alert: showAlert,
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
      case "TeachersDirectory":
        return <TeachersDirectoryScreen />;
      case "TeacherProfile":
        return <TeacherProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (!preferencesReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.app} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider value={language}>
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
              hasUnreadNotifications={notifications.some((item) => !item.read)}
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
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
