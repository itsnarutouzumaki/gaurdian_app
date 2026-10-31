# Verification report

## Checks passed

- `npm install --no-audit --no-fund` — installed the React Native CLI dependencies and native modules.
- `npm run config:apply` — synchronized the app identity, platform IDs, launcher assets and Android splash configuration; repeated runs are idempotent.
- `npm run verify` — data, routes, source syntax/imports, static styles, logic, Hindi localization and TypeScript checks passed.
- `react-native config` — all native modules resolved for Android and iOS.
- `android\gradlew.bat assembleDebug --no-daemon` — Android debug build passed.
- `android\gradlew.bat assembleRelease --no-daemon` — Android release build, including the Metro production bundle, passed.

## Checks not completed

- The app was not launched on a physical phone or emulator. Use `MANUAL_TEST_PLAN.md` to verify the punch-hole/notch and system-navigation safe areas on-device.
- The iOS project and native module integration are configured, but an iOS build was not run because this workspace is on Windows and iOS builds require macOS/Xcode.
- Native push delivery is not configured; notifications in this demo remain local in-app records.

## Scope reminder

This is a frontend-only UI prototype. Login, complaints, leave requests, notifications and profile changes use local demo state, not a backend. Document actions create placeholder PDFs, not real school-uploaded scanned answer copies. Mock people, fees, transactions, policies and school records are fictional.

See `MANUAL_TEST_PLAN.md` for the page-by-page interaction checklist.
