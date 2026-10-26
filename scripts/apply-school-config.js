const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const activeSchool = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/schools/active-school.json'), 'utf8'),
);
const schoolRoot = path.join(root, 'src/data/schools', activeSchool.schoolId);
const school = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'school.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'app-config.json'), 'utf8'));
const theme = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'theme.json'), 'utf8'));
const appPath = path.join(root, 'app.json');
const app = JSON.parse(fs.readFileSync(appPath, 'utf8'));

if (school.id !== activeSchool.schoolId) {
  throw new Error(`Active school "${activeSchool.schoolId}" does not match school.json ID "${school.id}".`);
}
for (const [name, value] of Object.entries({
  appName: config.appName,
  slug: config.slug,
  scheme: config.scheme,
  version: config.version,
  androidPackage: config.android?.package,
  iosBundleIdentifier: config.ios?.bundleIdentifier,
})) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`The active school's app-config.json is missing ${name}.`);
  }
}

function ensureConfiguredAsset(relativePath, label) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') return;
  if (!fs.existsSync(path.join(root, relativePath))) {
    throw new Error(`Configured ${label} does not exist: ${relativePath}`);
  }
}

ensureConfiguredAsset(config.icon, 'app icon');
ensureConfiguredAsset(config.android.adaptiveIcon.foregroundImage, 'Android adaptive icon');
ensureConfiguredAsset(config.splash?.android?.image, 'Android splash image');

const splashPluginName = 'expo-splash-screen';
const splashPluginOptions = { android: config.splash.android };
const existingPlugins = (app.expo.plugins || []).filter((plugin) => {
  const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
  return pluginName !== splashPluginName;
});
existingPlugins.push([splashPluginName, splashPluginOptions]);

app.expo.name = config.appName;
app.expo.slug = config.slug;
app.expo.scheme = config.scheme;
app.expo.version = config.version;
app.expo.backgroundColor = theme.light.pageBackground;
app.expo.userInterfaceStyle = theme.defaultMode;
app.expo.plugins = existingPlugins;
app.expo.ios = {
  ...(app.expo.ios || {}),
  bundleIdentifier: config.ios.bundleIdentifier,
};
app.expo.android = {
  ...(app.expo.android || {}),
  package: config.android.package,
  adaptiveIcon: {
    ...((app.expo.android || {}).adaptiveIcon || {}),
    backgroundColor: config.android.adaptiveIcon.backgroundColor,
  },
};
if (config.icon) app.expo.icon = config.icon;
else delete app.expo.icon;
if (config.android.adaptiveIcon.foregroundImage) {
  app.expo.android.adaptiveIcon.foregroundImage = config.android.adaptiveIcon.foregroundImage;
} else delete app.expo.android.adaptiveIcon.foregroundImage;

fs.writeFileSync(appPath, `${JSON.stringify(app, null, 2)}\n`);
console.log(`Applied branding for ${school.name}`);
console.log(`App name: ${app.expo.name}`);
console.log(`Slug: ${app.expo.slug}`);
console.log('The native launcher name and identifiers change at build time, not while the app is already installed.');
