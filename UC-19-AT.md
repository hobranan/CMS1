# Acceptance Test Suite — UC-19 View Conference Registration Prices

## Assumptions / Notes
- Registration prices may be visible to guests or require authentication depending on policy.
- Prices may include multiple categories and conditions.
- The CMS UI is the primary source of pricing information.

---

## AT-UC19-01 — View Registration Prices Successfully (Main Success Scenario)

**Objective:** Verify a guest or registered user can view published registration prices.

**Preconditions:**
- Registration pricing information is published and visible.

**Steps:**
1. Navigate to **Registration Prices** page.

**Expected Results:**
- The system displays registration categories and corresponding prices.
- Prices are readable and clearly labeled.

---

## AT-UC19-02 — Registration Prices Not Published (Extension 1a)

**Objective:** Verify correct behavior when prices are not yet available.

**Preconditions:**
- Registration prices are not published.

**Steps:**
1. Navigate to **Registration Prices** page.

**Expected Results:**
- The system displays a message indicating prices are not available yet.
- No pricing table is shown.

---

## AT-UC19-03 — Pricing Retrieval Failure (Extension 2a)

**Objective:** Verify system behavior when pricing cannot be retrieved.

**Preconditions:**
- Ability to simulate database/service failure.

**Steps:**
1. Navigate to **Registration Prices** page while retrieval fails.

**Expected Results:**
- The system displays a system error message.
- Pricing information is not shown.

---

## AT-UC19-04 — Incomplete Pricing Information Displayed (Extension 3a)

**Objective:** Verify system handles missing pricing categories gracefully.

**Preconditions:**
- Pricing data exists but is missing one or more categories.

**Steps:**
1. Navigate to **Registration Prices** page.

**Expected Results:**
- The system displays available pricing categories.
- A notice indicates some information is unavailable or incomplete.

---

## AT-UC19-05 — Restricted Pricing Access (Extension 1b)

**Objective:** Verify pricing access restrictions are enforced.

**Preconditions:**
- Pricing policy restricts full details to logged-in users.

**Steps:**
1. Access **Registration Prices** page as a guest.
2. (Optional) Log in and access the page again.

**Expected Results:**
- As a guest, limited pricing information is shown or login is prompted.
- As a logged-in user, full pricing details are visible.

---

## AT-UC19-06 — Persistence Check: Prices Remain Visible After Refresh

**Objective:** Verify pricing information persists across refresh/navigation.

**Preconditions:**
- Registration prices are published.

**Steps:**
1. View registration prices.
2. Refresh the page or navigate away and back.

**Expected Results:**
- The same pricing information is displayed consistently.
