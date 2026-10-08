# Labe College of Nursing Sciences, Gboko

Updated institutional portal / public website build.

## Major updates in this build

- Replaced the old public photo set with the institution-supplied pictures:
  1. Girls Hostels
  2. Governor of Benue State signing the bill — His Excellency, Rev. Fr. Hyacinth Iormem Alia
  3. College Classroom
  4. College School Environment
  5. ICT & Computer Centre
- Preserved the official College logo/crest.
- Public Gallery now reads from the live `gallery` registry instead of a hard-coded photo list.
- ICT Media Center can upload pictures, publish them, preview them, delete them, and upload replacements.
- Uploaded images are sent to Firebase Storage; the resulting public URL is stored with the gallery record.
- Added a dedicated Provost photograph uploader/remover. The picture appears on the Home page and Provost page.
- Removed the Quick Demo Login Pre-fills from the public login modal.
- Added Course Registry & Lecturer Assignment for ICT Admin, Registrar and Examination Officer.
- Course creation includes code, title, department, level, semester, credit units, type, approval status and a lecturer dropdown populated from active Lecturer user accounts.
- Added Bursary/Accounts manual payment entry. Physical payments can be recorded by bank teller, POS, transfer or cash and a receipt is generated.
- Online student payment remains available through the student portal.
- Added Firestore persistence/live synchronization for gallery, courses and payments.

## Firebase Storage requirement

The picture uploader uses Firebase Storage. The connected Firebase project must have Storage enabled.

The project includes `storage.rules`. Deploy that file together with the Firestore rules when using Firebase CLI.

Example:

```bash
firebase deploy --only firestore:rules,storage
```

If the Firebase Storage service has not been enabled yet, open the Firebase Console for the connected project and enable Storage first.

## Important security note

The current portal uses the college's application-level role/PIN login. For a production financial/academic system, Firebase Authentication plus role-based custom claims should be enabled so that Firestore and Storage rules can enforce ICT Admin, Registrar, Examination Officer, Bursar and Accountant permissions server-side.

## School payment policy represented in the UI

Students can pay school fees:
- Online through the student portal; or
- Physically at the Bursary/Accounts Department.

Every physical payment should be entered by an authorized Bursar/Accountant and issued a system receipt.

## LCNS Portal Upgrade – October 2026

This version preserves the existing LCNS portal architecture and adds:
- ND 1 / ND 2 user-facing academic terminology.
- Online student course registration with Firestore persistence.
- HON./academic officer → Exam Officer → Registrar course-registration approval workflow.
- Approved-course-only lecturer score-sheet roster and printable score sheet.
- Official course-registration print/PDF workflow after final Registrar approval.
- Application submission date and time capture/display.
- Admin-controlled Post-UTME open/close switch and bright Apply Online CTA.
- Protected ICT Admin system-data deletion/reset center with confirmation phrase and audit logging.
- Bursary/payment data reset/management controls while retaining void/audit behavior.
- Seven institution-supplied photographs with expanded captions in the public gallery.
- Existing CMS, Firebase, authentication, portals, course management, score/result and payment features retained.
