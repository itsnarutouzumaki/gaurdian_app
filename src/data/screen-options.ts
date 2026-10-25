import type { ScreenName } from "../types";
import { C } from "../theme";

export const NOTIFICATION_FILTERS = ["All", "Requests", "Updates"] as const;
export type NotificationFilter = (typeof NOTIFICATION_FILTERS)[number];

export const SCHOOL_DETAILS_TABS = [
  "Photos",
  "Videos",
  "About",
  "Teachers",
] as const;

export const TEACHER_DIRECTORY_FILTERS = [
  "All",
  "Mathematics",
  "Science",
  "English",
  "Computer",
  "Social Science",
  "Hindi",
] as const;

export const TEACHER_PROFILE_TABS = [
  "About",
  "Qualifications",
  "Experience",
] as const;

export const PROFILE_MENU_OPTIONS: ReadonlyArray<{
  icon: string;
  title: string;
  detail: string;
  target: ScreenName;
  color: string;
  backgroundColor: string;
}> = [
  {
    icon: "✎",
    title: "Edit Profile",
    detail: "Update your name and profile photo",
    target: "EditProfile",
    color: C.primary,
    backgroundColor: C.blueSoft,
  },
  {
    icon: "♙",
    title: "Change Password",
    detail: "Keep your account secure",
    target: "ChangePassword",
    color: C.orange,
    backgroundColor: C.orangeSoft,
  },
  {
    icon: "?",
    title: "Help & Support",
    detail: "FAQs and contact information",
    target: "HelpSupport",
    color: C.success,
    backgroundColor: C.successSoft,
  },
  {
    icon: "▤",
    title: "Terms & Conditions",
    detail: "Rules for using the app",
    target: "TermsConditions",
    color: C.primary,
    backgroundColor: C.blueSoft,
  },
  {
    icon: "⬡",
    title: "Privacy Policy",
    detail: "How account and student data is handled",
    target: "PrivacyPolicy",
    color: C.purple,
    backgroundColor: C.purpleSoft,
  },
];

export const SAMPLE_PROFILE_PHOTOS = [
  "https://i.pravatar.cc/240?img=47",
  "https://i.pravatar.cc/240?img=48",
  "https://i.pravatar.cc/240?img=49",
] as const;
