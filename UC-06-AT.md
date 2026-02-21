# Acceptance Test Suite - UC-06 Upload manuscript in an allowed format

## Assumptions / Notes
- Allowed extensions: `.pdf`, `.doc`, `.docx`, `.tex` (case-insensitive).
- Maximum file size: 7 MB.
- Upload is complete only when file is attached to the submission.

---

## AT-UC06-01 - Successful Upload

**Objective:** Verify successful upload and attachment for valid extension and size.

**Preconditions:**
- Author is logged in and on upload section.

**Test Data:**
- File: `paper.pdf` (<= 7 MB)

**Steps:**
1. Select `paper.pdf`.
2. Complete upload.

**Expected Results:**
- Extension and size are accepted.
- File uploads to storage.
- File is associated with current submission.
- UI confirms attached state.

---

## AT-UC06-02 - Cancel File Selection

**Objective:** Verify cancel does not attach file.

**Steps:**
1. Open picker.
2. Cancel without selecting file.

**Expected Results:**
- No upload occurs.
- No file is attached.

---

## AT-UC06-03 - Reject Unsupported Extension

**Objective:** Verify rejection for unsupported extension.

**Test Data:**
- File: `paper.txt`

**Steps:**
1. Select `paper.txt`.

**Expected Results:**
- Upload is rejected.
- Error lists allowed extensions (`.pdf`, `.doc`, `.docx`, `.tex`).
- No file is attached.

---

## AT-UC06-04 - Reject Oversized File

**Objective:** Verify rejection for file > 7 MB.

**Test Data:**
- File: `paper_large.pdf` (> 7 MB)

**Steps:**
1. Select `paper_large.pdf`.

**Expected Results:**
- Upload is rejected.
- Size-limit error is shown.
- No file is attached.

---

## AT-UC06-05 - Network Interruption

**Objective:** Verify interruption leaves file unattached and provides retry guidance.

**Test Data:**
- File: `paper.pdf` (<= 7 MB)

**Steps:**
1. Start upload.
2. Interrupt network mid-transfer.

**Expected Results:**
- Upload fails gracefully.
- Retry guidance is shown.
- No file is attached.

---

## AT-UC06-06 - Storage/Service Failure

**Objective:** Verify service failure leaves file unattached.

**Steps:**
1. Attempt upload while storage service is failing.

**Expected Results:**
- System error is shown.
- No file is attached.

---

## AT-UC06-07 - Association Failure After Upload

**Objective:** Verify upload without association is not treated as attached.

**Steps:**
1. Upload valid file.
2. Simulate database failure during association.

**Expected Results:**
- System reports file could not be attached.
- File remains unattached.

---

## AT-UC06-08 - Attached File Persists Across Refresh

**Objective:** Verify attached state remains visible after refresh/navigation.

**Preconditions:**
- AT-UC06-01 succeeded.

**Steps:**
1. Refresh or navigate away/back.

**Expected Results:**
- Previously attached file is still shown as attached.
