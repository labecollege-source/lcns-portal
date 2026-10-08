# LCNS Portal Update — October 2026

Implemented without replacing the existing portal architecture:

- Removed the specific “2026/2027 Post-UTME Admission Screening Now Open!” announcement from the initial public announcements and filtered any cached copy.
- Added Provost applicant-review workflow with document inspection/download and application PDF printing.
- Added Provost “Recommend to Registrar” workflow.
- Added Registrar final admission action for candidates recommended/eligible by the Provost.
- Added Provost student registry exports to Excel and print-ready PDF.
- Strengthened lecturer CBT question builder with explicit correct-answer selection and validation. Correct answers remain hidden from students.
- Student CBT submission continues to show the score/result only, not the answer key.
- Expanded Bursary/Accounts manual payment entry to students and applicants.
- Added Post-UTME, Acceptance Fee, School Fees, Hostel and Non-Refundable Fee manual payment types.
- Manual finance entries are now PENDING until an authorized Bursary/Accounts officer verifies them.
- Added Pending Payments queue with “Verify, Clear & Receipt”.
- Verified payments update the relevant student ledger/admission payment status and make the official receipt printable.
- Student payment history now shows “Pending Bursary Clearance” instead of allowing a receipt to print before verification.
- Existing Paystack, Firestore, CMS, academic, CBT, result, and portal features were retained.
