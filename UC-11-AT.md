# Acceptance Test Suite - UC-11 Access Assigned Papers and Review Forms

## Assumptions / Notes
- Referees must be logged in to access assigned papers.
- Referees can access only papers assigned to them.
- Manuscripts are view-only in this flow (no download/export).
- Review forms are pre-generated before referee access.

---

## AT-UC11-01 - View Assigned Papers List

**Objective:** Verify a referee can view assigned papers.

**Preconditions:**
- Referee is logged in.
- At least one paper is assigned.

**Steps:**
1. Navigate to Assigned Papers.

**Expected Results:**
- Assigned papers are listed for that referee only.

---

## AT-UC11-02 - Open Manuscript in View-Only Mode

**Objective:** Verify assigned manuscript access is view-only.

**Preconditions:**
- Referee is logged in.
- Assigned paper manuscript exists.

**Steps:**
1. Open assigned paper.
2. Open manuscript.

**Expected Results:**
- Manuscript opens in `view_only` mode.
- No download/export actions are available.

---

## AT-UC11-03 - Open Pre-Generated Review Form

**Objective:** Verify referee can open the pre-generated review form for assigned paper.

**Preconditions:**
- Referee is logged in.
- Assigned paper has a pre-generated review form.

**Steps:**
1. Open assigned paper.
2. Open review form.

**Expected Results:**
- Review form is returned and marked pre-generated.

---

## AT-UC11-04 - No Assigned Papers Empty State

**Objective:** Verify no-assignment behavior.

**Preconditions:**
- Referee is logged in.
- No active assignments.

**Steps:**
1. Navigate to Assigned Papers.

**Expected Results:**
- `200` response with empty paper list.
- "No assigned papers" message shown.

---

## AT-UC11-05 - Unauthorized Access Blocked

**Objective:** Verify non-assigned paper resource access is blocked.

**Preconditions:**
- Referee is logged in.
- Target paper is not assigned to referee.

**Steps:**
1. Attempt direct URL access to manuscript or review form.

**Expected Results:**
- `403` authorization response.
- No paper resource data is leaked.

---

## AT-UC11-06 - Manuscript Unavailable

**Objective:** Verify missing manuscript handling for assigned paper.

**Preconditions:**
- Referee is logged in.
- Paper is assigned but manuscript is unavailable.

**Steps:**
1. Open manuscript for assigned paper.

**Expected Results:**
- `404` manuscript-unavailable response.
- Retry guidance can be shown.

---

## AT-UC11-07 - Review Form Unavailable

**Objective:** Verify missing review-form handling for assigned paper.

**Preconditions:**
- Referee is logged in.
- Paper is assigned but review form is unavailable.

**Steps:**
1. Open review form for assigned paper.

**Expected Results:**
- `404` review-form-unavailable response.
- Retry guidance can be shown.

---

## AT-UC11-08 - Assigned List Retrieval Failure

**Objective:** Verify list retrieval failure behavior.

**Preconditions:**
- Referee is logged in.
- Simulate assigned-list retrieval failure.

**Steps:**
1. Open Assigned Papers.

**Expected Results:**
- `500` response with list-failure error.
- No stale list shown.

---

## AT-UC11-09 - Refresh Consistency

**Objective:** Verify refresh uses server-authoritative state.

**Preconditions:**
- Referee is logged in.
- Assigned paper initially accessible.

**Steps:**
1. Open manuscript successfully.
2. Make manuscript unavailable server-side.
3. Refresh/reopen manuscript.

**Expected Results:**
- Refreshed access shows unavailable state (`404`) based on current server data.
