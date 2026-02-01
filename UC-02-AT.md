# Acceptance Test Suite — UC-02 Validate User-Provided Information

## Assumptions / Notes
- The user is authenticated (logged in) before submitting any form covered by this use case.
- Validation rules depend on the specific form, but at minimum include:
  - Required-field completeness checks
  - Format checks (e.g., email format, allowed characters, numeric ranges)
  - Business rule/constraint checks (e.g., max lengths, consistency rules)
- When validation fails, the system does not store or update data and provides clear error feedback.

---

## AT-UC02-01 — Valid Submission Accepted (Main Success Scenario)

**Objective:** Verify that valid user-provided information is accepted and stored/updated.

**Preconditions:**
- User is logged in.
- The target form is accessible to the user.

**Test Data (example):**
- All required fields filled with valid values.
- Any fields with constraints (length/range/format) are within limits.

**Steps:**
1. Navigate to a CMS form that accepts user input (e.g., profile update form).
2. Enter valid values into all required fields and optional fields (if used).
3. Submit the form.

**Expected Results:**
- The system checks required fields and validates formats/constraints.
- The system accepts the submission.
- The system stores/updates the information in the database.
- The system displays a success/confirmation message.

---

## AT-UC02-02 — Missing Required Field Rejected (Extension 3a)

**Objective:** Verify that submissions missing required fields are rejected.

**Preconditions:**
- User is logged in.
- The target form is accessible.

**Test Data (example):**
- One required field left blank; all other fields valid.

**Steps:**
1. Open the target form.
2. Leave one required field blank.
3. Fill other fields with valid values.
4. Submit the form.

**Expected Results:**
- The system detects missing required field(s).
- The system rejects the submission.
- No data is stored/updated.
- The system highlights missing fields and displays an error message.

---

## AT-UC02-03 — Invalid Format Rejected (Extension 4a)

**Objective:** Verify that invalid field formats are rejected.

**Preconditions:**
- User is logged in.
- The target form is accessible.

**Test Data (example):**
- Enter an invalid value in a format-validated field (e.g., email field = `bademail`).

**Steps:**
1. Open the target form.
2. Enter an invalid formatted value in one field (e.g., invalid email).
3. Ensure all other required fields are valid.
4. Submit the form.

**Expected Results:**
- The system detects the invalid format.
- The system rejects the submission.
- No data is stored/updated.
- The system displays an error message indicating which field is invalid and why (at least generally).

---

## AT-UC02-04 — Constraint/Business Rule Violation Rejected (Extension 4b)

**Objective:** Verify that rule/constraint violations are rejected.

**Preconditions:**
- User is logged in.
- The target form is accessible.

**Test Data (example):**
- Enter a value that violates a constraint (e.g., exceeds max length, out-of-range number, inconsistent fields).

**Steps:**
1. Open the target form.
2. Enter input that violates a known constraint/business rule for one field.
3. Fill remaining required fields with valid values.
4. Submit the form.

**Expected Results:**
- The system detects the rule/constraint violation.
- The system rejects the submission.
- No data is stored/updated.
- The system displays an error message explaining the violation (or indicating the constraint failure clearly).

---

## AT-UC02-05 — Multiple Errors Reported (Combined Extensions)

**Objective:** Verify the system handles multiple validation failures in one submission.

**Preconditions:**
- User is logged in.
- The target form is accessible.

**Test Data (example):**
- One required field missing
- One field has invalid format
- One field violates a constraint

**Steps:**
1. Open the target form.
2. Leave one required field blank.
3. Enter an invalid formatted value in another field.
4. Enter a constraint-violating value in a third field.
5. Submit the form.

**Expected Results:**
- The system rejects the submission.
- No data is stored/updated.
- The system reports all validation errors OR reports the first blocking error clearly and consistently (whichever is the system design).
- The user remains on the form page with actionable feedback.

---

## AT-UC02-06 — No Partial Updates on Validation Failure (Atomicity Check)

**Objective:** Verify that the system does not partially store/update data when validation fails.

**Preconditions:**
- User is logged in.
- The target form updates existing information (e.g., profile update).
- Baseline data exists for the user in the database.

**Test Data (example):**
- Change Field A to a valid new value.
- Change Field B to an invalid value (format/constraint violation).

**Steps:**
1. Open the update form.
2. Modify Field A with a valid value.
3. Modify Field B with an invalid value.
4. Submit the form.
5. Refresh/reopen the form (or re-fetch the displayed data).

**Expected Results:**
- The system rejects the submission.
- Neither Field A nor Field B changes are persisted (no partial update).
- The user sees validation errors and remains on the form page.

---

## AT-UC02-07 — Error Feedback is Clear and Field-Specific (Usability Acceptance)

**Objective:** Verify error feedback is understandable and supports correction.

**Preconditions:**
- User is logged in.
- The target form is accessible.

**Test Data (example):**
- Create any validation failure (missing required field or invalid format).

**Steps:**
1. Open the target form.
2. Intentionally cause a validation failure.
3. Submit the form.

**Expected Results:**
- The system provides an error message that indicates:
  - At least one specific field that needs correction (or highlights it), and
  - What type of problem occurred (missing/invalid/constraint violation).
- The user can correct the input and attempt resubmission.

---
