const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const shared = JSON.parse(
  fs.readFileSync(path.resolve(root, "..", "shared", "school-config.json"), "utf8"),
);
const school = shared.school;
const config = JSON.parse(
  fs.readFileSync(
    path.join(root, "src", "data", "schools", "greenwood-demo", "app-config.json"),
    "utf8",
  ),
);
const theme = shared.theme;
const appPath = path.join(root, "app.json");
const app = JSON.parse(fs.readFileSync(appPath, "utf8"));
const androidPath = path.join(root, "android", "app", "build.gradle");
const androidStringsPath = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "res",
  "values",
  "strings.xml",
);
const androidStylesPath = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "res",
  "values",
  "styles.xml",
);
const androidColorsPath = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "res",
  "values",
  "colors.xml",
);
const androidSplashPath = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "res",
  "drawable-nodpi",
  "school_splash.png",
);
const androidIconDirectories = [
  "mipmap-mdpi",
  "mipmap-hdpi",
  "mipmap-xhdpi",
  "mipmap-xxhdpi",
  "mipmap-xxxhdpi",
].map((directory) =>
  path.join(root, "android", "app", "src", "main", "res", directory),
);
const androidAdaptiveIconPath = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "res",
  "drawable-nodpi",
  "ic_launcher_foreground.png",
);
const iosIconPath = path.join(
  root,
  "ios",
  "GreenwoodGuardian",
  "Images.xcassets",
  "AppIcon.appiconset",
  "AppIcon.png",
);
const iosProjectPath = path.join(
  root,
  "ios",
  "GreenwoodGuardian.xcodeproj",
  "project.pbxproj",
);
const iosInfoPath = path.join(root, "ios", "GreenwoodGuardian", "Info.plist");
const iosLaunchPath = path.join(
  root,
  "ios",
  "GreenwoodGuardian",
  "LaunchScreen.storyboard",
);

for (const [name, value] of Object.entries({
  appName: school.name,
  androidPackage: config.android?.package,
  iosBundleIdentifier: config.ios?.bundleIdentifier,
  version: config.version,
})) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`The active school's app-config.json is missing ${name}.`);
  }
}

function ensureConfiguredAsset(relativePath, label) {
  if (typeof relativePath !== "string" || relativePath.trim() === "") return;
  const assetPath = path.resolve(root, relativePath);
  if (!fs.existsSync(assetPath)) {
    throw new Error(`Configured ${label} does not exist: ${relativePath}`);
  }
}

function replaceRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Unable to update ${label}; the native template has changed.`);
  }
  return content.replace(pattern, replacement);
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

ensureConfiguredAsset(config.icon, "app icon");
ensureConfiguredAsset(config.android.adaptiveIcon.foregroundImage, "Android adaptive icon");
ensureConfiguredAsset(config.splash?.android?.image, "Android splash image");

app.name = "GreenwoodGuardian";
app.displayName = school.name;
fs.writeFileSync(appPath, `${JSON.stringify(app, null, 2)}\n`);

let gradle = fs.readFileSync(androidPath, "utf8");
gradle = replaceRequired(
  gradle,
  /(\bnamespace\s+)"[^"]+"/,
  `$1"${config.android.package}"`,
  "Android namespace",
);
gradle = replaceRequired(
  gradle,
  /(\bapplicationId\s+)"[^"]+"/,
  `$1"${config.android.package}"`,
  "Android application ID",
);
gradle = replaceRequired(
  gradle,
  /(\bversionName\s+)"[^"]+"/,
  `$1"${config.version}"`,
  "Android version",
);
fs.writeFileSync(androidPath, gradle);

const escapedName = xmlEscape(school.name);
fs.writeFileSync(
  androidStringsPath,
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="app_name">${escapedName}</string>\n</resources>\n`,
);
fs.writeFileSync(
  androidColorsPath,
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="splash_background">${theme.light.primaryDark}</color>\n    <color name="ic_launcher_background">${theme.light.primaryDark}</color>\n</resources>\n`,
);
let androidStyles = fs.readFileSync(androidStylesPath, "utf8");
androidStyles = replaceRequired(
  androidStyles,
  /<style name="AppTheme" parent="[^"]+">/,
  `<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">`,
  "Android application theme",
);
const splashStyleItems = [
  '<item name="android:windowBackground">@color/splash_background</item>',
  '<item name="android:windowSplashScreenBackground">@color/splash_background</item>',
  '<item name="android:windowSplashScreenAnimatedIcon">@drawable/school_splash</item>',
];
androidStyles = androidStyles.replace(
  /^[ \t]*<item name="android:window(?:Background|SplashScreenBackground|SplashScreenAnimatedIcon)">.*<\/item>[ \t]*\r?\n?/gm,
  "",
);
androidStyles = androidStyles.replace(/(\r?\n[ \t]*){3,}/g, "\n\n");
const splashItems = splashStyleItems.map((item) => `        ${item}`).join("\n");
const updatedAndroidStyles = androidStyles.replace(
  /^[ \t]*<\/style>/m,
  `${splashItems}\n    </style>`,
);
if (updatedAndroidStyles === androidStyles) {
  throw new Error("Unable to update Android application theme; the native template has changed.");
}
androidStyles = updatedAndroidStyles;
fs.writeFileSync(androidStylesPath, androidStyles);
fs.mkdirSync(path.dirname(androidSplashPath), { recursive: true });
fs.copyFileSync(
  path.resolve(root, config.splash.android.image),
  androidSplashPath,
);
for (const directory of androidIconDirectories) {
  const iconPath = path.join(directory, "ic_launcher.png");
  fs.copyFileSync(path.resolve(root, config.icon), iconPath);
  fs.copyFileSync(path.resolve(root, config.icon), path.join(directory, "ic_launcher_round.png"));
}
fs.copyFileSync(
  path.resolve(root, config.android.adaptiveIcon.foregroundImage),
  androidAdaptiveIconPath,
);
fs.copyFileSync(path.resolve(root, config.icon), iosIconPath);

let iosProject = fs.readFileSync(iosProjectPath, "utf8");
iosProject = replaceRequired(
  iosProject,
  /PRODUCT_BUNDLE_IDENTIFIER = "[^"]+";/,
  `PRODUCT_BUNDLE_IDENTIFIER = "${config.ios.bundleIdentifier}";`,
  "iOS bundle identifier",
);
iosProject = iosProject.replace(
  /PRODUCT_BUNDLE_IDENTIFIER = "[^"]+";/g,
  `PRODUCT_BUNDLE_IDENTIFIER = "${config.ios.bundleIdentifier}";`,
);
iosProject = replaceRequired(
  iosProject,
  /MARKETING_VERSION = [^;]+;/,
  `MARKETING_VERSION = ${config.version};`,
  "iOS marketing version",
);
fs.writeFileSync(iosProjectPath, iosProject);

let iosInfo = fs.readFileSync(iosInfoPath, "utf8");
iosInfo = replaceRequired(
  iosInfo,
  /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
  `$1${escapedName}$2`,
  "iOS display name",
);
if (!iosInfo.includes("<key>NSPhotoLibraryUsageDescription</key>")) {
  iosInfo = iosInfo.replace(
    "</dict>",
    `\t<key>NSPhotoLibraryUsageDescription</key>\n\t<string>Choose a profile photo for your guardian account.</string>\n\t<key>NSPhotoLibraryAddUsageDescription</key>\n\t<string>Save selected profile photos to your photo library.</string>\n</dict>`,
  );
}
fs.writeFileSync(iosInfoPath, iosInfo);

let iosLaunch = fs.readFileSync(iosLaunchPath, "utf8");
iosLaunch = replaceRequired(
  iosLaunch,
  /(<label\b[^>]*\btext=")[^"]+"/,
  `$1${escapedName}"`,
  "iOS launch-screen name",
);
fs.writeFileSync(iosLaunchPath, iosLaunch);

console.log(`Applied native branding for ${school.name}`);
console.log(`Android application ID: ${config.android.package}`);
console.log(`iOS bundle identifier: ${config.ios.bundleIdentifier}`);
console.log("Rebuild the native app to apply launcher and splash changes.");
