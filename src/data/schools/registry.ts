import { getSchoolConfiguration } from "../../config/schoolConfig";
import type {
  AppConfiguration,
  SchoolConfiguration,
  SchoolMediaConfig,
  SchoolTheme,
} from "./types";

type UnresolvedSchoolConfiguration = Omit<
  SchoolConfiguration,
  "app" | "media" | "theme"
> & {
  app: Omit<AppConfiguration, "splash"> & {
    splash: {
      android: Omit<AppConfiguration["splash"]["android"], "resizeMode"> & {
        resizeMode: string;
      };
    };
  };
  theme: Omit<SchoolTheme, "defaultMode"> & { defaultMode: string };
  media: SchoolMediaConfig;
};

const sharedSchool = getSchoolConfiguration();

const schoolRegistry: Record<string, UnresolvedSchoolConfiguration> = {
  [sharedSchool.schoolId]: {
    school: {
      ...sharedSchool.school,
      id: sharedSchool.schoolId,
      defaultAcademicYear: sharedSchool.academic.defaultAcademicYear,
      availableAcademicYears: sharedSchool.academic.availableAcademicYears,
    },
    app: sharedSchool.parentApp,
    theme: sharedSchool.theme,
    media: {
      coverImage: sharedSchool.media.coverImages[0] ?? null,
      photos: sharedSchool.media.galleryImages,
      videos: sharedSchool.media.videos,
    },
  },
};

function resolveActiveSchool(): SchoolConfiguration {
  const config = schoolRegistry[sharedSchool.schoolId];
  if (!config) {
    throw new Error(`No school configuration registered for "${sharedSchool.schoolId}".`);
  }
  if (config.school.id !== sharedSchool.schoolId) {
    throw new Error(`School ID "${config.school.id}" does not match shared school ID "${sharedSchool.schoolId}".`);
  }
  const defaultMode = config.theme.defaultMode;
  if (defaultMode !== "light" && defaultMode !== "dark") {
    throw new Error(`Unsupported default appearance mode "${defaultMode}".`);
  }
  const splashResizeMode = config.app.splash.android.resizeMode;
  if (splashResizeMode !== "contain" && splashResizeMode !== "cover") {
    throw new Error(`Unsupported Android splash resize mode "${splashResizeMode}".`);
  }
  return {
    ...config,
    app: {
      ...config.app,
      splash: {
        android: {
          ...config.app.splash.android,
          resizeMode: splashResizeMode,
        },
      },
    },
    theme: { ...config.theme, defaultMode },
  };
}

const activeSchoolConfiguration = resolveActiveSchool();

export function getActiveSchoolConfig(): SchoolConfiguration {
  return activeSchoolConfiguration;
}
