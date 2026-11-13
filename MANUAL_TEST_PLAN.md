# Parent Guardian App — Manual Test Plan

## Before testing

- Build from the Parent directory after running `npm run config:apply`.
- Confirm [`../shared/school-config.json`](../shared/school-config.json) points at the intended Test International School tenant and reachable backend.
- Use only credentials for a seeded test guardian account. Do not enter real student or guardian data.
- Requests submitted from this app are written to the backend and persist in the test database.

## 1. Sign-in and device layout

- [ ] Splash and login show the configured school name and test-environment label.
- [ ] Sign in with an assigned test guardian account. Invalid credentials produce an explicit error.
- [ ] The Home screen shows only records returned for that account by the guardian bootstrap endpoint.
- [ ] On a phone with a notch or punch-hole camera and gesture navigation, the status bar, page title, tabs, and toast remain clear of system cutouts and navigation controls.
- [ ] Home, Notifications, and Profile tabs work. Android Back dismisses dialogs, pops nested screens, returns root Profile/Notifications to Home, and exits from root Home/Login.

## 2. Backend data

- [ ] Verify the signed-in guardian identity and linked student records match the backend account.
- [ ] Open each linked student's dashboard and verify class, section, student number, academic year, attendance, results, and fee receipts against the backend.
- [ ] Confirm missing backend records appear as empty/unavailable states; no sample person or transaction appears as a fallback.
- [ ] Open the teacher directory and confirm it contains only teacher details returned for the signed-in account's linked students.
- [ ] Verify that the school photos, videos, facilities, and contact details are shown as unavailable when not configured.

## 3. Student access requests

- [ ] Submit a valid student number in a supported short or canonical form, such as `A1` or `AAAAB01`.
- [ ] Confirm the request is sent to the backend and appears in the account's pending request list after refresh.
- [ ] Confirm the linked student list does not change until the school approves the request.
- [ ] Try an empty value, malformed value, and zero-only number; each is rejected with a clear message.
- [ ] Confirm the displayed student number returned by the backend is normalized.

## 4. Guardian profile

- [ ] Edit the guardian's name and optional address; save and verify the backend data after refresh or a new sign-in.
- [ ] Confirm mobile number and email are read-only and loaded from the account.
- [ ] Confirm profile editing and child requests do not require a bundled/sample profile photo.

## 5. Attendance, results, and fees

- [ ] Select an available academic year and verify attendance and result records come from the backend.
- [ ] Confirm attendance calendar states and totals match the records returned for that student and year.
- [ ] Confirm subject-level results and published examination summaries match backend marks; no local examination data is substituted.
- [ ] Download a fee or examination document and confirm it uses the selected student's current backend records and configured template.
- [ ] Confirm generated documents are marked as not official school records.
- [ ] Confirm scanned answer-copy download reports unavailable unless a backend file is provided.

## 6. Complaints and leave requests

- [ ] Submit a complaint with a message of at least eight characters. Confirm the request is stored by the backend and appears in the account's complaint history after refresh.
- [ ] Confirm the screen explicitly states that file attachments are unavailable in this build.
- [ ] Submit a leave request with valid dates and reason, confirm the current account password, and verify the request appears in history after refresh.
- [ ] Verify invalid date ranges, missing reason, and incorrect passwords fail without a success message.
- [ ] Confirm neither request changes attendance automatically.

## 7. Notifications and account screens

- [ ] Verify notifications are loaded from the backend and filtered by All / Requests / Updates.
- [ ] Mark one notification and all notifications as read. Confirm the backend read state is reflected after refresh and sign-in.
- [ ] Open Help & Support, Terms & Conditions, and Privacy Policy; verify the localized Test International content is loaded from shared configuration.
- [ ] Confirm empty school contacts do not render placeholder phone numbers, emails, or links.
- [ ] Change the app language and verify the selection persists after restart.
- [ ] For an account requiring a first-sign-in password change, complete the backend flow and verify the new password works. Existing-password changes from Profile remain unavailable.

## 8. Persistence and isolation

- [ ] Sign out and sign in as another test guardian. Confirm no prior account's children, notifications, or requests are visible.
- [ ] After a successful write, restart the app and confirm the server remains the source of truth.
- [ ] Check logs/screenshots before sharing them; redact account credentials and personal data.
