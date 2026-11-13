const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const root = path.join(__dirname, "..");
const shared = JSON.parse(
  fs.readFileSync(
    path.resolve(root, "..", "shared", "school-config.json"),
    "utf8",
  ),
);
const schoolApp = shared.parentApp;

assert.equal(shared.schoolId, "test-international");
assert.equal(shared.tenantCode, "TEST-INTERNATIONAL");
assert.equal(shared.school.name, "Test International School");
assert.match(shared.apiBaseUrl, /^https:\/\//);
assert.equal(shared.academic.defaultAcademicYear, "2026-27");
assert.deepEqual(shared.academic.availableAcademicYears, ["2026-27"]);
assert.equal(shared.school.established, null);
assert.equal(shared.school.phone, "");
assert.equal(shared.school.email, "");
assert.equal(shared.school.website, "");
assert.deepEqual(shared.school.facilities, []);
assert.deepEqual(shared.media.coverImages, []);
assert.deepEqual(shared.media.galleryImages, []);
assert.deepEqual(shared.media.videos, []);
assert.equal(schoolApp.slug, "test-international-school");
assert.equal(schoolApp.android.package, "com.testinternational.guardian");
assert.equal(schoolApp.ios.bundleIdentifier, "com.testinternational.guardian");
assert.equal(schoolApp.name, "TestInternationalGuardian");
for (const asset of [
  shared.media.logo,
  schoolApp.icon,
  schoolApp.android.adaptiveIcon.foregroundImage,
  schoolApp.splash.android.image,
]) {
  assert.ok(
    fs.existsSync(path.resolve(root, "..", "shared", asset)),
    `Configured school asset is missing from shared: ${asset}`,
  );
}
function assertNativeAssetMatchesShared(sharedAsset, nativeAsset) {
  const sharedAssetPath = path.resolve(root, "..", "shared", sharedAsset);
  const nativeAssetPath = path.join(root, nativeAsset);
  assert.ok(fs.existsSync(nativeAssetPath), `Generated native asset is missing: ${nativeAsset}`);
  const hash = (filePath) =>
    crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  assert.equal(
    hash(nativeAssetPath),
    hash(sharedAssetPath),
    `Generated native asset is out of sync with shared source: ${nativeAsset}`,
  );
}
assertNativeAssetMatchesShared(
  schoolApp.splash.android.image,
  path.join("android", "app", "src", "main", "res", "drawable-nodpi", "school_splash.png"),
);
assertNativeAssetMatchesShared(
  schoolApp.android.adaptiveIcon.foregroundImage,
  path.join("android", "app", "src", "main", "res", "drawable-nodpi", "ic_launcher_foreground.png"),
);
for (const density of ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]) {
  for (const fileName of ["ic_launcher.png", "ic_launcher_round.png"]) {
    assertNativeAssetMatchesShared(
      schoolApp.icon,
      path.join("android", "app", "src", "main", "res", `mipmap-${density}`, fileName),
    );
  }
}
assertNativeAssetMatchesShared(
  schoolApp.icon,
  path.join(
    "ios",
    "TestInternationalGuardian",
    "Images.xcassets",
    "AppIcon.appiconset",
    "AppIcon.png",
  ),
);
assert.equal(
  fs.existsSync(path.join(root, "src", "data", "schools", shared.schoolId, "app-config.json")),
  false,
  "Parent school app configuration must only be sourced from shared.",
);
assert.equal(
  fs.existsSync(path.join(root, "assets")),
  false,
  "School-owned source assets must only be stored in shared.",
);

const androidBuild = fs.readFileSync(path.join(root, "android", "app", "build.gradle"), "utf8");
assert.match(androidBuild, /namespace\s+"com\.testinternational\.guardian"/);
assert.match(androidBuild, /applicationId\s+"com\.testinternational\.guardian"/);

for (const section of ["helpTopics", "termsSections", "privacySections"]) {
  const english = shared.guardianContent[section].en;
  const hindi = shared.guardianContent[section].hi;
  assert.ok(english.length > 0, `${section} English content is missing`);
  assert.equal(english.length, hindi.length, `${section} translations differ in length`);
  for (const [index, item] of english.entries()) {
    assert.ok(item.title && item.body, `${section} English entry ${index} is incomplete`);
    assert.ok(hindi[index].title && hindi[index].body, `${section} Hindi entry ${index} is incomplete`);
  }
}

for (const fixture of [
  "src/data/mock-data.json",
  "src/data/mock-examinations.ts",
  `src/data/schools/${shared.schoolId}/teachers.json`,
  "scripts/generate-mock-data.py",
]) {
  assert.equal(
    fs.existsSync(path.join(root, fixture)),
    false,
    `Removed demo fixture still exists: ${fixture}`,
  );
}

const apiConfig = fs.readFileSync(path.join(root, "src", "config", "api.ts"), "utf8");
assert.match(apiConfig, /school-config\.json/);
assert.doesNotMatch(apiConfig, /schoolbackend-pazac5nn5a-el\.a\.run\.app|TEST-INTERNATIONAL/);

console.log("Shared Test International configuration and fixture-removal checks passed.");
