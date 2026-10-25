# Guardian School App — architecture and refactoring rules

These instructions apply to **all** source changes in this repository. They exist so maintainability work does not silently redesign the product or change demo behavior.

This is a frontend-only Expo / React Native / TypeScript prototype. Login, complaints, leave, profile edits, and notifications are in-memory session state. PDF actions generate placeholder files and open the system share sheet.

## Stack freeze

Do **not** change versions of Expo, React Native, React, TypeScript, or other packages unless the user explicitly asks.

Pinned at the time of the architecture audit (see `package.json`):

- `expo` ~58.0.19
- `react` 19.3.0
- `react-native` 0.88.0
- `react-native-safe-area-context` ~5.10.1
- Expo modules: `expo-document-picker`, `expo-file-system`, `expo-image-picker`, `expo-sharing` (SDK 58)
- TypeScript ~6.0.3, `babel-preset-expo` ~58.0.20

Do not add navigation libraries, UI kits, state libraries, or other dependencies for a maintainability refactor. The app uses a custom in-memory stack in `App.tsx` (`navigate` / `replace` / `goBack` / `resetTo`). Preserve that model.

## Inspect before changing

1. Read the file you will edit and every module it imports for the behavior you intend to keep.
2. Never guess about unseen screens, JSON fields, route params, or validation rules.
3. Preserve existing user/working-tree changes. Do not overwrite or revert unrelated work.
4. Do not change business logic, types that describe domain data, navigation destinations, or data structures in `src/data/` unless the user explicitly requests a behavior change.

## Single responsibility and file layout

Every source file must have **one clear primary responsibility**.

### Screens

- Every screen listed in `ScreenName` (`src/types.ts`) lives in its **own** `.tsx` file.
- Name the file after the screen: `HomeScreen.tsx` exports `HomeScreen`, `FeesReceiptScreen.tsx` exports `FeesReceiptScreen`, and so on.
- Keep screens under `src/screens/`, one component per file. The former grouped screen files have been removed; do not reintroduce them.
- Each screen has a colocated `*.styles.ts` file for static styles.
- `App.tsx` remains the composition root: session state, stack navigation, tab visibility, toast overlay, logout dialog, and the `switch` that renders the current route. Do not move navigation behavior into a new router.

### Styles

- Each screen `.tsx` must have a colocated `*.styles.ts` (example: `HomeScreen.tsx` + `HomeScreen.styles.ts`).
- Each **styled reusable component** must have a colocated `*.styles.ts` (already started for `UI.tsx`, `Selectors.tsx`, `DatePickerModal.tsx`).
- Static style objects must **not** be written inline in JSX (`style={{ ... }}` with literal layout/color objects).
- Allowed exceptions (do not invent more):
  - Dynamic values that cannot be static StyleSheet entries (pressed opacity, selected/disabled colors, sizes passed as props, data-driven subject colors).
  - Combining a named style with a small dynamic override: `style={[styles.chip, selected && styles.chipSelected]}` or `style={[styles.avatar, { width: size }]}`.
  - `StyleSheet.absoluteFill` and `contentStyle` / `style` props forwarded from callers.
- Put static styles in `StyleSheet.create` in the matching `*.styles.ts`. Import theme tokens there; do not duplicate hex values that already exist on `C` / `R`.

### Components vs screens

- Reusable UI lives in `src/components/` (`Page`, `Card`, `Field`, `ActionButton`, `YearRibbon`, `ChoiceModal`, `DatePickerModal`, and similar).
- Screen-specific helpers (for example `QuickLink`, `ActionTile`, `InfoRow`, `ChoiceInline`, `TeacherListRow`) may stay next to the screen until they are used by two or more screens. Do not extract them “just in case.”
- Do not mix screen navigation/business rules into generic UI primitives.

### Lib, data, and types

- `src/lib/` is for pure helpers already present: `format.ts`, `selectors.ts`, `calendar.ts`, `notifications.ts`, `pdf.ts`. Reuse them instead of duplicating (Attendance currently rebuilds a calendar grid instead of calling `createCalendarGrid`; `monthTitle` exists in `format.ts`).
- `src/data/mock-data.json` and `src/data/school-config.json` are the source of demo content and branding. Do not reshape them during a refactor.
- `src/data/screen-options.ts` holds static screen option lists (filters, tabs, profile menu). Keep that role.
- `src/types.ts` is the domain type source. Prefer tightening `any` with real types over introducing new wrapper types.
- `src/app-context.tsx` only defines `AppContextValue`, the provider, and `useApp`. App state construction stays in `App.tsx`.
- `src/theme.ts` is the only place for shared visual tokens.

## Theme tokens

Shared colors, spacing, typography, radii, and other **repeated** design values must use central tokens in `src/theme.ts`.

Existing tokens:

- `C` — colors, merged from `school-config.json` `school.theme` with fallbacks (`bg`, `primary`, `primaryDark`, `accent`, `surface`, `text`, `muted`, `border`, `success`, `successSoft`, `danger`, `dangerSoft`, `warning`, `warningSoft`, `blueSoft`, `purple`, `purpleSoft`, `orange`, `orangeSoft`, `teal`, `shadow`).
- `R` — radii (`sm`, `md`, `lg`, `pill`).

When extracting styles:

- Use `C.*` and `R.*` instead of repeating those hex values.
- Add a token **only** when the same value is already repeated in the existing UI (for example common paddings 12–16, white `#FFFFFF` on primary headers). Do not invent a new palette or spacing scale that changes the look.
- Hardcoded colors that are unique to one control may stay local until they are duplicated.
- Visual change is permitted **only** to correct a demonstrable inconsistency against an **existing** established style (for example one toast using a one-off green while success elsewhere uses `C.success`). Do not “improve” contrast, spacing, or layout as part of a refactor.

## Preserve product behavior

Do not change business behavior to make the code cleaner.

Must keep, unless the user asks otherwise:

- All 23 `ScreenName` routes and the `App.tsx` renderer `switch`.
- Stack + tab rules: tabs hidden on Splash/Login/SignUp/ForgotPassword; Home / Notifications / Profile `resetTo` targets (`Home`, `Notifications`, `MyProfile`).
- Profile-completeness gate before Add Child (full name, mobile, email, photo); mobile/email read-only on Edit Profile.
- Student ID format check, duplicate-link rejection, pending link requests (not immediate linking).
- Academic-year ribbon shared across attendance, results, fees; child switch resets year to that child’s current year.
- Attendance statuses and legend (present / absent / holiday / no-class / unmarked); holidays not counted as absences.
- Subject overview without marks; tests newest-first with download only when `copyAvailable`.
- Complaint message required; leave date range validation; demo toasts and `Alert` copy.
- Notification filters All / Requests / Updates and mark-read behavior.
- JSON-driven school branding and `scripts/apply-school-config.js` as the way to sync `app.json`.
- Demo login: any non-empty mobile + password calls `signIn()`.

Do not redesign screens, copy, icons, or layout while splitting files or moving styles.

## TypeScript and abstractions

- `tsconfig.json` uses `strict: true`. Do not disable it.
- Do not introduce `any`. Replace existing `any` only when the replacement matches the real JSON/runtime shape (`complaints`, `leaveRequests`, `linkRequests`, school config, help/terms/privacy sections).
- Do not add unnecessary hooks, context splits, HOCs, generic style factories, or “design system” layers.
- Prefer the smallest change that isolates a screen or a StyleSheet.

## Checks after each refactoring phase

Run existing checks and report **actual** command output, not assumed success.

From `package.json`:

```text
npm run verify
```

which is:

1. `npm run data:check` — `scripts/check-data.js`
2. `npm run route:check` — `scripts/check-routes.js` (requires every `ScreenName` to have a `case` in `App.tsx`)
3. `npm run syntax:check` — `scripts/check-source-syntax.js`
4. `npm run logic:check` — `scripts/check-logic.js` (profile completeness, leave dates, calendar grid, INR format, historical Maths teacher ids)
5. `npm run typecheck` — `tsc --noEmit`

If `verify` stops at the first failure, run the remaining scripts individually and record each result.

Do not “fix” check failures by changing demo data or `app.json` unless that is the assigned task. Do not run `config:apply` as a drive-by during a UI-structure refactor.

`check-routes.js` reads `App.tsx` with regex. After splitting screens, keep the `case "ScreenName":` map in `App.tsx` and keep literal `navigate("…")` / `replace` / `resetTo` string destinations.

## Current architecture

Composition:

- `App.tsx` — seed state from JSON, stack, auth flag, context value, tabs, toast, logout modal, screen switch.
- `App.styles.ts` — static app-shell, toast and logout-dialog styles.
- `src/app-context.tsx` — context type + `useApp`.
- `src/theme.ts`, `src/types.ts`.

Each `ScreenName` route is rendered by a corresponding component in `src/screens/`:

| Area | Screen components |
| --- | --- |
| Authentication | `SplashScreen`, `LoginScreen`, `SignUpScreen`, `ForgotPasswordScreen` |
| Main | `HomeScreen`, `AddChildScreen`, `ChildDashboardScreen`, `AttendanceScreen`, `ResultsScreen`, `SubjectResultsScreen` |
| Requests | `FeesReceiptScreen`, `RaiseComplaintScreen`, `LeaveRequestScreen` |
| Profile | `MyProfileScreen`, `EditProfileScreen`, `ChangePasswordScreen`, `HelpSupportScreen`, `TermsConditionsScreen`, `PrivacyPolicyScreen` |
| School and teachers | `SchoolDetailsScreen`, `TeachersDirectoryScreen`, `TeacherProfileScreen` |
| Notifications | `NotificationsScreen` |

Components: `src/components/UI.tsx` (+ `UI.styles.ts`), `Selectors.tsx` (+ `Selectors.styles.ts`), `DatePickerModal.tsx` (+ `DatePickerModal.styles.ts`), and `TeacherListRow.tsx` (+ `TeacherListRow.styles.ts`).

Scripts: `check-data.js`, `check-routes.js`, `check-source-syntax.js`, `check-inline-styles.js`, `check-logic.js`, `apply-school-config.js`, `generate-mock-data.py`.

Product docs: `README.md`, `MANUAL_TEST_PLAN.md`. Treat the manual test plan as the interaction contract when judging whether a refactor changed behavior.

## Known baseline issues (do not “fix” unless asked)

Recorded during the architecture audit. Later phases must not hide these by skipping checks.

- `npm run verify` **fails** at `data:check`: `Android adaptive icon background is stale; run npm run config:apply` because `app.json` `expo.android.adaptiveIcon.backgroundColor` is `#0c010f` while `school-config.json` `theme.primaryDark` is `#073C88`. Do not run `config:apply` or edit `app.json` as part of a screen/style split unless the assigned step is branding sync.
- After that failure, the other verify steps were run separately and **passed**: `route:check`, `syntax:check` (22 TypeScript files), `logic:check`, `typecheck`.
- `README.md` still mentions Expo SDK 57 while `package.json` targets SDK 58; this is documentation-only and remains outside the screen/style refactor.
- `npm run data:check` fails on the known stale Android adaptive-icon background in `app.json`. Do not apply branding changes as part of a refactor.

## Refactor status

The screen isolation and shared-style/type-safety phases are complete. Preserve their boundaries in future work:

- Keep one screen component and one style file per route; grouped screen files have been removed.
- Keep navigation, the literal route switch, app state, and screen business rules in their existing owners.
- Keep shared static styles in colocated `*.styles.ts` files and use existing `C`, `R`, and `S` theme tokens where appropriate.
- `npm run style:check` detects fully static object literals directly assigned to JSX `style` props; dynamic styles and style arrays remain permitted.
- JSON-derived record types are based on the current mock data shape. Update types only alongside an explicitly authorized data-schema change.
- `npm run verify` includes data, route, syntax, style, logic, and type checks. Run checks individually as well when the known `data:check` failure stops the sequence.

Stop if a change would alter navigation, validation, copy, layout, or demo data. Ask the user before any product-facing change.
