# Guardian App — Manual UI Test Plan

Run the app with `npm install`, `npm run config:apply`, `npm start` and, in a second terminal, `npm run android`. These tests use synthetic local JSON data; they do not require a backend.

## 1. Sign-in and main navigation

- [ ] Splash opens, then Login can be opened.
- [ ] Demo login accepts any non-empty mobile number and password; this is intentionally not real authentication.
- [ ] Home, Notifications and Profile bottom tabs replace the current tab stack without duplicating screens.
- [ ] Logout opens a confirmation dialog. Cancel keeps the session; Logout returns to Login.
- [ ] On Android, Back dismisses the logout dialog first, pops a nested screen, returns Profile/Notifications roots to Home, and exits from root Home/Login.
- [ ] On a phone with a notch or punch-hole camera and gesture navigation, the status bar, page title, tabs and toast remain clear of system cutouts and navigation controls.

## 2. Home and linked children

- [ ] School hero photo, school name/tagline/location and **View School Details** appear in that order; the button is directly below the school identity.
- [ ] Aarav Sharma and Ananya Sharma appear as two separate linked child cards with class, section and student ID.
- [ ] Tapping a child opens their dashboard.
- [ ] Add Child is available from Home.
- [ ] With all required guardian profile fields populated, a valid-looking new student ID + full name creates a local pending access request and notification; it does not immediately add/link the student.
- [ ] Duplicate linked-student ID, invalid ID format, and empty required fields are rejected.

## 3. Profile completion gate

- [ ] In `src/data/mock-data.json`, temporarily blank one of `guardian.fullName`, `guardian.mobileNumber`, `guardian.email`, or `guardian.profilePhotoUrl`; restart/reload the app.
- [ ] Tap Add Child. The app should route to Edit Profile and identify missing fields.
- [ ] Full name and profile photo can be edited; mobile/email fields are read-only; address is optional.
- [ ] If mobile/email is missing, the user is told to contact the school office. The app must not allow the guardian to edit these locked fields directly.
- [ ] Restore the JSON values after testing.

## 4. Academic-year selection and attendance

- [ ] The newest academic year is selected by default. Select 2025–26 and 2024–25 and confirm the selected year appears on Attendance and Results.
- [ ] Select another child and confirm the year resets to that child’s current year.
- [ ] Attendance shows present (green), absent (red), holiday (blue), and no-class/unmarked (grey) states.
- [ ] Monthly arrows change the calendar month. Changing child/year resets the month selector to a valid month for that record.
- [ ] Holidays and unmarked future days do not increase absence counts; the percentage is based on marked present + absent class days.

## 5. Results and teacher profiles

- [ ] Subject-list page shows subject names and test counts, with no marks at subject level.
- [ ] Open Mathematics and confirm the teacher profile card is clickable.
- [ ] Switch to the 2024–25 academic year and confirm the historical Mathematics teacher changes to the historical teacher record.
- [ ] Tests/exams appear newest-first, with date, obtained/maximum marks and a download icon. No question-wise marks are shown.
- [ ] Tap a download icon for a test with a copy. A sample PDF should be created and the system share sheet should open; the PDF must not render inside the app.
- [ ] A test without an uploaded-copy flag shows a disabled download action/message.

## 6. Fees, complaints and leave requests

- [ ] Fees Receipt lets the user choose Admission or an available month for the selected academic year.
- [ ] Check itemized fee amounts, total, payment status, date/mode and transaction ID.
- [ ] Download Receipt creates a sample PDF and opens the system share sheet.
- [ ] Complaint submission requires a message; attachment is optional. Selecting a PDF/image shows its file name. Submitting creates a local complaint and notification.
- [ ] Leave request requires start/end dates and rejects an end date before the start date. Submit creates a pending request and notification; it does not auto-excuse attendance.

## 7. Notifications, school and teachers

- [ ] Notifications filter by All / Requests / Updates; opening/marking a notice changes its read state; related items route to the relevant screen where implemented.
- [ ] View School Details opens About, Photos, Videos and Teachers sections. External photos/videos require network access.
- [ ] Teachers Directory search/filter works. Teacher details include credentials, teaching experience, specialization and school contact/office-hours information; residential home address is not shown.

## 8. Account pages

- [ ] Edit Profile requires full name + photo; mobile/email are locked; address remains optional.
- [ ] Change Password validates empty fields, minimum length, difference from the current password and confirmation matching. It explicitly states no real password changes in this UI demo.
- [ ] Help & Support search filters FAQs and school contact actions display the configured contact details.
- [ ] Terms & Conditions and Privacy Policy show illustrative demo content.
- [ ] The Language row offers native labels “English” and “हिन्दी”; selecting either updates translated UI and remains selected after a restart.

## 9. Android branding, notifications and package size

- [ ] Build and install a fresh Android APK after changing `app-config.json`; confirm the launcher uses the configured provisional GI monogram and the launch screen uses the configured splash logo on `#073C88`.
- [ ] Confirm the provisional icon is replaced with approved Greenwood artwork before any production release.
- [ ] In-app demo notifications remain usable. Native push delivery/token registration is not configured in this build.
- [ ] Verify the local toast overlay remains separate from OS notifications.
- [ ] Record the built release APK/AAB size from the actual build artifact and attach the artifact/build variant to the audit. Do not infer package size from source assets or installed npm modules.
