import type { ImageSourcePropType } from "react-native";
export type SchoolInformation = {
  id: string;
  name: string;
  tagline: string;
  established: number;
  address: string;
  shortLocation: string;
  phone: string;
  email: string;
  website: string;
  grades: string;
  about: string;
  mission: string;
  facilities: string[];
  defaultAcademicYear: string;
  availableAcademicYears: string[];
};

export type SchoolThemePalette = {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  primaryButtonBackground: string;
  primaryButtonText: string;
  link: string;
  pageBackground: string;
  cardBackground: string;
  text: string;
  mutedText: string;
  border: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  blueSoft: string;
  purple: string;
  purpleSoft: string;
  orange: string;
  orangeSoft: string;
  teal: string;
  shadow: string;
};

export type SchoolTheme = {
  defaultMode: "light" | "dark";
  light: SchoolThemePalette;
  dark: SchoolThemePalette | null;
};

export type AppConfiguration = {
  appName: string;
  slug: string;
  scheme: string;
  version: string;
  demoMode: boolean;
  android: {
    package: string;
    adaptiveIcon: {
      foregroundImage: string | null;
      backgroundColor: string;
    };
  };
  splash: {
    android: {
      image: string;
      imageWidth: number;
      resizeMode: "contain" | "cover";
      backgroundColor: string;
    };
  };
  ios: { bundleIdentifier: string };
  icon: string | null;
};

export type SchoolVideo = {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  url: string;
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

export type SchoolMediaConfig = {
  logo: {
    kind: "bundled";
    assetKey: string;
    altText: string;
    source: ImageSourcePropType;
  };
  coverImage: string;
  photos: string[];
  videos: SchoolVideo[];
};

export type SchoolConfiguration = {
  school: SchoolInformation;
  app: AppConfiguration;
  theme: SchoolTheme;
  media: SchoolMediaConfig;
  teachers: TeacherRecord[];
};
