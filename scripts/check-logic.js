const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "guardian-app-check-"));

function transpile(relativePath) {
  const sourcePath = path.join(root, relativePath);
  const outputPath = path.join(
    temp,
    relativePath.replace(/\.ts$/, ".js"),
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const output = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    fileName: sourcePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  fs.writeFileSync(outputPath, output.outputText);
  return outputPath;
}

try {
  for (const file of [
    "src/lib/format.ts",
    "src/lib/calendar.ts",
    "src/lib/back-navigation.ts",
    "src/lib/push-payload.ts",
    "src/lib/examination-results.ts",
    "src/lib/document-rendering.ts",
    "src/templates/document-templates.ts",
    "src/services/guardian-data/map-guardian-bootstrap.ts",
    "src/services/guardian-data/map-guardian-child.ts",
    "src/services/guardian-data/map-guardian-teacher.ts",
  ]) {
    transpile(file);
  }

  const format = require(path.join(temp, "src/lib/format.js"));
  const calendar = require(path.join(temp, "src/lib/calendar.js"));
  const navigation = require(path.join(temp, "src/lib/back-navigation.js"));
  const { parsePushTapPayload } = require(path.join(temp, "src/lib/push-payload.js"));
  const { buildExaminationReport } = require(
    path.join(temp, "src/lib/examination-results.js"),
  );
  const documents = require(path.join(temp, "src/lib/document-rendering.js"));
  const { mapGuardianBootstrap } = require(
    path.join(temp, "src/services/guardian-data/map-guardian-bootstrap.js"),
  );

  assert.equal(format.isProfileComplete({ fullName: "Test Parent" }), true);
  assert.equal(format.isProfileComplete({ fullName: "" }), false);
  assert.equal(calendar.validateDateRange("2026-10-28", "2026-10-29"), null);
  assert.match(calendar.validateDateRange("2026-10-30", "2026-10-29"), /cannot be before/);
  assert.match(calendar.validateDateRange("", "2026-10-29"), /select both/);
  const cells = calendar.createCalendarGrid(2026, 1, [
    { day: 1, date: "2026-02-01", status: "present" },
  ]);
  assert.equal(cells.length % 7, 0);
  assert.equal(cells.find((cell) => cell && cell.day === 1).status, "present");
  assert.equal(
    navigation.getHardwareBackDecision({
      stackLength: 3,
      route: "Results",
      authenticated: true,
      modalVisible: false,
    }),
    "pop",
  );
  assert.equal(
    navigation.getHardwareBackDecision({
      stackLength: 1,
      route: "Home",
      authenticated: true,
      modalVisible: false,
    }),
    "exit",
  );
  assert.deepEqual(
    parsePushTapPayload({ route: "Attendance", childId: "student-1" }),
    { route: "Attendance", childId: "student-1" },
  );
  assert.equal(parsePushTapPayload({ route: "DeleteAccount" }), null);
  assert.equal(parsePushTapPayload(null), null);
  assert.equal(format.money(123456), "₹1,23,456");
  const englishDate = format.dateLabel("2026-10-24");
  format.setFormatLanguage("hi");
  assert.notEqual(format.dateLabel("2026-10-24"), englishDate);
  assert.match(format.monthTitle("October", 2026), /अक्टूबर/);
  format.setFormatLanguage("en");

  const subjects = [
    { id: "math", name: "Math & Logic" },
    { id: "science", name: "Science" },
  ];
  const examination = {
    id: "assessment-1",
    childId: "student-1",
    academicYear: "2026-27",
    type: "halfYearly",
    title: "Half-Yearly Examination",
    date: "2026-10-12",
    subjects: [
      { subjectId: "math", score: 45, maxScore: 50 },
      { subjectId: "science", score: 38, maxScore: 50 },
    ],
  };
  const report = buildExaminationReport(examination, subjects);
  assert.equal(report.totalScore, 83);
  assert.equal(report.maxScore, 100);
  assert.equal(report.percentage, 83);
  assert.throws(
    () =>
      buildExaminationReport(
        { ...examination, subjects: [{ subjectId: "missing", score: 1, maxScore: 1 }] },
        subjects,
      ),
    /unknown subject/,
  );

  const brand = {
    schoolName: "Test International School",
    address: "",
    phone: "",
    email: "",
    accentColor: "#075DCE",
    footerNote: "Generated from school records.",
  };
  const child = { id: "student-1", fullName: "<Test Student>", studentId: "A1" };
  const year = { label: "2026-27", className: "Class 1", section: "A" };
  const feeReceipts = [
    {
      id: "receipt-1",
      label: "April",
      academicYear: "2026-27",
      breakdown: { Tuition: 1000 },
      total: 1000,
      paid: true,
      paymentDate: "2026-04-10",
      paymentMode: "UPI",
      transactionId: "TX-1",
    },
  ];
  const feeStatement = documents.buildFeeStatementHtml(
    brand,
    "school-classic",
    child,
    year,
    feeReceipts,
  );
  assert.match(feeStatement, /Academic Year Fee Statement/);
  assert.match(feeStatement, /&lt;Test Student&gt;/);
  assert.match(feeStatement, /Generated from school records\./);
  assert.doesNotMatch(feeStatement, /DEMO DOCUMENT/);
  assert.doesNotMatch(feeStatement, /<Test Student>/);
  assert.throws(
    () => documents.buildFeeStatementHtml(brand, "missing-template", child, year, feeReceipts),
    /Unknown school document template/,
  );
  assert.match(
    documents.buildExaminationHtml(
      brand,
      "school-classic",
      child,
      year,
      examination,
      subjects,
    ),
    /83\.0%/,
  );

  const academicYear = {
    _id: "year-1",
    label: "2026-27",
    startsOn: "2026-04-01",
    endsOn: "2027-03-31",
    status: "current",
  };
  const mapped = mapGuardianBootstrap({
    school: {
      code: "TEST-INTERNATIONAL",
      name: "Test International School",
      timezone: "Asia/Kolkata",
      academicYears: [academicYear],
      currentAcademicYearId: "year-1",
    },
    account: {
      id: "guardian-1",
      role: "guardian",
      profile: {
        id: "guardian-profile-1",
        fullName: "Test Parent",
        phone: "9000000000",
        email: "test-parent@example.test",
        relationship: "Parent",
      },
    },
    children: [
      {
        id: "student-1",
        studentNumber: "AA00001",
        fullName: "Test Student",
        relationship: "Parent",
        classSection: {
          academicYearId: "year-1",
          className: "Class 1",
          section: "A",
          classTeacherId: "teacher-1",
        },
        academicYears: [academicYear],
        attendance: [],
        publishedAssessments: [],
        results: [],
        feeReceipts: [],
        subjectAssignments: [],
        subjects: [],
        teachers: [{ _id: "teacher-1", displayName: "Test Teacher" }],
      },
    ],
    complaints: [],
    leaveRequests: [],
    childLinkRequests: [
      {
        _id: "link-1",
        proposedStudentNumber: "B01",
        relationship: "Parent",
        status: "pending",
        createdAt: "2026-10-01",
      },
    ],
    notifications: [],
  });
  assert.equal(mapped.guardian.fullName, "Test Parent");
  assert.equal(mapped.children[0].studentId, "AA00001");
  assert.equal(mapped.children[0].currentAcademicYear, "2026-27");
  assert.equal(mapped.linkRequests[0].studentNumber, "B01");
  assert.equal(mapped.teachers[0].name, "Test Teacher");
  assert.equal(mapped.children[0].fullName, "Test Student");

  console.log("Guardian mapping, navigation, validation, formatting and document checks passed.");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
