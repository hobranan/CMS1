# Acceptance Test Suite — UC-06 Upload Manuscript in an Allowed Format

## Assumptions / Notes
- Allowed manuscript formats: PDF, Word, or LaTeX.
- Maximum file size: 7 MB.
- Upload must succeed and the file must be attached to the submission for completion.

---

## AT-UC06-01 — Successful Upload (Allowed Format + Size)

**Objective:** Verify an author can upload a manuscript in an allowed format within size limits and have it attached to the submission.

**Preconditions:**
- Author is logged in.
- Author is on the manuscript upload section of the submission workflow.

**Test Data:**
- File: `paper.pdf` (PDF, ≤ 7 MB)

**Steps:**
1. Select `paper.pdf` in the upload control.
2. Confirm the upload begins and completes.

**Expected Results:**
- The system accepts the file type and size.
- The file uploads successfully to storage.
- The system associates the uploaded file with the current submission.
- The UI indicates the file is attached (e.g., file name shown, “Upload successful”).

---

## AT-UC06-02 — Cancel File Selection (Extension 2a)

**Objective:** Verify canceling file selection does not attach any file.

**Preconditions:**
- Author is logged in and on upload section.

**Steps:**
1. Open the file picker.
2. Click cancel/close without selecting a file.

**Expected Results:**
- No validation occurs.
- No upload occurs.
- No file is shown as attached.

---

## AT-UC06-03 — Reject Unsupported File Type (Extension 3a)

**Objective:** Verify the system rejects file types outside PDF/Word/LaTeX.

**Preconditions:**
- Author is logged in and on upload section.

**Test Data:**
- File: `paper.txt` (unsupported)

**Steps:**
1. Select `paper.txt` for upload.

**Expected Results:**
- The system rejects the file (no successful upload).
- An error message indicates allowed formats (PDF/Word/LaTeX).
- No file is attached to the submission.

---

## AT-UC06-04 — Reject Oversized File (Extension 4a)

**Objective:** Verify the system rejects files exceeding the maximum allowed size.

**Preconditions:**
- Author is logged in and on upload section.

**Test Data:**
- File: `paper_large.pdf` (> 7 MB)

**Steps:**
1. Select `paper_large.pdf` for upload.

**Expected Results:**
- The system rejects the file (no successful upload).
- An error message indicates the size limit.
- No file is attached to the submission.

---

## AT-UC06-05 — Network Interruption During Upload (Extension 5a)

**Objective:** Verify the system handles network failures during upload.

**Preconditions:**
- Author is logged in and on upload section.
- Ability to simulate network interruption (e.g., disable network during upload).

**Test Data:**
- File: `paper.pdf` (PDF, ≤ 7 MB)

**Steps:**
1. Start uploading `paper.pdf`.
2. Interrupt the network connection mid-upload.

**Expected Results:**
- The upload fails gracefully.
- The system displays a message indicating upload failure due to connectivity.
- The system prompts retry.
- No file is attached to the submission.

---

## AT-UC06-06 — Storage/Service Error During Upload (Extension 5b)

**Objective:** Verify the system handles storage service failures.

**Preconditions:**
- Author is logged in and on upload section.
- Ability to simulate storage service unavailability/error.

**Test Data:**
- File: `paper.pdf` (PDF, ≤ 7 MB)

**Steps:**
1. Attempt to upload `paper.pdf` while the storage service is failing/unavailable.

**Expected Results:**
- The upload does not complete successfully.
- The system displays a system error message and advises retry later.
- No file is attached.

---

## AT-UC06-07 — Upload Succeeds but Attachment Fails (Database Error) (Extension 6a)

**Objective:** Verify the system does not treat the file as attached if association fails.

**Preconditions:**
- Author is logged in and on upload section.
- Ability to simulate database failure on association step.

**Test Data:**
- File: `paper.pdf` (PDF, ≤ 7 MB)

**Steps:**
1. Upload `paper.pdf`.
2. Force a database error when saving/associating the file reference.

**Expected Results:**
- The system reports that the file could not be attached.
- The UI does not show the file as attached (or clearly indicates it is not attached).
- The author is prompted to retry attachment/upload.

---

## AT-UC06-08 — Persistence Check: File Remains Attached After Page Refresh

**Objective:** Verify that an attached manuscript remains associated with the submission.

**Preconditions:**
- AT-UC06-01 succeeded (file attached).

**Steps:**
1. Refresh the submission page (or navigate away and back to the submission draft).
2. Inspect the upload section.

**Expected Results:**
- The previously uploaded manuscript is still shown as attached to the submission.
- The system does not require re-upload unless the author removes/replaces it.
