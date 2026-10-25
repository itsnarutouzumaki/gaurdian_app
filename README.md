# Greenwood Guardian App — React Native UI Demo

A **frontend-only, JSON-driven React Native prototype** for the guardian side of a multi-school school-management app. It intentionally contains no backend, real authentication, payment collection, or real student records. All actions are local to the running app session.

## What is included

- Splash / welcome, login, sign up, and forgot-password screens.
- Home screen with school photo, school name and **View School Details** directly below the school identity, followed by multiple linked children.
- Child-link request form with student ID validation and profile-completeness gate.
- Child dashboard with a horizontally scrollable academic-year selector (2026–27 selected by default).
- Attendance summary plus a monthly calendar with present, absent, holiday, and no-class/unmarked states.
- Results subject list without subject-level marks; individual subject pages show tests/exams in date order, obtained/maximum marks, and a download icon only.
- Teacher cards from the selected academic year’s subject results, linked to a detailed teacher profile.
- Admission/monthly fee receipt selection, itemized fees, paid/due state, transaction metadata and PDF generation.
- Complaint form with mandatory message and optional PDF/image attachment picker.
- Leave-request form with start/end calendar pickers, range validation, and a notification entry.
- Notifications with All / Requests / Updates filters and mark-read behavior.
- Profile, Edit Profile, Change Password, Help & Support, Terms & Conditions, Privacy Policy, logout confirmation dialog.
- School photos/videos/About/facilities and a searchable teacher directory.
- Rich mock data for two children, four academic years per child, six active teachers plus one historical faculty record, 37 subject records, 192 tests/exams, fee history, attendance dates, notifications, complaints, leave requests, help and policy content.
- A school config JSON and a script to apply it to native app metadata before a school-specific build.

## Requirements

- Node.js 22.13 or newer (recommended for Expo SDK 57).
- npm.
- Android phone with Expo Go compatible with SDK 57, or an Android emulator. iOS requires macOS/Xcode.

## Run locally

```bash
npm install
npx expo install --fix
npm run data:check
npm run start
```

Scan the QR code using Expo Go on your Android phone, or press `a` in the terminal to open an Android emulator. The Expo package is pinned to SDK 57 because it is the stable Expo Go target at the time this prototype was created; SDK 58 has recently been released and may not yet be supported by the store version of Expo Go.

If Expo shows an SDK/package compatibility warning after the package install, run:

```bash
npx expo install --fix
npx expo start --clear
```

## Demo login

The login form is prefilled with sample details. Any non-empty mobile number and password will open the demo app. This is **not real authentication**.

## Important data files

### `src/data/school-config.json`

The primary school customization file. It controls:

- `app.defaultAcademicYear`, `app.availableAcademicYears`
- school name and tagline
- school location/contact/About text/facilities
- hero image, school gallery images, linked videos
- school UI theme colors

To apply the school name to the native launcher name and package identifiers before making a school build:

```bash
# Edit src/data/school-config.json first
npm run config:apply
```

Native launcher name, bundle ID, and Android package name are build-time configuration. They cannot change on a device merely because a JSON file changed inside an already-installed app. The app’s on-screen school branding is loaded from the JSON at runtime.

### `src/data/mock-data.json`

Contains the demo guardian, children, academic records, attendance, subjects/tests, teacher profiles, receipts, notices, complaints, leave requests, help topics, terms and privacy text. Edit this file to create other test scenarios. For example, blank `guardian.fullName` or `guardian.profilePhotoUrl` to test that Add Child redirects to Edit Profile.

### `scripts/generate-mock-data.py`

Regenerates the synthetic demo dataset and the school config for reproducible test data. Run from the project root:

```bash
python scripts/generate-mock-data.py
npm run data:check
```

The photos/videos use external demo image/video URLs, so those portions of the UI need an internet connection. The rest of the app data is local JSON.

## PDF behavior in this UI-only build

The PDF buttons **do not render a PDF inside the app**. They generate a sample PDF locally and open the system share sheet so a tester can save it or open it in a compatible PDF app. This verifies the user interaction and document handoff flow, but the generated answer-copy PDF is only a placeholder—not a real scanned answer script. In the production app, the PDF function must instead fetch the school-uploaded scanned copy from secure storage. The fee receipt preview is rendered from the selected JSON fee record and exported as a sample PDF.

## Profile and linking rules implemented

- Required before Add Child: full name, mobile number, email, profile photo.
- The guardian can edit full name and profile photo. Mobile and email are read-only; contact the school for corrections.
- Address is optional.
- When required fields are missing, Add Child is blocked and the app opens Edit Profile with a message listing missing items.
- A student-link request is a request to access an existing student; it does not create a student or immediately link a new one.
- Logout requires confirmation.

## Checks

```bash
npm run data:check
npm run typecheck
npm run verify
```

`data:check` verifies the JSON structure, unique student IDs, multiple academic years, teachers linked to subjects, test marks, fee records, child references and the rule that subject-level overview records do not contain marks or question-wise marks. TypeScript is checked with `tsc` once npm dependencies are installed.

## Limitations (intentional for the requested scope)

- No backend, real sign-in/OTP, database, principal approval queue, push notification service, or persistence after app restart.
- Mock complaint and leave requests add notifications in app memory only.
- Demo PDFs are generated placeholders; no genuine scanned-copy document is provided.
- Fee receipt amounts, phone numbers, email addresses, school, guardian, child and teacher records are fictional UI data.
- A production release needs real authorization checks, secure student-data separation per school, privacy review, error handling, audit trails, and verified school-owned documents.
