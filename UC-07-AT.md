# Acceptance Test Suite — UC-07 Save Paper Submission Draft

## Assumptions / Notes
- Authors can manually save a submission at any stage before final submission.
- Drafts persist across sessions and logins.
- Saving a draft may require minimal validation but not full submission validation.

---

## AT-UC07-01 — Save Draft Successfully (Main Success Scenario)

**Objective:** Verify an author can save a paper submission draft at any stage.

**Preconditions:**
- Author is logged in.
- Author has started a new paper submission.

**Steps:**
1. Enter partial metadata into the submission form.
2. Select the **Save** option.

**Expected Results:**
- The system saves the current submission state as a draft.
- A confirmation message is displayed.
- The draft is available when the author returns later.

---

## AT-UC07-02 — Save Without Changes (Extension 2a)

**Objective:** Verify the system handles save requests when no changes were made.

**Preconditions:**
- Author is logged in.
- A draft exists and no fields have been modified since last save.

**Steps:**
1. Select the **Save** option.

**Expected Results:**
- The system detects no changes.
- The system informs the author that there are no new changes to save.
- The existing draft remains unchanged.

---

## AT-UC07-03 — Invalid Data Prevents Save (Extension 3a)

**Objective:** Verify saving is rejected when invalid data prevents draft storage.

**Preconditions:**
- Author is logged in.
- Submission draft contains invalid data.

**Steps:**
1. Enter invalid data in a field required for saving.
2. Select the **Save** option.

**Expected Results:**
- The system rejects the save request.
- An error message identifies fields that must be corrected.
- No draft update is stored.

---

## AT-UC07-04 — Draft Persistence Across Sessions

**Objective:** Verify saved drafts persist across logout/login.

**Preconditions:**
- AT-UC07-01 completed successfully.

**Steps:**
1. Log out of the CMS.
2. Log back in.
3. Navigate to the author’s submission drafts.

**Expected Results:**
- The previously saved draft is visible.
- Draft content matches the last saved state.

---

## AT-UC07-05 — Storage Failure During Save (Extension 4a)

**Objective:** Verify system behavior when draft storage fails.

**Preconditions:**
- Author is logged in.
- Ability to simulate database/storage failure.

**Steps:**
1. Attempt to save a draft while storage is unavailable.

**Expected Results:**
- The draft is not saved.
- The system displays a system error message advising retry later.

---

## AT-UC07-06 — Network Interruption During Save (Extension 4b)

**Objective:** Verify system behavior when network fails during save.

**Preconditions:**
- Author is logged in.
- Ability to simulate network interruption.

**Steps:**
1. Select **Save** while network connectivity is interrupted.

**Expected Results:**
- The draft is not saved.
- The system informs the author of connectivity issues and prompts retry.

---

## AT-UC07-07 — Continue Editing After Save

**Objective:** Verify author can continue editing after saving a draft.

**Preconditions:**
- Author is logged in.

**Steps:**
1. Enter partial submission data.
2. Select **Save**.
3. Modify additional fields without leaving the page.

**Expected Results:**
- The system allows continued editing.
- Changes after save are not persisted until the next save.

---

## AT-UC07-08 - Submit Persists Unsaved Edits Before Final Validation

**Objective:** Verify submit action saves unsaved edits before final submission validation runs.

**Preconditions:**
- Author is logged in.
- Draft has unsaved edits.
- Draft still fails final submission validation.

**Steps:**
1. Modify editable draft fields without pressing Save.
2. Select **Submit**.

**Expected Results:**
- The system first persists current edits as draft data.
- The system then executes final submission validation.
- Final submission is blocked due to validation failure.
- Newly edited values remain saved and visible on reload.
