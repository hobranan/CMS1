# Acceptance Test Suite - UC-02 Validate User-Provided Information

## Assumptions / Notes

- User is authenticated for all UC-02 scenarios.
- Validation checks include required, format, and business rules.
- Error mode is deterministic all-errors with stable ordering.

---

## AT-UC02-01 - Valid Create/Update Submission Accepted

**Expected Results:**
- Submission accepted only after required/format/business checks all pass.
- Full create/update write persisted.
- Success confirmation shown.

---

## AT-UC02-02 - Missing Required Field Rejected

**Expected Results:**
- Required-field failures detected from form metadata.
- Submission rejected; no persistence.
- Field-specific correction guidance shown.

---

## AT-UC02-03 - Invalid Format Rejected

**Expected Results:**
- Format failures detected per form inline rules.
- Submission rejected; no persistence.
- Field-specific format feedback shown.

---

## AT-UC02-04 - Business Rule Violation Rejected

**Expected Results:**
- Business/cross-field violation detected.
- Submission rejected; no persistence.
- Field-level rule guidance shown.

---

## AT-UC02-05 - Mixed Errors Deterministic Ordering

**Expected Results:**
- Submission with mixed required/format/business errors is rejected.
- All field-level errors returned in stable deterministic order.
- No persistence occurs.

---

## AT-UC02-06 - No Partial Updates on Validation Failure

**Expected Results:**
- If any field fails validation, no partial create/update write persists.

---

## AT-UC02-07 - Correction and Resubmission Recovery

**Expected Results:**
- User can correct invalid fields and resubmit.
- Success achieved after correction within defined attempt criteria.

---

## AT-UC02-08 - Persistence Failure Rollback

**Expected Results:**
- If persistence fails after validation pass, write is rolled back/aborted atomically.
- User receives retry guidance.

---

## AT-UC02-09 - Concurrent Conflicting Update Policy

**Expected Results:**
- Concurrent conflicting updates resolve with last-write-wins final state.
- Final persisted state matches latest accepted write.

---

## AT-UC02-10 - Traceability and Ownership Artifacts

**Expected Results:**
- FR-to-AT mapping is present and consistent.
- Per-form inline rule ownership is documented.
