const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'src/data/school-config.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/mock-data.json'), 'utf8'));
const appConfig = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
const ok = (condition, message) => assert.ok(condition, message);

ok(config.school?.name && config.school?.heroPhotoUrl, 'school-config.json needs a school name and hero photo');
ok(config.app?.defaultAcademicYear, 'school-config.json needs a default academic year');
ok(config.app?.availableAcademicYears?.includes(config.app.defaultAcademicYear), 'default academic year must exist in availableAcademicYears');
ok(config.app?.appName === config.school.name, 'appName should match the school name by default');
ok(appConfig.name === config.app.appName, 'app.json app name is stale; run npm run config:apply');
ok(appConfig.slug === config.app.appSlug, 'app.json slug is stale; run npm run config:apply');
ok(appConfig.android.package === config.app.androidPackage, 'Android package is stale; run npm run config:apply');
ok(appConfig.ios.bundleIdentifier === config.app.iosBundleIdentifier, 'iOS bundle identifier is stale; run npm run config:apply');
ok(appConfig.backgroundColor === (config.school.theme.background || config.school.theme.bg), 'App background color is stale; run npm run config:apply');
ok(appConfig.android.adaptiveIcon.backgroundColor === config.school.theme.primaryDark, 'Android adaptive icon background is stale; run npm run config:apply');

ok(data.guardian, 'guardian mock profile is missing');
for (const key of ['fullName', 'mobileNumber', 'email', 'profilePhotoUrl']) ok(key in data.guardian, `guardian.${key} is missing`);
ok(Array.isArray(data.children) && data.children.length >= 2, 'at least two demo children are required');
ok(Array.isArray(data.teachers) && data.teachers.length >= 3, 'a useful teacher directory is required');
const childIds = new Set();
const studentIds = new Set();
const teacherIds = new Set(data.teachers.map(teacher => teacher.id));
for (const child of data.children) {
  ok(!childIds.has(child.id), `duplicate child id: ${child.id}`);
  childIds.add(child.id);
  ok(!studentIds.has(child.studentId), `duplicate student id: ${child.studentId}`);
  studentIds.add(child.studentId);
  ok(/^\d{4}-[A-Z]-\d{2}-[A-Z]-\d{3}$/.test(child.studentId), `${child.studentId} does not match the example student ID format`);
  ok(child.fullName && child.photoUrl, `${child.id} needs name/photo`);
  ok(child.academicYears.some(year => year.label === child.currentAcademicYear), `${child.id} is missing its current academic year`);
  ok(child.currentAcademicYear === config.app.defaultAcademicYear, `${child.id} current academic year does not match config`);
  ok(child.academicYears.length >= 3, `${child.id} needs at least three academic years`);
  for (const year of child.academicYears) {
    ok(config.app.availableAcademicYears.includes(year.label), `${child.id}/${year.label} is not in the configured academic years`);
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
for (const teacher of data.teachers) ok(teacher.highestDegree && teacher.about, `${teacher.id} needs a professional profile`);
for (const notice of data.notifications) if (notice.childId) ok(childIds.has(notice.childId), `${notice.id} references unknown child ${notice.childId}`);
for (const request of data.leaveRequests) ok(childIds.has(request.childId), `${request.id} references an unknown child`);
for (const request of data.complaints) ok(childIds.has(request.childId), `${request.id} references an unknown child`);
ok(data.helpTopics.length >= 5, 'help topics should include key guardian flows');
ok(data.termsSections.length >= 3 && data.privacySections.length >= 3, 'policy content is incomplete');
console.log('Mock data and school-branding checks passed.');
console.log(`School: ${config.school.name}`);
console.log(`Children: ${data.children.length} · Teachers: ${data.teachers.length}`);
console.log(`Academic-year records: ${data.children.reduce((sum, child) => sum + child.academicYears.length, 0)}`);
console.log(`Subjects: ${data.children.reduce((sum, child) => sum + child.academicYears.reduce((n, year) => n + year.subjects.length, 0), 0)}`);
console.log(`Test/exam records: ${data.children.reduce((sum, child) => sum + child.academicYears.reduce((n, year) => n + year.subjects.reduce((m, subject) => m + subject.tests.length, 0), 0), 0)}`);
