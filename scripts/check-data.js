const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const activeSchool = JSON.parse(fs.readFileSync(path.join(root, 'src/data/schools/active-school.json'), 'utf8'));
const schoolRoot = path.join(root, 'src/data/schools', activeSchool.schoolId);
const school = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'school.json'), 'utf8'));
const app = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'app-config.json'), 'utf8'));
const theme = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'theme.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'media.json'), 'utf8'));
const teachers = JSON.parse(fs.readFileSync(path.join(schoolRoot, 'teachers.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/mock-data.json'), 'utf8'));
const appConfig = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
const ok = (condition, message) => assert.ok(condition, message);

ok(activeSchool.schoolId === school.id, 'active-school.json must select the matching school configuration');
ok(school.name && media.coverImage, 'school configuration needs a name and cover image');
ok(school.defaultAcademicYear, 'school configuration needs a default academic year');
ok(school.availableAcademicYears.includes(school.defaultAcademicYear), 'default academic year must exist in availableAcademicYears');
ok(app.appName === school.name, 'appName should match the school name by default');
ok(appConfig.name === app.appName, 'app.json app name is stale; run npm run config:apply');
ok(appConfig.slug === app.slug, 'app.json slug is stale; run npm run config:apply');
ok(appConfig.scheme === app.scheme, 'app.json scheme is stale; run npm run config:apply');
ok(appConfig.version === app.version, 'app.json version is stale; run npm run config:apply');
ok(appConfig.userInterfaceStyle === theme.defaultMode, 'App appearance mode is stale; run npm run config:apply');
ok(appConfig.android.package === app.android.package, 'Android package is stale; run npm run config:apply');
ok(appConfig.ios.bundleIdentifier === app.ios.bundleIdentifier, 'iOS bundle identifier is stale; run npm run config:apply');
ok(appConfig.backgroundColor === theme.light.pageBackground, 'App background color is stale; run npm run config:apply');
ok(appConfig.android.adaptiveIcon.backgroundColor === theme.light.primaryDark, 'Android adaptive icon background is stale; run npm run config:apply');
ok(theme.defaultMode === 'light' && theme.light && theme.dark === null, 'A dark palette needs to be supplied before selecting dark mode');
ok(Array.isArray(media.photos) && media.photos.length > 0, 'school media needs a photo gallery');
ok(media.photos.includes(media.coverImage), 'cover image should be included in the school photo gallery');
ok(media.logo?.kind === 'bundled' && media.logo.assetKey && media.logo.altText, 'school logo needs a registered bundled asset and alternative text');
const escapedAssetKey = media.logo.assetKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const assetMap = fs.readFileSync(path.join(schoolRoot, 'assets.ts'), 'utf8');
const assetEntry = new RegExp(`["']${escapedAssetKey}["']\\s*:\\s*require\\(["']([^"']+)["']\\)`).exec(assetMap);
ok(assetEntry, `No statically bundled image is registered for ${media.logo.assetKey}`);
ok(fs.existsSync(path.resolve(schoolRoot, assetEntry[1])), `Bundled school logo file is missing: ${assetEntry[1]}`);
if (app.icon) ok(fs.existsSync(path.join(root, app.icon)), `Configured app icon is missing: ${app.icon}`);
ok(Boolean(app.icon), 'The active school needs a configured launcher icon');
ok(appConfig.icon === app.icon, 'app.json icon does not match the active school configuration');
ok(Boolean(app.android.adaptiveIcon.foregroundImage), 'The active school needs a configured Android adaptive icon');
if (app.android.adaptiveIcon.foregroundImage) {
  ok(fs.existsSync(path.join(root, app.android.adaptiveIcon.foregroundImage)), `Configured Android adaptive icon is missing: ${app.android.adaptiveIcon.foregroundImage}`);
}
ok(appConfig.android.adaptiveIcon.foregroundImage === app.android.adaptiveIcon.foregroundImage, 'Android adaptive icon does not match the active school configuration');
const splashPlugin = appConfig.plugins.find(
  plugin => (Array.isArray(plugin) ? plugin[0] : plugin) === 'expo-splash-screen',
);
ok(Array.isArray(splashPlugin), 'Expo splash-screen plugin is not configured; run npm run config:apply');
const splashOptions = splashPlugin[1]?.android;
ok(splashOptions?.image === app.splash.android.image, 'Android splash image is stale; run npm run config:apply');
ok(splashOptions?.imageWidth === app.splash.android.imageWidth, 'Android splash image width is stale; run npm run config:apply');
ok(splashOptions?.resizeMode === app.splash.android.resizeMode, 'Android splash resize mode is stale; run npm run config:apply');
ok(splashOptions?.backgroundColor === theme.light.primaryDark, 'Android splash background must match school primaryDark');
ok(app.splash.android.backgroundColor === theme.light.primaryDark, 'Configured Android splash color must match school primaryDark');
ok(fs.existsSync(path.join(root, app.splash.android.image)), `Configured Android splash image is missing: ${app.splash.android.image}`);
ok(Number.isFinite(app.splash.android.imageWidth) && app.splash.android.imageWidth > 0, 'Android splash image width must be a positive number');
ok(appConfig.plugins.some(plugin => (Array.isArray(plugin) ? plugin[0] : plugin) === 'expo-notifications'), 'Expo notifications plugin is not configured');

ok(data.guardian, 'guardian mock profile is missing');
for (const key of ['fullName', 'mobileNumber', 'email', 'profilePhotoUrl']) ok(key in data.guardian, `guardian.${key} is missing`);
ok(Array.isArray(data.children) && data.children.length >= 2, 'at least two demo children are required');
ok(Array.isArray(teachers) && teachers.length >= 3, 'a useful teacher directory is required');
ok(!('teachers' in data), 'teacher records belong in the selected school configuration');
const childIds = new Set();
const studentIds = new Set();
const teacherIds = new Set(teachers.map(teacher => teacher.id));
for (const child of data.children) {
  ok(!childIds.has(child.id), `duplicate child id: ${child.id}`);
  childIds.add(child.id);
  ok(!studentIds.has(child.studentId), `duplicate student id: ${child.studentId}`);
  studentIds.add(child.studentId);
  ok(/^\d{4}-[A-Z]-\d{2}-[A-Z]-\d{3}$/.test(child.studentId), `${child.studentId} does not match the example student ID format`);
  ok(child.fullName && child.photoUrl, `${child.id} needs name/photo`);
  ok(child.academicYears.some(year => year.label === child.currentAcademicYear), `${child.id} is missing its current academic year`);
  ok(child.currentAcademicYear === school.defaultAcademicYear, `${child.id} current academic year does not match config`);
  ok(child.academicYears.length >= 3, `${child.id} needs at least three academic years`);
  for (const year of child.academicYears) {
    ok(school.availableAcademicYears.includes(year.label), `${child.id}/${year.label} is not in the configured academic years`);
    ok(year.attendance && year.attendance.months.length > 0, `${child.id}/${year.label}: attendance months are missing`);
    const attendance = year.attendance;
    ok(attendance.totalClasses === attendance.present + attendance.absent, `${child.id}/${year.label}: classes must equal present + absent (holidays/no-class excluded)`);
    const percentage = Math.round(attendance.present / Math.max(1, attendance.present + attendance.absent) * 100);
    ok(attendance.percentage === percentage, `${child.id}/${year.label}: attendance percentage is inconsistent`);
    const records = year.attendance.months.flatMap(month => month.records);
    const holidayCount = records.filter(record => record.status === 'holiday').length;
    ok(attendance.holidays === holidayCount, `${child.id}/${year.label}: holiday count is inconsistent`);
    for (const month of year.attendance.months) {
      ok(month.records.every(record => ['present', 'absent', 'holiday', 'noClass', 'unmarked'].includes(record.status)), `${child.id}/${year.label}/${month.month}: invalid attendance status`);
      ok(new Set(month.records.map(record => record.day)).size === month.records.length, `${child.id}/${year.label}/${month.month}: duplicate calendar day`);
    }
    ok(Array.isArray(year.subjects) && year.subjects.length >= 3, `${child.id}/${year.label}: subjects are missing`);
    ok(Array.isArray(year.feeReceipts) && year.feeReceipts.length >= 2, `${child.id}/${year.label}: fee receipts are missing`);
    ok(teacherIds.has(year.classTeacherId), `${child.id}/${year.label}: class teacher does not exist`);
    for (const receipt of year.feeReceipts) {
      const total = Object.values(receipt.breakdown).reduce((sum, amount) => sum + amount, 0);
      ok(total === receipt.total, `${receipt.id}: receipt total does not equal the fee breakdown`);
      ok(receipt.academicYear === year.label, `${receipt.id}: receipt is linked to the wrong academic year`);
    }
    for (const subject of year.subjects) {
      ok(teacherIds.has(subject.teacherId), `${subject.name} references missing teacher ${subject.teacherId}`);
      ok(!('marks' in subject) && !('score' in subject), `marks must not appear in the subject overview record: ${subject.name}`);
      ok(Array.isArray(subject.tests) && subject.tests.length > 0, `${subject.name} needs test/exam records`);
      for (const test of subject.tests) {
        ok(Number.isFinite(test.score) && Number.isFinite(test.maxScore) && test.maxScore > 0 && test.score <= test.maxScore, `${test.id} has invalid test marks`);
        ok(typeof test.copyAvailable === 'boolean', `${test.id} must declare copy availability`);
        ok(teacherIds.has(test.teacherId), `${test.id} references a missing teacher`);
        ok(!('questionWiseMarks' in test) && !('questionMarks' in test), `${test.id} must not expose question-wise marks`);
      }
    }
  }
}
for (const teacher of teachers) ok(teacher.highestDegree && teacher.about, `${teacher.id} needs a professional profile`);
for (const notice of data.notifications) if (notice.childId) ok(childIds.has(notice.childId), `${notice.id} references unknown child ${notice.childId}`);
for (const request of data.leaveRequests) ok(childIds.has(request.childId), `${request.id} references an unknown child`);
for (const request of data.complaints) ok(childIds.has(request.childId), `${request.id} references an unknown child`);
ok(data.helpTopics.length >= 5, 'help topics should include key guardian flows');
ok(data.termsSections.length >= 3 && data.privacySections.length >= 3, 'policy content is incomplete');
console.log('Mock data and school-configuration checks passed.');
console.log(`School: ${school.name}`);
console.log(`Children: ${data.children.length} · Teachers: ${teachers.length}`);
console.log(`Academic-year records: ${data.children.reduce((sum, child) => sum + child.academicYears.length, 0)}`);
console.log(`Subjects: ${data.children.reduce((sum, child) => sum + child.academicYears.reduce((n, year) => n + year.subjects.length, 0), 0)}`);
console.log(`Test/exam records: ${data.children.reduce((sum, child) => sum + child.academicYears.reduce((n, year) => n + year.subjects.reduce((m, subject) => m + subject.tests.length, 0), 0), 0)}`);
