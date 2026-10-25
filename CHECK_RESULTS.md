# Verification report

## Checks passed in this workspace

- `npm run data:check` — validated school branding, 2 children, 7 teachers, 8 academic-year records, 37 subject records and 192 tests/exams; data consistency checks passed.
- `npm run route:check` — all 23 screen routes are registered and literal navigation destinations resolve to known routes.
- `NODE_PATH="$(npm root -g)" npm run syntax:check` — TypeScript/TSX syntax transpilation and local relative import/export resolution passed for 17 source files.
- `NODE_PATH="$(npm root -g)" npm run logic:check` — smoke checks passed for profile completion rules, leave date validation, calendar grid generation, INR formatting and historical teacher mapping.
- `python -m py_compile scripts/generate-mock-data.py` — mock-data generator syntax passed.
- `npm run config:apply` — native name/slug/scheme and platform identifiers generated from the school JSON configuration; the following data check passed again.
- `unzip -t guardian-school-app.zip` — archive integrity passed with no ZIP errors.

## Checks not completed

- `npm install --ignore-scripts --no-audit --no-fund` timed out while trying to reach the npm registry in this workspace, so project dependencies were not installed here.
- Consequently, a real `npm run typecheck` with Expo's base tsconfig and React/React Native typings could not run. The attempted command reports `expo/tsconfig.base` and dependency typings missing because `node_modules` is absent; the cascading JSX/type diagnostics from that run are not a valid project type-check result.
- No Android/iOS simulator or physical-device launch was performed in this environment. The project should be installed and smoke-tested on a machine with npm registry access and Expo Go/emulator before production use.

## Scope reminder

This repo is intentionally a **frontend-only UI prototype**. Login, notifications, complaints, leave requests and profile changes use local in-memory demo state, not a backend. Document actions create placeholder PDFs, not real school-uploaded scanned answer copies. Mock people, fees, transactions, policies and school records are fictional.

See `MANUAL_TEST_PLAN.md` for the page-by-page interaction checklist.
