const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'guardian-app-check-'));
try {
  for (const file of ['format', 'calendar', 'back-navigation', 'push-payload']) {
    const sourcePath = path.join(root, 'src/lib', `${file}.ts`);
    const transpiled = ts.transpileModule(fs.readFileSync(sourcePath, 'utf8'), {
      fileName: sourcePath,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    fs.writeFileSync(path.join(temp, `${file}.js`), transpiled.outputText);
  }
  const format = require(path.join(temp, 'format.js'));
  const calendar = require(path.join(temp, 'calendar.js'));
  const navigation = require(path.join(temp, 'back-navigation.js'));
  const { parsePushTapPayload } = require(path.join(temp, 'push-payload.js'));
  const mock = JSON.parse(fs.readFileSync(path.join(root, 'src/data/mock-data.json'), 'utf8'));
  const activeSchool = JSON.parse(fs.readFileSync(path.join(root, 'src/data/schools/active-school.json'), 'utf8'));
  const teachers = JSON.parse(fs.readFileSync(path.join(root, 'src/data/schools', activeSchool.schoolId, 'teachers.json'), 'utf8'));
  const complete = mock.guardian;
  assert.equal(format.isProfileComplete(complete), true);
  assert.equal(format.isProfileComplete({ ...complete, fullName: '' }), false);
  assert.equal(format.isProfileComplete({ ...complete, mobileNumber: '' }), false);
  assert.equal(format.isProfileComplete({ ...complete, email: '' }), false);
  assert.equal(format.isProfileComplete({ ...complete, profilePhotoUrl: null }), false);
  assert.equal(calendar.validateDateRange('2026-10-28', '2026-10-29'), null);
  assert.match(calendar.validateDateRange('2026-10-30', '2026-10-29'), /cannot be before/);
  assert.match(calendar.validateDateRange('', '2026-10-29'), /select both/);
  const cells = calendar.createCalendarGrid(2026, 1, [{ day: 1, date: '2026-02-01', status: 'present' }]);
  assert.equal(cells.length % 7, 0);
  assert.equal(cells.filter(cell => cell && cell.day).length, 28);
  assert.equal(cells.find(cell => cell && cell.day === 1).status, 'present');
  assert.equal(navigation.getHardwareBackDecision({
    stackLength: 3, route: 'Results', authenticated: true, modalVisible: false,
  }), 'pop');
  assert.equal(navigation.getHardwareBackDecision({
    stackLength: 1, route: 'Notifications', authenticated: true, modalVisible: false,
  }), 'home');
  assert.equal(navigation.getHardwareBackDecision({
    stackLength: 1, route: 'Home', authenticated: true, modalVisible: false,
  }), 'exit');
  assert.equal(navigation.getHardwareBackDecision({
    stackLength: 1, route: 'Login', authenticated: false, modalVisible: false,
  }), 'exit');
  assert.equal(navigation.getHardwareBackDecision({
    stackLength: 2, route: 'Results', authenticated: true, modalVisible: true,
  }), 'dismiss-modal');
  assert.deepEqual(parsePushTapPayload({ route: 'Attendance', childId: 'child-1' }), {
    route: 'Attendance',
    childId: 'child-1',
  });
  assert.deepEqual(parsePushTapPayload({ route: 'Notifications' }), {
    route: 'Notifications',
  });
  assert.equal(parsePushTapPayload({ route: 'DeleteAccount' }), null);
  assert.equal(parsePushTapPayload({ route: 'Home', childId: 7 }), null);
  assert.equal(parsePushTapPayload(null), null);
  assert.equal(format.money(123456), '₹1,23,456');
  for (const child of mock.children) {
    const current = child.academicYears.find(year => year.label === '2026-27');
    const historical = child.academicYears.find(year => year.label === '2024-25');
    assert.equal(current.subjects.find(subject => subject.name === 'Mathematics').teacherId, 't-priya');
    assert.equal(historical.subjects.find(subject => subject.name === 'Mathematics').teacherId, 't-rakesh');
  }
  assert.ok(teachers.some(teacher => teacher.id === 't-priya'));
  assert.ok(teachers.some(teacher => teacher.id === 't-rakesh'));
  console.log('Logic checks passed: profile completion, leave date validation, calendar construction, INR formatting, historical teacher mapping, Back handling and notification payload validation.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
