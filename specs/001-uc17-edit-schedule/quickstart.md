# Quickstart - UC-17 Edit Schedule

## Goal
Allow authorized editors to edit draft and published schedules, save valid changes with updated last-edited timestamp, and safely reject invalid/conflicting or failed saves.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-17.md`, `UC-17-AT.md`

## Implementation Steps
1. Add schedule edit mode gated by authentication and schedule-edit permission.
2. Load schedule details in edit mode including sessions, papers, rooms, times, and current conflict indicators.
3. Permit edits for both draft and published schedules when authorized.
4. Block edit entry/save for schedules explicitly locked by policy, with explanatory feedback.
5. Validate proposed edits against scheduling constraints and reference integrity before save.
6. Reject conflicting/invalid saves and keep persisted schedule unchanged.
7. Discard unsaved changes on cancel and exit edit mode without persistence.
8. On valid save, persist schedule updates and refresh conflict status display.
9. On successful save, update and display latest last-edited date/time.
10. Keep published schedules published after successful edit save.
11. Handle concurrent stale saves with conflict feedback and no overwrite.
12. On database save failure, return system error and persist no changes.
13. Ensure saved edits remain visible across refresh and new sessions.

## Validation Scenarios
- Authorized editor saves valid schedule changes successfully.
- Published schedule edit save succeeds and schedule remains published.
- Successful save updates visible last-edited date/time.
- Conflicting/invalid save attempt is rejected with actionable feedback and no persisted change.
- Cancel before save discards unsaved edits.
- Policy-locked schedule blocks edit/save with explanatory message.
- Concurrent stale save attempt is rejected with conflict feedback.
- Database failure on save returns error and preserves prior schedule state.
- Refresh/new session shows only last committed saved schedule.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for permissions, validation, save/cancel semantics, published-edit behavior, timestamp updates, lock handling, and failure paths.
