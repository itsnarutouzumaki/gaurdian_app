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
- A school configuration registry that separates school branding and faculty from guardian/student demo records.

## Requirements

- Node.js 22.13 or newer.
- npm.
- Android Studio with the Android SDK and an emulator or USB-connected phone. iOS builds require macOS, Xcode and CocoaPods.

## Run locally

```bash
npm install
npm run config:apply
npm run data:check
npm run start
```

In a second terminal, install and launch the Android app:

```bash
npm run android
```

For iOS, run `cd ios && pod install` on macOS, then `npm run ios`. Native modules are linked by the React Native CLI.

## Demo login

The login form is prefilled with sample details. Any non-empty mobile number and password will open the demo app. This is **not real authentication**.

## Important data files

### Shared school configuration

`../shared/school-config.json` is the source for both applications' school identity, theme, academic defaults, media metadata and supported languages. Both apps import this root-level JSON through a typed `src/config/schoolConfig.ts` module. Metro watches the root `shared/` directory.

The shared configuration points to the owner-provided `../shared/assets/logo.png`. Both apps render that source directly in their UI. Native package IDs, app version, launcher paths and splash settings remain app-specific in `src/data/schools/greenwood-demo/app-config.json`; `npm run config:apply` syncs app identity and native splash branding into the React Native CLI projects.

`src/data/schools/greenwood-demo/teachers.json` remains local demo teacher data and is not part of the shared static school configuration.

`src/data/mock-data.json` remains the guardian/student and operational demo dataset (academic records, attendance, fees, requests and notifications); teacher profiles are no longer duplicated there.
`src/theme.ts` is the theme facade and keeps the existing `C`, `R` and `S` exports.

To apply shared school identity/theme and the app-specific native metadata before a school-specific build:

```bash
npm run config:apply
```

The supplied logo is bundled directly in the UI. Native launcher name, bundle ID, package name, icon and launch screen are build-time configuration. They cannot change on a device merely because JSON changed inside an installed app. The school gallery and video thumbnails are existing HTTPS demo URLs.

### `scripts/generate-mock-data.py`

Regenerates only the operational mock dataset. It reads the selected school's canonical teacher IDs and does not rewrite school identity, theme, media, app config or teacher files. Run from the project root:

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
npm test
npm run verify
```

`data:check` verifies the selected school configuration, synchronized native app identity and splash assets, unique student IDs, academic years, teacher references, test marks, fee records, child references and the rule that subject-level overview records do not contain marks or question-wise marks. `npm test` runs the logic and localization checks; `npm run verify` also checks routes, syntax, static styles and TypeScript.

## Language, Android Back and notifications

- English and Hindi are available from the Language row on My Profile. The app uses `i18next` / `react-i18next`, starts from the device language when supported, and stores a user selection locally with AsyncStorage. Untranslated dynamic/user-provided strings remain unchanged.
- Android Back dismisses the logout dialog, pops an in-app screen, returns a root Profile/Notifications screen to Home, or exits from root Home/Login.
- Notifications in this demo are in-app records only; native push delivery is not configured. `registerPushTokenWithBackend` accepts a device token from a future native push provider and posts it to an authenticated HTTPS `POST /v1/device-tokens` service. The service must authenticate the bearer token, associate the token with that guardian, and return a 2xx status on success. No access token, push provider or backend URL is bundled in the demo.
- The app’s toast overlay is local UI feedback; it is separate from operating-system push notifications.

## Android package-size audit

No React Native CLI APK or AAB is checked into this workspace, so release package size and per-module size savings have not been measured. Measure the release APK/AAB from the actual Android build pipeline before reporting a size target or savings; do not use the JavaScript dependency tree or raw asset sizes as a substitute for the packaged artifact.

## Limitations (intentional for the requested scope)

- No backend, real sign-in/OTP, database, principal approval queue, push notification service, or persistence after app restart.
- Mock complaint and leave requests add notifications in app memory only.
- Demo PDFs are generated placeholders; no genuine scanned-copy document is provided.
- Fee receipt amounts, phone numbers, email addresses, school, guardian, child and teacher records are fictional UI data.
- A production release needs real authorization checks, secure student-data separation per school, privacy review, error handling, audit trails, and verified school-owned documents.
