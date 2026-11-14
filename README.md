# Parent Guardian App

React Native CLI app for guardians. The build is configured for the Test International School tenant and loads account and student records from the school backend; it does not bundle people, teacher, attendance, fee, assessment, complaint, leave-request, or notification fixtures.

## Features

- Guardian sign-in, signup verification, password recovery, forced first-sign-in password changes, and secure session storage.
- Account-scoped bootstrap for linked students, attendance, results, fees, teachers, complaints, leave requests, child-link requests, and notifications.
- Backend-backed profile updates, student access requests, complaints, leave requests, and notification read state.
- School identity, theme, academic year, contact details, media, and guardian help/policy content from the shared configuration.
- Attendance and academic-year views, fee statements, result documents, school details, and teacher profiles.
- English and Hindi UI, Android Back handling, and safe-area-aware layouts.

## Requirements and local run

- Node.js 22.13 or newer and npm.
- Android Studio, Android SDK, and an emulator or USB-connected phone for Android.
- macOS, Xcode, and CocoaPods for iOS.

From this directory:

```bash
npm install
npm run config:apply
npm run start
```

In another terminal:

```bash
npm run android:debug
```

The React Native CLI commands clean only the selected app's native build outputs before building. Release builds may require signing configuration. iOS builds cannot run on Windows.

## Test-school configuration

[`../shared/school-config.json`](../shared/school-config.json) is the source of truth for the active school, tenant code, API origin, academic year, theme, media, and localized guardian content. The Parent API client reads the tenant and API origin from this file. Keep school-specific contact and media values empty until approved values are supplied; the app displays an unavailable state rather than invented details.

Native package identifiers, launcher/splash assets, and document templates are also configured in [`../shared/school-config.json`](../shared/school-config.json), with source images stored under `../shared/assets/`. Apply the shared settings with `npm run config:apply`; the command copies the required assets into generated Android/iOS native resource directories for packaging. These build identifiers do not change in an already installed app.

School photos shown on the Parent and Teacher home screens belong in `../shared/assets/photos/`. Add `.jpg`, `.jpeg`, `.png`, or `.webp` files; both apps bundle them in case-insensitive alphabetical filename order when starting Metro or building. Parent copies these shared images and its welcome-screen branding into gitignored app-local asset folders before bundling, so Metro can serve them from the app root. The school logo and app branding images (app icon, Android adaptive icon and splash) belong in `../shared/assets/logo/`; their paths are configured in `school-config.json`.

The shared school-photo carousel, home-school information card, complete school-details content, school-details header, and bottom navigation footer live in `../common/components/` and are used by both apps. Keep navigation shells and app-specific screens in their respective projects.

This is a test tenant. Use only assigned test accounts and never enter real guardian, student, or payment information.

## Backend behavior

After login, the app requests `GET /api/v1/guardian/bootstrap` and uses the returned account-scoped data as its only operational source. Empty or invalid responses are not replaced with sample records. Authenticated GET responses are cached per account for up to 10 minutes; successful writes invalidate the cache.

The app writes profile changes, student-link requests, complaints, leave requests, and notification read state to the backend. Those requests create persistent test-environment changes. Leave requests require the current account password. Complaint attachments and profile-photo uploads are not enabled in this build. Signup and password recovery depend on backend SMS/OTP configuration.

The base URL and tenant code are maintained only in the shared configuration. The backend must be reachable and provisioned for that tenant before sign-in. Do not copy credentials into app configuration or documentation.

## Documents

Fee and examination documents are rendered from the current backend records and the configured templates in `src/templates/document-templates.ts`. Generated PDFs are not official school records. Scanned answer-copy downloads are unavailable until a file is supplied by the backend.

## Validation

```bash
npm run data:check
npm run logic:check
npm run locale:check
npm run typecheck
npm run verify
```

`npm run verify` checks the shared tenant configuration, removed-fixture contract, routes, source syntax, static styles, data mapping, document rendering, localization, and TypeScript types.

## Manual backend test

See [`MANUAL_TEST_PLAN.md`](MANUAL_TEST_PLAN.md). In-app writes in the plan persist to the configured test backend, so use only a test guardian account.

## Current limitations

- The test school has no configured contact information, facilities, or videos; those surfaces show unavailable/empty states. School-photo carousels show their empty state until photos are added to the shared school-photo folder.
- Teacher details are limited to what the backend returns for the signed-in guardian's linked children.
- File upload/download flows for profile photos, complaint attachments, and scanned answer copies are not enabled.
- Native push delivery is not configured; the in-app notification list and read state use backend records.
- Backend SMS/OTP delivery must be configured for signup and password recovery.
- Changing an existing password from the profile screen is not enabled yet; the forced first-sign-in change is supported.
- The app does not restore authenticated navigation after a cold launch; sign in again after restarting it.
