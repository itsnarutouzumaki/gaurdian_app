const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const shared = JSON.parse(fs.readFileSync(path.resolve(root, '..', 'shared/school-config.json'), 'utf8'));
const school = shared.school;
const academic = shared.academic;
const app = JSON.parse(fs.readFileSync(path.join(root, 'src/data/schools/greenwood-demo/app-config.json'), 'utf8'));
const theme = shared.theme;
const media = shared.media;
const teachers = JSON.parse(fs.readFileSync(path.join(root, 'src/data/schools/greenwood-demo/teachers.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/mock-data.json'), 'utf8'));
const appConfig = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
const packageConfig = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const androidBuild = fs.readFileSync(path.join(root, 'android', 'app', 'build.gradle'), 'utf8');
const androidStrings = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml'), 'utf8');
const androidStyles = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'styles.xml'), 'utf8');
const androidColors = fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'colors.xml'), 'utf8');
const iosProject = fs.readFileSync(path.join(root, 'ios', 'GreenwoodGuardian.xcodeproj', 'project.pbxproj'), 'utf8');
const iosInfo = fs.readFileSync(path.join(root, 'ios', 'GreenwoodGuardian', 'Info.plist'), 'utf8');
const ok = (condition, message) => assert.ok(condition, message);

ok(shared.schoolId === 'greenwood-demo', 'shared school ID does not match the configured demo school');
ok(school.name && media.coverImages[0], 'shared school configuration needs a name and cover image');
ok(academic.defaultAcademicYear, 'shared school configuration needs a default academic year');
ok(academic.availableAcademicYears.includes(academic.defaultAcademicYear), 'default academic year must exist in availableAcademicYears');
ok(appConfig.name === 'GreenwoodGuardian', 'React Native app registry name is stale; run npm run config:apply');
ok(appConfig.displayName === school.name, 'app.json display name is stale; run npm run config:apply');
ok(packageConfig.main === 'index.js', 'package.json must use the React Native CLI entry point');
ok(packageConfig.scripts.start === 'react-native start', 'Metro must start through the React Native CLI');
ok(!Object.keys(packageConfig.dependencies).some(name => name.startsWith('expo-') || name === 'expo'), 'Expo packages remain in package.json');
ok(androidBuild.includes(`namespace "${app.android.package}"`), 'Android namespace is stale; run npm run config:apply');
ok(androidBuild.includes(`applicationId "${app.android.package}"`), 'Android application ID is stale; run npm run config:apply');
ok(androidBuild.includes(`versionName "${app.version}"`), 'Android version is stale; run npm run config:apply');
ok(androidStrings.includes(`<string name="app_name">${school.name}</string>`), 'Android display name is stale; run npm run config:apply');
ok(iosProject.includes(`PRODUCT_BUNDLE_IDENTIFIER = "${app.ios.bundleIdentifier}";`), 'iOS bundle identifier is stale; run npm run config:apply');
ok(iosInfo.includes(`<string>${school.name}</string>`), 'iOS display name is stale; run npm run config:apply');
ok(androidStyles.includes('@drawable/school_splash'), 'Android native splash image is not configured; run npm run config:apply');
ok(theme.defaultMode === 'light' && theme.light && theme.dark === null, 'A dark palette needs to be supplied before selecting dark mode');
ok(Array.isArray(media.galleryImages) && media.galleryImages.length > 0, 'shared school media needs a photo gallery');
ok(media.galleryImages.includes(media.coverImages[0]), 'cover image should be included in the school photo gallery');
ok(media.logo === 'assets/logo.png', 'shared school logo path is incorrect');
ok(fs.existsSync(path.resolve(root, '..', 'shared', media.logo)), 'Configured shared/assets/logo.png is missing.');
if (app.icon) ok(fs.existsSync(path.join(root, app.icon)), `Configured app icon is missing: ${app.icon}`);
ok(Boolean(app.icon), 'The app needs a configured launcher icon');
ok(Boolean(app.android.adaptiveIcon.foregroundImage), 'The app needs a configured Android adaptive icon');
if (app.android.adaptiveIcon.foregroundImage) {
  ok(fs.existsSync(path.join(root, app.android.adaptiveIcon.foregroundImage)), `Configured Android adaptive icon is missing: ${app.android.adaptiveIcon.foregroundImage}`);
}
ok(fs.existsSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi', 'school_splash.png')), 'Android native splash image is missing; run npm run config:apply');
ok(fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher.png')).equals(fs.readFileSync(path.join(root, app.icon))), 'Android launcher icon is stale; run npm run config:apply');
ok(fs.readFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi', 'ic_launcher_foreground.png')).equals(fs.readFileSync(path.join(root, app.android.adaptiveIcon.foregroundImage))), 'Android adaptive launcher icon is stale; run npm run config:apply');
ok(fs.readFileSync(path.join(root, 'ios', 'GreenwoodGuardian', 'Images.xcassets', 'AppIcon.appiconset', 'AppIcon.png')).equals(fs.readFileSync(path.join(root, app.icon))), 'iOS launcher icon is stale; run npm run config:apply');
ok(androidColors.includes(theme.light.primaryDark), 'Android splash background must match school primaryDark');
ok(fs.existsSync(path.join(root, app.splash.android.image)), `Configured Android splash image is missing: ${app.splash.android.image}`);
ok(Number.isFinite(app.splash.android.imageWidth) && app.splash.android.imageWidth > 0, 'Android splash image width must be a positive number');

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
  ok(child.currentAcademicYear === academic.defaultAcademicYear, `${child.id} current academic year does not match shared config`);
  ok(child.academicYears.length >= 3, `${child.id} needs at least three academic years`);
  for (const year of child.academicYears) {
    ok(academic.availableAcademicYears.includes(year.label), `${child.id}/${year.label} is not in the configured academic years`);
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
