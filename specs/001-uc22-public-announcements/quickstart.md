# Quickstart: View public announcements

## Prerequisites
- CMS running with web routes enabled.
- At least one announcement record in storage for happy-path checks.
- Announcement records include `is_public` and publish timestamp metadata.

## 1. Verify list view (happy path)
1. Open `Announcements` page as a guest.
2. Confirm announcements render in reverse chronological order.
3. Confirm list remains consistent after browser refresh.

## 2. Verify detail view
1. Select any announcement from list.
2. Confirm full announcement content is visible.
3. Return to list and open another item.

## 3. Verify empty state
1. Use dataset with no public announcements.
2. Open `Announcements` page.
3. Confirm no-announcements message is shown and no list items appear.

## 4. Verify failure handling
1. Simulate announcement list retrieval failure.
2. Open `Announcements` page.
3. Confirm explicit system-error message and no list rendering.

## 5. Verify unavailable detail recovery
1. Open list with a target announcement present.
2. Remove or mark target announcement unavailable.
3. Select target announcement.
4. Confirm unavailable message and automatic return to list view.
