import activeSchool from "./active-school.json";
import greenwoodApp from "./greenwood-demo/app-config.json";
import greenwoodMedia from "./greenwood-demo/media.json";
import greenwoodSchool from "./greenwood-demo/school.json";
import greenwoodTeachers from "./greenwood-demo/teachers.json";
import greenwoodTheme from "./greenwood-demo/theme.json";
import { bundledSchoolAssets } from "./greenwood-demo/assets";
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
  media: Omit<SchoolMediaConfig, "logo"> & {
    logo: { kind: string; assetKey: string; altText: string };
  };
};

type RegisteredSchoolId = "greenwood-demo";

const schoolRegistry: Record<RegisteredSchoolId, UnresolvedSchoolConfiguration> = {
  "greenwood-demo": {
    school: greenwoodSchool,
    app: greenwoodApp,
    theme: greenwoodTheme,
    media: greenwoodMedia,
    teachers: greenwoodTeachers,
  },
};

function resolveActiveSchool(): SchoolConfiguration {
  const config = Object.entries(schoolRegistry).find(
    ([schoolId]) => schoolId === activeSchool.schoolId,
  )?.[1];
  if (!config) {
    throw new Error(`No school configuration registered for "${activeSchool.schoolId}".`);
  }
  if (config.school.id !== activeSchool.schoolId) {
    throw new Error(
      `Active school ID "${activeSchool.schoolId}" does not match the registered school ID "${config.school.id}".`,
    );
  }
  const defaultMode = config.theme.defaultMode;
  if (defaultMode !== "light" && defaultMode !== "dark") {
    throw new Error(`Unsupported default appearance mode "${defaultMode}".`);
  }
  if (config.media.logo.kind !== "bundled") {
    throw new Error(`Unsupported logo source type "${config.media.logo.kind}".`);
  }
  const splashResizeMode = config.app.splash.android.resizeMode;
  if (splashResizeMode !== "contain" && splashResizeMode !== "cover") {
    throw new Error(`Unsupported Android splash resize mode "${splashResizeMode}".`);
  }
  const logoSource = bundledSchoolAssets[config.media.logo.assetKey];
  if (!logoSource) {
    throw new Error(
      `No bundled image asset is registered for school logo "${config.media.logo.assetKey}".`,
    );
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
    media: {
      ...config.media,
      logo: { ...config.media.logo, kind: "bundled", source: logoSource },
    },
  };
}

const activeSchoolConfiguration = resolveActiveSchool();

export function getActiveSchoolConfig(): SchoolConfiguration {
  return activeSchoolConfiguration;
}
