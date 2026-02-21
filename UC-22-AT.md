# Acceptance Test Suite - UC-22 View public conference announcements

## Assumptions / Notes
- Announcements marked as public are accessible without authentication.
- Announcements are displayed in reverse chronological order.

---

## AT-UC22-01 — View Announcements List (Main Success Scenario)

**Objective:** Verify a guest can view the list of public announcements.

**Preconditions:**
- At least one public announcement exists.

**Steps:**
1. Navigate to **Announcements** page.

**Expected Results:**
- The system displays a list of public announcements ordered by date.

---

## AT-UC22-02 — View Announcement Content (Main Success Scenario)

**Objective:** Verify a guest can read a full announcement.

**Preconditions:**
- At least one public announcement exists.

**Steps:**
1. Open the announcements list.
2. Select an announcement.

**Expected Results:**
- The system displays the full announcement content.
- The guest can return to the announcements list.

---

## AT-UC22-03 — No Public Announcements (Extension 1a)

**Objective:** Verify system behavior when no announcements exist.

**Preconditions:**
- No public announcements exist.

**Steps:**
1. Navigate to **Announcements** page.

**Expected Results:**
- The system displays a message indicating no announcements are available.

---

## AT-UC22-04 — Announcement Retrieval Failure (Extension 2a)

**Objective:** Verify system behavior when announcements cannot be retrieved.

**Preconditions:**
- Ability to simulate database/service failure.

**Steps:**
1. Navigate to **Announcements** page while retrieval fails.

**Expected Results:**
- The system displays a system error message.
- No announcements are shown.

---

## AT-UC22-05 — Selected Announcement Unavailable (Extension 4a)

**Objective:** Verify system behavior when a selected announcement is unavailable.

**Preconditions:**
- Announcement list is displayed.
- Selected announcement is removed/unavailable.

**Steps:**
1. Select the unavailable announcement.

**Expected Results:**
- The system displays an error message.
- The guest is returned to the announcements list.

---

## AT-UC22-06 — Persistence Check: Announcements Remain Visible After Refresh

**Objective:** Verify announcements remain visible across refresh/navigation.

**Preconditions:**
- Public announcements exist.

**Steps:**
1. View announcements.
2. Refresh the page.

**Expected Results:**
- The same public announcements are displayed consistently.
