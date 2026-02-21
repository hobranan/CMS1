# Acceptance Test Suite - UC-05 Submit paper manuscript with required metadata

## Assumptions / Notes
- The author must be logged in to submit a paper.
- Required metadata includes (at minimum): author names, affiliations/contact info, abstract, keywords, and main source.
- Contact-info validation uses: valid primary email required; optional phone normalizes to 7-15 digits with allowed separators (`+`, `-`, spaces, parentheses).
- Allowed manuscript formats: PDF, Word, or LaTeX.
- Maximum file size: 7 MB.
- On success, the submission is stored and the author receives confirmation.

---

## AT-UC05-01 — Successful Paper Submission

**Objective:** Verify an author can submit a paper with complete metadata and a valid manuscript file.

**Preconditions:**
- Author is logged in.
- Submission feature is available.

**Test Data:**
- Valid metadata in all required fields
- Manuscript file: `paper.pdf` (PDF, ≤ 7 MB)

**Steps:**
1. Navigate to **Submit Manuscript**.
2. Enter valid values for all required metadata fields.
3. Upload `paper.pdf` that is within size limit.
4. Submit the form.

**Expected Results:**
- The system validates required metadata completeness and file constraints.
- The system stores metadata and file reference in the database.
- A success message is displayed.
- The author is redirected to their home page/dashboard.

---

## AT-UC05-02 — Missing Required Metadata (Extension 4a)

**Objective:** Verify submission is rejected when required metadata is missing.

**Preconditions:**
- Author is logged in.

**Test Data:**
- Leave one required metadata field blank (e.g., Abstract)
- Manuscript file: valid PDF ≤ 7 MB

**Steps:**
1. Open the submission form.
2. Leave a required field blank.
3. Upload a valid manuscript file.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The missing field is highlighted and an error message is shown.
- No submission is stored/finalized.
- The author remains on the submission page.

---

## AT-UC05-03 — Invalid Metadata Value (Extension 4b)

**Objective:** Verify submission is rejected when metadata contains invalid values (e.g., invalid email).

**Preconditions:**
- Author is logged in.

**Test Data:**
- Provide an invalid email format in a contact field (e.g., `bademail`)
- Other required fields valid
- Manuscript file valid PDF ≤ 7 MB

**Steps:**
1. Open the submission form.
2. Enter metadata with an invalid value (e.g., invalid email).
3. Upload a valid manuscript file.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The invalid field(s) are indicated with an error message.
- No submission is stored/finalized.
- The author remains on the submission page.

---

## AT-UC05-04 — No File Uploaded (Extension 5a)

**Objective:** Verify submission is rejected when no manuscript file is uploaded.

**Preconditions:**
- Author is logged in.

**Test Data:**
- All required metadata valid
- No file uploaded

**Steps:**
1. Open the submission form.
2. Fill all required metadata fields.
3. Do not upload a manuscript file.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- An error message indicates a manuscript file is required.
- No submission is stored/finalized.
- The author remains on the submission page.

---

## AT-UC05-05 — Unsupported File Format (Extension 5b)

**Objective:** Verify submission is rejected when the uploaded file is not PDF/Word/LaTeX.

**Preconditions:**
- Author is logged in.

**Test Data:**
- All required metadata valid
- Upload file: `paper.txt` (unsupported format)

**Steps:**
1. Open the submission form.
2. Fill all required metadata fields.
3. Upload `paper.txt`.
4. Submit the form.

**Expected Results:**
- The system rejects the file/submission.
- An error message indicates allowed formats (PDF/Word/LaTeX).
- No submission is stored/finalized.
- The author remains on the submission page.

---

## AT-UC05-06 — File Exceeds Size Limit (Extension 5c)

**Objective:** Verify submission is rejected when the file exceeds the maximum size.

**Preconditions:**
- Author is logged in.

**Test Data:**
- All required metadata valid
- Upload file: `paper_large.pdf` (> 7 MB)

**Steps:**
1. Open the submission form.
2. Fill all required metadata fields.
3. Upload `paper_large.pdf` (> 7 MB).
4. Submit the form.

**Expected Results:**
- The system rejects the upload/submission.
- An error message indicates the file exceeds the size limit.
- No submission is stored/finalized.
- The author remains on the submission page.

---

## AT-UC05-07 — Multiple Validation Errors (Extension 7a)

**Objective:** Verify the system handles multiple simultaneous validation failures.

**Preconditions:**
- Author is logged in.

**Test Data:**
- Leave one required metadata field blank
- Upload unsupported file format (e.g., `paper.exe`)

**Steps:**
1. Open the submission form.
2. Leave a required metadata field blank.
3. Upload an unsupported file type.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The system reports all actionable errors (or the first blocking error consistently).
- No submission is stored/finalized.
- The author remains on the submission page.

---

## AT-UC05-08 — Storage Failure (Extension 8a)

**Objective:** Verify the system behaves correctly when storage/database fails while saving a valid submission.

**Preconditions:**
- Author is logged in.
- Simulate DB/storage failure at save time (e.g., DB unavailable or write blocked).

**Test Data:**
- All required metadata valid
- Valid manuscript file ≤ 7 MB

**Steps:**
1. Open the submission form.
2. Enter valid metadata and upload a valid manuscript file.
3. Submit the form while storage is unavailable.

**Expected Results:**
- The system does not finalize the submission.
- The system displays a system error message advising retry later.
- The author remains on (or returns to) the submission page.
- No submission is stored (or it is clearly not marked as submitted/entered into review).

---

## AT-UC05-09 — Persistence Check After Successful Submission

**Objective:** Verify that after successful submission, the paper appears in the author’s account.

**Preconditions:**
- AT-UC05-01 completed successfully.

**Steps:**
1. Navigate to the author’s submissions list (e.g., “My Papers”).
2. Locate the newly submitted paper.

**Expected Results:**
- The submitted paper appears in the list with the provided metadata.
- The stored manuscript reference/file is associated with the submission.
