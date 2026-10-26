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

- Node.js 22.13 or newer (recommended for Expo SDK 58).
- npm.
- Android phone with Expo Go compatible with SDK 57, or an Android emulator. iOS requires macOS/Xcode.

## Run locally

```bash
npm install
npx expo install --fix
npm run data:check
npm run start
```

Scan the QR code using an Expo Go version compatible with SDK 58, or press `a` in the terminal to open an Android emulator. Package versions are intentionally pinned in `package.json`.

If Expo shows an SDK/package compatibility warning after the package install, run:

```bash
npx expo install --fix
npx expo start --clear
```

## Demo login

The login form is prefilled with sample details. Any non-empty mobile number and password will open the demo app. This is **not real authentication**.

## Important data files

### `src/data/schools/`

- `active-school.json` selects the school by ID.
- `<school-id>/school.json` contains the school identity, contact/About information, facilities and academic-year options.
- `<school-id>/app-config.json` contains Expo app identity, native package identifiers, launcher icon paths and Android splash settings. The current Greenwood launcher icon is a provisional blue-and-white “GI” monogram; replace it with approved school artwork before release.
- `<school-id>/theme.json` contains the default appearance mode and semantic palettes. The dark palette is `null` until real dark-mode colors are provided.
- `<school-id>/media.json` contains the configured cover image, ordered gallery, videos and logo metadata.
- `<school-id>/teachers.json` is the canonical teacher directory. Historical teacher IDs referenced by academic records remain unchanged.
- `<school-id>/assets.ts` statically maps bundled React Native images. JSON must reference an asset key; a filesystem path in JSON is not a valid React Native image source.
- `registry.ts` is the typed registry and the single runtime selector. Only `greenwood-demo` is registered; add school data and a registry entry before selecting another school.

`src/data/mock-data.json` remains the guardian/student and operational demo dataset (academic records, attendance, fees, requests and notifications); teacher profiles are no longer duplicated there.
`src/theme.ts` is the theme facade and keeps the existing `C`, `R` and `S` exports.

To apply the selected school’s app identity and appearance to native metadata before a school-specific build:

```bash
# Edit the selected school configuration first
npm run config:apply
```

Native launcher name, bundle ID, package name, icon and launch screen are build-time configuration. They cannot change on a device merely because JSON changed inside an installed app. The `expo-splash-screen` plugin uses the selected school’s Android splash image, width, resize mode and background color; changing these settings requires a new native build. The logo in `media.json` is a school UI logo and is not used as a launcher icon. The current splash screen retains the MNNIT logo previously authorized for this prototype; the launcher uses a separate provisional GI icon, not the MNNIT logo. The school gallery and video thumbnails are existing HTTPS demo URLs.

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

`data:check` verifies the selected school configuration, synchronized Expo identity and launcher assets, unique student IDs, academic years, teacher references, test marks, fee records, child references and the rule that subject-level overview records do not contain marks or question-wise marks. `npm test` runs the logic and localization checks; `npm run verify` also checks routes, syntax, static styles and TypeScript.

## Language, Android Back and notifications

- English and Hindi are available from the Language row on My Profile. The app uses `i18next` / `react-i18next`, starts from the device language when supported, and stores a user selection locally with AsyncStorage. Untranslated dynamic/user-provided strings remain unchanged.
- Android Back dismisses the logout dialog, pops an in-app screen, returns a root Profile/Notifications screen to Home, or exits from root Home/Login.
- The Expo Notifications client configures the Android channel, handles foreground notifications and routes validated notification taps. This repository has no authenticated production login or notification backend, so it does not request/register a device token or claim server delivery. `registerPushTokenWithBackend` is an adapter for a future authenticated HTTPS `POST /v1/device-tokens` service; it requires a real access token and must be called from the production authentication flow. The request body is `{ "token": "<Expo push token>", "platform": "android" | "ios" }`; the service must authenticate the bearer token, associate the token with that authenticated guardian, and return a 2xx status on success. No access token or backend URL is bundled in the demo.
- The app’s toast overlay is local UI feedback; it is separate from operating-system push notifications.

## Android package-size audit

No APK or AAB is checked into this workspace, so installed/package size and per-module size savings have not been measured. The final Expo Android export produced a 2,192,499-byte Hermes JavaScript bundle (Expo reports 2.2 MB) and one 38,781-byte school image. These are only bundle/export figures, not the final APK/AAB or installed size. Measure the release APK/AAB from the actual Android build pipeline before reporting a size target or savings; do not use the JavaScript dependency tree or raw asset sizes as a substitute for the packaged artifact.

## Limitations (intentional for the requested scope)

- No backend, real sign-in/OTP, database, principal approval queue, push notification service, or persistence after app restart.
- Mock complaint and leave requests add notifications in app memory only.
- Demo PDFs are generated placeholders; no genuine scanned-copy document is provided.
- Fee receipt amounts, phone numbers, email addresses, school, guardian, child and teacher records are fictional UI data.
- A production release needs real authorization checks, secure student-data separation per school, privacy review, error handling, audit trails, and verified school-owned documents.
