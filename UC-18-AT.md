# Acceptance Test Suite — UC-18 View Final Conference Schedule

## Assumptions / Notes
- The final schedule must be published to be viewable as “final.”
- Attendees/authors may view schedule according to access policy (public or authenticated).
- The schedule is organized by day/session and includes time and location.

---

## AT-UC18-01 — View Published Schedule Successfully (Main Success Scenario)

**Objective:** Verify an attendee/author can view the published conference schedule.

**Preconditions:**
- A schedule exists and is published.
- User has required access rights (if login required).

**Steps:**
1. Navigate to **Conference Schedule**.
2. Observe the displayed schedule.

**Expected Results:**
- The system retrieves the published schedule.
- The schedule is displayed grouped by day/session with times and locations.

---

## AT-UC18-02 — View Session/Presentation Details (Main Success Scenario)

**Objective:** Verify the user can open a session or presentation and view details.

**Preconditions:**
- Published schedule exists with at least one session/presentation entry.

**Steps:**
1. Open the schedule page.
2. Select a session or presentation.
3. View details.

**Expected Results:**
- The system shows details such as title, authors (if available), time, and location.
- The user can return to the schedule view.

---

## AT-UC18-03 — Schedule Not Published (Extension 1a)

**Objective:** Verify correct behavior when schedule is not yet published.

**Preconditions:**
- No schedule is published (draft only or not generated).

**Steps:**
1. Navigate to **Conference Schedule**.

**Expected Results:**
- The system indicates the schedule is not available yet.
- No final schedule is displayed.

---

## AT-UC18-04 — Schedule Retrieval Failure (Extension 2a)

**Objective:** Verify system behavior when schedule cannot be retrieved.

**Preconditions:**
- Schedule is published.
- Ability to simulate database/service failure.

**Steps:**
1. Navigate to **Conference Schedule** while retrieval fails.

**Expected Results:**
- The system displays a system error message.
- No schedule is shown (or a fallback message is displayed).

---

## AT-UC18-05 — Restricted Details Hidden or Login Prompted (Extension 4a)

**Objective:** Verify restricted details are handled per policy.

**Preconditions:**
- Schedule is published.
- Policy restricts some details (e.g., abstracts) to authenticated users.
- Test both unauthenticated and authenticated views if applicable.

**Steps:**
1. Access schedule without required authentication (if applicable).
2. Open a presentation detail view.

**Expected Results:**
- Restricted fields are hidden or replaced with a login prompt.
- Non-restricted fields (time/location/title) remain visible.

---

## AT-UC18-06 — Missing Presentation Details (Extension 5a)

**Objective:** Verify system handles incomplete schedule metadata.

**Preconditions:**
- Schedule is published.
- One schedule entry is missing optional details (e.g., abstract).

**Steps:**
1. Open the schedule.
2. Select the entry with missing details.

**Expected Results:**
- The system displays available details.
- The system indicates some details are unavailable (without crashing).

---

## AT-UC18-07 — Persistence Check: Schedule Visible After Refresh/Logout/Login

**Objective:** Verify published schedule persists across sessions.

**Preconditions:**
- A schedule is published.

**Steps:**
1. View the schedule.
2. Refresh the page or log out/log in.
3. View the schedule again.

**Expected Results:**
- The schedule remains visible and unchanged.
