# Quickstart - UC-18 Public Schedule PDF

## Goal
Provide publicly accessible final conference schedule viewing with PDF-based view/export and safe handling of unpublished, restricted, and failure conditions.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-18.md`, `UC-18-AT.md`

## Implementation Steps
1. Expose public schedule endpoints that do not require authentication.
2. Gate public content by published status and block unpublished final schedule exposure.
3. Return published schedule grouped by day/session with core time/location fields.
4. Add session/presentation detail endpoint from schedule entries.
5. Render available detail fields and mark optional unavailable details explicitly.
6. Apply policy-based field restrictions so restricted fields are hidden while non-restricted fields remain visible.
7. Implement schedule PDF view endpoint for public document viewing.
8. Implement schedule PDF export endpoint (download) using PDF format.
9. On retrieval failures, return explicit system error and no schedule content.
10. Ensure published schedule remains stable across refresh and return visits.

## Validation Scenarios
- Unauthenticated user accesses published schedule successfully.
- Unpublished schedule request returns clear not-available message and no final content.
- Session detail opens and shows available fields with unavailable markers where needed.
- Policy-restricted fields are hidden while allowed fields remain visible.
- PDF view and export endpoints both return PDF content.
- Retrieval failure shows explicit system error without partial final schedule display.
- Refresh/return visit preserves published schedule visibility and consistency.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for public access, publication gating, detail restrictions, PDF responses, and failure handling.
